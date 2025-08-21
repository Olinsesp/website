import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Esquema de validação com Zod
const inscricaoSchema = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.email({ message: 'Email inválido.' }),
  cpf: z.string().min(11, { message: 'CPF deve ter 11 caracteres.' }),
  dataNascimento: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Por favor, insira uma data válida.',
  }),
  telefone: z.string().min(10, { message: 'Telefone inválido.' }),
  camiseta: z.string(),
  afiliacao: z.string(),
  modalidades: z
    .array(z.string())
    .min(1, { message: 'Selecione ao menos uma modalidade.' }),
});

export async function GET() {
  try {
    const inscricoes = await prisma.inscricao.findMany();
    return NextResponse.json(inscricoes);
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar as inscrições.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = inscricaoSchema.parse(data);

    const inscricao = await prisma.inscricao.create({
      data: validatedData,
    });

    return NextResponse.json(inscricao, { status: 201 });
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

    console.error('Erro ao criar inscrição:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao processar a inscrição.' },
      { status: 500 },
    );
  }
}
