import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

const classificacaoSchema = z.object({
  modalidadeId: z.string().min(1, 'O ID da modalidade é obrigatório.'),
  posicao: z.number().min(1, 'A posição deve ser maior que 0.'),
  inscricaoId: z.string().optional(),
  lotacao: z.string().optional(),
  tempo: z.string().optional(),
  distancia: z.string().optional(),
  observacoes: z.string().optional(),
  atleta: z.string().optional(),
});

const pontuacaoMapa: Record<number, number> = {
  1: 20,
  2: 15,
  3: 12,
  4: 9,
  5: 7,
  6: 5,
  7: 4,
  8: 3,
  9: 2,
  10: 1,
};

async function enrichClassificacao(classificacao: any) {
  const modalidade = classificacao.modalidade
    ? {
        nome: classificacao.modalidade.nome,
        modalidadesSexo: classificacao.modalidade.modalidadesSexo,
      }
    : null;

  let atletaNome = classificacao.atleta;
  let lotacaoEnriquecida = classificacao.lotacao;

  if (!atletaNome && classificacao.inscricaoId && classificacao.inscricao) {
    atletaNome = classificacao.inscricao.nome;
    lotacaoEnriquecida = classificacao.inscricao.lotacao;
  } else if (!atletaNome && classificacao.lotacao) {
    atletaNome = classificacao.lotacao;
  }

  let sexo = '';
  if (modalidade?.modalidadesSexo) {
    if (modalidade.modalidadesSexo.includes('Masculino')) {
      sexo = 'Masculino';
    } else if (modalidade.modalidadesSexo.includes('Feminino')) {
      sexo = 'Feminino';
    }
  }

  return {
    id: classificacao.id,
    modalidadeId: classificacao.modalidadeId,
    posicao: classificacao.posicao,
    inscricaoId: classificacao.inscricaoId,
    lotacao: lotacaoEnriquecida || classificacao.lotacao,
    pontuacao: classificacao.pontuacao,
    tempo: classificacao.tempo,
    distancia: classificacao.distancia,
    observacoes: classificacao.observacoes,
    atleta: atletaNome || 'Atleta/Equipe Desconhecido',
    modalidade: modalidade?.nome || 'Modalidade Desconhecida',
    sexo: sexo || 'N/A',
  };
}

function calcularQuadroMedalhas(classificacoesEnriquecidas: any[]) {
  const mapa = new Map<
    string,
    {
      lotacao: string;
      ouro: number;
      prata: number;
      bronze: number;
      total: number;
    }
  >();

  for (const c of classificacoesEnriquecidas) {
    if (c.posicao > 3 || !c.lotacao) continue;

    const atual = mapa.get(c.lotacao) || {
      lotacao: c.lotacao,
      ouro: 0,
      prata: 0,
      bronze: 0,
      total: 0,
    };

    if (c.posicao === 1) atual.ouro += 1;
    if (c.posicao === 2) atual.prata += 1;
    if (c.posicao === 3) atual.bronze += 1;
    atual.total = atual.ouro + atual.prata + atual.bronze;
    mapa.set(c.lotacao, atual);
  }

  return Array.from(mapa.values()).sort((a, b) => {
    if (b.ouro !== a.ouro) return b.ouro - a.ouro;
    if (b.prata !== a.prata) return b.prata - a.prata;
    if (b.bronze !== a.bronze) return b.bronze - a.bronze;
    return b.total - a.total;
  });
}

function calcularEstatisticas(classificacoesEnriquecidas: any[]) {
  const modalidadesUnicas = new Set(
    classificacoesEnriquecidas.map((c) => c.modalidade).filter(Boolean),
  );
  const lotacoesUnicas = new Set(
    classificacoesEnriquecidas.map((c) => c.lotacao).filter(Boolean),
  );

  return {
    totalClassificacoes: classificacoesEnriquecidas.length,
    totalCampeoes: classificacoesEnriquecidas.filter((c) => c.posicao === 1)
      .length,
    totalModalidades: modalidadesUnicas.size,
    totalLotacoes: lotacoesUnicas.size,
    modalidades: Array.from(modalidadesUnicas) as string[],
    lotacoes: Array.from(lotacoesUnicas) as string[],
  };
}

export async function GET(request: NextRequest) {
  try {
    const headerList = request.headers;
    const userRole = headerList.get('x-user-role');
    const userOrgao = headerList.get('x-user-orgao');

    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const modalidade = searchParams.get('modalidade');
    const lotacao = searchParams.get('lotacao');
    const incluirMedalhas = searchParams.get('medalhas') === 'true';
    const incluirEstatisticas = searchParams.get('estatisticas') !== 'false';
    const incluirFiltros = searchParams.get('filtros') === 'true';

    let where: Prisma.ClassificacaoWhereInput = {};

    // Role-based filter
    if (userRole === 'PONTOFOCAL' && userOrgao) {
      where.OR = [
        { inscricao: { orgaoOrigem: userOrgao } },
        { lotacao: userOrgao },
      ];
    }

    // Query param filters
    const queryFilters: Prisma.ClassificacaoWhereInput = {};
    if (modalidade) {
      queryFilters.modalidade = { nome: modalidade };
    }
    if (lotacao) {
      // This will override the PONTOFOCAL filter if a specific lotacao is requested
      where = { ...where, lotacao: lotacao };
    }
    if (tipo === 'atletas') {
      queryFilters.inscricaoId = { not: null };
    } else if (tipo === 'equipes') {
      queryFilters.inscricaoId = null;
    }

    const finalWhere = { ...where, AND: queryFilters };

    const classificacoes = await prisma.classificacao.findMany({
      where: finalWhere,
      include: {
        modalidade: true,
        inscricao: true,
      },
      orderBy: [{ posicao: 'asc' }, { pontuacao: 'desc' }],
    });

    const enrichedClassificacoes = await Promise.all(
      classificacoes.map(enrichClassificacao),
    );

    const response: any = {
      dados: enrichedClassificacoes,
    };

    if (incluirEstatisticas || incluirMedalhas || incluirFiltros) {
      // The stats should also be filtered for PONTOFOCAL
      const statsWhere =
        userRole === 'PONTOFOCAL' && userOrgao
          ? {
              OR: [
                { inscricao: { orgaoOrigem: userOrgao } },
                { lotacao: userOrgao },
              ],
            }
          : {};

      const todasClassificacoes = await prisma.classificacao.findMany({
        where: statsWhere,
        include: {
          modalidade: true,
          inscricao: true,
        },
      });

      const todasEnriquecidas = await Promise.all(
        todasClassificacoes.map(enrichClassificacao),
      );

      if (incluirEstatisticas) {
        response.estatisticas = calcularEstatisticas(todasEnriquecidas);
      }

      if (incluirMedalhas) {
        response.quadroMedalhas = calcularQuadroMedalhas(todasEnriquecidas);
      }

      if (incluirFiltros) {
        const estatisticas = calcularEstatisticas(todasEnriquecidas);
        response.filtros = {
          modalidades: estatisticas.modalidades,
          lotacoes: estatisticas.lotacoes,
        };
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao buscar classificações:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar as classificações.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = classificacaoSchema.parse(body);
    const pontuacaoCalculada = pontuacaoMapa[validatedData.posicao] ?? 0;

    const novaClassificacao = await prisma.classificacao.create({
      data: {
        modalidadeId: validatedData.modalidadeId,
        posicao: validatedData.posicao,
        inscricaoId: validatedData.inscricaoId || null,
        lotacao: validatedData.lotacao || null,
        pontuacao: pontuacaoCalculada,
        tempo: validatedData.tempo || null,
        distancia: validatedData.distancia || null,
        observacoes: validatedData.observacoes || null,
        atleta: validatedData.atleta || null,
      },
      include: {
        modalidade: true,
        inscricao: true,
      },
    });

    const enrichedNovaClassificacao =
      await enrichClassificacao(novaClassificacao);
    return NextResponse.json(enrichedNovaClassificacao, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join('; ');
      return NextResponse.json(
        {
          error: `Erro de validação: ${errorMessages}`,
          details: error.issues,
        },
        { status: 400 },
      );
    }
    console.error('Erro ao criar classificação:', error);
    return NextResponse.json(
      {
        error: `Ocorreu um erro no servidor ao criar a classificação: ${(error as Error).message}`,
      },
      { status: 500 },
    );
  }
}
