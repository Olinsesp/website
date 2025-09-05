const stringUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const staticMidias = [
  {
    id: '1',
    tipo: 'foto',
    url: `${stringUrl}/olinsesp/foto1.png`,
    titulo: 'Abertura do Evento',
    destaque: true,
    createdAt: new Date('2026-12-15T09:00:00').toISOString(),
  },
  {
    id: '2',
    tipo: 'foto',
    url: `${stringUrl}/olinsesp/foto1.png`,
    titulo: 'Jogo de Vôlei',
    destaque: false,
    createdAt: new Date('2026-12-15T11:30:00').toISOString(),
  },
  {
    id: '3',
    tipo: 'video',
    url: `${stringUrl}/olinsesp/video1.mp4`,
    titulo: 'Melhores Momentos - Dia 1',
    destaque: true,
    createdAt: new Date('2026-12-15T20:00:00').toISOString(),
  },
  {
    id: '4',
    tipo: 'release',
    url: 'Resultados do primeiro dia de competições da Olinsesp VIII.',
    titulo: 'Balanço do Dia 1',
    destaque: false,
    createdAt: new Date('2026-12-16T09:00:00').toISOString(),
  },
  {
    id: '5',
    tipo: 'foto',
    url: `${stringUrl}/olinsesp/foto1.png`,
    titulo: 'Corrida de Rua',
    destaque: false,
    createdAt: new Date('2026-12-16T10:00:00').toISOString(),
  },
];
