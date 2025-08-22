import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const servicoUpdateSchema = z.object({
  nome: z.string().min(1, 'O nome do serviço é obrigatório.').optional(),
  descricao: z.string().min(1, 'A descrição é obrigatória.').optional(),
  localizacao: z.string().min(1, 'A localização é obrigatória.').optional(),
  horario: z.string().min(1, 'O horário é obrigatório.').optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const servico = await prisma.servico.findUnique({
      where: { id },
    });

    if (!servico) {
      return NextResponse.json(
        { error: 'Serviço não encontrado.' },
        { status: 404 },
      );
    }

    return NextResponse.json(servico);
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar o serviço.' },
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
    const validatedData = servicoUpdateSchema.parse(data);

    const servico = await prisma.servico.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(servico);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos.',
          details: z.treeifyError(error),
        },
        { status: 400 },
      );
    }
    console.error('Erro ao atualizar serviço:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao atualizar o serviço.' },
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
    await prisma.servico.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao deletar o serviço.' },
      { status: 500 },
    );
  }
}
