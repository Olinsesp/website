import { Inscricao } from './inscricao';

export interface Classificacao {
  id: string;
  modalidadeId: string;
  posicao: number;
  inscricaoId?: string;
  equipe?: string;
  pontuacao: number;
  tempo?: string;
  distancia?: string;
  observacoes?: string;
  modalidade?: string;
  nome?: string;
  atleta?: string;
  sexo?: string;
  inscricao?: Inscricao; 
  detalhes?: Record<string, any>;
  dynamicFields?: Record<string, any>;
}

export type MedalRow = {
  equipe: string;
  ouro: number;
  prata: number;
  bronze: number;
  total: number;
};
