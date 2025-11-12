'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Trophy } from 'lucide-react';
import React from 'react';
import { Classificacao } from '@/types/classificacao';
import { getPosicaoBadge, getPontuacaoColor } from './utils';

type Props = {
  classificacao: Classificacao;
};

export default function TeamResultCard({ classificacao }: Props) {
  return (
    <Card className='hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-r from-gray-50 to-white shadow-lg hover:shadow-purple-500/10'>
      <CardContent className='p-6'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
          <div className='flex items-center gap-6'>
            <div className='flex flex-col items-center min-w-[80px]'>
              <div className='text-3xl font-bold text-purple-600 mb-2'>
                {classificacao.posicao}º
              </div>
              {getPosicaoBadge(classificacao.posicao)}
            </div>
            <div className='flex-1'>
              <h4 className='font-semibold text-xl mb-3 text-gray-800'>
                {classificacao.lotacao}
              </h4>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Trophy className='h-4 w-4 text-purple-500' />
                  <span className='font-medium'>
                    {classificacao.modalidade}
                  </span>
                  <span className='text-gray-400'>•</span>
                  <span>{classificacao.categoria}</span>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col items-end gap-4'>
            <div className='text-right'>
              <div
                className={`text-3xl font-bold ${getPontuacaoColor(classificacao.pontuacao)}`}
              >
                {classificacao.pontuacao}
              </div>
              <p className='text-sm text-gray-500'>pontos</p>
            </div>
            <div className='flex gap-2'>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 hover:bg-gray-100'
              >
                <Share2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
        {classificacao.observacoes && (
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <p className='text-sm text-gray-600 italic'>
              💡 {classificacao.observacoes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
