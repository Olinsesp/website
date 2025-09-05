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

const jogoSchema = z.object({
  modalidade: z.string().min(1, 'A modalidade é obrigatória.'),
  data: z.string().min(1, 'A data é obrigatória.'),
  horario: z.string().min(1, 'O horário é obrigatório.'),
  resultado: z.string().optional(),
});

export async function GET() {
  try {
    return NextResponse.json(staticJogos);
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar os jogos.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = jogoSchema.parse(body);

    const novoJogo = {
      id: (staticJogos.length + 1).toString(),
      ...validatedData,
    };

    staticJogos.push(novoJogo);

    return NextResponse.json(novoJogo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Erro ao criar jogo:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao criar o jogo.' },
      { status: 500 },
    );
  }
}
