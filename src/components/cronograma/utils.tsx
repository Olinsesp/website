'use client';

import { Badge } from '@/components/ui/badge';
import { Award, Calendar, Trophy, Users } from 'lucide-react';

export const getStatusBadge = (status: string | undefined) => {
  switch (status) {
    case 'finalizado':
      return (
        <Badge className='bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1'>
          <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
          Finalizado
        </Badge>
      );
    case 'em_andamento':
      return (
        <Badge className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-3 py-1 animate-pulse'>
          <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
          Em Andamento
        </Badge>
      );
    case 'agendado':
      return (
        <Badge className='bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-3 py-1'>
          <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
          Agendado
        </Badge>
      );
    default:
      return (
        <Badge variant='outline' className='border-gray-300 text-gray-600'>
          -
        </Badge>
      );
  }
};

export const getTipoIcon = (tipo: string | undefined) => {
  switch (tipo) {
    case 'cerimonia':
      return <Award className='h-5 w-5 text-yellow-500' />;
    case 'final':
      return <Trophy className='h-5 w-5 text-yellow-500' />;
    case 'congresso':
      return <Users className='h-5 w-5 text-blue-500' />;
    default:
      return <Calendar className='h-5 w-5 text-blue-500' />;
  }
};
