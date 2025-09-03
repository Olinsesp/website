import { NextResponse } from 'next/server';
import { z } from 'zod';

const staticCronograma = [
  {
    id: '1',
    atividade: 'Cerimônia de Abertura',
    inicio: new Date('2026-12-15T09:00:00').toISOString(),
    fim: new Date('2026-12-15T10:00:00').toISOString(),
    detalhes: 'Ginásio Principal',
    modalidade: 'Cerimônia',
  },
  {
    id: '2',
    atividade: 'Futebol - Fase de Grupos',
    inicio: new Date('2026-12-15T10:30:00').toISOString(),
    fim: new Date('2026-12-15T12:00:00').toISOString(),
    detalhes: 'Campo 1',
    modalidade: 'Futebol de Campo',
  },
  {
    id: '3',
    atividade: 'Vôlei - Feminino',
    inicio: new Date('2026-12-15T11:00:00').toISOString(),
    fim: new Date('2026-12-15T12:30:00').toISOString(),
    detalhes: 'Quadra 2',
    modalidade: 'Voleibol',
  },
  {
    id: '4',
    atividade: 'Congresso Técnico',
    inicio: new Date('2026-12-15T14:00:00').toISOString(),
    fim: new Date('2026-12-15T15:00:00').toISOString(),
    detalhes: 'Auditório',
    modalidade: 'Congresso',
  },
  {
    id: '5',
    atividade: 'Natação - 50m Livre',
    inicio: new Date('2026-12-16T09:30:00').toISOString(),
    fim: new Date('2026-12-16T10:30:00').toISOString(),
    detalhes: 'Piscina Olímpica',
    modalidade: 'Natação',
  },
  {
    id: '6',
    atividade: 'Final - Basquete Masculino',
    inicio: new Date('2026-12-17T15:00:00').toISOString(),
    fim: new Date('2026-12-17T16:30:00').toISOString(),
    detalhes: 'Ginásio Principal',
    modalidade: 'Basquete',
  },
  {
    id: '7',
    atividade: 'Cerimônia de Encerramento',
    inicio: new Date('2026-12-17T18:00:00').toISOString(),
    fim: new Date('2026-12-17T19:00:00').toISOString(),
    detalhes: 'Ginásio Principal',
    modalidade: 'Cerimônia',
  },
];

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
    const cronograma = staticCronograma.find((c) => c.id === id);

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

    const cronogramaIndex = staticCronograma.findIndex((c) => c.id === id);

    if (cronogramaIndex === -1) {
      return NextResponse.json(
        { error: 'Atividade do cronograma não encontrada.' },
        { status: 404 },
      );
    }

    const cronogramaAtualizado = {
      ...staticCronograma[cronogramaIndex],
      ...validatedData,
    };

    return NextResponse.json(cronogramaAtualizado);
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

    const cronogramaIndex = staticCronograma.findIndex((c) => c.id === id);

    if (cronogramaIndex === -1) {
      return NextResponse.json(
        { error: 'Atividade do cronograma não encontrada.' },
        { status: 404 },
      );
    }

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
