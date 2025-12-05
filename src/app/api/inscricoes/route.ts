import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { Inscricao } from '@/types/inscricao';

const inscricaoSchema = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.email({ message: 'Email inválido.' }),
  cpf: z
    .string()
    .min(11, { message: 'CPF deve ter 11 caracteres.' })
    .max(11, { message: 'CPF deve ter 11 caracteres.' })
    .regex(/^\d+$/, { message: 'CPF deve conter apenas números.' }),
  dataNascimento: z.coerce.date(),
  telefone: z.string().min(10, { message: 'Telefone inválido.' }),
  sexo: z.enum(['m', 'f']).optional(),
  camiseta: z.string().min(1, { message: 'Selecione um tamanho de camiseta.' }),
  lotacao: z.string(),
  orgaoOrigem: z.string(),
  matricula: z
    .string()
    .min(5, { message: 'Matrícula deve ter ao menos 5 caracteres.' }),
  modalidades: z
    .array(z.string())
    .min(1, { message: 'Selecione ao menos uma modalidade.' }),
});

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

    const { modalidades: modalidadesNomes, ...dadosInscricao } = validatedData;

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

    const novaInscricao = await prisma.inscricao.create({
      data: {
        ...dadosInscricao,
        dataNascimento: new Date(dadosInscricao.dataNascimento),
        modalidades: {
          create: modalidades.map((modalidade) => ({
            modalidadeId: modalidade.id,
          })),
        },
      },
      include: {
        modalidades: { include: { modalidade: true } },
      },
    });

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

  const modalidades = await prisma.modalidade.findMany({
    where: {
      nome: {
        in: inscricao.modalidades,
      },
    },
  });

  const modalidadesHTML = modalidades
    .map((modalidade) => {
      const dataInicio = modalidade.dataInicio
        ? new Date(modalidade.dataInicio).toLocaleDateString('pt-BR')
        : 'A definir';

      const dataFim = modalidade.dataFim
        ? new Date(modalidade.dataFim).toLocaleDateString('pt-BR')
        : null;

      return `
        <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
          <h3 style="margin: 0; color: #2563eb;">${modalidade.nome}</h3>
          <p>${modalidade.descricao}</p>

          <p><strong>Local:</strong> ${modalidade.local || 'A definir'}</p>
          <p><strong>Data:</strong> 
            ${dataInicio}${dataFim && dataFim !== dataInicio ? ` a ${dataFim}` : ''}
          </p>
          <p><strong>Horário:</strong> ${modalidade.horario || 'A definir'}</p>
          <p><strong>Categoria:</strong> ${modalidade.categoria?.join(', ') || 'N/A'}</p>
        </div>
      `;
    })
    .join('');

  const emailHTML = `
    <h2>Olá, ${inscricao.nome}!</h2>
    <p>Sua inscrição foi confirmada.</p>
    <h3>Modalidades Selecionadas:</h3>
    ${modalidadesHTML}
  `;

  await transporter.sendMail({
    from: `"Organização VIII Olinsesp" <${process.env.GMAIL_USER}>`,
    to: inscricao.email,
    subject: 'Confirmação de Inscrição - VIII Olinsesp',
    html: emailHTML,
  });
}
