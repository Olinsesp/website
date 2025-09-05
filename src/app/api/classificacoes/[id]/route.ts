import { NextResponse } from 'next/server';
import { z } from 'zod';

const classificacoes = [
  {
    id: '1',
    modalidade: 'Futsal Masculino',
    categoria: 'Adulto',
    posicao: 1,
    afiliacao: 'PMDF',
    pontuacao: 95,
    observacoes: 'Campeão da modalidade',
  },
  {
    id: '2',
    modalidade: 'Futsal Masculino',
    categoria: 'Adulto',
    posicao: 2,
    afiliacao: 'CBMDF',
    pontuacao: 88,
    observacoes: 'Vice-campeão da modalidade',
  },
  {
    id: '3',
    modalidade: 'Futsal Masculino',
    categoria: 'Adulto',
    posicao: 3,
    afiliacao: 'PCDF',
    pontuacao: 82,
    observacoes: 'Terceiro lugar na modalidade',
  },
  {
    id: '4',
    modalidade: 'Vôlei Feminino',
    categoria: 'Adulto',
    posicao: 1,
    afiliacao: 'PMDF',
    pontuacao: 92,
    observacoes: 'Campeão da modalidade',
  },
  {
    id: '5',
    modalidade: 'Vôlei Feminino',
    categoria: 'Adulto',
    posicao: 2,
    afiliacao: 'CBMDF',
    pontuacao: 87,
    observacoes: 'Vice-campeão da modalidade',
  },
  {
    id: '6',
    modalidade: 'Basquete Masculino',
    categoria: 'Adulto',
    posicao: 1,
    afiliacao: 'PMDF',
    pontuacao: 94,
    observacoes: 'Campeão da modalidade',
  },
  {
    id: '7',
    modalidade: 'Basquete Masculino',
    categoria: 'Adulto',
    posicao: 2,
    afiliacao: 'PCDF',
    pontuacao: 89,
    observacoes: 'Vice-campeão da modalidade',
  },
  {
    id: '8',
    modalidade: 'Atletismo',
    categoria: '100m',
    posicao: 1,
    atleta: 'Lucas Mendes',
    afiliacao: 'DEPEN',
    pontuacao: 96,
    tempo: '10.45s',
    distancia: '100m',
    observacoes: 'Recorde do evento',
  },
  {
    id: '9',
    modalidade: 'Atletismo',
    categoria: '100m',
    posicao: 2,
    atleta: 'Ricardo Alves',
    afiliacao: 'PMDF',
    pontuacao: 91,
    tempo: '10.78s',
    distancia: '100m',
    observacoes: 'Velocidade impressionante',
  },
  {
    id: '10',
    modalidade: 'Natação',
    categoria: '50m Livre',
    posicao: 1,
    atleta: 'Gabriel Torres',
    afiliacao: 'CBMDF',
    pontuacao: 93,
    tempo: '25.32s',
    distancia: '50m',
    observacoes: 'Estilo perfeito',
  },
];

const classificacaoUpdateSchema = z.object({
  modalidade: z.string().min(1, 'A modalidade é obrigatória.').optional(),
  categoria: z.string().min(1, 'A categoria é obrigatória.').optional(),
  posicao: z.number().min(1, 'A posição deve ser maior que 0.').optional(),
  atleta: z.string().optional(),
  afiliacao: z.string().min(1, 'A afiliação é obrigatória.').optional(),
  pontuacao: z
    .number()
    .min(0, 'A pontuação deve ser maior ou igual a 0.')
    .optional(),
  tempo: z.string().optional(),
  distancia: z.string().optional(),
  observacoes: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const classificacao = classificacoes.find((c) => c.id === id);

    if (!classificacao) {
      return NextResponse.json(
        { error: 'Classificação não encontrada.' },
        { status: 404 },
      );
    }

    return NextResponse.json(classificacao);
  } catch (error) {
    console.error('Erro ao buscar classificação:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar a classificação.' },
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
    const body = await request.json();

    const validatedData = classificacaoUpdateSchema.parse(body);

    const classificacaoIndex = classificacoes.findIndex((c) => c.id === id);

    if (classificacaoIndex === -1) {
      return NextResponse.json(
        { error: 'Classificação não encontrada.' },
        { status: 404 },
      );
    }

    // Atualizar a classificação
    classificacoes[classificacaoIndex] = {
      ...classificacoes[classificacaoIndex],
      ...validatedData,
    };

    return NextResponse.json(classificacoes[classificacaoIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Erro ao atualizar classificação:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao atualizar a classificação.' },
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

    const classificacaoIndex = classificacoes.findIndex((c) => c.id === id);

    if (classificacaoIndex === -1) {
      return NextResponse.json(
        { error: 'Classificação não encontrada.' },
        { status: 404 },
      );
    }

    // Remover a classificação
    classificacoes.splice(classificacaoIndex, 1);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar classificação:', error);
    return NextResponse.json(
      {
        error: 'Ocorreu um erro no servidor ao deletar a classificação.',
      },
      { status: 500 },
    );
  }
}
