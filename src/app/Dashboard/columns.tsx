'use client';
import { ColumnDef } from '@tanstack/react-table';

export type Inscricoes = {
  nome: string;
  email: string;
  afiliacao: string;
  modalidades: string[];
};

export const columns: ColumnDef<Inscricoes>[] = [
  { accessorKey: 'nome', header: 'Nome' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'afiliacao', header: 'Afiliação' },
  {
    accessorKey: 'modalidades',
    header: 'Modalidades',
    cell: ({ row }) => {
      const modalidades = row.getValue('modalidades') as string[];
      return modalidades.join(', ');
    },
  },
];
