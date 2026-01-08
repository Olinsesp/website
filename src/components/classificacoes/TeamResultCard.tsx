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
    <Card className='hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-r from-gray-50 to-white shadow-lg hover:shadow-purple-500/10'>
      <CardContent className='p-6'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
          <div className='flex items-center gap-6'>
            <div className='flex flex-col items-center min-w-20'>
              <div className='text-3xl font-bold text-purple-600 mb-2'>
                {classificacao.posicao}º
              </div>
              {getPosicaoBadge(classificacao.posicao)}
            </div>
            <div className='flex-1'>
              <h4 className='font-semibold text-xl mb-3 text-gray-800'>
                {classificacao.equipe || '-'}
              </h4>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Trophy className='h-4 w-4 text-purple-500' />
                  <span className='font-medium'>
                    {classificacao.modalidade}
                  </span>
                  <span className='text-gray-400'>•</span>
                </div>
                {renderDetalhes(classificacao.detalhes)}
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
    <div className='mt-3 rounded-lg bg-purple-50/60 border border-purple-100 px-3 py-2 shadow-sm'>
      <div className='font-semibold text-purple-900 text-xs sm:text-sm mb-2 flex items-center gap-2'>
        <span className='inline-block w-2 h-2 bg-purple-400 rounded-full'></span>
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
                className='flex items-center gap-2 text-purple-900/90 text-xs sm:text-sm'
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
