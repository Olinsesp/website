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
        orgaoOrigem: {
          equals: orgaoDeOrigem,
          mode: 'insensitive',
        },
      };
    }

    const inscricoes = await prisma.inscricao.findMany({
      where: whereClause,
      include: {
        modalidades: { include: { modalidade: true } },
        equipeRel: true,
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

    const equipesMap = new Map<string, number>();
    inscricoes.forEach((i) => {
      if (i.equipeRel) {
        equipesMap.set(
          i.equipeRel.nome,
          (equipesMap.get(i.equipeRel.nome) || 0) + 1,
        );
      }
    });
    const uniqueEquipes = Array.from(equipesMap.keys());

    const inscricoesData = inscricoes.map((i) => ({
      ...i,
      equipeName: i.equipeRel?.nome,
      modalidades: i.modalidades.map((m) => ({
        modalidadeId: m.modalidadeId,
        nome: m.modalidade.nome,
        detalhes: m.detalhes,
      })),
    }));

    return NextResponse.json({
      inscritosCount,
      modalidadesCount,
      lotacoesCount,
      uniqueLotacoes,
      uniqueModalidades,
      uniqueEquipes,
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
