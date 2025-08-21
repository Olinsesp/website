import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const servicoSchema = z.object({
  nome: z.string().min(1, 'O nome do serviço é obrigatório.'),
  descricao: z.string().min(1, 'A descrição é obrigatória.'),
  localizacao: z.string().min(1, 'A localização é obrigatória.'),
  horario: z.string().min(1, 'O horário é obrigatório.'),
});

export async function GET() {
  try {
    const servicos = await prisma.servico.findMany();
    return NextResponse.json(servicos);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar os serviços.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = servicoSchema.parse(data);

    const servico = await prisma.servico.create({
      data: validatedData,
    });

    return NextResponse.json(servico, { status: 201 });
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

    console.error('Erro ao criar serviço:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao processar a solicitação.' },
      { status: 500 },
    );
  }
}
