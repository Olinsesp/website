import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const classificacaoUpdateSchema = z
  .object({
    modalidadeId: z
      .string()
      .min(1, 'O ID da modalidade é obrigatório.')
      .optional(),
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
    atleta: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.inscricaoId && !data.lotacao && !data.atleta) return true;
      const hasInscricao = !!data.inscricaoId;
      const hasLotacao = !!data.lotacao;
      const hasAtleta = !!data.atleta;
      return (
        (hasInscricao && !hasLotacao && !hasAtleta) ||
        (!hasInscricao && hasLotacao && !hasAtleta) ||
        (!hasInscricao && !hasLotacao && hasAtleta)
      );
    },
    {
      message:
        'A classificação deve ser individual (com `inscricaoId`), de equipe (com `lotacao`), ou com `atleta` diretamente, mas apenas um.',
      path: ['inscricaoId', 'lotacao', 'atleta'],
    },
  );

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const classificacao = await prisma.classificacao.findUnique({
      where: { id },
      include: {
        modalidade: true,
        inscricao: true,
      },
    });

    if (!classificacao) {
      return NextResponse.json(
        { error: 'Classificação não encontrada.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: classificacao.id,
      modalidadeId: classificacao.modalidadeId,
      posicao: classificacao.posicao,
      inscricaoId: classificacao.inscricaoId,
      lotacao: classificacao.lotacao,
      pontuacao: classificacao.pontuacao,
      tempo: classificacao.tempo,
      distancia: classificacao.distancia,
      observacoes: classificacao.observacoes,
      atleta: classificacao.atleta,
    });
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

    const classificacaoAtualizada = await prisma.classificacao.update({
      where: { id },
      data: validatedData,
      include: {
        modalidade: true,
        inscricao: true,
      },
    });

    return NextResponse.json({
      id: classificacaoAtualizada.id,
      modalidadeId: classificacaoAtualizada.modalidadeId,
      posicao: classificacaoAtualizada.posicao,
      inscricaoId: classificacaoAtualizada.inscricaoId,
      lotacao: classificacaoAtualizada.lotacao,
      pontuacao: classificacaoAtualizada.pontuacao,
      tempo: classificacaoAtualizada.tempo,
      distancia: classificacaoAtualizada.distancia,
      observacoes: classificacaoAtualizada.observacoes,
      atleta: classificacaoAtualizada.atleta,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: error.issues },
        { status: 400 },
      );
    }
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Classificação não encontrada.' },
        { status: 404 },
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

    await prisma.classificacao.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Classificação não encontrada.' },
        { status: 404 },
      );
    }
    console.error('Erro ao deletar classificação:', error);
    return NextResponse.json(
      {
        error: 'Ocorreu um erro no servidor ao deletar a classificação.',
      },
      { status: 500 },
    );
  }
}
