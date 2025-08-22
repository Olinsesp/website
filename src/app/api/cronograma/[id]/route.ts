import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const cronogramaUpdateSchema = z.object({
  atividade: z.string().min(1, 'A atividade é obrigatória.').optional(),
  inicio: z.iso.datetime({ message: 'Data de início inválida.' }).optional(),
  fim: z.iso.datetime({ message: 'Data de fim inválida.' }).optional(),
  detalhes: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cronograma = await prisma.cronograma.findUnique({
      where: { id },
    });

    if (!cronograma) {
      return NextResponse.json(
        { error: 'Atividade do cronograma não encontrada.' },
        { status: 404 },
      );
    }

    return NextResponse.json(cronograma);
  } catch (error) {
    console.error('Erro ao buscar atividade do cronograma:', error);
    return NextResponse.json(
      {
        error:
          'Ocorreu um erro no servidor ao buscar a atividade do cronograma.',
      },
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
    const data = await request.json();
    const validatedData = cronogramaUpdateSchema.parse(data);

    const cronograma = await prisma.cronograma.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(cronograma);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos.',
          details: z.treeifyError(error),
        },
        { status: 400 },
      );
    }
    console.error('Erro ao atualizar atividade do cronograma:', error);
    return NextResponse.json(
      {
        error:
          'Ocorreu um erro no servidor ao atualizar a atividade do cronograma.',
      },
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
    await prisma.cronograma.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar atividade do cronograma:', error);
    return NextResponse.json(
      {
        error:
          'Ocorreu um erro no servidor ao deletar a atividade do cronograma.',
      },
      { status: 500 },
    );
  }
}
