import { Classificacao, MedalRow } from './classificacao';
import { Modalidade } from './modalidade';
import { CronogramaResponse } from './cronograma';
import { MidiasResponse } from './midia';

export interface ClassificacoesResponse {
  dados: Classificacao[];
  estatisticas?: {
    totalClassificacoes: number;
    totalCampeoes: number;
    totalModalidades: number;
    totalLotacoes: number;
    modalidades: string[];
    categorias: string[];
    lotacoes: string[];
  };
  quadroMedalhas?: MedalRow[];
  filtros?: {
    modalidades: string[];
    categorias: string[];
    lotacoes: string[];
  };
}

export interface ModalidadesResponse {
  dados: Modalidade[];
  estatisticas?: {
    totalModalidades: number;
    totalVagas: number;
    vagasDisponiveis: number;
    totalPremios: number;
  };
}

export type { CronogramaResponse };
export type { MidiasResponse };
