'use client';

import { Badge } from '@/components/ui/badge';
import { Award, Crown, Medal } from 'lucide-react';

export const getPosicaoBadge = (posicao: number) => {
  switch (posicao) {
    case 1:
      return (
        <Badge className='bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0 px-3 py-1 text-sm font-bold'>
          <Crown className='h-3 w-3 mr-1' />
          1º Lugar
        </Badge>
      );
    case 2:
      return (
        <Badge className='bg-gradient-to-r from-gray-300 to-gray-400 text-white border-0 px-3 py-1 text-sm font-bold'>
          <Medal className='h-3 w-3 mr-1' />
          2º Lugar
        </Badge>
      );
    case 3:
      return (
        <Badge className='bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0 px-3 py-1 text-sm font-bold'>
          <Award className='h-3 w-3 mr-1' />
          3º Lugar
        </Badge>
      );
    default:
      return (
        <Badge variant='outline' className='border-gray-300 text-gray-600'>
          {posicao}º Lugar
        </Badge>
      );
  }
};

export const getPontuacaoColor = (pontuacao: number) => {
  if (pontuacao >= 90) return 'text-green-600';
  if (pontuacao >= 80) return 'text-blue-600';
  if (pontuacao >= 70) return 'text-yellow-600';
  return 'text-gray-600';
};
