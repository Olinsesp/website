import { NextResponse } from 'next/server';
import { z } from 'zod';
import { staticCronograma } from './cronogramaData';

const eventoSchema = z.object({
  atividade: z.string().min(1, 'A atividade é obrigatória.'),
  inicio: z.string().min(1, 'A data de início é obrigatória.'),
  fim: z.string().min(1, 'A data de fim é obrigatória.'),
  detalhes: z.string().min(1, 'Os detalhes são obrigatórios.'),
  modalidade: z.string().min(1, 'A modalidade é obrigatória.'),
});

export async function GET() {
  try {
    const cronograma = staticCronograma.sort(
      (a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime(),
    );
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
    const body = await req.json();
    const validatedData = eventoSchema.parse(body);

    const novoEvento = {
      id: (staticCronograma.length + 1).toString(),
      ...validatedData,
    };

    staticCronograma.push(novoEvento);

    return NextResponse.json(novoEvento, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao criar o evento.' },
      { status: 500 },
    );
  }
}
