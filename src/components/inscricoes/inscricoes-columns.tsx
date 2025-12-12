import { ColumnDef } from '@tanstack/react-table';
import { Inscricao } from '@/types/inscricao';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    pendente: { label: 'Pendente', color: 'bg-amarelo-olinsesp' },
    aprovada: { label: 'Aprovada', color: 'bg-verde-olinsesp' },
    rejeitada: { label: 'Rejeitada', color: 'bg-vermelho-olinsesp' },
  };
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: 'Desconhecido',
    color: 'bg-gray-500',
  };
  return <Badge className={`${config.color} text-white`}>{config.label}</Badge>;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const getInscricoesBaseColumns = (): ColumnDef<Inscricao>[] => [
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'telefone',
    header: 'Telefone',
  },
  {
    accessorKey: 'lotacao',
    header: 'Lotação',
  },
  {
    accessorKey: 'modalidades',
    header: 'Modalidades',
    cell: ({ row }) => row.original.modalidades.map((m) => m.nome).join(', '),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => getStatusBadge(row.original.status || 'pendente'),
  },
  {
    accessorKey: 'createdAt',
    header: 'Inscrito em',
    cell: ({ row }) =>
      row.original.createdAt ? formatDate(row.original.createdAt) : 'N/A',
  },
];

export const getInscricoesColumns = (
  handleEdit: (inscricao: Inscricao) => void,
  handleDelete: (id: string) => void,
  showActions: boolean = false,
): ColumnDef<Inscricao>[] => {
  const baseColumns = getInscricoesBaseColumns();
  if (showActions) {
    return [
      ...baseColumns,
      {
        id: 'actions',
        header: 'Ações',
        cell: ({ row }) => {
          const inscricao = row.original;
          return (
            <div className='flex gap-2 justify-end'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => handleEdit(inscricao)}
              >
                <Edit className='h-4 w-4' />
              </Button>
              <Button
                size='sm'
                variant='destructive'
                onClick={() => handleDelete(inscricao.id)}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          );
        },
      },
    ];
  }
  return baseColumns;
};
