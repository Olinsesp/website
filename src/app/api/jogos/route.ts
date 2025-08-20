import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const jogoSchema = z.object({
  modalidade: z.string().min(1, 'A modalidade é obrigatória.'),
  data: z.iso.datetime({ message: 'Data inválida.' }),
  horario: z.string().min(1, 'O horário é obrigatório.'),
  resultado: z.string().optional(),
});

export async function GET() {
  try {
    const jogos = await prisma.jogo.findMany({ orderBy: { data: 'asc' } });
    return NextResponse.json(jogos);
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar os jogos.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = jogoSchema.parse(data);

    const jogo = await prisma.jogo.create({
      data: validatedData,
    });

    return NextResponse.json(jogo, { status: 201 });
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

    console.error('Erro ao criar jogo:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao processar a solicitação.' },
      { status: 500 }
    );
  }
}
