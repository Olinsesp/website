import { Modalidade } from './modalidade';

export type Evento = {
  id: string;
  atividade: string;
  inicio: string;
  fim: string;
  detalhes?: string | null;
  dia?: string;
  modalidadeId?: string | null;
  modalidadeRel?: Modalidade;
};

export type EventoEnriquecido = Evento & {
  horario: string;
  tipo: 'cerimonia' | 'jogo' | 'final' | 'congresso';
  local: string;
  status: 'agendado' | 'cancelado' | 'realizado';
  participantes: string;
  inicioFormatado: string;
  horarioFormatado: string;
};

export interface DiaCronograma {
  id: string;
  data: string;
  titulo: string;
  descricao: string;
  eventos: EventoEnriquecido[];
}

export interface CronogramaResponse {
  dias?: DiaCronograma[];
  dados?: Evento[];
}
