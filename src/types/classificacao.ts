export interface Classificacao {
  id: string;
  modalidade: string;
  categoria: string;
  posicao: number;
  atleta?: string;
  afiliacao: string;
  pontuacao: number;
  tempo?: string;
  distancia?: string;
  observacoes?: string;
}

export type MedalRow = {
  afiliacao: string;
  ouro: number;
  prata: number;
  bronze: number;
  total: number;
};
