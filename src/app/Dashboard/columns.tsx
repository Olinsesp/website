'use client';
import { ColumnDef } from '@tanstack/react-table';

export type Inscricoes = {
  nome: string;
  email: string;
  lotacao: string;
  orgaoOrigem: string;
  modalidades: string[];
};

export const columns: ColumnDef<Inscricoes>[] = [
  { accessorKey: 'nome', header: 'Nome' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'lotacao', header: 'Lotação' },
  { accessorKey: 'orgaoOrigem', header: 'Órgão de Origem' },
  {
    accessorKey: 'modalidades',
    header: 'Modalidades',
    cell: ({ row }) => {
      const modalidades = row.getValue('modalidades') as string[];
      return modalidades.join(', ');
    },
  },
];
