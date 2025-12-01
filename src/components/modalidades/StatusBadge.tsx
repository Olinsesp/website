'use client';

import { Badge } from '@/components/ui/badge';

type Props = {
  status:
    | 'inscricoes-abertas'
    | 'inscricoes-fechadas'
    | 'em-andamento'
    | 'finalizada'
    | string;
};

export default function StatusBadge({ status }: Props) {
  switch (status) {
    case 'inscricoes-abertas':
      return (
        <Badge className='bg-linear-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1 animate-pulse'>
          <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
          Inscrições Abertas
        </Badge>
      );
    case 'inscricoes-fechadas':
      return (
        <Badge className='bg-linear-to-r from-red-500 to-red-600 text-white border-0 px-3 py-1'>
          <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
          Inscrições Fechadas
        </Badge>
      );
    case 'em-andamento':
      return (
        <Badge className='bg-linear-to-r from-yellow-500 to-orange-500 text-white border-0 px-3 py-1 animate-pulse'>
          <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
          Em Andamento
        </Badge>
      );
    case 'finalizada':
      return (
        <Badge className='bg-linear-to-r from-blue-500 to-blue-600 text-white border-0 px-3 py-1'>
          <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
          Finalizada
        </Badge>
      );
    default:
      return (
        <Badge variant='outline' className='border-gray-300 text-gray-600'>
          -
        </Badge>
      );
  }
}
