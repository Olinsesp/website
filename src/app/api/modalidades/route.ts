import { NextResponse } from 'next/server';
import { z } from 'zod';
import { modalidades } from './modalidadesData';

const modalidadeSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório.'),
  descricao: z.string().min(1, 'A descrição é obrigatória.'),
  categoria: z.string().min(1, 'A categoria é obrigatória.'),
  maxParticipantes: z
    .number()
    .min(1, 'O número máximo de participantes deve ser maior que 0.'),
  participantesAtuais: z
    .number()
    .min(0, 'O número de participantes atuais deve ser maior ou igual a 0.'),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  local: z.string().optional(),
  horario: z.string().optional(),
  regras: z.array(z.string()).optional(),
  premios: z.array(z.string()).optional(),
  status: z
    .enum([
      'inscricoes-abertas',
      'inscricoes-encerradas',
      'em-andamento',
      'finalizada',
    ])
    .optional(),
});

function calcularEstatisticasModalidades(modalidadesData: any[]) {
  const totalVagas = modalidadesData.reduce(
    (acc, m) => acc + (m.maxParticipantes || 0),
    0,
  );

  const vagasDisponiveis = modalidadesData.reduce((total, m) => {
    const vagasDisponiveis =
      (m.maxParticipantes || 0) - (m.participantesAtuais || 0);
    return total + Math.max(0, vagasDisponiveis);
  }, 0);

  const totalPremios = modalidadesData.reduce(
    (acc, m) => acc + (m.premios?.length || 0),
    0,
  );

  return {
    totalModalidades: modalidadesData.length,
    totalVagas,
    vagasDisponiveis,
    totalPremios,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const incluirEstatisticas = searchParams.get('estatisticas') !== 'false'; // default true

    const response: any = {
      dados: modalidades,
    };

    // Adicionar estatísticas se solicitado
    if (incluirEstatisticas) {
      response.estatisticas = calcularEstatisticasModalidades(modalidades);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao buscar modalidades:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar as modalidades.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = modalidadeSchema.parse(body);

    const novaModalidade = {
      id: (modalidades.length + 1).toString(),
      dataInicio: '',
      dataFim: '',
      local: '',
      horario: '',
      regras: [],
      premios: [],
      status: 'inscricoes-abertas' as const,
      camposExtras: [],
      ...validatedData,
    };

    modalidades.push(novaModalidade);

    return NextResponse.json(novaModalidade, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Erro ao criar modalidade:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao criar a modalidade.' },
      { status: 500 },
    );
  }
}
