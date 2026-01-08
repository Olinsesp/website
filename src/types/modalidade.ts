import { Evento } from '@/types/cronograma';

export interface Modalidade {
  id: string;
  nome: string;
  descricao: string;
  maxParticipantes: number;
  participantesAtuais: number;
  regras: string[];
  premios: string[];
  status:
    | 'inscricoes-abertas'
    | 'inscricoes-fechadas'
    | 'em-andamento'
    | 'finalizada';
  vagasPorEquipe?: any;
  eventos?: Evento[];
}
