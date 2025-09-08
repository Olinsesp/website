'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Video = {
  id: string;
  url: string;
  titulo?: string | null;
  destaque: boolean;
  createdAt: string;
};

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Card className='hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden'>
      <div className='relative overflow-hidden'>
        <video
          controls
          className='w-full h-48 sm:h-56 object-cover'
          src={video.url}
        />
        {video.destaque && (
          <div className='absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
            ⭐ Destaque
          </div>
        )}
      </div>
      <CardContent className='p-4 sm:p-6'>
        <h4 className='font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-800'>
          {video.titulo || 'Vídeo do Evento'}
        </h4>
        <div className='flex justify-between items-center text-xs sm:text-sm text-gray-500'>
          <span>{new Date(video.createdAt).toLocaleDateString('pt-BR')}</span>
          <Button
            variant='ghost'
            size='sm'
            className='h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-gray-100'
          >
            <Share2 className='h-3 w-3 sm:h-4 sm:w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
