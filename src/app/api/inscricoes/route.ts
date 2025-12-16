import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { sendMassEmail } from '@/lib/email-utils';

const modalidadeSelectionSchema = z.object({
  modalidadeId: z.string(),
  sexo: z.string().optional(),
  divisao: z.array(z.string()).optional(),
  categoria: z.array(z.string()).optional(),
  faixaEtaria: z.array(z.string()).optional(),
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
  equipeId: z.string().min(1, { message: 'Equipe é obrigatória.' }),
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
    const searchParams = request.nextUrl.searchParams;
    const equipeId = searchParams.get('equipeId');

    let whereClause: Prisma.InscricaoWhereInput = {};

    if (equipeId) {
      whereClause = {
        equipeId: equipeId,
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
    const validatedData = inscricaoSchema.parse(json);

    const { modalidades: modalidadesSelections, ...dadosInscricao } =
      validatedData;

    const equipe = await prisma.equipe.findUnique({
      where: { id: validatedData.equipeId },
    });

    if (!equipe) {
      return NextResponse.json(
        { error: 'Equipe não encontrada.' },
        { status: 404 },
      );
    }

    const modalidadeIds = modalidadesSelections.map((m) => m.modalidadeId);
    const existingModalidades = await prisma.modalidade.findMany({
      where: {
        id: {
          in: modalidadeIds,
        },
      },
    });

    const novaInscricao = await prisma.inscricao.create({
      data: {
        ...dadosInscricao,
        dataNascimento: new Date(dadosInscricao.dataNascimento),
        modalidades: {
          create: modalidadesSelections.map((m) => {
            const modalidade = existingModalidades.find(
              (em) => em.id === m.modalidadeId,
            );
            if (!modalidade) {
              throw new Error(
                `Modalidade with ID ${m.modalidadeId} not found.`,
              );
            }
            return {
              modalidade: {
                connect: {
                  id: modalidade.id,
                },
              },
              sexo: m.sexo,
              divisao: m.divisao,
              categoria: m.categoria,
              faixaEtaria: m.faixaEtaria,
            };
          }),
        },
      },
      include: {
        modalidades: { include: { modalidade: true } },
      },
    });
    try {
      const inscricaoModalidadesDetalhes =
        await prisma.inscricaoModalidade.findMany({
          where: {
            inscricaoId: novaInscricao.id,
          },
          include: {
            modalidade: true,
          },
        });

      const modalidadesHTML = inscricaoModalidadesDetalhes
        .map((im) => {
          const optionsHTML = `
                ${im.sexo ? `<p><strong>Sexo:</strong> ${im.sexo}</p>` : ''}
                ${im.divisao && im.divisao.length > 0 ? `<p><strong>Divisão:</strong> ${im.divisao.join(', ')}</p>` : ''}
                ${im.categoria && im.categoria.length > 0 ? `<p><strong>Categoria:</strong> ${im.categoria.join(', ')}</p>` : ''}
                ${im.faixaEtaria && im.faixaEtaria.length > 0 ? `<p><strong>Faixa Etária:</strong> ${im.faixaEtaria.join(', ')}</p>` : ''}
              `;

          return `
                <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
                  <h3 style="margin: 0; color: #2563eb;">${im.modalidade.nome}</h3>
                  ${optionsHTML || '<p>Nenhuma opção específica selecionada.</p>'}
                </div>
              `;
        })
        .join('');

      const emailHTML = `
            <h2>Olá, ${novaInscricao.nome}!</h2>
            <p>Sua inscrição foi confirmada com sucesso.</p>
            <h3>Detalhes das Modalidades Selecionadas:</h3>
            ${modalidadesHTML}
          `;

      await sendMassEmail(
        [novaInscricao.email],
        'Confirmação de Inscrição - VIII Olinsesp',
        emailHTML,
      );
    } catch (emailError) {
      console.error('❌ Erro ao enviar email de confirmação:', emailError);
    }
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
