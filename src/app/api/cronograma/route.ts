import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { EventoEnriquecido, DiaCronograma } from '@/types/cronograma';
import { sendMassEmail } from '@/lib/email-utils';

const eventoSchema = z.object({
  atividade: z.string().min(1, 'A atividade é obrigatória.'),
  inicio: z.string().min(1, 'A data de início é obrigatória.'),
  fim: z.string().min(1, 'A data de fim é obrigatória.'),
  detalhes: z.string().optional(),
  local: z.string().optional(),
  modalidadeId: z.string().optional().nullable(),
});

function getTipo(
  atividade: string,
): 'cerimonia' | 'jogo' | 'final' | 'congresso' {
  const lowerAtividade = atividade.toLowerCase();
  if (
    lowerAtividade.includes('cerimônia') ||
    lowerAtividade.includes('cerimonia')
  ) {
    return 'cerimonia';
  }
  if (lowerAtividade.includes('congresso')) {
    return 'congresso';
  }
  if (lowerAtividade.includes('final')) {
    return 'final';
  }
  return 'jogo';
}

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
    tipo: getTipo(evento.atividade),
    local: evento.detalhes || 'A definir',
    status: 'agendado' as const,
    participantes: 'Consulte detalhes',
    inicioFormatado,
    horarioFormatado,
    modalidadeRel: evento.modalidadeRel,
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
        modalidadeId: e.modalidadeId,
        local: e.local,
        modalidadeRel: e.modalidadeRel,
      }));
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
        local: validatedData.local || null,
        modalidadeId: validatedData.modalidadeId || null,
      },
      include: {
        modalidadeRel: true,
      },
    });

    let recipientEmails: string[] = [];
    const inicioFormatted = new Date(novoEvento.inicio).toLocaleString(
      'pt-BR',
      { dateStyle: 'full', timeStyle: 'short' },
    );
    const fimFormatted = new Date(novoEvento.fim).toLocaleString('pt-BR', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const subject = `Novo Evento no Cronograma Olinsesp: ${novoEvento.atividade}`;
    const emailHtml = `
      <h1>Novo Evento Adicionado ao Cronograma da VIII Olinsesp!</h1>
      <p>Um novo evento foi adicionado ao cronograma:</p>
      <ul>
        <li><strong>Atividade:</strong> ${novoEvento.atividade}</li>
        <li><strong>Início:</strong> ${inicioFormatted}</li>
        <li><strong>Fim:</strong> ${fimFormatted}</li>
        ${novoEvento.local ? `<li><strong>Local:</strong> ${novoEvento.local}</li>` : ''}
        ${novoEvento.detalhes ? `<li><strong>Detalhes:</strong> ${novoEvento.detalhes}</li>` : ''}
        ${novoEvento.modalidadeRel ? `<li><strong>Modalidade:</strong> ${novoEvento.modalidadeRel.nome}</li>` : ''}
      </ul>
      <p>Confira o cronograma completo no site para mais detalhes.</p>
      <p>Atenciosamente,</p>
      <p>A Equipe Olinsesp</p>
    `;

    if (novoEvento.modalidadeId) {
      const inscricoesModalidade = await prisma.inscricaoModalidade.findMany({
        where: {
          modalidadeId: novoEvento.modalidadeId,
        },
        include: {
          inscricao: {
            select: {
              email: true,
            },
          },
        },
      });
      recipientEmails = inscricoesModalidade
        .map((im) => im.inscricao.email)
        .filter((email): email is string => !!email);
    } else {
      const allInscricoes = await prisma.inscricao.findMany({
        select: {
          email: true,
        },
      });
      recipientEmails = allInscricoes
        .map((i) => i.email)
        .filter((email): email is string => !!email);
    }

    try {
      await sendMassEmail(recipientEmails, subject, emailHtml);
    } catch (emailError) {
      console.error('❌ Erro ao enviar e-mails de notificação:', emailError);
    }

    return NextResponse.json(
      {
        id: novoEvento.id,
        atividade: novoEvento.atividade,
        inicio: novoEvento.inicio.toISOString(),
        fim: novoEvento.fim.toISOString(),
        detalhes: novoEvento.detalhes,
        modalidade: novoEvento.modalidadeRel?.nome || null,
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
