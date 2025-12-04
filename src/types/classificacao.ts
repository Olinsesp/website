export interface Classificacao {
  id: string;
  modalidadeId: string;
  posicao: number;
  inscricaoId?: string;
  lotacao?: string;
  pontuacao: number;
  tempo?: string;
  distancia?: string;
  observacoes?: string;
  modalidade?: string;
  nome?: string;
  atleta?: string;
  sexo?: string;
}

export type MedalRow = {
  lotacao: string;
  ouro: number;
  prata: number;
  bronze: number;
  total: number;
};
