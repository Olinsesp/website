'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Este tipo deve corresponder ao objeto ENRIQUECIDO que criaremos no page.tsx
export type ClassificacaoEnriquecida = {
  id: string;
  modalidade: string; // Nome da modalidade
  categoria: string;
  posicao: number;
  atleta?: string; // Nome do atleta
  lotacao?: string;
  pontuacao: number;
};

interface ClassificacoesColumnsProps {
  onEdit: (classificacao: ClassificacaoEnriquecida) => void;
  onDelete: (id: string) => void;
}

export const getClassificacoesColumns = ({
  onEdit,
  onDelete,
}: ClassificacoesColumnsProps): ColumnDef<ClassificacaoEnriquecida>[] => [
  {
    accessorKey: 'posicao',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Pos.
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const posicao = row.getValue('posicao') as number;
      const colors = {
        1: 'bg-yellow-400 text-yellow-900',
        2: 'bg-gray-300 text-gray-800',
        3: 'bg-amber-500 text-amber-900',
      };
      return (
        <Badge
          variant='outline'
          className={`font-bold ${colors[posicao as keyof typeof colors] || 'bg-gray-100'}`}
        >
          {posicao}º
        </Badge>
      );
    },
  },
  {
    accessorKey: 'modalidade',
    header: 'Modalidade',
  },
  {
    accessorKey: 'categoria',
    header: 'Categoria',
  },
  {
    accessorKey: 'atleta',
    header: 'Atleta/Equipe',
    cell: ({ row }) => {
      const atleta = row.getValue('atleta') as string | undefined;
      const lotacao = row.original.lotacao;
      return atleta ? (
        <div>
          <div className='font-medium'>{atleta}</div>
          <div className='text-xs text-muted-foreground'>{lotacao}</div>
        </div>
      ) : (
        <div className='font-medium'>{lotacao}</div>
      );
    },
  },
  {
    accessorKey: 'pontuacao',
    header: 'Pontuação',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const classificacao = row.original;
      return (
        <div className='flex justify-end gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onEdit(classificacao)}
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => onDelete(classificacao.id)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      );
    },
  },
];
