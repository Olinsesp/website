'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Target, Users, Zap } from 'lucide-react';
import React from 'react';
import { Classificacao } from '@/types/classificacao';
import { getPosicaoBadge, getPontuacaoColor } from './utils';

type Props = {
  classificacao: Classificacao;
};

export default function AthleteResultCard({ classificacao }: Props) {
  return (
    <Card className='hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-r from-gray-50 to-white shadow-lg hover:shadow-blue-500/10'>
      <CardContent className='p-4 sm:p-6'>
        <div className='flex flex-col gap-4 sm:gap-6'>
          <div className='flex items-start gap-4'>
            <div className='flex flex-col items-center min-w-[60px] sm:min-w-20'>
              <div className='text-2xl sm:text-3xl font-bold text-azul-olinsesp mb-1 sm:mb-2'>
                {classificacao.posicao}º
              </div>
              {getPosicaoBadge(classificacao.posicao)}
            </div>
            <div className='flex-1'>
              <h4 className='font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-800'>
                {classificacao.atleta}
              </h4>
            </div>
          </div>

          <div className='space-y-2 sm:space-y-3'>
            <div className='flex items-center gap-2 text-gray-600'>
              <Target className='h-4 w-4 text-blue-500 shrink-0' />
              <span className='font-medium text-sm sm:text-base'>
                {classificacao.modalidade}
              </span>
              <span className='text-gray-400'>•</span>
            </div>
            <div className='flex items-center gap-2 text-gray-600'>
              <Users className='h-4 w-4 text-green-500 shrink-0' />
              <span className='text-sm sm:text-base'>
                {classificacao.equipe || '-'}
              </span>
            </div>
            {classificacao.tempo && (
              <div className='flex items-center gap-2 text-gray-600'>
                <Zap className='h-4 w-4 text-orange-500 shrink-0' />
                <span className='text-sm sm:text-base'>
                  Tempo: {classificacao.tempo}
                </span>
              </div>
            )}
            {classificacao.distancia && (
              <div className='flex items-center gap-2 text-gray-600'>
                <Target className='h-4 w-4 text-purple-500 shrink-0' />
                <span className='text-sm sm:text-base'>
                  Distância: {classificacao.distancia}
                </span>
              </div>
            )}
            {renderDetalhes(classificacao.detalhes)}
          </div>

          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-2 border-t border-gray-200'>
            <div className='text-left sm:text-right'>
              <div
                className={`text-2xl sm:text-3xl font-bold ${getPontuacaoColor(classificacao.pontuacao)}`}
              >
                {classificacao.pontuacao}
              </div>
              <p className='text-xs sm:text-sm text-gray-500'>pontos</p>
            </div>
            <div className='flex gap-2'>
              <Button
                variant='ghost'
                size='sm'
                className='h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-gray-100'
              >
                <Share2 className='h-3 w-3 sm:h-4 sm:w-4' />
              </Button>
            </div>
          </div>
        </div>

        {classificacao.observacoes && (
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <p className='text-xs sm:text-sm text-gray-600 italic'>
              💡 {classificacao.observacoes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const renderDetalhes = (detalhes: Record<string, any> | undefined) => {
  if (!detalhes || Object.keys(detalhes).length === 0) {
    return null;
  }

  const labels: Record<string, string> = {
    genero: 'Gênero',
    faixasEtarias: 'Faixa Etária',
    graduacoes: 'Graduação',
    categoriasPeso: 'Divisão de Peso',
    provas: 'Prova',
    categoria: 'Categoria',
  };

  return (
    <div className='mt-3 rounded-lg bg-blue-50/60 border border-blue-100 px-3 py-2 shadow-sm'>
      <div className='font-semibold text-blue-900 text-xs sm:text-sm mb-2 flex items-center gap-2'>
        <span className='inline-block w-2 h-2 bg-blue-400 rounded-full'></span>
        Detalhes da Prova
      </div>
      <div className='flex flex-col gap-1'>
        {Object.entries(detalhes).map(([key, value]) => {
          if (value) {
            const label = labels[key] || key;
            const displayValue = Array.isArray(value)
              ? value.join(', ')
              : value;
            return (
              <div
                key={key}
                className='flex items-center gap-2 text-blue-900/90 text-xs sm:text-sm'
              >
                <span className='font-medium whitespace-nowrap'>{label}:</span>
                <span className='truncate'>{displayValue}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
