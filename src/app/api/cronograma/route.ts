import { NextResponse } from 'next/server';
import { z } from 'zod';
import { staticCronograma } from './cronogramaData';
import { EventoEnriquecido, DiaCronograma } from '@/types/cronograma';

const eventoSchema = z.object({
  atividade: z.string().min(1, 'A atividade é obrigatória.'),
  inicio: z.string().min(1, 'A data de início é obrigatória.'),
  fim: z.string().min(1, 'A data de fim é obrigatória.'),
  detalhes: z.string().min(1, 'Os detalhes são obrigatórios.'),
  modalidade: z.string().min(1, 'A modalidade é obrigatória.'),
});

function enriquecerEvento(evento: any): EventoEnriquecido {
  const inicioDate = new Date(evento.inicio);
  const inicioFormatado = inicioDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const horarioFormatado = inicioDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    ...evento,
    horario: horarioFormatado,
    tipo: evento.atividade.includes('Cerimônia') ? 'cerimonia' : 'jogo',
    local: evento.detalhes || 'A definir',
    status: 'agendado' as const,
    participantes: 'Consulte detalhes',
    inicioFormatado,
    horarioFormatado,
  };
}

function agruparPorDia(eventos: EventoEnriquecido[]): DiaCronograma[] {
  const groupedByDay = eventos.reduce(
    (acc, evento) => {
      const data =
        evento.inicioFormatado ||
        new Date(evento.inicio).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

      if (!acc[data]) {
        acc[data] = {
          id: `dia-${Object.keys(acc).length + 1}`,
          data,
          titulo: `Dia ${Object.keys(acc).length + 1}`,
          descricao: `Eventos do dia ${data}`,
          eventos: [],
        };
      }
      acc[data].eventos.push(evento);
      return acc;
    },
    {} as Record<string, DiaCronograma>,
  );

  return Object.values(groupedByDay);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agruparPorDiaParam = searchParams.get('agruparPorDia') !== 'false';
    const incluirFormatacao = searchParams.get('formatar') !== 'false';

    let eventos = staticCronograma.sort(
      (a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime(),
    );

    if (incluirFormatacao) {
      eventos = eventos.map(enriquecerEvento) as any[];
    }

    const response: any = {};

    if (agruparPorDiaParam) {
      response.dias = agruparPorDia(eventos as EventoEnriquecido[]);
    } else {
      response.dados = eventos;
    }

    return NextResponse.json(response);
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
