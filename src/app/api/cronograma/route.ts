import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const cronogramaSchema = z.object({
  atividade: z.string().min(1, 'A atividade é obrigatória.'),
  inicio: z.iso.datetime({ message: 'Data de início inválida.' }),
  fim: z.iso.datetime({ message: 'Data de fim inválida.' }),
  detalhes: z.string().optional(),
});

export async function GET() {
  try {
    const cronograma = await prisma.cronograma.findMany({
      orderBy: { inicio: 'asc' },
    });
    return NextResponse.json(cronograma);
  } catch (error) {
    console.error('Erro ao buscar cronograma:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar o cronograma.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = cronogramaSchema.parse(data);

    const atividade = await prisma.cronograma.create({
      data: validatedData,
    });

    return NextResponse.json(atividade, { status: 201 });
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

    console.error('Erro ao criar atividade no cronograma:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao processar a solicitação.' },
      { status: 500 },
    );
  }
}
