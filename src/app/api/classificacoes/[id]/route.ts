import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const pointsMap: Record<number, number> = {
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

const classificacaoUpdateSchema = z.object({
  modalidadeId: z
    .string()
    .min(1, 'O ID da modalidade é obrigatório.')
    .optional(),
  posicao: z.coerce
    .number()
    .min(1, 'A posição deve ser maior que 0.')
    .optional(),
  inscricaoId: z.string().optional(),
  equipe: z.string().optional(),
  tempo: z.string().optional(),
  distancia: z.string().optional(),
  observacoes: z.string().optional(),
  atleta: z.string().optional(),
  detalhes: z.record(z.string(), z.any()).optional(),
});

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
      equipe: classificacao.equipe,
      tempo: classificacao.tempo,
      distancia: classificacao.distancia,
      observacoes: classificacao.observacoes,
      atleta: classificacao.atleta,
      pontuacao: classificacao.pontuacao,
      detalhes: classificacao.detalhes,
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

    let newPontuacao;

    if (validatedData.posicao) {
      newPontuacao = pointsMap[validatedData.posicao] ?? 0;
    }

    let finalDetalhes = validatedData.detalhes || {};

    if (validatedData.inscricaoId && validatedData.modalidadeId) {
      const inscricaoModalidade = await prisma.inscricaoModalidade.findUnique({
        where: {
          inscricaoId_modalidadeId: {
            inscricaoId: validatedData.inscricaoId,
            modalidadeId: validatedData.modalidadeId,
          },
        },
      });

      if (inscricaoModalidade?.detalhes) {
        finalDetalhes = {
          ...(inscricaoModalidade.detalhes as object),
          ...finalDetalhes,
        };
      }
    }

    const classificacaoAtualizada = await prisma.classificacao.update({
      where: { id },
      data: {
        ...validatedData,
        detalhes: finalDetalhes, 
        ...(validatedData.posicao && { pontuacao: newPontuacao }),
      },
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
      equipe: classificacaoAtualizada.equipe,
      tempo: classificacaoAtualizada.tempo,
      distancia: classificacaoAtualizada.distancia,
      observacoes: classificacaoAtualizada.observacoes,
      atleta: classificacaoAtualizada.atleta,
      pontuacao: classificacaoAtualizada.pontuacao,
      detalhes: classificacaoAtualizada.detalhes,
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
      { error: 'Ocorreu um erro no servidor ao deletar a classificação.' },
      { status: 500 },
    );
  }
}
