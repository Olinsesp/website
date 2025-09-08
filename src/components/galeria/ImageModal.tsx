'use client';

import { Button } from '@/components/ui/button';
import Image, { StaticImageData } from 'next/image';

export default function ImageModal({
  src,
  onClose,
}: {
  src: string | StaticImageData;
  onClose: () => void;
}) {
  if (!src) return null as any;
  return (
    <div
      className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4'
      onClick={onClose}
    >
      <div className='relative max-w-4xl max-h-full'>
        <Image
          width={1200}
          height={800}
          src={src}
          alt='Imagem ampliada'
          className='max-w-full max-h-full object-contain rounded-lg'
        />
        <Button
          variant='secondary'
          size='sm'
          className='absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 text-gray-800 hover:bg-white border-0 text-sm sm:text-base'
          onClick={onClose}
        >
          ✕
        </Button>
      </div>
    </div>
  );
}
