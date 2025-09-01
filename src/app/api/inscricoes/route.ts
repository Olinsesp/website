import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { inscricoes } from './inscriçoesData';

const inscricaoSchema = z.object({
  nome: z
    .string()
    .min(10, { message: 'O nome deve ter pelo menos 10 caracteres.' }),
  email: z.email({ message: 'Email inválido.' }),
  cpf: z.string().max(11).min(11, { message: 'CPF deve ter 11 caracteres.' }),
  dataNascimento: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Por favor, insira uma data válida.',
  }),
  telefone: z.string().min(10, { message: 'Telefone inválido.' }),
  camiseta: z.string(),
  afiliacao: z.string(),
  matricula: z
    .string()
    .min(5, { message: 'Matrícula deve ter ao menos 5 caracteres.' }),
  modalidades: z
    .array(z.string())
    .min(1, { message: 'Selecione ao menos uma modalidade.' }),
});

export async function GET() {
  try {
    return NextResponse.json(inscricoes);
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar as inscrições.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = inscricaoSchema.parse(data);
    sendEmail(validatedData).catch((err) => {
      console.error('Erro ao enviar email (simulado):', err.message);
    });

    return NextResponse.json(validatedData, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados de entrada inválidos.', details: error.message },
        { status: 400 },
      );
    }

    console.error('Erro ao criar inscrição (simulado):', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao processar a inscrição.' },
      { status: 500 },
    );
  }
}

type Inscricao = {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: Date;
  telefone: string;
  camiseta: string;
  afiliacao: string;
  modalidades: string[];
};

async function sendEmail(inscricao: Inscricao) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Organização Olinsesp 2026" <${process.env.GMAIL_USER}>`,
    to: inscricao.email,
    subject: 'Confirmação de Inscrição - Olinsesp 2026',
    html: `
      <h2>Olá, ${inscricao.nome}!</h2>
      <p>Sua inscrição para o <strong>Olinsesp 2026</strong> foi realizada com sucesso 🎉</p>
      <p><strong>Modalidades selecionadas:</strong></p>
      <ul>
        ${inscricao.modalidades.map((m) => `<li>${m}</li>`).join('')}
      </ul>
      <p>Em breve entraremos em contato com mais informações.<br>
      Obrigado por participar!</p>
    `,
  });
}
