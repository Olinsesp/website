'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users } from 'lucide-react';
import React from 'react';
import { getStatusBadge, getTipoIcon } from './utils';
import { EventoEnriquecido } from '@/types/cronograma';

type Props = {
  evento: EventoEnriquecido;
};

export default function EventCard({ evento }: Props) {
  return (
    <Card className='hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-r from-gray-50 to-white shadow-lg hover:shadow-blue-500/10'>
      <CardContent className='p-4 sm:p-6'>
        <div className='flex flex-col gap-4 sm:gap-6'>
          <div className='flex items-start gap-4'>
            <div className='flex flex-col items-center min-w-[80px] sm:min-w-[100px]'>
              <div className='text-xl sm:text-2xl font-bold text-azul-olinsesp mb-1 sm:mb-2'>
                {evento.horario}
              </div>
              <div className='flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-gray-500'>
                {getTipoIcon(evento.tipo)}
                <span className='text-xs sm:text-sm font-medium text-center'>
                  {evento.modalidadeRel?.nome}
                </span>
              </div>
            </div>

            <div className='flex-1'>
              <h4 className='font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-800'>
                {evento.atividade}
              </h4>
            </div>
          </div>

          <div className='space-y-2 sm:space-y-3'>
            <div className='flex items-center gap-2 text-gray-600'>
              <MapPin className='h-4 w-4 text-azul-olinsesp flex-shrink-0' />
              <span className='font-medium text-sm sm:text-base'>
                {evento.local}
              </span>
            </div>
            <div className='flex items-center gap-2 text-gray-600'>
              <Users className='h-4 w-4 text-verde-olinsesp flex-shrink-0' />
              <span className='text-sm sm:text-base'>
                {evento.participantes}
              </span>
            </div>
            {/* {evento.resultado && (
              <div className='flex items-center gap-2 text-verde-olinsesp font-semibold'>
                <Trophy className='h-4 w-4 flex-shrink-0' />
                <span className='text-sm sm:text-base'>
                  🏆 {evento.resultado}
                </span>
              </div>
            )} */}
          </div>

          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-2 border-t border-gray-200'>
            <div className='flex-shrink-0'>{getStatusBadge(evento.status)}</div>
            {evento.tipo === 'congresso' && (
              <Button
                variant='outline'
                size='sm'
                className='border-2 border-azul-olinsesp text-azul-olinsesp hover:bg-azul-olinsesp/10 hover:border-azul-olinsesp transition-colors text-xs sm:text-sm'
              >
                Ver Pauta
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
