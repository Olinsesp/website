import { NextResponse } from 'next/server';

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

export async function GET() {
  try {
    const cronograma = staticCronograma.sort(
      (a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime(),
    );
    return NextResponse.json(cronograma);
  } catch (error) {
    console.error('Erro ao buscar cronograma:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar o cronograma.' },
      { status: 500 },
    );
  }
}
