import { NextResponse } from 'next/server';
import { z } from 'zod';
import { classificacoes } from './classificacoesData';

const classificacaoSchema = z.object({
  modalidade: z.string().min(1, 'A modalidade é obrigatória.'),
  categoria: z.string().min(1, 'A categoria é obrigatória.'),
  posicao: z.number().min(1, 'A posição deve ser maior que 0.'),
  atleta: z.string().optional(),
  afiliacao: z.string().min(1, 'A afiliação é obrigatória.'),
  pontuacao: z.number().min(0, 'A pontuação deve ser maior ou igual a 0.'),
  tempo: z.string().optional(),
  distancia: z.string().optional(),
  observacoes: z.string().optional(),
});

export async function GET() {
  try {
    return NextResponse.json(classificacoes);
  } catch (error) {
    console.error('Erro ao buscar classificações:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar as classificações.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = classificacaoSchema.parse(body);

    const novaClassificacao = {
      id: (classificacoes.length + 1).toString(),
      ...validatedData,
    };

    classificacoes.push(novaClassificacao as any);

    return NextResponse.json(novaClassificacao, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Erro ao criar classificação:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao criar a classificação.' },
      { status: 500 },
    );
  }
}
