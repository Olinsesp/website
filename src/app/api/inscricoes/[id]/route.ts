import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const modalidadeSelectionSchema = z.object({
  modalidadeId: z.string(),
  sexo: z.string().optional(),
  divisao: z.string().optional(),
  categoria: z.string().optional(),
  faixaEtaria: z.string().optional(),
});

const inscricaoUpdateSchema = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
    .optional(),
  email: z.email({ message: 'Email inválido.' }).optional(),
  telefone: z.string().min(10, { message: 'Telefone inválido.' }).optional(),
  camiseta: z.string().optional(),
  lotacao: z.string().optional(),
  orgaoOrigem: z.string().optional(),
  status: z.enum(['aprovada', 'pendente', 'rejeitada']).optional(),
  modalidades: z
    .array(modalidadeSelectionSchema)
    .min(1, { message: 'Selecione ao menos uma modalidade.' })
    .optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const inscricao = await prisma.inscricao.findUnique({
      where: { id },
      include: {
        modalidades: {
          include: {
            modalidade: true,
          },
        },
      },
    });

    if (!inscricao) {
      return NextResponse.json(
        { error: 'Inscrição não encontrada.' },
        { status: 404 },
      );
    }

    const inscricaoFormatada = {
      id: inscricao.id,
      nome: inscricao.nome,
      email: inscricao.email,
      cpf: inscricao.cpf,
      dataNascimento: inscricao.dataNascimento.toISOString(),
      telefone: inscricao.telefone,
      sexo: inscricao.sexo,
      camiseta: inscricao.camiseta,
      lotacao: inscricao.lotacao,
      orgaoOrigem: inscricao.orgaoOrigem,
      matricula: inscricao.matricula,
      modalidades: inscricao.modalidades.map((im) => ({
        modalidadeId: im.modalidade.id,
        nome: im.modalidade.nome,
        sexo: im.sexo,
        divisao: im.divisao,
        categoria: im.categoria,
        faixaEtaria: im.faixaEtaria,
      })),
      status: inscricao.status,
      createdAt: inscricao.createdAt.toISOString(),
    };

    return NextResponse.json(inscricaoFormatada);
  } catch (error) {
    console.error('Erro ao buscar inscrição:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar a inscrição.' },
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
    const data = await request.json();
    const validatedData = inscricaoUpdateSchema.parse(data);

    const { modalidades: modalidadesSelections, ...dadosAtualizacao } =
      validatedData;

    const updateData: any = { ...dadosAtualizacao };

    if (modalidadesSelections) {
      await prisma.inscricaoModalidade.deleteMany({
        where: { inscricaoId: id },
      });

      updateData.modalidades = {
        create: modalidadesSelections.map((mod) => ({
          modalidadeId: mod.modalidadeId,
          sexo: mod.sexo,
          divisao: mod.divisao,
          categoria: mod.categoria,
          faixaEtaria: mod.faixaEtaria,
        })),
      };
    }

    const inscricaoAtualizada = await prisma.inscricao.update({
      where: { id },
      data: updateData,
      include: {
        modalidades: {
          include: {
            modalidade: true,
          },
        },
      },
    });

    const inscricaoFormatada = {
      id: inscricaoAtualizada.id,
      nome: inscricaoAtualizada.nome,
      email: inscricaoAtualizada.email,
      cpf: inscricaoAtualizada.cpf,
      dataNascimento: inscricaoAtualizada.dataNascimento.toISOString(),
      telefone: inscricaoAtualizada.telefone,
      sexo: inscricaoAtualizada.sexo,
      camiseta: inscricaoAtualizada.camiseta,
      lotacao: inscricaoAtualizada.lotacao,
      orgaoOrigem: inscricaoAtualizada.orgaoOrigem,
      matricula: inscricaoAtualizada.matricula,
      modalidades: inscricaoAtualizada.modalidades.map((im) => ({
        modalidadeId: im.modalidade.id,
        nome: im.modalidade.nome,
        sexo: im.sexo,
        divisao: im.divisao,
        categoria: im.categoria,
        faixaEtaria: im.faixaEtaria,
      })),
      status: inscricaoAtualizada.status,
      createdAt: inscricaoAtualizada.createdAt.toISOString(),
    };

    return NextResponse.json(inscricaoFormatada);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos.',
          details: error.issues,
        },
        { status: 400 },
      );
    }
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Inscrição não encontrada.' },
        { status: 404 },
      );
    }
    console.error('Erro ao atualizar inscrição:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao atualizar a inscrição.' },
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

    await prisma.inscricao.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Inscrição não encontrada.' },
        { status: 404 },
      );
    }
    console.error('Erro ao deletar inscrição:', error);
    return NextResponse.json(
      {
        error: 'Ocorreu um erro no servidor ao deletar a inscrição.',
      },
      { status: 500 },
    );
  }
}
