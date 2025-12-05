import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.modalidade.createMany({
    data: [
      // -----------------------------------------------------------
      // XADREZ
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
        modalidadesSexo: ['Masculino', 'Feminino'],
        faixaEtaria: [],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // FUTSAL
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
        faixaEtaria: [],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // FUTEBOL DE CAMPO
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
        modalidadesSexo: ['Masculino', 'Master 40+'],
        faixaEtaria: ['40+'],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // JIU-JITSU
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
          // Faixa Branca – Masculino
          'Faixa Branca – Masculino – Até 66 kg',
          'Faixa Branca – Masculino – Até 73 kg',
          'Faixa Branca – Masculino – Até 81 kg',
          'Faixa Branca – Masculino – Até 90 kg',
          'Faixa Branca – Masculino – Até 100 kg',
          'Faixa Branca – Masculino – +100 kg',

          // Faixa Branca – Feminino
          'Faixa Branca – Feminino – Até 57 kg',
          'Faixa Branca – Feminino – Até 63 kg',
          'Faixa Branca – Feminino – Até 70 kg',
          'Faixa Branca – Feminino – +70 kg',

          // Faixa Azul e Faixa Roxa – Masculino
          'Faixa Azul e Faixa Roxa – Masculino – Até 66 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 73 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 81 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 90 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 100 kg',
          'Faixa Azul e Faixa Roxa – Masculino – +100 kg',

          // Faixa Azul e Faixa Roxa – Feminino
          'Faixa Azul e Faixa Roxa – Feminino – Até 57 kg',
          'Faixa Azul e Faixa Roxa – Feminino – Até 63 kg',
          'Faixa Azul e Faixa Roxa – Feminino – Até 70 kg',
          'Faixa Azul e Faixa Roxa – Feminino – +70 kg',

          // Faixa Marrom e Faixa Preta – Masculino
          'Faixa Marrom e Faixa Preta – Masculino – Até 66 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 73 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 81 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 90 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 100 kg',
          'Faixa Marrom e Faixa Preta – Masculino – +100 kg',

          // Faixa Marrom e Faixa Preta – Feminino
          'Faixa Marrom e Faixa Preta – Feminino – Até 57 kg',
          'Faixa Marrom e Faixa Preta – Feminino – Até 63 kg',
          'Faixa Marrom e Faixa Preta – Feminino – Até 70 kg',
          'Faixa Marrom e Faixa Preta – Feminino – +70 kg',
        ],
      },

      // -----------------------------------------------------------
      // JUDÔ
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
          // Faixa Branca – Masculino
          'Faixa Branca – Masculino – Até 66 kg',
          'Faixa Branca – Masculino – Até 73 kg',
          'Faixa Branca – Masculino – Até 81 kg',
          'Faixa Branca – Masculino – Até 90 kg',
          'Faixa Branca – Masculino – Até 100 kg',
          'Faixa Branca – Masculino – +100 kg',

          // Faixa Branca – Feminino
          'Faixa Branca – Feminino – Até 57 kg',
          'Faixa Branca – Feminino – Até 63 kg',
          'Faixa Branca – Feminino – Até 70 kg',
          'Faixa Branca – Feminino – +70 kg',

          // Faixa Azul e Faixa Roxa – Masculino
          'Faixa Azul e Faixa Roxa – Masculino – Até 66 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 73 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 81 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 90 kg',
          'Faixa Azul e Faixa Roxa – Masculino – Até 100 kg',
          'Faixa Azul e Faixa Roxa – Masculino – +100 kg',

          // Faixa Azul e Faixa Roxa – Feminino
          'Faixa Azul e Faixa Roxa – Feminino – Até 57 kg',
          'Faixa Azul e Faixa Roxa – Feminino – Até 63 kg',
          'Faixa Azul e Faixa Roxa – Feminino – Até 70 kg',
          'Faixa Azul e Faixa Roxa – Feminino – +70 kg',

          // Faixa Marrom e Faixa Preta – Masculino
          'Faixa Marrom e Faixa Preta – Masculino – Até 66 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 73 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 81 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 90 kg',
          'Faixa Marrom e Faixa Preta – Masculino – Até 100 kg',
          'Faixa Marrom e Faixa Preta – Masculino – +100 kg',

          // Faixa Marrom e Faixa Preta – Feminino
          'Faixa Marrom e Faixa Preta – Feminino – Até 57 kg',
          'Faixa Marrom e Faixa Preta – Feminino – Até 63 kg',
          'Faixa Marrom e Faixa Preta – Feminino – Até 70 kg',
          'Faixa Marrom e Faixa Preta – Feminino – +70 kg',
        ],
      },

      // -----------------------------------------------------------
      // NATAÇÃO
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
        modalidadesSexo: ['Masculino', 'Feminino', 'Master'],
        faixaEtaria: ['Masculino 45+', 'Feminino 40+'],
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
      // VÔLEI DE QUADRA
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
        faixaEtaria: [],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // VÔLEI DE PRAIA
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
        faixaEtaria: [],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // DOMINÓ
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
        modalidadesSexo: ['Masculino', 'Feminino'],
        faixaEtaria: [],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // TÊNIS DE MESA
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
        faixaEtaria: [],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // TRIATHLON
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
      // CABO DE GUERRA
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
        faixaEtaria: [],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // ATLETISMO
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
        modalidadesSexo: ['Masculino', 'Feminino', 'Master'],
        faixaEtaria: ['Masculino 45+', 'Feminino 40+'],
        divisoes: ['100m', '200m', '400m', '800m', '1500m', '5000m', '10 km'],
      },

      // -----------------------------------------------------------
      // BASQUETEBOL
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
        faixaEtaria: [],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // BEACH TÊNIS
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
        faixaEtaria: [],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // FUTEVÔLEI
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
        faixaEtaria: [],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // CALISTENIA
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
        faixaEtaria: [],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // TRUCO
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
        modalidadesSexo: ['Masculino', 'Feminino'],
        faixaEtaria: [],
        divisoes: [],
      },

      // -----------------------------------------------------------
      // CORRIDA DE ORIENTAÇÃO
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
        modalidadesSexo: ['Masculino', 'Feminino'],
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

  // ============================================================
  // 2. BUSCA TODAS AS MODALIDADES PARA PEGAR OS IDs
  // ============================================================
  const modalidades = await prisma.modalidade.findMany();
  const getId = (nome: string) =>
    modalidades.find((m) => m.nome === nome)?.id || '';

  // ============================================================
  // 3. LISTA DE ÓRGÃOS
  // ============================================================
  const ORGAOS = [
    'SSP',
    'CBMDF',
    'PMDF',
    'PCDF',
    'DETRAN-DF',
    'PF',
    'PPDF',
    'PPF',
    'PLDF',
    'PLF',
    'PRF',
    'SEJUS',
  ];

  // ============================================================
  // 4. CRIA INSCRIÇÕES (EXEMPLOS)
  // ============================================================
  const inscricoesCriadas = await prisma.inscricao.createMany({
    data: [
      {
        nome: 'Ana Souza',
        email: 'ana.souza@example.com',
        cpf: '11111111111',
        dataNascimento: new Date('1992-01-12'),
        telefone: '61999110000',
        sexo: 'Feminino',
        camiseta: 'P',
        lotacao: 'SSP',
        orgaoOrigem: 'SSP',
        matricula: '004',
        status: 'pendente',
      },
      {
        nome: 'Bruno Oliveira',
        email: 'bruno.oliveira@example.com',
        cpf: '22222222222',
        dataNascimento: new Date('1988-03-22'),
        telefone: '61999220000',
        sexo: 'Masculino',
        camiseta: 'M',
        lotacao: 'CBMDF',
        orgaoOrigem: 'CBMDF',
        matricula: '005',
        status: 'pendente',
      },
      {
        nome: 'Carla Menezes',
        email: 'carla.menezes@example.com',
        cpf: '33333333333',
        dataNascimento: new Date('1995-07-09'),
        telefone: '61999330000',
        sexo: 'Feminino',
        camiseta: 'PP',
        lotacao: 'PMDF',
        orgaoOrigem: 'PMDF',
        matricula: '006',
        status: 'pendente',
      },
      {
        nome: 'Diego Santos',
        email: 'diego.santos@example.com',
        cpf: '44444444444',
        dataNascimento: new Date('1984-11-02'),
        telefone: '61999440000',
        sexo: 'Masculino',
        camiseta: 'G',
        lotacao: 'PCDF',
        orgaoOrigem: 'PCDF',
        matricula: '007',
        status: 'pendente',
      },
      {
        nome: 'Eduarda Martins',
        email: 'eduarda.martins@example.com',
        cpf: '55555555555',
        dataNascimento: new Date('1991-12-20'),
        telefone: '61999550000',
        sexo: 'Feminino',
        camiseta: 'M',
        lotacao: 'DETRAN-DF',
        orgaoOrigem: 'DETRAN-DF',
        matricula: '008',
        status: 'pendente',
      },
      {
        nome: 'Felipe Ramos',
        email: 'felipe.ramos@example.com',
        cpf: '66666666666',
        dataNascimento: new Date('1987-09-17'),
        telefone: '61999660000',
        sexo: 'Masculino',
        camiseta: 'GG',
        lotacao: 'PF',
        orgaoOrigem: 'PF',
        matricula: '009',
        status: 'pendente',
      },
      {
        nome: 'Gabriela Lima',
        email: 'gabriela.lima@example.com',
        cpf: '77777777777',
        dataNascimento: new Date('1993-05-14'),
        telefone: '61999770000',
        sexo: 'Feminino',
        camiseta: 'M',
        lotacao: 'PPDF',
        orgaoOrigem: 'PPDF',
        matricula: '010',
        status: 'pendente',
      },
      {
        nome: 'Henrique Castro',
        email: 'henrique.castro@example.com',
        cpf: '88888888888',
        dataNascimento: new Date('1989-04-10'),
        telefone: '61999880000',
        sexo: 'Masculino',
        camiseta: 'G',
        lotacao: 'PPF',
        orgaoOrigem: 'PPF',
        matricula: '011',
        status: 'pendente',
      },
      {
        nome: 'Isabela Rocha',
        email: 'isabela.rocha@example.com',
        cpf: '99999999999',
        dataNascimento: new Date('1994-02-02'),
        telefone: '61999990001',
        sexo: 'Feminino',
        camiseta: 'P',
        lotacao: 'PLDF',
        orgaoOrigem: 'PLDF',
        matricula: '012',
        status: 'pendente',
      },
      {
        nome: 'João Pedro Almeida',
        email: 'joaopedro.almeida@example.com',
        cpf: '10101010101',
        dataNascimento: new Date('1986-10-19'),
        telefone: '61999990002',
        sexo: 'Masculino',
        camiseta: 'M',
        lotacao: 'PLF',
        orgaoOrigem: 'PLF',
        matricula: '013',
        status: 'pendente',
      },
      {
        nome: 'Karen Luz',
        email: 'karen.luz@example.com',
        cpf: '12121212121',
        dataNascimento: new Date('1990-08-30'),
        telefone: '61999990003',
        sexo: 'Feminino',
        camiseta: 'PP',
        lotacao: 'PRF',
        orgaoOrigem: 'PRF',
        matricula: '014',
        status: 'pendente',
      },
      {
        nome: 'Lucas Vieira',
        email: 'lucas.vieira@example.com',
        cpf: '13131313131',
        dataNascimento: new Date('1982-07-03'),
        telefone: '61999990004',
        sexo: 'Masculino',
        camiseta: 'GG',
        lotacao: 'SEJUS',
        orgaoOrigem: 'SEJUS',
        matricula: '015',
        status: 'pendente',
      },
      {
        nome: 'Mariana Barros',
        email: 'mariana.barros@example.com',
        cpf: '14141414141',
        dataNascimento: new Date('1996-06-11'),
        telefone: '61999990005',
        sexo: 'Feminino',
        camiseta: 'M',
        lotacao: 'SSP',
        orgaoOrigem: 'SSP',
        matricula: '016',
        status: 'pendente',
      },
      {
        nome: 'Nicolas Duarte',
        email: 'nicolas.duarte@example.com',
        cpf: '15151515151',
        dataNascimento: new Date('1983-03-08'),
        telefone: '61999990006',
        sexo: 'Masculino',
        camiseta: 'G',
        lotacao: 'CBMDF',
        orgaoOrigem: 'CBMDF',
        matricula: '017',
        status: 'pendente',
      },
      {
        nome: 'Olivia Sena',
        email: 'olivia.sena@example.com',
        cpf: '16161616161',
        dataNascimento: new Date('1991-04-27'),
        telefone: '61999990007',
        sexo: 'Feminino',
        camiseta: 'P',
        lotacao: 'PMDF',
        orgaoOrigem: 'PMDF',
        matricula: '018',
        status: 'pendente',
      },
      {
        nome: 'Paulo Gama',
        email: 'paulo.gama@example.com',
        cpf: '17171717171',
        dataNascimento: new Date('1980-12-01'),
        telefone: '61999990008',
        sexo: 'Masculino',
        camiseta: 'GG',
        lotacao: 'PCDF',
        orgaoOrigem: 'PCDF',
        matricula: '019',
        status: 'pendente',
      },
      {
        nome: 'Queila Moreira',
        email: 'queila.moreira@example.com',
        cpf: '18181818181',
        dataNascimento: new Date('1997-09-15'),
        telefone: '61999990009',
        sexo: 'Feminino',
        camiseta: 'M',
        lotacao: 'DETRAN-DF',
        orgaoOrigem: 'DETRAN-DF',
        matricula: '020',
        status: 'pendente',
      },
      {
        nome: 'Rodrigo Torres',
        email: 'rodrigo.torres@example.com',
        cpf: '19191919191',
        dataNascimento: new Date('1988-01-22'),
        telefone: '61999990010',
        sexo: 'Masculino',
        camiseta: 'G',
        lotacao: 'PF',
        orgaoOrigem: 'PF',
        matricula: '021',
        status: 'pendente',
      },
      {
        nome: 'Sabrina Vidal',
        email: 'sabrina.vidal@example.com',
        cpf: '20202020202',
        dataNascimento: new Date('1992-10-09'),
        telefone: '61999990011',
        sexo: 'Feminino',
        camiseta: 'P',
        lotacao: 'PPDF',
        orgaoOrigem: 'PPDF',
        matricula: '022',
        status: 'pendente',
      },
      {
        nome: 'Tiago Porto',
        email: 'tiago.porto@example.com',
        cpf: '21212121212',
        dataNascimento: new Date('1984-02-18'),
        telefone: '61999990012',
        sexo: 'Masculino',
        camiseta: 'M',
        lotacao: 'PPF',
        orgaoOrigem: 'PPF',
        matricula: '023',
        status: 'pendente',
      },
      {
        nome: 'Úrsula Farias',
        email: 'ursula.farias@example.com',
        cpf: '23232323232',
        dataNascimento: new Date('1993-11-29'),
        telefone: '61999990013',
        sexo: 'Feminino',
        camiseta: 'PP',
        lotacao: 'PLDF',
        orgaoOrigem: 'PLDF',
        matricula: '024',
        status: 'pendente',
      },
      {
        nome: 'Vitor Nunes',
        email: 'vitor.nunes@example.com',
        cpf: '24242424242',
        dataNascimento: new Date('1985-07-06'),
        telefone: '61999990014',
        sexo: 'Masculino',
        camiseta: 'G',
        lotacao: 'PLF',
        orgaoOrigem: 'PLF',
        matricula: '025',
        status: 'pendente',
      },
      {
        nome: 'Wendy Azevedo',
        email: 'wendy.azevedo@example.com',
        cpf: '25252525252',
        dataNascimento: new Date('1994-08-21'),
        telefone: '61999990015',
        sexo: 'Feminino',
        camiseta: 'M',
        lotacao: 'PRF',
        orgaoOrigem: 'PRF',
        matricula: '026',
        status: 'pendente',
      },
      {
        nome: 'Yago Ribeiro',
        email: 'yago.ribeiro@example.com',
        cpf: '26262626262',
        dataNascimento: new Date('1983-06-19'),
        telefone: '61999990016',
        sexo: 'Masculino',
        camiseta: 'GG',
        lotacao: 'SEJUS',
        orgaoOrigem: 'SEJUS',
        matricula: '027',
        status: 'pendente',
      },
    ],
  });

  console.log('Inscrições criadas!');

  // ============================================================
  // 5. RELACIONAR INSCRIÇÕES ÀS MODALIDADES
  // ============================================================
  const inscricoes = await prisma.inscricao.findMany();

  await prisma.inscricaoModalidade.createMany({
    data: [
      // João Silva → Xadrez + Atletismo
      {
        inscricaoId: inscricoes[0].id,
        modalidadeId: getId('Xadrez'),
      },
      {
        inscricaoId: inscricoes[0].id,
        modalidadeId: getId('Atletismo'),
      },

      // Maria Ferreira → Natação
      {
        inscricaoId: inscricoes[1].id,
        modalidadeId: getId('Natação'),
      },

      // Carlos Andrade → Futebol de Salão
      {
        inscricaoId: inscricoes[2].id,
        modalidadeId: getId('Futebol de Salão'),
      },
    ],
  });

  console.log('InscriçãoModalidade criada!');
  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
