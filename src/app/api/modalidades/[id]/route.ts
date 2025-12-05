import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const modalidadeUpdateSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório.').optional(),
  descricao: z.string().min(1, 'A descrição é obrigatória.').optional(),
  categoria: z.string().array().optional(),
  maxParticipantes: z
    .number()
    .min(1, 'O número máximo de participantes deve ser maior que 0.')
    .optional(),
  participantesAtuais: z
    .number()
    .min(0, 'O número de participantes atuais deve ser maior ou igual a 0.')
    .optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  local: z.string().optional(),
  horario: z.string().optional(),
  regras: z.array(z.string()).optional(),
  faixaEtaria: z.array(z.string()).optional(),
  premios: z.array(z.string()).optional(),
  divisoes: z.string().array().optional(),
  modalidadesSexo: z.array(z.string()).optional(),
  status: z
    .enum([
      'inscricoes-abertas',
      'inscricoes-encerradas',
      'em-andamento',
      'finalizada',
    ])
    .optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const modalidade = await prisma.modalidade.findUnique({
      where: { id },
    });

    if (!modalidade) {
      return NextResponse.json(
        { error: 'Modalidade não encontrada.' },
        { status: 404 },
      );
    }

    return NextResponse.json(modalidade);
  } catch (error) {
    console.error('Erro ao buscar modalidade:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar a modalidade.' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validatedData = modalidadeUpdateSchema.parse(body);

    const modalidade = await prisma.modalidade.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(modalidade);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: error.issues },
        { status: 400 },
      );
    }
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Modalidade não encontrada.' },
        { status: 404 },
      );
    }
    console.error('Erro ao atualizar modalidade:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao atualizar a modalidade.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.modalidade.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Modalidade não encontrada.' },
        { status: 404 },
      );
    }
    console.error('Erro ao deletar modalidade:', error);
    return NextResponse.json(
      {
        error: 'Ocorreu um erro no servidor ao deletar a modalidade.',
      },
      { status: 500 },
    );
  }
}
