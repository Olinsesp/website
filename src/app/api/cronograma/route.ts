import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { EventoEnriquecido, DiaCronograma, Evento } from '@/types/cronograma';

const eventoSchema = z.object({
  atividade: z.string().min(1, 'A atividade é obrigatória.'),
  inicio: z.string().min(1, 'A data de início é obrigatória.'),
  fim: z.string().min(1, 'A data de fim é obrigatória.'),
  detalhes: z.string().optional(),
  modalidade: z.string().optional(),
  modalidadeId: z.string().optional(),
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
    id: evento.id,
    atividade: evento.atividade,
    inicio:
      evento.inicio instanceof Date
        ? evento.inicio.toISOString()
        : evento.inicio,
    fim: evento.fim instanceof Date ? evento.fim.toISOString() : evento.fim,
    detalhes: evento.detalhes,
    modalidade: evento.modalidade || evento.modalidadeRel?.nome || null,
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

    const eventos = await prisma.evento.findMany({
      include: {
        modalidadeRel: true,
      },
      orderBy: { inicio: 'asc' },
    });

    let eventosFormatados: any[] = eventos;

    if (incluirFormatacao) {
      eventosFormatados = eventos.map(enriquecerEvento) as any[];
    } else {
      eventosFormatados = eventos.map((e) => ({
        id: e.id,
        atividade: e.atividade,
        inicio: e.inicio.toISOString(),
        fim: e.fim.toISOString(),
        detalhes: e.detalhes,
        modalidade: e.modalidade || e.modalidadeRel?.nome || null,
      })) as Evento[];
    }

    const response: any = {};

    if (agruparPorDiaParam && incluirFormatacao) {
      response.dias = agruparPorDia(eventosFormatados as EventoEnriquecido[]);
    } else {
      response.dados = eventosFormatados;
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

    const novoEvento = await prisma.evento.create({
      data: {
        atividade: validatedData.atividade,
        inicio: new Date(validatedData.inicio),
        fim: new Date(validatedData.fim),
        detalhes: validatedData.detalhes || null,
        modalidade: validatedData.modalidade || null,
        modalidadeId: validatedData.modalidadeId || null,
      },
      include: {
        modalidadeRel: true,
      },
    });

    return NextResponse.json(
      {
        id: novoEvento.id,
        atividade: novoEvento.atividade,
        inicio: novoEvento.inicio.toISOString(),
        fim: novoEvento.fim.toISOString(),
        detalhes: novoEvento.detalhes,
        modalidade:
          novoEvento.modalidade || novoEvento.modalidadeRel?.nome || null,
      },
      { status: 201 },
    );
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
