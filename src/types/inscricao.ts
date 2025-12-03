export interface Inscricao {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string | Date;
  telefone: string;
  camiseta: string;
  lotacao: string;
  orgaoOrigem: string;
  matricula: string;
  modalidades: string[];
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
  modalidades: string[];
  status: 'Pendente' | 'Confirmado' | 'Cancelado';
};
