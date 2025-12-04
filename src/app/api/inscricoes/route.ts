import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { Inscricao } from '@/types/inscricao';

const inscricaoSchema = z
  .object({
    nome: z
      .string()
      .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
    email: z.email({ message: 'Email inválido.' }),
    cpf: z
      .string()
      .min(11, { message: 'CPF deve ter 11 caracteres.' })
      .max(11, { message: 'CPF deve ter 11 caracteres.' })
      .regex(/^\d+$/, { message: 'CPF deve conter apenas números.' }),
    dataNascimento: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
      message: 'Por favor, insira uma data válida.',
    }),
    telefone: z.string().min(10, { message: 'Telefone inválido.' }),
    sexo: z.enum(['m', 'f']).optional(),
    camiseta: z
      .string()
      .min(1, { message: 'Selecione um tamanho de camiseta.' }),
    lotacao: z.string(),
    orgaoOrigem: z.string(),
    matricula: z
      .string()
      .min(5, { message: 'Matrícula deve ter ao menos 5 caracteres.' }),
    modalidades: z
      .array(z.string())
      .min(1, { message: 'Selecione ao menos uma modalidade.' }),
  })
  .catchall(z.string());

export async function GET() {
  try {
    const inscricoes = await prisma.inscricao.findMany({
      include: {
        modalidades: {
          include: {
            modalidade: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const inscricoesFormatadas = inscricoes.map((inscricao) => ({
      id: inscricao.id,
      nome: inscricao.nome,
      email: inscricao.email,
      cpf: inscricao.cpf,
      dataNascimento: inscricao.dataNascimento.toISOString(),
      telefone: inscricao.telefone,
      sexo: inscricao.sexo,
      camiseta: inscricao.camiseta,
      lotacao: inscricao.lotacao,
      orgaoOrigem: inscricao.orgaoOrigem,
      matricula: inscricao.matricula,
      modalidades: inscricao.modalidades.map((im) => im.modalidade.nome),
      status: inscricao.status,
      createdAt: inscricao.createdAt.toISOString(),
      ...(inscricao.dadosExtras as object),
    }));

    return NextResponse.json(inscricoesFormatadas);
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar as inscrições.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = inscricaoSchema.parse(data);

    // Extrair modalidades e dados extras
    const { modalidades: modalidadesNomes, ...dadosInscricao } = validatedData;

    // Buscar IDs das modalidades
    const modalidades = await prisma.modalidade.findMany({
      where: {
        nome: {
          in: modalidadesNomes,
        },
      },
    });

    if (modalidades.length !== modalidadesNomes.length) {
      return NextResponse.json(
        { error: 'Uma ou mais modalidades não foram encontradas.' },
        { status: 400 },
      );
    }

    // Separar dados extras (campos que não são do schema principal)
    const camposExtras: Record<string, any> = {};
    const dadosInscricaoConhecidos = [
      'nome',
      'email',
      'cpf',
      'dataNascimento',
      'telefone',
      'sexo',
      'camiseta',
      'lotacao',
      'orgaoOrigem',
      'matricula',
    ];

    for (const key in dadosInscricao) {
      if (!dadosInscricaoConhecidos.includes(key)) {
        camposExtras[key] = (dadosInscricao as any)[key];
      }
    }

    // Criar inscrição com modalidades
    const novaInscricao = await prisma.inscricao.create({
      data: {
        ...dadosInscricao,
        dataNascimento: new Date(dadosInscricao.dataNascimento), // Ensure dataNascimento is a Date object
        dadosExtras:
          Object.keys(camposExtras).length > 0 ? camposExtras : undefined,
        modalidades: {
          create: modalidades.map((modalidade) => ({
            modalidadeId: modalidade.id,
          })),
        },
      },
      include: {
        modalidades: {
          include: {
            modalidade: true,
          },
        },
      },
    });

    // Enviar email em background
    sendEmail({
      ...validatedData,
      id: novaInscricao.id,
      status: novaInscricao.status,
      createdAt: novaInscricao.createdAt,
    }).catch((err) => {
      console.error('Erro ao enviar email', err.message);
    });

    const inscricaoFormatada = {
      id: novaInscricao.id,
      nome: novaInscricao.nome,
      email: novaInscricao.email,
      cpf: novaInscricao.cpf,
      dataNascimento: novaInscricao.dataNascimento.toISOString(),
      telefone: novaInscricao.telefone,
      sexo: novaInscricao.sexo,
      camiseta: novaInscricao.camiseta,
      lotacao: novaInscricao.lotacao,
      orgaoOrigem: novaInscricao.orgaoOrigem,
      matricula: novaInscricao.matricula,
      modalidades: novaInscricao.modalidades.map((im) => im.modalidade.nome),
      status: novaInscricao.status,
      createdAt: novaInscricao.createdAt.toISOString(),
      ...(novaInscricao.dadosExtras as object),
    };

    return NextResponse.json(inscricaoFormatada, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados de entrada inválidos.', details: error.message },
        { status: 400 },
      );
    }

    console.error('Erro ao criar inscrição', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao processar a inscrição.' },
      { status: 500 },
    );
  }
}

async function sendEmail(
  inscricao: Omit<Inscricao, 'id' | 'status' | 'createdAt'> & {
    sexo?: 'm' | 'f';
  },
) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
    console.log(
      'Credenciais de email não configuradas. Email não será enviado.',
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // Buscar modalidades do banco de dados
  const allModalidades = await prisma.modalidade.findMany();
  const allFlattenedModalidades = allModalidades.map((mod) => ({
    ...mod,
    parentCategory: mod.categoria,
  }));

  const modalidadesSelecionadas = allFlattenedModalidades.filter((m) =>
    inscricao.modalidades.includes(m.nome),
  );

  const dataNascimentoDate =
    inscricao.dataNascimento instanceof Date
      ? inscricao.dataNascimento
      : new Date(inscricao.dataNascimento);
  const dataNascimentoFormatada = dataNascimentoDate.toLocaleDateString(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  );

  const sexoFormatado =
    inscricao.sexo === 'm'
      ? 'Masculino'
      : inscricao.sexo === 'f'
        ? 'Feminino'
        : 'Não informado';

  const getCamposExtrasPorModalidade = (modalidade: any) => {
    if (!modalidade.campos_extras) return [];

    return modalidade.campos_extras.filter((field: any) => {
      const fieldId = field.id.toLowerCase();
      const fieldLabel = field.label?.toLowerCase() || '';

      const isMasculinoField =
        fieldId.includes('masculino') ||
        fieldId.includes('masculina') ||
        fieldLabel.includes('masculino') ||
        fieldLabel.includes('masculina');

      const isFemininoField =
        fieldId.includes('feminino') ||
        fieldId.includes('feminina') ||
        fieldLabel.includes('feminino') ||
        fieldLabel.includes('feminina');

      if (!isMasculinoField && !isFemininoField) return true;
      if (isMasculinoField && inscricao.sexo === 'm') return true;
      if (isFemininoField && inscricao.sexo === 'f') return true;
      return false;
    });
  };

  const modalidadesHTML = modalidadesSelecionadas
    .map((modalidade) => {
      const camposExtras = getCamposExtrasPorModalidade(modalidade);
      const camposExtrasHTML = camposExtras
        .filter((field: any) => {
          const valor = inscricao[field.id];
          return valor && String(valor).trim() !== '';
        })
        .map((field: any) => {
          const valor = inscricao[field.id];
          return `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>${field.label}:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${String(valor)}</td>
            </tr>
          `;
        })
        .join('');

      const dataInicio = modalidade.dataInicio
        ? new Date(modalidade.dataInicio).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : 'A definir';
      const dataFim = modalidade.dataFim
        ? new Date(modalidade.dataFim).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : 'A definir';

      return `
        <div style="margin-bottom: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 8px; border-left: 4px solid #2563eb;">
          <h3 style="margin-top: 0; color: #2563eb; font-size: 20px;">${modalidade.nome}</h3>
          <p style="color: #666; margin: 10px 0;">${modalidade.descricao}</p>
          
          <table style="width: 100%; margin: 15px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Local:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${modalidade.local || 'A definir'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Data:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${dataInicio}${modalidade.dataFim && dataInicio !== dataFim ? ` a ${dataFim}` : ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Horário:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${modalidade.horario || 'A definir'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Categoria:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${modalidade.parentCategory || 'N/A'}</td>
            </tr>
            ${camposExtrasHTML}
          </table>
        </div>
      `;
    })
    .join('');

  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #2563eb 0%, #ea580c 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-radius: 0 0 8px 8px;
        }
        .info-section {
          background-color: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">VIII Olinsesp</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Confirmação de Inscrição</p>
      </div>
      
      <div class="content">
        <h2 style="color: #2563eb;">Olá, ${inscricao.nome}! 🎉</h2>
        <p>Sua inscrição para o <strong>VIII Olinsesp</strong> foi realizada com sucesso!</p>
        
        <div class="info-section">
          <h3 style="margin-top: 0; color: #2563eb;">Dados da Inscrição</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Nome:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${inscricao.nome}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Email:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${inscricao.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>CPF:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${inscricao.cpf}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Data de Nascimento:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${dataNascimentoFormatada}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Telefone:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${inscricao.telefone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Sexo:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${sexoFormatado}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Tamanho da Camiseta:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${inscricao.camiseta.toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Matrícula:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${inscricao.matricula}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Lotação:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${inscricao.lotacao}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Órgão de Origem:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${inscricao.orgaoOrigem}</td>
            </tr>
          </table>
        </div>

        <div class="info-section">
          <h3 style="margin-top: 0; color: #2563eb;">Modalidades Selecionadas</h3>
          ${modalidadesHTML}
        </div>

        <p style="margin-top: 30px; padding: 15px; background-color: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px;">
          <strong>📧 Próximos Passos:</strong><br>
          Em breve entraremos em contato com mais informações sobre o evento, incluindo cronogramas detalhados e instruções importantes.
        </p>
      </div>
      
      <div class="footer">
        <p>Obrigado por participar do <strong>VIII Olinsesp</strong>!</p>
        <p>Organização VIII Olinsesp</p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Organização VIII Olinsesp" <${process.env.GMAIL_USER}>`,
      to: inscricao.email,
      subject: 'Confirmação de Inscrição - VIII Olinsesp',
      html: emailHTML,
    });
    console.log('Email enviado com sucesso para:', inscricao.email);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}
