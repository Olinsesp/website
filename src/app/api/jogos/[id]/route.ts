import { NextResponse } from 'next/server';
import { z } from 'zod';

const staticJogos = [
  {
    id: '1',
    modalidade: 'Futebol de Campo',
    data: new Date('2026-12-15T10:30:00').toISOString(),
    horario: '10:30',
    resultado: 'Equipe A 2 vs 1 Equipe B',
  },
  {
    id: '2',
    modalidade: 'Voleibol',
    data: new Date('2026-12-15T11:00:00').toISOString(),
    horario: '11:00',
    resultado: 'Equipe C 3 vs 2 Equipe D',
  },
  {
    id: '3',
    modalidade: 'Basquete',
    data: new Date('2026-12-17T15:00:00').toISOString(),
    horario: '15:00',
    resultado: 'Equipe E 88 vs 85 Equipe F',
  },
];

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
    const jogo = staticJogos.find((j) => j.id === id);

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

    const jogoIndex = staticJogos.findIndex((j) => j.id === id);

    if (jogoIndex === -1) {
      return NextResponse.json(
        { error: 'Jogo não encontrado.' },
        { status: 404 },
      );
    }

    const jogoAtualizado = {
      ...staticJogos[jogoIndex],
      ...validatedData,
    };

    return NextResponse.json(jogoAtualizado);
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

    const jogoIndex = staticJogos.findIndex((j) => j.id === id);

    if (jogoIndex === -1) {
      return NextResponse.json(
        { error: 'Jogo não encontrado.' },
        { status: 404 },
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar jogo:', error);
    return NextResponse.json(
      {
        error: 'Ocorreu um erro no servidor ao deletar o jogo.',
      },
      { status: 500 },
    );
  }
}
