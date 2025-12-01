'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Calendar, Users } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname,
    );
  });

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-orange-50'>
      <div className='text-center max-w-2xl mx-auto p-8'>
        <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-2xl'>
          <CardContent className='p-12'>
            {/* Ícone de Erro Estilizado */}
            <div className='relative mb-8'>
              <div className='text-8xl font-black text-blue-600 mb-4'>404</div>
              <div className='absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full animate-pulse'></div>
            </div>

            {/* Título e Descrição */}
            <h1 className='text-3xl font-bold text-gray-800 mb-4'>
              Página não encontrada
            </h1>
            <p className='text-lg text-gray-600 mb-8 max-w-md mx-auto'>
              A página que você está procurando não existe ou foi movida para
              outro local.
            </p>

            {/* Botões de Navegação */}
            <div className='space-y-4 mb-8'>
              <Link href='/'>
                <Button
                  size='lg'
                  className='w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  <Home className='mr-2 h-5 w-5' />
                  Voltar ao Início
                </Button>
              </Link>
            </div>

            {/* Links Rápidos */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <Link href='/Inscricoes'>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors'
                >
                  <Users className='mr-2 h-4 w-4' />
                  Inscrições
                </Button>
              </Link>
              <Link href='/Cronograma'>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-colors'
                >
                  <Calendar className='mr-2 h-4 w-4' />
                  Cronograma
                </Button>
              </Link>
            </div>

            {/* Informação Adicional */}
            <div className='mt-8 pt-6 border-t border-gray-200'>
              <p className='text-sm text-gray-500'>
                Se você acredita que isso é um erro, entre em contato com nossa
                equipe.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
