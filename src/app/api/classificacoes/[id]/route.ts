import { NextResponse } from 'next/server';
import { z } from 'zod';
import { classificacoes } from '../classificacoesData';

const classificacaoUpdateSchema = z
  .object({
    modalidadeId: z
      .string()
      .min(1, 'O ID da modalidade é obrigatório.')
      .optional(),
    categoria: z.string().min(1, 'A categoria é obrigatória.').optional(),
    posicao: z.number().min(1, 'A posição deve ser maior que 0.').optional(),
    inscricaoId: z.string().optional(),
    lotacao: z.string().optional(),
    pontuacao: z
      .number()
      .min(0, 'A pontuação deve ser maior ou igual a 0.')
      .optional(),
    tempo: z.string().optional(),
    distancia: z.string().optional(),
    observacoes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.inscricaoId && !data.lotacao) return true;
      return (
        (data.inscricaoId && !data.lotacao) ||
        (!data.inscricaoId && data.lotacao)
      );
    },
    {
      message:
        'A classificação deve ser individual (com `inscricaoId`) ou de equipe (com `lotacao`), mas não ambos.',
      path: ['inscricaoId', 'lotacao'],
    },
  );

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const classificacao = classificacoes.find((c) => c.id === id);

    if (!classificacao) {
      return NextResponse.json(
        { error: 'Classificação não encontrada.' },
        { status: 404 },
      );
    }

    return NextResponse.json(classificacao);
  } catch (error) {
    console.error('Erro ao buscar classificação:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar a classificação.' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validatedData = classificacaoUpdateSchema.parse(body);

    const classificacaoIndex = classificacoes.findIndex((c) => c.id === id);

    if (classificacaoIndex === -1) {
      return NextResponse.json(
        { error: 'Classificação não encontrada.' },
        { status: 404 },
      );
    }

    classificacoes[classificacaoIndex] = {
      ...classificacoes[classificacaoIndex],
      ...validatedData,
    } as any;

    return NextResponse.json(classificacoes[classificacaoIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Erro ao atualizar classificação:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao atualizar a classificação.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const classificacaoIndex = classificacoes.findIndex((c) => c.id === id);

    if (classificacaoIndex === -1) {
      return NextResponse.json(
        { error: 'Classificação não encontrada.' },
        { status: 404 },
      );
    }

    classificacoes.splice(classificacaoIndex, 1);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar classificação:', error);
    return NextResponse.json(
      {
        error: 'Ocorreu um erro no servidor ao deletar a classificação.',
      },
      { status: 500 },
    );
  }
}
