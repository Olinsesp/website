import { NextResponse } from 'next/server';
import { z } from 'zod';

export const modalidades = [
  {
    id: '1',
    nome: 'Futebol de Campo',
    descricao:
      'Disputas emocionantes no gramado. Equipes de 11 jogadores em busca da glória.',
    categoria: 'Coletiva',
    maxParticipantes: 16,
    participantesAtuais: 12,
    dataInicio: '2025-10-20',
    dataFim: '2025-10-26',
    local: 'Centro de Treinamento da PMDF',
    horario: '08:00 - 12:00',
    regras: [
      'Times de 11 jogadores',
      'Dois tempos de 45 minutos',
      'Eliminatória simples',
    ],
    premios: ['Troféu para o campeão', 'Medalhas para os 3 primeiros'],
    status: 'inscricoes-abertas',
  },
  {
    id: '2',
    nome: 'Voleibol',
    descricao:
      'Saques, bloqueios e cortadas. Partidas de vôlei de quadra masculino e feminino.',
    categoria: 'Coletiva',
    maxParticipantes: 24,
    participantesAtuais: 24,
    dataInicio: '2025-10-21',
    dataFim: '2025-10-25',
    local: 'Ginásio do CBMDF',
    horario: '14:00 - 18:00',
    regras: [
      'Equipes de 6 jogadores',
      'Melhor de 3 sets',
      'Fase de grupos e eliminatórias',
    ],
    premios: ['Troféu para equipe campeã', 'Medalhas para os finalistas'],
    status: 'inscricoes-fechadas',
  },
  {
    id: '3',
    nome: 'Basquete',
    descricao:
      'Dribles, arremessos e cestas de três pontos. A elite do basquete em quadra.',
    categoria: 'Coletiva',
    maxParticipantes: 12,
    participantesAtuais: 8,
    dataInicio: '2025-10-22',
    dataFim: '2025-10-26',
    local: 'Ginásio da PCDF',
    horario: '09:00 - 13:00',
    regras: [
      'Equipes de 5 jogadores',
      '4 quartos de 10 minutos',
      'Torneio de dupla eliminação',
    ],
    premios: ['Troféu e medalhas para os campeões'],
    status: 'inscricoes-abertas',
  },
  {
    id: '4',
    nome: 'Natação',
    descricao:
      'Velocidade e resistência na piscina. Provas de 50m, 100m e revezamento.',
    categoria: 'Individual',
    maxParticipantes: 100,
    participantesAtuais: 78,
    dataInicio: '2025-11-01',
    dataFim: '2025-11-02',
    local: 'Piscina Olímpica do CBMDF',
    horario: '10:00 - 16:00',
    regras: [
      'Provas de 50m livre, 100m costas, etc.',
      'Classificatórias e finais',
      'Regras da FINA',
    ],
    premios: ['Medalhas de ouro, prata e bronze por prova'],
    status: 'em-andamento',
  },
  {
    id: '5',
    nome: 'Jiu-Jitsu',
    descricao:
      'A arte suave em ação. Competições por peso e absoluto com os melhores lutadores.',
    categoria: 'Individual',
    maxParticipantes: 150,
    participantesAtuais: 150,
    dataInicio: '2025-11-05',
    dataFim: '2025-11-06',
    local: 'Academia da PCDF',
    horario: '09:00 - 19:00',
    regras: [
      'Lutas por categoria de peso e faixa',
      'Regras da IBJJF',
      'Kimono obrigatório',
    ],
    premios: ['Medalhas por categoria', 'Troféu para o absoluto'],
    status: 'inscricoes-fechadas',
  },
  {
    id: '6',
    nome: 'Corrida de Rua',
    descricao:
      'Teste seus limites no asfalto. Percursos de 5km e 10km pela cidade.',
    categoria: 'Resistência',
    maxParticipantes: 500,
    participantesAtuais: 450,
    dataInicio: '2025-11-09',
    dataFim: '2025-11-09',
    local: 'Eixo Monumental, Brasília',
    horario: '07:00 - 10:00',
    regras: [
      'Percursos de 5km e 10km',
      'Chip de cronometragem obrigatório',
      'Hidratação a cada 2.5km',
    ],
    premios: [
      'Medalha de participação para todos',
      'Troféus para os 3 primeiros (masc/fem) de cada percurso',
    ],
    status: 'finalizada',
  },
  {
    id: '7',
    nome: 'Tênis de Mesa',
    descricao:
      'Agilidade e precisão em alta velocidade. Partidas individuais e em duplas.',
    categoria: 'Individual',
    maxParticipantes: 64,
    participantesAtuais: 50,
    dataInicio: '2025-11-12',
    dataFim: '2025-11-13',
    local: 'Salão de Jogos da PMDF',
    horario: '13:00 - 19:00',
    regras: [
      'Partidas de melhor de 5 sets',
      'Categorias individual e duplas',
      'Eliminatória simples',
    ],
    premios: ['Medalhas para os 3 primeiros de cada categoria'],
    status: 'inscricoes-abertas',
  },
  {
    id: '8',
    nome: 'Xadrez',
    descricao:
      'Estratégia e concentração no tabuleiro. Um desafio para a mente.',
    categoria: 'Individual',
    maxParticipantes: 50,
    participantesAtuais: 32,
    dataInicio: '2025-11-15',
    dataFim: '2025-11-16',
    local: 'Auditório do CBMDF',
    horario: '14:00 - 20:00',
    regras: [
      'Sistema suíço de emparceiramento',
      '5 rodadas',
      'Relógios de xadrez serão utilizados',
    ],
    premios: ['Troféu para o campeão', 'Medalhas para os 3 primeiros'],
    status: 'em-andamento',
  },
];

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
      'inscricoes-fechadas',
      'em-andamento',
      'finalizada',
    ])
    .optional(),
});

export async function GET() {
  try {
    return NextResponse.json(modalidades);
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
