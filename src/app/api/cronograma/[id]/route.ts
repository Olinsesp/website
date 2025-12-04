import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const cronogramaUpdateSchema = z.object({
  atividade: z.string().min(1, 'A atividade é obrigatória.').optional(),
  inicio: z.string().optional(),
  fim: z.string().optional(),
  detalhes: z.string().optional(),
  modalidade: z.string().optional(),
  modalidadeId: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const evento = await prisma.evento.findUnique({
      where: { id },
      include: {
        modalidadeRel: true,
      },
    });

    if (!evento) {
      return NextResponse.json(
        { error: 'Atividade do cronograma não encontrada.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: evento.id,
      atividade: evento.atividade,
      inicio: evento.inicio.toISOString(),
      fim: evento.fim.toISOString(),
      detalhes: evento.detalhes,
      modalidade: evento.modalidade || evento.modalidadeRel?.nome || null,
    });
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

    const updateData: any = {};
    if (validatedData.atividade) updateData.atividade = validatedData.atividade;
    if (validatedData.inicio)
      updateData.inicio = new Date(validatedData.inicio);
    if (validatedData.fim) updateData.fim = new Date(validatedData.fim);
    if (validatedData.detalhes !== undefined)
      updateData.detalhes = validatedData.detalhes;
    if (validatedData.modalidade !== undefined)
      updateData.modalidade = validatedData.modalidade;
    if (validatedData.modalidadeId !== undefined)
      updateData.modalidadeId = validatedData.modalidadeId;

    const eventoAtualizado = await prisma.evento.update({
      where: { id },
      data: updateData,
      include: {
        modalidadeRel: true,
      },
    });

    return NextResponse.json({
      id: eventoAtualizado.id,
      atividade: eventoAtualizado.atividade,
      inicio: eventoAtualizado.inicio.toISOString(),
      fim: eventoAtualizado.fim.toISOString(),
      detalhes: eventoAtualizado.detalhes,
      modalidade:
        eventoAtualizado.modalidade ||
        eventoAtualizado.modalidadeRel?.nome ||
        null,
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
        { error: 'Atividade do cronograma não encontrada.' },
        { status: 404 },
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

    await prisma.evento.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Atividade do cronograma não encontrada.' },
        { status: 404 },
      );
    }
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
