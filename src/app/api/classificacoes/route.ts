import { NextResponse } from 'next/server';
import { z } from 'zod';
import { classificacoes } from './classificacoesData';
import { modalidades } from '../modalidades/modalidadesData';
import { inscricoes } from '../inscricoes/inscriçoesData';

const classificacaoSchema = z
  .object({
    modalidadeId: z.string().min(1, 'O ID da modalidade é obrigatório.'),
    categoria: z.string().min(1, 'A categoria é obrigatória.'),
    posicao: z.number().min(1, 'A posição deve ser maior que 0.'),
    inscricaoId: z.string().optional(),
    lotacao: z.string().optional(),
    pontuacao: z.number().min(0, 'A pontuação deve ser maior ou igual a 0.'),
    tempo: z.string().optional(),
    distancia: z.string().optional(),
    observacoes: z.string().optional(),
    atleta: z.string().optional(),
  })
  .refine(
    (data) =>
      (data.inscricaoId && !data.lotacao && !data.atleta) ||
      (!data.inscricaoId && data.lotacao && !data.atleta) ||
      (!data.inscricaoId && !data.lotacao && data.atleta),
    {
      message:
        'Forneça `inscricaoId` para individual, `lotacao` para equipe, ou `atleta` diretamente, mas apenas um.',
      path: ['inscricaoId', 'lotacao', 'atleta'],
    },
  );

function enrichClassificacao(classificacao: any) {
  const modalidade = modalidades.find(
    (m) => m.id === classificacao.modalidadeId,
  );
  let atletaNome = classificacao.atleta;
  let lotacaoEnriquecida = classificacao.lotacao;

  if (!atletaNome && classificacao.inscricaoId) {
    const inscricao = inscricoes.find(
      (i) => i.id === classificacao.inscricaoId,
    );
    if (inscricao) {
      atletaNome = inscricao.nome;
      lotacaoEnriquecida = inscricao.lotacao;
    }
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

  if (!sexo) {
    if (classificacao.categoria.includes('Masculino')) {
      sexo = 'Masculino';
    } else if (classificacao.categoria.includes('Feminino')) {
      sexo = 'Feminino';
    }
  }

  return {
    ...classificacao,
    modalidade: modalidade?.nome || 'Modalidade Desconhecida',
    atleta: atletaNome || 'Atleta/Equipe Desconhecido',
    lotacao: lotacaoEnriquecida || classificacao.lotacao,
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
  const categoriasUnicas = new Set(
    classificacoesEnriquecidas.map((c) => c.categoria),
  );

  return {
    totalClassificacoes: classificacoesEnriquecidas.length,
    totalCampeoes: classificacoesEnriquecidas.filter((c) => c.posicao === 1)
      .length,
    totalModalidades: modalidadesUnicas.size,
    totalLotacoes: lotacoesUnicas.size,
    modalidades: Array.from(modalidadesUnicas) as string[],
    categorias: Array.from(categoriasUnicas) as string[],
    lotacoes: Array.from(lotacoesUnicas) as string[],
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo'); // 'atletas' ou 'equipes'
    const modalidade = searchParams.get('modalidade');
    const categoria = searchParams.get('categoria');
    const lotacao = searchParams.get('lotacao');
    const incluirMedalhas = searchParams.get('medalhas') === 'true';
    const incluirEstatisticas = searchParams.get('estatisticas') !== 'false'; // default true
    const incluirFiltros = searchParams.get('filtros') === 'true';

    // Enriquecer todas as classificações
    let enrichedClassificacoes = classificacoes.map(enrichClassificacao);

    // Separar atletas e equipes
    const atletas = enrichedClassificacoes.filter((c) => c.inscricaoId);
    const equipes = enrichedClassificacoes.filter((c) => !c.inscricaoId);

    // Aplicar filtro de tipo
    if (tipo === 'atletas') {
      enrichedClassificacoes = atletas;
    } else if (tipo === 'equipes') {
      enrichedClassificacoes = equipes;
    }

    // Aplicar filtros
    if (modalidade) {
      enrichedClassificacoes = enrichedClassificacoes.filter(
        (c) => c.modalidade === modalidade,
      );
    }
    if (categoria) {
      enrichedClassificacoes = enrichedClassificacoes.filter(
        (c) => c.categoria === categoria,
      );
    }
    if (lotacao) {
      enrichedClassificacoes = enrichedClassificacoes.filter(
        (c) => c.lotacao === lotacao,
      );
    }

    // Preparar resposta
    const response: any = {
      dados: enrichedClassificacoes,
    };

    // Adicionar estatísticas se solicitado
    if (incluirEstatisticas) {
      const todasClassificacoes = classificacoes.map(enrichClassificacao);
      response.estatisticas = calcularEstatisticas(todasClassificacoes);
    }

    // Adicionar quadro de medalhas se solicitado
    if (incluirMedalhas) {
      const todasClassificacoes = classificacoes.map(enrichClassificacao);
      response.quadroMedalhas = calcularQuadroMedalhas(todasClassificacoes);
    }

    // Adicionar listas de filtros se solicitado
    if (incluirFiltros) {
      const todasClassificacoes = classificacoes.map(enrichClassificacao);
      const estatisticas = calcularEstatisticas(todasClassificacoes);
      response.filtros = {
        modalidades: estatisticas.modalidades,
        categorias: estatisticas.categorias,
        lotacoes: estatisticas.lotacoes,
      };
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

    const novaClassificacao = {
      id: (classificacoes.length + 1).toString(),
      ...validatedData,
    };

    classificacoes.push(novaClassificacao as any);

    const enrichedNovaClassificacao = enrichClassificacao(novaClassificacao);

    return NextResponse.json(enrichedNovaClassificacao, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Erro ao criar classificação:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao criar a classificação.' },
      { status: 500 },
    );
  }
}
