import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

async function main() {
  console.log('Start seeding...');

  // 1. LIMPAR DADOS EXISTENTES
  console.log('Limpando dados existentes...');
  await prisma.inscricaoModalidade.deleteMany({});
  await prisma.inscricao.deleteMany({});
  await prisma.modalidade.deleteMany({});
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
    'PLF',
    'SEJUS',
  ];

  const usuariosData = await Promise.all(
    orgaos.map(async (o) => ({
      nome: `Ponto Focal ${o}`,
      username: o,
      password: await bcrypt.hash(o, 10),
      orgaoDeOrigem: o,
      role: o === 'SSPDF' ? UserRole.ADMIN : UserRole.PONTOFOCAL,
    })),
  );

  await prisma.user.createMany({
    data: usuariosData,
  });

  console.log('Usuários criados com sucesso!');

  // 2. CRIAR MODALIDADES
  console.log('Criando modalidades...');
  await prisma.modalidade.createMany({
    data: [
      // -----------------------------------------------------------
      // XADREZ (Categoria Mista)
      // -----------------------------------------------------------
      {
        nome: 'Xadrez',
        descricao: 'Competição individual de xadrez.',
        categoria: ['Individual'],
        maxParticipantes: 100,
        dataInicio: '2025-07-10',
        dataFim: '2025-07-12',
        local: 'Sala de Jogos',
        horario: '09:00',
        regras: ['Sistema suíço', 'Partidas rápidas'],
        premios: ['Medalhas', 'Troféu'],
        modalidadesSexo: ['Misto'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // FUTSAL (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Futebol de Salão',
        descricao: 'Disputado em equipes, formato tradicional de futsal.',
        categoria: ['Coletivo'],
        maxParticipantes: 120,
        dataInicio: '2025-07-15',
        dataFim: '2025-07-20',
        local: 'Ginásio Principal',
        horario: '18:00',
        regras: ['Partidas de 40 minutos', '5 jogadores em quadra'],
        premios: ['Medalhas', 'Troféu'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // FUTEBOL DE CAMPO (Somente Masculino)
      // -----------------------------------------------------------
      {
        nome: 'Futebol de Campo',
        descricao: 'Competição de futebol em campo oficial.',
        categoria: ['Coletivo'],
        maxParticipantes: 200,
        dataInicio: '2025-07-22',
        dataFim: '2025-07-29',
        local: 'Campo Oficial',
        horario: '16:00',
        regras: ['Onze jogadores', 'Dois tempos de 45 min'],
        premios: ['Medalhas', 'Troféu'],
        modalidadesSexo: ['Masculino'],
        faixaEtaria: ['40+', 'Adulto'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // JIU-JITSU (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Jiu-Jitsu',
        descricao: 'Competição individual de Jiu-Jitsu.',
        categoria: ['Individual'],
        maxParticipantes: 300,
        dataInicio: '2025-08-01',
        dataFim: '2025-08-03',
        local: 'Ginásio Auxiliar',
        horario: '08:00',
        regras: ['Regulamento CBJJ'],
        premios: ['Medalhas'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        faixaEtaria: [
          '18-29',
          '30-39',
          '40-49',
          '50+',
          '18-29 Fem',
          '30-39 Fem',
          '40+ Fem',
        ],
        divisoes: [
          'Faixa Branca – Masculino – Até 66 kg',
          'Faixa Branca – Masculino – Até 73 kg',
          'Faixa Branca – Masculino – Até 81 kg',
          'Faixa Branca – Masculino – Até 90 kg',
          'Faixa Branca – Masculino – Até 100 kg',
          'Faixa Branca – Masculino – +100 kg',
          'Faixa Branca – Feminino – Até 57 kg',
          'Faixa Branca – Feminino – Até 63 kg',
          'Faixa Branca – Feminino – Até 70 kg',
          'Faixa Branca – Feminino – +70 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 66 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 73 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 81 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 90 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 100 kg',
          'Faixa Azul e Faixa Roxa – Masculino – +100 kg',
          'Faixa Azul e Faixa Roxa – Feminino – Até 57 kg',
          'Faixa Azul e Faixa Roxa – Feminino – Até 63 kg',
          'Faixa Azul e Faixa Roxa – Feminino – Até 70 kg',
          'Faixa Azul e Faixa Roxa – Feminino – +70 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 66 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 73 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 81 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 90 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 100 kg',
          'Faixa Marrom e Faixa Preta – Masculino – +100 kg',
          'Faixa Marrom e Faixa Preta – Feminino – Até 57 kg',
          'Faixa Marrom e Faixa Preta – Feminino – Até 63 kg',
          'Faixa Marrom e Faixa Preta – Feminino – Até 70 kg',
          'Faixa Marrom e Faixa Preta – Feminino – +70 kg',
        ],
      },

      // -----------------------------------------------------------
      // JUDÔ (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Judô',
        descricao: 'Competição individual de Judô.',
        categoria: ['Individual'],
        maxParticipantes: 200,
        dataInicio: '2025-08-05',
        dataFim: '2025-08-06',
        local: 'Ginásio Auxiliar',
        horario: '08:00',
        regras: ['Regras oficiais da FIJ'],
        premios: ['Medalhas'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        faixaEtaria: [
          '18-29',
          '30-39',
          '40-49',
          '50+',
          '18-29 Fem',
          '30-39 Fem',
          '40+ Fem',
        ],
        divisoes: [
          'Faixa Branca – Masculino – Até 66 kg',
          'Faixa Branca – Masculino – Até 73 kg',
          'Faixa Branca – Masculino – Até 81 kg',
          'Faixa Branca – Masculino – Até 90 kg',
          'Faixa Branca – Masculino – Até 100 kg',
          'Faixa Branca – Masculino – +100 kg',
          'Faixa Branca – Feminino – Até 57 kg',
          'Faixa Branca – Feminino – Até 63 kg',
          'Faixa Branca – Feminino – Até 70 kg',
          'Faixa Branca – Feminino – +70 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 66 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 73 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 81 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 90 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 100 kg',
          'Faixa Azul e Faixa Roxa – Masculino – +100 kg',
          'Faixa Azul e Faixa Roxa – Feminino – Até 57 kg',
          'Faixa Azul e Faixa Roxa – Feminino – Até 63 kg',
          'Faixa Azul e Faixa Roxa – Feminino – Até 70 kg',
          'Faixa Azul e Faixa Roxa – Feminino – +70 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 66 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 73 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 81 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 90 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 100 kg',
          'Faixa Marrom e Faixa Preta – Masculino – +100 kg',
          'Faixa Marrom e Faixa Preta – Feminino – Até 57 kg',
          'Faixa Marrom e Faixa Preta – Feminino – Até 63 kg',
          'Faixa Marrom e Faixa Preta – Feminino – Até 70 kg',
          'Faixa Marrom e Faixa Preta – Feminino – +70 kg',
        ],
      },

      // -----------------------------------------------------------
      // NATAÇÃO (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Natação',
        descricao: 'Provas individuais e revezamentos.',
        categoria: ['Individual', 'Revezamento'],
        maxParticipantes: 250,
        dataInicio: '2025-08-10',
        dataFim: '2025-08-12',
        local: 'Piscina Olímpica',
        horario: '09:00',
        regras: ['Regras da FINA'],
        premios: ['Medalhas'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        faixaEtaria: ['Masculino 45+', 'Feminino 40+', 'Adulto'],
        divisoes: [
          '50m Livre',
          '50m Borboleta',
          '50m Peito',
          '50m Costas',
          '400m Livre',
          '4x50m Medley',
          '4x50m Livre',
        ],
      },

      // -----------------------------------------------------------
      // VÔLEI DE QUADRA (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Vôlei de Quadra',
        descricao: 'Disputado em equipes de 6 atletas.',
        categoria: ['Coletivo'],
        maxParticipantes: 120,
        dataInicio: '2025-07-15',
        dataFim: '2025-07-18',
        local: 'Ginásio Principal',
        horario: '19:00',
        regras: ['Melhor de 5 sets'],
        premios: ['Medalhas', 'Troféu'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // VÔLEI DE PRAIA (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Vôlei de Praia',
        descricao: 'Disputado em duplas.',
        categoria: ['Duplas'],
        maxParticipantes: 80,
        dataInicio: '2025-07-20',
        dataFim: '2025-07-22',
        local: 'Arena de Areia',
        horario: '15:00',
        regras: ['Melhor de 3 sets'],
        premios: ['Medalhas', 'Troféu'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // DOMINÓ (Misto)
      // -----------------------------------------------------------
      {
        nome: 'Dominó',
        descricao: 'Competição em duplas.',
        categoria: ['Duplas'],
        maxParticipantes: 60,
        dataInicio: '2025-07-10',
        dataFim: '2025-07-11',
        local: 'Área Social',
        horario: '13:00',
        regras: ['Melhor de 3 partidas'],
        premios: ['Medalhas'],
        modalidadesSexo: ['Misto'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // TÊNIS DE MESA (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Tênis de Mesa',
        descricao: 'Competição individual.',
        categoria: ['Individual'],
        maxParticipantes: 80,
        dataInicio: '2025-07-13',
        dataFim: '2025-07-13',
        local: 'Ginásio Auxiliar',
        horario: '10:00',
        regras: ['Melhor de 5 sets'],
        premios: ['Medalhas'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // TRIATHLON (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Triathlon',
        descricao: 'Prova combinada de corrida, ciclismo e natação.',
        categoria: ['Individual'],
        maxParticipantes: 120,
        dataInicio: '2025-09-01',
        dataFim: '2025-09-01',
        local: 'Circuito Externo',
        horario: '07:00',
        regras: ['Prova completa'],
        premios: ['Medalhas', 'Troféu'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        faixaEtaria: ['Adulto', 'Master Masculino 45+', 'Master Feminino 40+'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // CABO DE GUERRA (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Cabo de Guerra',
        descricao: 'Competição em equipes de força.',
        categoria: ['Coletivo'],
        maxParticipantes: 80,
        dataInicio: '2025-07-28',
        dataFim: '2025-07-28',
        local: 'Campo Externo',
        horario: '14:00',
        regras: ['Equipes de 6 atletas'],
        premios: ['Medalhas'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // ATLETISMO (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Atletismo',
        descricao: 'Provas de pista em diferentes distâncias.',
        categoria: ['Individual'],
        maxParticipantes: 200,
        dataInicio: '2025-08-15',
        dataFim: '2025-08-16',
        local: 'Pista Oficial',
        horario: '08:00',
        regras: ['Regras da World Athletics'],
        premios: ['Medalhas'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        faixaEtaria: ['Masculino 45+', 'Feminino 40+', 'Adulto'],
        divisoes: ['100m', '200m', '400m', '800m', '1500m', '5000m', '10 km'],
      },

      // -----------------------------------------------------------
      // BASQUETEBOL (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Basquetebol',
        descricao: 'Disputado em equipes de 5 atletas.',
        categoria: ['Coletivo'],
        maxParticipantes: 120,
        dataInicio: '2025-07-18',
        dataFim: '2025-07-21',
        local: 'Ginásio Principal',
        horario: '20:00',
        regras: ['Partidas de 4 tempos'],
        premios: ['Medalhas', 'Troféu'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // BEACH TÊNIS (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Beach Tênis',
        descricao: 'Disputado em duplas na areia.',
        categoria: ['Duplas'],
        maxParticipantes: 80,
        dataInicio: '2025-07-24',
        dataFim: '2025-07-25',
        local: 'Arena de Areia',
        horario: '16:00',
        regras: ['Melhor de 3 sets'],
        premios: ['Medalhas'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // FUTEVÔLEI (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Futevôlei',
        descricao: 'Competição em duplas na areia.',
        categoria: ['Duplas'],
        maxParticipantes: 60,
        dataInicio: '2025-07-26',
        dataFim: '2025-07-27',
        local: 'Arena de Areia',
        horario: '17:00',
        regras: ['Melhor de 3 sets'],
        premios: ['Medalhas'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // CALISTENIA (Masc + Fem)
      // -----------------------------------------------------------
      {
        nome: 'Calistenia',
        descricao: 'Provas de força e resistência.',
        categoria: ['Individual'],
        maxParticipantes: 60,
        dataInicio: '2025-08-20',
        dataFim: '2025-08-20',
        local: 'Área Externa',
        horario: '10:00',
        regras: ['Regras específicas por aparelho'],
        premios: ['Medalhas'],
        modalidadesSexo: ['Masculino', 'Feminino'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // TRUCO (Misto)
      // -----------------------------------------------------------
      {
        nome: 'Truco',
        descricao: 'Competição em duplas.',
        categoria: ['Duplas'],
        maxParticipantes: 40,
        dataInicio: '2025-07-14',
        dataFim: '2025-07-14',
        local: 'Área Social',
        horario: '14:00',
        regras: ['Melhor de 3 partidas'],
        premios: ['Medalhas'],
        modalidadesSexo: ['Misto'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // CORRIDA DE ORIENTAÇÃO (Mista)
      // -----------------------------------------------------------
      {
        nome: 'Corrida de Orientação',
        descricao: 'Prova de navegação em terreno aberto.',
        categoria: ['Individual'],
        maxParticipantes: 150,
        dataInicio: '2025-09-05',
        dataFim: '2025-09-05',
        local: 'Area Ambiental',
        horario: '07:00',
        regras: ['Prova Sprint e Floresta'],
        premios: ['Medalhas'],
        modalidadesSexo: ['Misto'],
        faixaEtaria: [
          'Mulheres até 40',
          'Homens até 40',
          'Mulheres 40-59',
          'Homens 40-59',
          'Mulheres 60+',
          'Homens 60+',
        ],
        divisoes: ['Sprint', 'Floresta'],
      },
    ],
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
