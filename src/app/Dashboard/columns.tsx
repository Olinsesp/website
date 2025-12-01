'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export type Inscricoes = {
  id: string;
  nome: string;
  email: string;
  lotacao: string;
  orgaoOrigem: string;
  modalidades: string[];
  status: 'Pendente' | 'Confirmado' | 'Cancelado'; // Adding status for better management
};

export const columns: ColumnDef<Inscricoes>[] = [
  {
    accessorKey: 'nome',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nome
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'lotacao',
    header: 'Lotação',
    cell: ({ row }) => (
      <Badge variant='outline'>{row.getValue('lotacao')}</Badge>
    ),
  },
  { accessorKey: 'orgaoOrigem', header: 'Órgão de Origem' },
  {
    accessorKey: 'modalidades',
    header: 'Modalidades',
    cell: ({ row }) => {
      const modalidades = row.getValue('modalidades') as string[];
      return (
        <div className='flex flex-wrap gap-1'>
          {modalidades.map((m) => (
            <Badge key={m}>{m}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant =
        status === 'Confirmado'
          ? 'default'
          : status === 'Pendente'
            ? 'secondary'
            : 'destructive';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem>Ver Inscrição</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-green-600'>
              Aprovar
            </DropdownMenuItem>
            <DropdownMenuItem className='text-red-600'>
              Cancelar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
