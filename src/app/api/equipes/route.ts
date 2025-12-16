import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const equipes = await prisma.equipe.findMany({
      select: {
        id: true,
        nome: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });
    return NextResponse.json(equipes);
  } catch (error) {
    console.error('❌ Erro GET equipes:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar equipes.' },
      { status: 500 },
    );
  }
}
