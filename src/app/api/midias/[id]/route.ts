import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const midiaUpdateSchema = z.object({
  tipo: z.enum(['foto', 'video', 'release']).optional(),
  url: z.string().min(1, 'A URL é obrigatória.').optional(),
  titulo: z.string().optional(),
  destaque: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const midia = await prisma.midia.findUnique({
      where: { id },
    });

    if (!midia) {
      return NextResponse.json(
        { error: 'Mídia não encontrada.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: midia.id,
      tipo: midia.tipo,
      url: midia.url,
      titulo: midia.titulo,
      destaque: midia.destaque,
      createdAt: midia.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Erro ao buscar mídia:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar a mídia.' },
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
    const validatedData = midiaUpdateSchema.parse(data);

    const midiaAtualizada = await prisma.midia.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({
      id: midiaAtualizada.id,
      tipo: midiaAtualizada.tipo,
      url: midiaAtualizada.url,
      titulo: midiaAtualizada.titulo,
      destaque: midiaAtualizada.destaque,
      createdAt: midiaAtualizada.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos.',
          details: error.issues,
        },
        { status: 400 },
      );
    }
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Mídia não encontrada.' },
        { status: 404 },
      );
    }
    console.error('Erro ao atualizar mídia:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao atualizar a mídia.' },
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

    await prisma.midia.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Mídia não encontrada.' },
        { status: 404 },
      );
    }
    console.error('Erro ao deletar mídia:', error);
    return NextResponse.json(
      {
        error: 'Ocorreu um erro no servidor ao deletar a mídia.',
      },
      { status: 500 },
    );
  }
}
