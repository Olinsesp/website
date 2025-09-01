import { NextResponse } from 'next/server';

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
