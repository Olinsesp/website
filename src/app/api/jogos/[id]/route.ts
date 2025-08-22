import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const jogoUpdateSchema = z.object({
  modalidade: z.string().min(1, 'A modalidade é obrigatória.').optional(),
  data: z.iso.datetime({ message: 'Data inválida.' }).optional(),
  horario: z.string().min(1, 'O horário é obrigatório.').optional(),
  resultado: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const jogo = await prisma.jogo.findUnique({
      where: { id },
    });

    if (!jogo) {
      return NextResponse.json(
        { error: 'Jogo não encontrado.' },
        { status: 404 },
      );
    }

    return NextResponse.json(jogo);
  } catch (error) {
    console.error('Erro ao buscar jogo:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar o jogo.' },
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
    const validatedData = jogoUpdateSchema.parse(data);

    const jogo = await prisma.jogo.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(jogo);
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
    console.error('Erro ao atualizar jogo:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao atualizar o jogo.' },
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
    await prisma.jogo.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar jogo:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao deletar o jogo.' },
      { status: 500 },
    );
  }
}
