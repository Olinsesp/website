export interface PesoCategoria {
  masculino?: string[];
  feminino?: string[];
}

export interface CategoriaEtaria {
  sexo: string;
  faixaEtaria: string;
}

export interface Modalidade {
  id: string;
  nome: string;
  descricao: string;
  categoria: string[];
  maxParticipantes: number;
  participantesAtuais: number;
  dataInicio: string;
  dataFim: string;
  local: string;
  horario: string;
  regras: string[];
  premios: string[];
  status:
    | 'inscricoes-abertas'
    | 'inscricoes-encerradas'
    | 'em-andamento'
    | 'finalizada';
  divisoes?: string[];
  modalidadesSexo?: string[];
  faixaEtaria?: string[];
}
