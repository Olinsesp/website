export interface ModalidadeSelection {
  modalidadeId: string;
  nome?: string;
  detalhes?: Record<string, any>;
}

export interface Inscricao {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string | Date;
  telefone: string;
  camiseta: string;
  lotacao: string;
  equipeId: string;
  orgaoOrigem: string;
  matricula: string;
  sexo: string;
  modalidades: ModalidadeSelection[];
  status?: 'aprovada' | 'pendente' | 'rejeitada';
  createdAt?: string;
  [key: string]: any;
}

export type InscricoesTable = {
  id: string;
  nome: string;
  email: string;
  lotacao: string;
  orgaoOrigem: string;
  modalidades: ModalidadeSelection[];
  status: 'pendente' | 'aprovada' | 'rejeitada';
};
