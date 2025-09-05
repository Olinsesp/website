import { NextResponse } from 'next/server';
import { z } from 'zod';
import { staticJogos } from './jogosData';

const jogoSchema = z.object({
  modalidade: z.string().min(1, 'A modalidade é obrigatória.'),
  data: z.string().min(1, 'A data é obrigatória.'),
  horario: z.string().min(1, 'O horário é obrigatório.'),
  resultado: z.string().min(1, 'O resultado é obrigatório.'),
});

export async function GET() {
  try {
    return NextResponse.json(staticJogos);
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar os jogos.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = jogoSchema.parse(body);

    const novoJogo = {
      id: (staticJogos.length + 1).toString(),
      ...validatedData,
    };

    staticJogos.push(novoJogo);

    return NextResponse.json(novoJogo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Erro ao criar jogo:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao criar o jogo.' },
      { status: 500 },
    );
  }
}
