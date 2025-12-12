import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orgaoDeOrigem = searchParams.get('orgaoDeOrigem');

    let whereClause: Prisma.InscricaoWhereInput = {};

    if (orgaoDeOrigem !== null) {
      whereClause = {
        orgaoOrigem: orgaoDeOrigem,
      };
    }

    const inscricoes = await prisma.inscricao.findMany({
      where: whereClause,
      include: {
        modalidades: { include: { modalidade: true } },
      },
    });

    const inscritosCount = inscricoes.length;

    const modalidadesMap = new Map<string, number>();
    inscricoes.forEach((i) => {
      i.modalidades.forEach((m) => {
        modalidadesMap.set(
          m.modalidade.nome,
          (modalidadesMap.get(m.modalidade.nome) || 0) + 1,
        );
      });
    });
    const modalidadesCount = Array.from(modalidadesMap, ([name, value]) => ({
      name,
      value,
    }));

    const lotacoesMap = new Map<string, number>();
    inscricoes.forEach((i) => {
      lotacoesMap.set(i.lotacao, (lotacoesMap.get(i.lotacao) || 0) + 1);
    });
    const lotacoesCount = Array.from(lotacoesMap, ([name, quantidade]) => ({
      name,
      quantidade,
    }));
    const uniqueLotacoes = Array.from(lotacoesMap.keys());
    const uniqueModalidades = Array.from(modalidadesMap.keys());

    const inscricoesData = inscricoes.map((i) => ({
      ...i,
      modalidades: i.modalidades.map((m) => ({
        modalidadeId: m.modalidadeId,
        nome: m.modalidade.nome,
        sexo: m.sexo,
        divisao: m.divisao,
        categoria: m.categoria,
        faixaEtaria: m.faixaEtaria,
      })),
    }));

    return NextResponse.json({
      inscritosCount,
      modalidadesCount,
      lotacoesCount,
      uniqueLotacoes,
      uniqueModalidades,
      inscricoes: inscricoesData,
    });
  } catch (error) {
    console.error('❌ Erro GET dashboard summary:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar dados do dashboard.' },
      { status: 500 },
    );
  }
}
