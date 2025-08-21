import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Inscricao
  const inscritos = [
    {
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      cpf: '12345678901',
      dataNascimento: new Date('1990-05-15'),
      telefone: '61999999999',
      camiseta: 'M',
      afiliacao: 'Polícia Militar',
      modalidades: ['Futebol', 'Corrida'],
    },
    {
      nome: 'Maria Souza',
      email: 'maria.souza@email.com',
      cpf: '23456789012',
      dataNascimento: new Date('1992-08-20'),
      telefone: '61988888888',
      camiseta: 'G',
      afiliacao: 'Corpo de Bombeiros',
      modalidades: ['Natação', 'Judô'],
    },
  ];

  for (const p of inscritos) {
    await prisma.inscricao.create({ data: p });
  }

  // Seed Jogo
  const jogos = [
    {
      modalidade: 'Futebol',
      data: new Date('2025-09-10'),
      horario: '10:00',
      resultado: null,
    },
    {
      modalidade: 'Natação',
      data: new Date('2025-09-11'),
      horario: '14:00',
      resultado: null,
    },
  ];

  for (const j of jogos) {
    await prisma.jogo.create({ data: j });
  }

  // Seed Midia
  const midias = [
    {
      tipo: 'imagem',
      url: 'https://example.com/foto1.jpg',
      titulo: 'Abertura do Evento',
      destaque: true,
    },
    {
      tipo: 'video',
      url: 'https://example.com/video1.mp4',
      titulo: 'Entrevista',
      destaque: false,
    },
  ];

  for (const m of midias) {
    await prisma.midia.create({ data: m });
  }

  // Seed Cronograma
  const cronogramas = [
    {
      atividade: 'Inscrições',
      inicio: new Date('2025-08-01'),
      fim: new Date('2025-08-31'),
      detalhes: 'Inscrições online para todos os atletas',
    },
    {
      atividade: 'Cerimônia de Abertura',
      inicio: new Date('2025-09-05T09:00'),
      fim: new Date('2025-09-05T12:00'),
      detalhes: 'Abertura oficial do evento',
    },
  ];

  for (const c of cronogramas) {
    await prisma.cronograma.create({ data: c });
  }

  // Seed Servico
  const servicos = [
    {
      nome: 'Alimentação',
      descricao: 'Refeitório disponível para atletas e equipe',
      localizacao: 'Pavilhão Principal',
      horario: '08:00-20:00',
    },
    {
      nome: 'Transporte',
      descricao: 'Van de transporte entre locais do evento',
      localizacao: 'Estacionamento A',
      horario: '07:00-22:00',
    },
  ];

  for (const s of servicos) {
    await prisma.servico.create({ data: s });
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
