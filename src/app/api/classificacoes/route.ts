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

  if (!atletaNome && classificacao.inscricaoId) {
    const inscricao = inscricoes.find(
      (i) => i.id === classificacao.inscricaoId,
    );
    atletaNome = inscricao?.nome;
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
    sexo: sexo || 'N/A',
  };
}

export async function GET() {
  try {
    const enrichedClassificacoes = classificacoes.map(enrichClassificacao);
    return NextResponse.json(enrichedClassificacoes);
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
