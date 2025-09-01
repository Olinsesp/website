import { NextResponse } from 'next/server';

const modalidades = [
  {
    id: '1',
    nome: 'Futebol de Campo',
    descricao:
      'Disputas emocionantes no gramado. Equipes de 11 jogadores em busca da glória.',
    editalUrl: '/docs/edital_futebol.pdf',
    icon: 'Futbol',
  },
  {
    id: '2',
    nome: 'Voleibol',
    descricao:
      'Saques, bloqueios e cortadas. Partidas de vôlei de quadra masculino e feminino.',
    editalUrl: '/docs/edital_volei.pdf',
    icon: 'Volleyball',
  },
  {
    id: '3',
    nome: 'Basquete',
    descricao:
      'Dribles, arremessos e cestas de três pontos. A elite do basquete em quadra.',
    editalUrl: '/docs/edital_basquete.pdf',
    icon: 'Trophy',
  },
  {
    id: '4',
    nome: 'Natação',
    descricao:
      'Velocidade e resistência na piscina. Provas de 50m, 100m e revezamento.',
    editalUrl: '/docs/edital_natacao.pdf',
    icon: 'Waves',
  },
  {
    id: '5',
    nome: 'Jiu-Jitsu',
    descricao:
      'A arte suave em ação. Competições por peso e absoluto com os melhores lutadores.',
    editalUrl: '/docs/edital_jiu-jitsu.pdf',
    icon: 'Swords',
  },
  {
    id: '6',
    nome: 'Corrida de Rua',
    descricao:
      'Teste seus limites no asfalto. Percursos de 5km e 10km pela cidade.',
    editalUrl: '/docs/edital_corrida.pdf',
    icon: 'Run',
  },
  {
    id: '7',
    nome: 'Tênis de Mesa',
    descricao:
      'Agilidade e precisão em alta velocidade. Partidas individuais e em duplas.',
    editalUrl: '/docs/edital_tenis_mesa.pdf',
    icon: 'Trophy',
  },
  {
    id: '8',
    nome: 'Xadrez',
    descricao:
      'Estratégia e concentração no tabuleiro. Um desafio para a mente.',
    editalUrl: '/docs/edital_xadrez.pdf',
    icon: 'BrainCircuit',
  },
];

export async function GET() {
  try {
    // In a real app, you would fetch this from a database
    // const modalidades = await prisma.modalidade.findMany();
    return NextResponse.json(modalidades);
  } catch (error) {
    console.error('Erro ao buscar modalidades:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar as modalidades.' },
      { status: 500 },
    );
  }
}
