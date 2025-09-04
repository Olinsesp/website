import { NextResponse } from 'next/server';
import { z } from 'zod';

const stringUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const staticMidias = [
  {
    id: '1',
    tipo: 'imagem',
    url: `${stringUrl}/olinsesp/foto1.png`,
    titulo: 'Abertura do Evento',
    destaque: true,
    createdAt: new Date('2026-12-15T09:00:00').toISOString(),
  },
  {
    id: '2',
    tipo: 'imagem',
    url: `${stringUrl}/olinsesp/foto1.png`,
    titulo: 'Jogo de Vôlei',
    destaque: false,
    createdAt: new Date('2026-12-15T11:30:00').toISOString(),
  },
  {
    id: '3',
    tipo: 'video',
    url: `${stringUrl}/olinsesp/foto1.png`,
    titulo: 'Melhores Momentos - Dia 1',
    destaque: true,
    createdAt: new Date('2026-12-15T20:00:00').toISOString(),
  },
  {
    id: '4',
    tipo: 'release',
    url: 'Resultados do primeiro dia de competições da Olinsesp VIII.',
    titulo: 'Balanço do Dia 1',
    destaque: false,
    createdAt: new Date('2026-12-16T09:00:00').toISOString(),
  },
  {
    id: '5',
    tipo: 'imagem',
    url: `${stringUrl}/olinsesp/foto1.png`,
    titulo: 'Corrida de Rua',
    destaque: false,
    createdAt: new Date('2026-12-16T10:00:00').toISOString(),
  },
];

const midiaUpdateSchema = z.object({
  tipo: z.string().min(1, 'O tipo é obrigatório.').optional(),
  url: z.url({ message: 'URL inválida.' }).optional(),
  titulo: z.string().optional(),
  destaque: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const midia = staticMidias.find((m) => m.id === id);

    if (!midia) {
      return NextResponse.json(
        { error: 'Mídia não encontrada.' },
        { status: 404 },
      );
    }

    return NextResponse.json(midia);
  } catch (error) {
    console.error('Erro ao buscar mídia:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar a mídia.' },
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
    const validatedData = midiaUpdateSchema.parse(data);

    const midiaIndex = staticMidias.findIndex((m) => m.id === id);

    if (midiaIndex === -1) {
      return NextResponse.json(
        { error: 'Mídia não encontrada.' },
        { status: 404 },
      );
    }

    const midiaAtualizada = {
      ...staticMidias[midiaIndex],
      ...validatedData,
    };

    return NextResponse.json(midiaAtualizada);
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
    console.error('Erro ao atualizar mídia:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao atualizar a mídia.' },
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

    const midiaIndex = staticMidias.findIndex((m) => m.id === id);

    if (midiaIndex === -1) {
      return NextResponse.json(
        { error: 'Mídia não encontrada.' },
        { status: 404 },
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar mídia:', error);
    return NextResponse.json(
      {
        error: 'Ocorreu um erro no servidor ao deletar a mídia.',
      },
      { status: 500 },
    );
  }
}
