import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const inscricaoUpdateSchema = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
    .optional(),
  email: z.email({ message: 'Email inválido.' }).optional(),
  telefone: z.string().min(10, { message: 'Telefone inválido.' }).optional(),
  camiseta: z.string().optional(),
  afiliacao: z.string().optional(),
  modalidades: z
    .array(z.string())
    .min(1, { message: 'Selecione ao menos uma modalidade.' })
    .optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const inscricao = await prisma.inscricao.findUnique({
      where: { id },
    });

    if (!inscricao) {
      return NextResponse.json(
        { error: 'Inscrição não encontrada.' },
        { status: 404 }
      );
    }

    return NextResponse.json(inscricao);
  } catch (error) {
    console.error('Erro ao buscar inscrição:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar a inscrição.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    const validatedData = inscricaoUpdateSchema.parse(data);

    const inscricao = await prisma.inscricao.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(inscricao);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos.',
          details: z.treeifyError(error),
        },
        { status: 400 }
      );
    }
    console.error('Erro ao atualizar inscrição:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao atualizar a inscrição.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.inscricao.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar inscrição:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao deletar a inscrição.' },
      { status: 500 }
    );
  }
}
