import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import { EquipeRole } from '@prisma/client';

async function main() {
  console.log('Start seeding...');

  // 1. LIMPAR DADOS EXISTENTES
  console.log('Limpando dados existentes...');
  await prisma.evento.deleteMany({});
  await prisma.inscricaoModalidade.deleteMany({});
  await prisma.inscricao.deleteMany({});
  await prisma.modalidade.deleteMany({});
  await prisma.equipe.deleteMany({});
  console.log('Dados limpos com sucesso.');

  // 0. CRIAR USUÁRIOS PADRÃO
  console.log('Criando usuários do sistema...');

  const orgaos = [
    'PMDF',
    'CBMDF',
    'PCDF',
    'PRF',
    'SSPDF',
    'DETRANDF',
    'PF',
    'PPDF',
    'PPF',
    'PLDF',
    'PLSF-PLCD',
    'SEJUS',
    'ADMIN',
  ];

  const usuariosData = await Promise.all(
    orgaos.map(async (o) => ({
      nome: `${o}`,
      username: o,
      password: await bcrypt.hash(o, 10),
      role: o === 'ADMIN' ? EquipeRole.ADMIN : EquipeRole.PONTOFOCAL,
    })),
  );

  await prisma.equipe.createMany({
    data: usuariosData,
  });

  console.log('Usuários criados com sucesso!');

  // 2. CRIAR MODALIDADES
  console.log('Criando modalidades...');

  const modalidadesData = [
    // XADREZ
    {
      nome: 'Xadrez',
      descricao: 'Competição individual de xadrez.',
      vagasPorEquipe: [
        {
          genero: 'Misto',
          tipo: 'equipe',
          totalAtletas: 4,
        },
      ],

      maxParticipantes: 100,
      regras: ['Sistema suíço', 'Partidas rápidas'],
      premios: ['Medalhas', 'Troféu'],
    },
    // FUTSAL
    {
      nome: 'Futebol de Salão',
      descricao: 'Disputado em equipes, formato tradicional de futsal.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          tipo: 'equipe',
          totalAtletas: 14,
        },
        {
          genero: 'Feminino',
          tipo: 'equipe',
          totalAtletas: 14,
        },
      ],

      maxParticipantes: 120,
      regras: ['Partidas de 40 minutos', '5 jogadores em quadra'],
      premios: ['Medalhas', 'Troféu'],
    },
    // FUTEBOL DE CAMPO
    {
      nome: 'Futebol de Campo',
      descricao: 'Competição de futebol em campo oficial.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          categoria: 'Livre',
          tipo: 'equipe',
          totalAtletas: 25,
        },
        {
          genero: 'Masculino',
          categoria: 'Master 35+',
          tipo: 'equipe',
          totalAtletas: 25,
        },
      ],

      maxParticipantes: 200,
      regras: ['Onze jogadores', 'Dois tempos de 45 min'],
      premios: ['Medalhas', 'Troféu'],
    },
    // JIU-JITSU
    {
      nome: 'Jiu-Jitsu',
      descricao: 'Competição individual de Jiu-Jitsu.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          tipo: 'individual',
          graduacoes: ['Branca', 'Azul/Roxa', 'Marrom/Preta'],
          faixasEtarias: ['18-29', '30-39', '40-49', '50+'],
          categoriasPeso: [
            'Até 66kg',
            'Até 73kg',
            'Até 81kg',
            'Até 90kg',
            'Até 100kg',
            '+100kg',
          ],
          totalAtletas: 144,
        },
        {
          genero: 'Feminino',
          tipo: 'individual',
          graduacoes: ['Branca', 'Azul/Roxa', 'Marrom/Preta'],
          faixasEtarias: ['18-29', '30-39', '40+'],
          categoriasPeso: [
            'Até 66kg',
            'Até 73kg',
            'Até 81kg',
            'Até 90kg',
            'Até 100kg',
            '+100kg',
          ],
          totalAtletas: 90,
        },
      ],
      maxParticipantes: 300,
      regras: ['Regulamento CBJJ'],
      premios: ['Medalhas'],
    },
    // JUDÔ
    {
      nome: 'Judô',
      descricao: 'Competição individual de Judô.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          tipo: 'individual',
          faixasEtarias: ['18-29', '30-39', '40-49', '50+'],
          categoriasPeso: [
            'Até 66kg',
            'Até 73kg',
            'Até 81kg',
            'Até 90kg',
            'Até 100kg',
            '+100kg',
          ],
          totalAtletas: 48,
        },
        {
          genero: 'Feminino',
          tipo: 'individual',
          faixasEtarias: ['18-29', '30-39', '40+'],
          categoriasPeso: [
            'Até 52kg',
            'Até 57kg',
            'Até 63kg',
            'Até 70kg',
            '+70kg',
          ],
          totalAtletas: 30,
        },
      ],
      maxParticipantes: 200,
      regras: ['Regras oficiais da FIJ'],
      premios: ['Medalhas'],
    },
    // NATAÇÃO
    {
      nome: 'Natação',
      descricao: 'Provas individuais e revezamentos.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          tipo: 'individual',
          faixasEtarias: ['18-29', '30-39', '40-49', '50-59'],
          provas: [
            '50m Livre',
            '50m Borboleta',
            '50m Peito',
            '50m Costas',
            '100m Livre',
            '400m Livre',
            '800m Livre',
          ],
          totalAtletas: 74,
        },
        {
          genero: 'Feminino',
          tipo: 'individual',
          faixasEtarias: ['18-29', '30-39', '40-49', '50-59'],
          provas: [
            '50m Livre',
            '50m Borboleta',
            '50m Peito',
            '50m Costas',
            '100m Livre',
            '400m Livre',
            '800m Livre',
          ],
          totalAtletas: 74,
        },
        {
          genero: 'Misto',
          tipo: 'revezamento',
          provas: ['4x50m Medley', '4x50m Livre'],
          faixasEtarias: ['18-29', '30-39', '40-49'],
          totalAtletas: 48,
        },
      ],

      maxParticipantes: 250,
      regras: ['Regras da FINA'],
      premios: ['Medalhas'],
    },
    // VÔLEI DE QUADRA
    {
      nome: 'Vôlei de Quadra',
      descricao: 'Disputado em equipes de 6 atletas.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          tipo: 'equipe',
          totalAtletas: 12,
        },
        {
          genero: 'Feminino',
          tipo: 'equipe',
          totalAtletas: 12,
        },
      ],

      maxParticipantes: 120,
      regras: ['Melhor de 5 sets'],
      premios: ['Medalhas', 'Troféu'],
    },
    // VÔLEI DE PRAIA
    {
      nome: 'Vôlei de Praia',
      descricao: 'Disputado em duplas.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          tipo: 'dupla',
          totalAtletas: 4,
        },
        {
          genero: 'Feminino',
          tipo: 'dupla',
          totalAtletas: 4,
        },
      ],

      maxParticipantes: 80,
      regras: ['Melhor de 3 sets'],
      premios: ['Medalhas', 'Troféu'],
    },
    // DOMINÓ
    {
      nome: 'Dominó',
      descricao: 'Competição em duplas.',
      vagasPorEquipe: [
        {
          genero: 'Misto',
          tipo: 'dupla',
          totalAtletas: 4,
        },
      ],

      maxParticipantes: 60,
      regras: ['Melhor de 3 partidas'],
      premios: ['Medalhas'],
    },
    // TÊNIS DE MESA
    {
      nome: 'Tênis de Mesa',
      descricao: 'Competição individual.',
      vagasPorEquipe: [
        { genero: 'Masculino', tipo: 'individual', totalAtletas: 2 },
        { genero: 'Feminino', tipo: 'individual', totalAtletas: 2 },
      ],

      maxParticipantes: 80,
      regras: ['Melhor de 5 sets'],
      premios: ['Medalhas'],
    },
    // TRIATHLON
    {
      nome: 'Triathlon',
      descricao: 'Prova combinada de corrida, ciclismo e natação.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          tipo: 'individual',
          faixasEtarias: ['18-29', '30-34', '35-39', '40-44', '45-49', '50+'],
          totalAtletas: 18,
        },
        {
          genero: 'Feminino',
          tipo: 'individual',
          faixasEtarias: ['18-29', '30-34', '35-39', '40-44', '45-49', '50+'],
          totalAtletas: 18,
        },
      ],

      maxParticipantes: 120,
      regras: ['Prova completa'],
      premios: ['Medalhas', 'Troféu'],
    },
    // CABO DE GUERRA
    {
      nome: 'Cabo de Guerra',
      descricao: 'Competição em equipes de força.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          tipo: 'equipe',
          totalAtletas: 10,
        },
        {
          genero: 'Feminino',
          tipo: 'equipe',
          totalAtletas: 10,
        },
      ],

      maxParticipantes: 80,
      regras: ['Equipes de 6 atletas'],
      premios: ['Medalhas'],
    },
    // ATLETISMO
    {
      nome: 'Atletismo',
      descricao: 'Provas de pista em diferentes distâncias.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          tipo: 'individual',
          faixasEtarias: ['18-29', '30-39', '40-49', '50-59'],
          provas: ['100m', '200m', '400m', '800m', '1500m', '5000m', '10km'],
          totalAtletas: 56,
        },
        {
          genero: 'Feminino',
          tipo: 'individual',
          faixasEtarias: ['18-29', '30-39', '40-49', '50-59'],
          provas: ['100m', '200m', '400m', '800m', '1500m', '5000m', '10km'],
          totalAtletas: 56,
        },
        {
          genero: 'Misto',
          tipo: 'revezamento',
          provas: ['4x100m'],
          faixasEtarias: ['18-29', '30-39', '40-49'],
          totalAtletas: 12,
        },
      ],

      maxParticipantes: 200,
      regras: ['Regras da World Athletics'],
      premios: ['Medalhas'],
    },
    // BASQUETEBOL
    {
      nome: 'Basquetebol',
      descricao: 'Disputado em equipes de 5 atletas.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          tipo: 'equipe',
          totalAtletas: 12,
        },
        {
          genero: 'Feminino',
          tipo: 'equipe',
          totalAtletas: 12,
        },
      ],

      maxParticipantes: 120,
      regras: ['Partidas de 4 tempos'],
      premios: ['Medalhas', 'Troféu'],
    },
    // BEACH TÊNIS
    {
      nome: 'Beach Tênis',
      descricao: 'Disputado em duplas na areia.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          tipo: 'dupla',
          totalAtletas: 4,
        },
        {
          genero: 'Feminino',
          tipo: 'dupla',
          totalAtletas: 4,
        },
        {
          genero: 'Misto',
          tipo: 'dupla',
          totalAtletas: 4,
        },
      ],

      maxParticipantes: 80,
      regras: ['Melhor de 3 sets'],
      premios: ['Medalhas'],
    },
    // FUTEVÔLEI
    {
      nome: 'Futevôlei',
      descricao: 'Competição em duplas na areia.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          tipo: 'dupla',
          totalAtletas: 4,
        },
        {
          genero: 'Feminino',
          tipo: 'dupla',
          totalAtletas: 4,
        },
      ],
      maxParticipantes: 60,
      regras: ['Melhor de 3 sets'],
      premios: ['Medalhas'],
    },
    // CALISTENIA
    {
      nome: 'Calistenia',
      descricao: 'Provas de força e resistência.',
      vagasPorEquipe: [
        { genero: 'Masculino', tipo: 'individual', totalAtletas: 5 },
        { genero: 'Feminino', tipo: 'individual', totalAtletas: 5 },
      ],
      maxParticipantes: 60,
      regras: ['Regras específicas por aparelho'],
      premios: ['Medalhas'],
    },
    // TRUCO
    {
      nome: 'Truco',
      descricao: 'Competição em duplas.',
      vagasPorEquipe: [
        {
          genero: 'Misto',
          tipo: 'equipe',
          totalAtletas: 4,
        },
      ],
      maxParticipantes: 40,
      regras: ['Melhor de 3 partidas'],
      premios: ['Medalhas'],
    },
    // CORRIDA DE ORIENTAÇÃO
    {
      nome: 'Corrida de Orientação',
      descricao: 'Prova de navegação em terreno aberto.',
      vagasPorEquipe: [
        {
          genero: 'Masculino',
          faixasEtarias: ['40', '40-59', '60+'],
          tipo: 'individual',
          totalAtletas: 30,
        },
        {
          genero: 'Feminino',
          faixasEtarias: ['40', '40-59', '60+'],
          tipo: 'individual',
          totalAtletas: 30,
        },
      ],
      maxParticipantes: 150,
      regras: ['Prova Sprint e Floresta'],
      premios: ['Medalhas'],
    },
  ];

  await prisma.modalidade.createMany({
    data: modalidadesData,
  });
  console.log('Modalidades criadas.');
}

main()
  .catch((e) => {
    console.error('Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
