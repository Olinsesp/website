import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ modalidadeId: string }> },
) {
  try {
    const { modalidadeId } = await params;
    if (!modalidadeId) {
      return NextResponse.json(
        { error: 'Modalidade ID não fornecido.' },
        { status: 400 },
      );
    }

    const inscricoes = await prisma.inscricao.findMany({
      where: {
        modalidades: {
          some: {
            modalidadeId: modalidadeId,
          },
        },
      },
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json({ dados: inscricoes });
  } catch (error) {
    console.error('Erro ao buscar inscrições por modalidade:', error);
    return NextResponse.json(
      {
        error:
          'Ocorreu um erro no servidor ao buscar inscrições por modalidade.',
      },
      { status: 500 },
    );
  }
}
