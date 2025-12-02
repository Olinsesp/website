'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import React from 'react';

type Props = {
  modalidade: string | null;
  categoria: string | null;
  lotacao: string | null;
  modalidades: string[];
  categorias: string[];
  lotacoes: string[];
  onChangeModalidade: (value: string | null) => void;
  onChangeCategoria: (value: string | null) => void;
  onChangeLotacao: (value: string | null) => void;
  className?: string;
};

export function ClassificacoesFilters({
  modalidade,
  categoria,
  lotacao,
  modalidades,
  categorias,
  lotacoes,
  onChangeModalidade,
  onChangeCategoria,
  onChangeLotacao,
  className,
}: Props) {
  return (
    <Card
      className={`bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6 sm:mb-8 ${className ?? ''}`}
    >
      <CardHeader className='pb-3 sm:pb-4 px-4 sm:px-6'>
        <div className='flex items-center gap-2'>
          <Filter className='h-4 w-4 sm:h-5 sm:w-5 text-azul-olinsesp' />
          <CardTitle className='text-lg sm:text-xl text-gray-800'>
            Filtros de Busca
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='p-4 sm:p-6'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
          <div className='space-y-2'>
            <label className='text-xs sm:text-sm font-medium text-gray-700'>
              Modalidade
            </label>
            <Select
              value={modalidade ?? 'todos'}
              onValueChange={(val) =>
                onChangeModalidade(val === 'todos' ? null : val)
              }
            >
              <SelectTrigger className='w-full border-2 border-gray-200 bg-white hover:border-azul-olinsesp transition-colors text-sm'>
                <SelectValue placeholder='Todas as modalidades' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='todos'>Todas as Modalidades</SelectItem>
                {modalidades.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <label className='text-xs sm:text-sm font-medium text-gray-700'>
              Categoria
            </label>
            <Select
              value={categoria ?? 'todos'}
              onValueChange={(val) =>
                onChangeCategoria(val === 'todos' ? null : val)
              }
            >
              <SelectTrigger className='w-full border-2 border-gray-200 bg-white hover:border-azul-olinsesp transition-colors text-sm'>
                <SelectValue placeholder='Todas as categorias' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='todos'>Todas as Categorias</SelectItem>
                {categorias.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <label className='text-xs sm:text-sm font-medium text-gray-700'>
              Lotação
            </label>
            <Select
              value={lotacao ?? 'todos'}
              onValueChange={(val) =>
                onChangeLotacao(val === 'todos' ? null : val)
              }
            >
              <SelectTrigger className='w-full border-2 border-gray-200 bg-white hover:border-azul-olinsesp transition-colors text-sm'>
                <SelectValue placeholder='Todas as lotações' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='todos'>Todas as lotações</SelectItem>
                {lotacoes.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ClassificacoesFilters;
