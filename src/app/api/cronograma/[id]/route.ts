import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendMassEmail } from '@/lib/email-utils';

const cronogramaUpdateSchema = z.object({
  atividade: z.string().min(1, 'A atividade é obrigatória.').optional(),
  inicio: z.string().optional(),
  fim: z.string().optional(),
  detalhes: z.string().optional().nullable(),
  local: z.string().optional(),
  modalidadeId: z.string().optional().nullable(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const evento = await prisma.evento.findUnique({
      where: { id },
      include: {
        modalidadeRel: true,
      },
    });

    if (!evento) {
      return NextResponse.json(
        { error: 'Atividade do cronograma não encontrada.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: evento.id,
      atividade: evento.atividade,
      inicio: evento.inicio.toISOString(),
      fim: evento.fim.toISOString(),
      detalhes: evento.detalhes,
      modalidadeId: evento.modalidadeId,
      modalidade: evento.modalidadeRel?.nome || null,
    });
  } catch (error) {
    console.error('Erro ao buscar atividade do cronograma:', error);
    return NextResponse.json(
      {
        error:
          'Ocorreu um erro no servidor ao buscar a atividade do cronograma.',
      },
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
    const validatedData = cronogramaUpdateSchema.parse(data);

    const originalEvento = await prisma.evento.findUnique({
      where: { id },
      include: { modalidadeRel: true },
    });

    if (!originalEvento) {
      return NextResponse.json(
        { error: 'Atividade do cronograma não encontrada para atualização.' },
        { status: 404 },
      );
    }

    const updateData: any = {};
    if (validatedData.atividade) updateData.atividade = validatedData.atividade;
    if (validatedData.inicio)
      updateData.inicio = new Date(validatedData.inicio);
    if (validatedData.fim) updateData.fim = new Date(validatedData.fim);
    if (validatedData.detalhes !== undefined)
      updateData.detalhes = validatedData.detalhes;
    if (validatedData.local) updateData.local = validatedData.local;

    if (validatedData.modalidadeId !== undefined) {
      updateData.modalidadeId = validatedData.modalidadeId;
    }

    const eventoAtualizado = await prisma.evento.update({
      where: { id },
      data: updateData,
      include: {
        modalidadeRel: true,
      },
    });

    const scheduleChanged =
      (validatedData.inicio &&
        new Date(validatedData.inicio).toISOString() !==
          originalEvento.inicio.toISOString()) ||
      (validatedData.fim &&
        new Date(validatedData.fim).toISOString() !==
          originalEvento.fim.toISOString());

    if (scheduleChanged) {
      let recipientEmails: string[] = [];
      const originalInicioFormatted = originalEvento.inicio.toLocaleString(
        'pt-BR',
        { dateStyle: 'full', timeStyle: 'short' },
      );
      const originalFimFormatted = originalEvento.fim.toLocaleString('pt-BR', {
        dateStyle: 'full',
        timeStyle: 'short',
      });
      const newInicioFormatted = eventoAtualizado.inicio.toLocaleString(
        'pt-BR',
        { dateStyle: 'full', timeStyle: 'short' },
      );
      const newFimFormatted = eventoAtualizado.fim.toLocaleString('pt-BR', {
        dateStyle: 'full',
        timeStyle: 'short',
      });

      const subject = `Atualização de Horário do Evento: ${eventoAtualizado.atividade}`;
      const emailHtml = `
        <h1>Atualização no Cronograma da VIII Olinsesp!</h1>
        <p>O evento "${eventoAtualizado.atividade}" teve seu horário atualizado:</p>
        <p><strong>Detalhes do Evento:</strong></p>
        <ul>
          <li><strong>Atividade:</strong> ${eventoAtualizado.atividade}</li>
          <li><strong>Local:</strong> ${eventoAtualizado.local || 'Não informado'}</li>
          ${eventoAtualizado.detalhes ? `<li><strong>Detalhes Adicionais:</strong> ${eventoAtualizado.detalhes}</li>` : ''}
          ${eventoAtualizado.modalidadeRel ? `<li><strong>Modalidade:</strong> ${eventoAtualizado.modalidadeRel.nome}</li>` : ''}
        </ul>
        <p><strong>Horário Original:</strong></p>
        <ul>
          <li><strong>Início:</strong> ${originalInicioFormatted}</li>
          <li><strong>Fim:</strong> ${originalFimFormatted}</li>
        </ul>
        <p><strong>Novo Horário:</strong></p>
        <ul>
          <li><strong>Início:</strong> ${newInicioFormatted}</li>
          <li><strong>Fim:</strong> ${newFimFormatted}</li>
        </ul>
        <p>Por favor, verifique o cronograma completo no site para mais informações.</p>
        <p>Atenciosamente,</p>
        <p>A Equipe Olinsesp</p>
      `;

      if (eventoAtualizado.modalidadeId) {
        const inscricoesModalidade = await prisma.inscricaoModalidade.findMany({
          where: {
            modalidadeId: eventoAtualizado.modalidadeId,
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
        console.error(
          '❌ Erro ao enviar e-mails de notificação de atualização:',
          emailError,
        );
      }
    }

    return NextResponse.json({
      id: eventoAtualizado.id,
      atividade: eventoAtualizado.atividade,
      inicio: eventoAtualizado.inicio.toISOString(),
      fim: eventoAtualizado.fim.toISOString(),
      detalhes: eventoAtualizado.detalhes,
      modalidadeId: eventoAtualizado.modalidadeId,
      modalidade: eventoAtualizado.modalidadeRel?.nome || null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos.',
          details: error.issues,
        },
        { status: 400 },
      );
    }
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Atividade do cronograma não encontrada.' },
        { status: 404 },
      );
    }
    console.error('Erro ao atualizar atividade do cronograma:', error);
    return NextResponse.json(
      {
        error:
          'Ocorreu um erro no servidor ao atualizar a atividade do cronograma.',
      },
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

    await prisma.evento.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Atividade do cronograma não encontrada.' },
        { status: 404 },
      );
    }
    console.error('Erro ao deletar atividade do cronograma:', error);
    return NextResponse.json(
      {
        error:
          'Ocorreu um erro no servidor ao deletar a atividade do cronograma.',
      },
      { status: 500 },
    );
  }
}
