import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const midiaSchema = z.object({
  tipo: z.string().min(1, 'O tipo é obrigatório.'),
  url: z.url({ message: 'URL inválida.' }),
  titulo: z.string().optional(),
  destaque: z.boolean().optional(),
});

export async function GET() {
  try {
    const midias = await prisma.midia.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(midias);
  } catch (error) {
    console.error('Erro ao buscar mídias:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar as mídias.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = midiaSchema.parse(data);

    const midia = await prisma.midia.create({
      data: validatedData,
    });

    return NextResponse.json(midia, { status: 201 });
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

    console.error('Erro ao criar mídia:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao processar a solicitação.' },
      { status: 500 }
    );
  }
}
