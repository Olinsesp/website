export interface Classificacao {
  id: string;
  modalidadeId: string;
  categoria: string;
  posicao: number;
  inscricaoId?: string;
  lotacao?: string;
  pontuacao: number;
  tempo?: string;
  distancia?: string;
  observacoes?: string;
  // Campos adicionados dinamicamente
  modalidade?: string;
  nome?: string;
  atleta?: string;
}

export type MedalRow = {
  lotacao: string;
  ouro: number;
  prata: number;
  bronze: number;
  total: number;
};
