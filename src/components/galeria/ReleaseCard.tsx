'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileTextIcon, Share2 } from 'lucide-react';
import { Release } from '@/types/midia';

export default function ReleaseCard({ release }: { release: Release }) {
  return (
    <Card className='hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-r from-gray-50 to-white shadow-lg'>
      <CardContent className='p-4 sm:p-6 lg:p-8'>
        <div className='flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6'>
          <div className='flex-1'>
            <h4 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 hover:text-azul-olinsesp cursor-pointer transition-colors'>
              {release.titulo}
            </h4>
            <p className='text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed'>
              {release.url}
            </p>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500'>
              <span>
                Publicado em:{' '}
                {new Date(release.createdAt).toLocaleDateString('pt-BR')}
              </span>
              {release.destaque && (
                <span className='bg-linear-to-r from-amarelo-olinsesp to-laranja-olinsesp text-white px-2 py-1 rounded-full text-xs font-medium'>
                  ⭐ Destaque
                </span>
              )}
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0'>
            <Button
              asChild
              variant='outline'
              size='sm'
              className='border-2 border-azul-olinsesp text-azul-olinsesp hover:bg-azul-olinsesp/10 hover:border-azul-olinsesp transition-colors text-xs sm:text-sm w-full sm:w-auto'
            >
              <a href={release.url} target='_blank' rel='noopener noreferrer'>
                <FileTextIcon className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2' />
                Ler Mais
              </a>
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-gray-100'
            >
              <Share2 className='h-3 w-3 sm:h-4 sm:w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
