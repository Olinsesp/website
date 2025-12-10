import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { Inscricao } from '@/types/inscricao';
import { Prisma } from '@prisma/client';

const modalidadeSelectionSchema = z.object({
  modalidadeId: z.string(),
  sexo: z.string().optional(),
  divisao: z.string().optional(),
  categoria: z.string().optional(),
  faixaEtaria: z.string().optional(),
});

const inscricaoSchema = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.email({ message: 'Email inválido.' }),
  cpf: z
    .string()
    .length(11, { message: 'CPF deve ter 11 caracteres numéricos.' })
    .regex(/^\d+$/, { message: 'CPF deve conter apenas números.' }),
  dataNascimento: z.coerce
    .date()
    .refine((d) => d instanceof Date && !isNaN(d.getTime()), {
      message: 'Data de nascimento inválida.',
    }),

  telefone: z.string().min(10, { message: 'Telefone inválido.' }),
  sexo: z.enum(['Masculino', 'Feminino']).optional(),
  camiseta: z.string().min(1, { message: 'Selecione um tamanho de camiseta.' }),
  lotacao: z.string(),
  orgaoOrigem: z.string(),
  matricula: z
    .string()
    .min(5, { message: 'Matrícula deve ter ao menos 5 caracteres.' })
    .regex(/^\d+$/, { message: 'Matrícula deve conter apenas números.' }),
  modalidades: z
    .array(modalidadeSelectionSchema)
    .min(1, { message: 'Selecione ao menos uma modalidade.' }),
  status: z.enum(['pendente', 'aprovada', 'rejeitada']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const headerList = request.headers;
    const userRole = headerList.get('x-user-role');
    const userOrgao = headerList.get('x-user-orgao');

    let whereClause: Prisma.InscricaoWhereInput = {};

    if (userRole === 'PONTOFOCAL' && userOrgao) {
      whereClause = {
        orgaoOrigem: userOrgao,
      };
    }

    const inscricoes = await prisma.inscricao.findMany({
      where: whereClause,
      include: {
        modalidades: { include: { modalidade: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      inscricoes.map((i) => ({
        ...i,
        dataNascimento: i.dataNascimento.toISOString(),
        createdAt: i.createdAt.toISOString(),
        modalidades: i.modalidades.map((m) => ({
          modalidadeId: m.modalidadeId,
          nome: m.modalidade.nome,
          sexo: m.sexo,
          divisao: m.divisao,
          categoria: m.categoria,
          faixaEtaria: m.faixaEtaria,
        })),
      })),
    );
  } catch (error) {
    console.error('❌ Erro GET inscrições:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar inscrições.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();

    // validação detalhada
    const validatedData = inscricaoSchema.parse(json);

    const { modalidades: modalidadesSelections, ...dadosInscricao } =
      validatedData;

    const novaInscricao = await prisma.inscricao.create({
      data: {
        ...dadosInscricao,
        dataNascimento: new Date(dadosInscricao.dataNascimento),
        modalidades: {
          create: modalidadesSelections.map((m) => ({
            modalidadeId: m.modalidadeId,
            sexo: m.sexo,
            divisao: m.divisao,
            categoria: m.categoria,
            faixaEtaria: m.faixaEtaria,
          })),
        },
      },
      include: {
        modalidades: { include: { modalidade: true } },
      },
    });
    const emailData = {
      ...validatedData,
      modalidades: novaInscricao.modalidades.map((m) => m.modalidade.nome),
      id: novaInscricao.id,
      status: novaInscricao.status,
      createdAt: novaInscricao.createdAt,
    };

    sendEmail(emailData).catch((err) =>
      console.error('❌ Erro ao enviar email:', err.message),
    );

    const resposta = {
      ...novaInscricao,
      dataNascimento: novaInscricao.dataNascimento.toISOString(),
      createdAt: novaInscricao.createdAt.toISOString(),
      modalidades: novaInscricao.modalidades.map((m) => ({
        modalidadeId: m.modalidadeId,
        nome: m.modalidade.nome,
        sexo: m.sexo,
        divisao: m.divisao,
        categoria: m.categoria,
        faixaEtaria: m.faixaEtaria,
      })),
    };

    return NextResponse.json(resposta, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos.',
          details: error.issues,
        },
        { status: 400 },
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('⚠️ Erro Prisma:', error);
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[];
        let errorMessage =
          'Já existe uma inscrição com um ou mais dados únicos.';

        if (target) {
          if (target.includes('cpf')) {
            errorMessage = 'O CPF informado já está cadastrado.';
          } else if (target.includes('matricula')) {
            errorMessage = 'A matrícula informada já está cadastrada.';
          } else if (target.includes('email')) {
            errorMessage = 'O email informado já está cadastrado.';
          }
        }

        return NextResponse.json(
          { error: errorMessage, meta: error.meta },
          { status: 409 },
        );
      }
    }

    console.error('❌ Erro ao criar inscrição:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar a inscrição.' },
      { status: 500 },
    );
  }
}
async function sendEmail(
  inscricao: Omit<Inscricao, 'id' | 'status' | 'createdAt'> & {
    sexo?: 'Masculino' | 'Feminino';
  },
) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
    console.warn('⚠️ Email não enviado: credenciais ausentes.');
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
    where: { nome: { in: inscricao.modalidades } },
  });

  const modalidadesHTML = modalidades
    .map((m) => {
      const dataInicio = m.dataInicio
        ? new Date(m.dataInicio).toLocaleDateString('pt-BR')
        : 'A definir';

      const dataFim = m.dataFim
        ? new Date(m.dataFim).toLocaleDateString('pt-BR')
        : null;

      return `
        <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
          <h3 style="margin: 0; color: #2563eb;">${m.nome}</h3>
          <p>${m.descricao}</p>
          <p><strong>Local:</strong> ${m.local || 'A definir'}</p>
          <p><strong>Data:</strong> ${dataInicio}${
            dataFim && dataFim !== dataInicio ? ` a ${dataFim}` : ''
          }</p>
          <p><strong>Horário:</strong> ${m.horario || 'A definir'}</p>
          <p><strong>Categoria:</strong> ${m.categoria?.join(', ') || 'N/A'}</p>
        </div>
      `;
    })
    .join('');

  const emailHTML = `
    <h2>Olá, ${inscricao.nome}!</h2>
    <p>Sua inscrição foi confirmada com sucesso.</p>
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
