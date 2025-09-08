'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

type Props = {
  title: string;
  date: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function DayNavigation({
  title,
  date,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8'>
      <Button
        onClick={onPrev}
        disabled={!canPrev}
        variant='outline'
        className='border-2 border-gray-200 hover:border-blue-300 transition-colors px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto'
      >
        <ChevronLeft className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
        Dia Anterior
      </Button>

      <div className='text-center order-first sm:order-none'>
        <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
          {title}
        </h3>
        <p className='text-sm sm:text-base text-gray-600 font-medium'>{date}</p>
      </div>

      <Button
        onClick={onNext}
        disabled={!canNext}
        variant='outline'
        className='border-2 border-gray-200 hover:border-blue-300 transition-colors px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto'
      >
        Próximo Dia
        <ChevronRight className='h-4 w-4 sm:h-5 sm:w-5 ml-2' />
      </Button>
    </div>
  );
}
