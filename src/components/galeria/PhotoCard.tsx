'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Share2 } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';

export type Foto = {
  id: string;
  url: string | StaticImageData;
  titulo?: string | null;
  destaque: boolean;
  createdAt: string;
};

type Props = {
  foto: Foto;
  onPreview: (src: string | StaticImageData) => void;
};

export default function PhotoCard({ foto, onPreview }: Props) {
  return (
    <Card className='group cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden'>
      <div className='relative overflow-hidden'>
        <Image
          width={500}
          height={300}
          src={foto.url}
          alt={foto.titulo || 'Foto do evento'}
          className='w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500'
          onClick={() => onPreview(foto.url)}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 sm:pb-4'>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => onPreview(foto.url)}
            className='bg-white/90 text-gray-800 hover:bg-white border-0 shadow-lg text-xs sm:text-sm'
          >
            <Eye className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2' />
            Ver Ampliada
          </Button>
        </div>

        {foto.destaque && (
          <div className='absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
            ⭐ Destaque
          </div>
        )}
      </div>

      <CardContent className='p-4 sm:p-6'>
        <h4 className='font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-800'>
          {foto.titulo || 'Foto do Evento'}
        </h4>
        <div className='flex justify-between items-center text-xs sm:text-sm text-gray-500'>
          <span>{new Date(foto.createdAt).toLocaleDateString('pt-BR')}</span>
          <div className='flex gap-1 sm:gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-gray-100'
            >
              <Download className='h-3 w-3 sm:h-4 sm:w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-gray-100'
            >
              <Share2 className='h-3 w-3 sm:h-4 sm:w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
