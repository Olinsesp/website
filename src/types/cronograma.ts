export interface Evento {
  id: string;
  atividade: string;
  inicio: string;
  fim: string;
  detalhes?: string | null;
  horario?: string;
  tipo?: string;
  local?: string;
  status?: 'agendado' | 'em_andamento' | 'finalizado';
  participantes?: string;
  modalidade?: string;
  resultado?: string;
  inicioFormatado?: string;
  horarioFormatado?: string;
}

export interface EventoEnriquecido extends Evento {
  horario: string;
  tipo: string;
  local: string;
  status: 'agendado' | 'em_andamento' | 'finalizado';
  participantes: string;
  inicioFormatado: string;
  horarioFormatado: string;
}

export interface DiaCronograma {
  id: string;
  data: string;
  titulo: string;
  descricao: string;
  eventos: Evento[];
}

export interface CronogramaResponse {
  dias?: DiaCronograma[];
  dados?: Evento[];
}
