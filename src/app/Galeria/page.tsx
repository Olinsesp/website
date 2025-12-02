'use client';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, ImageIcon, PlayCircle, FileTextIcon } from 'lucide-react';
import { StaticImageData } from 'next/image';
import PhotoCard from '@/components/galeria/PhotoCard';
import VideoCard from '@/components/galeria/VideoCard';
import ReleaseCard from '@/components/galeria/ReleaseCard';
import ImageModal from '@/components/galeria/ImageModal';
import QueryStateHandler from '@/components/ui/query-state-handler';

interface Midia {
  id: string;
  tipo: 'foto' | 'video' | 'release';
  url: string;
  titulo?: string | null;
  destaque: boolean;
  createdAt: string;
}

const fetchMidias = async (): Promise<Midia[]> => {
  const res = await fetch('/api/midias');
  if (!res.ok) {
    throw new Error('Falha ao buscar mídias');
  }
  return res.json();
};

export default function Galeria() {
  const [selectedImage, setSelectedImage] = useState<
    string | StaticImageData | null
  >(null);

  const {
    data: midias,
    isLoading,
    isError,
    error,
  } = useQuery<Midia[]>({
    queryKey: ['midias'],
    queryFn: fetchMidias,
  });

  const { fotos, videos, releases } = useMemo(() => {
    const fotos = midias?.filter((m) => m.tipo === 'foto') || [];
    const videos = midias?.filter((m) => m.tipo === 'video') || [];
    const releases = midias?.filter((m) => m.tipo === 'release') || [];
    return { fotos, videos, releases };
  }, [midias]);

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isError={isError}
      error={error as Error}
      loadingMessage='Carregando galeria...'
    >
      <div className='min-h-screen py-12'>
        <div className='container mx-auto px-4'>
          {/* Header da Página */}
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 bg-azul-olinsesp text-white px-6 py-3 rounded-full text-sm font-medium mb-6'>
              <Camera className='h-4 w-4' />
              Galeria Atualizada
            </div>

            <h1 className='text-4xl md:text-5xl font-bold mb-6 bg-azul-olinsesp bg-clip-text text-transparent'>
              Galeria de Mídias
            </h1>
            <p className='text-2xl md:text-xl font-medium text-gray-950 max-w-3xl mx-auto leading-relaxed'>
              Reviva os melhores momentos através de fotos, vídeos e notícias
              exclusivas do VIII Olinsesp
            </p>
          </div>

          {/* Estatísticas */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12'>
            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center'>
                  <ImageIcon className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {fotos.length}+
                </h3>
                <p className='text-sm sm:text-base text-gray-600'>
                  Fotos Exclusivas
                </p>
              </CardContent>
            </Card>

            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center'>
                  <PlayCircle className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {videos.length}+
                </h3>
                <p className='text-sm sm:text-base text-gray-600'>Vídeos HD</p>
              </CardContent>
            </Card>

            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center'>
                  <FileTextIcon className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {releases.length}+
                </h3>
                <p className='text-sm sm:text-base text-gray-600'>Releases</p>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-2xl'>
            <CardHeader className='text-center pb-4 sm:pb-6 px-4 sm:px-6'>
              <div className='h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 sm:mb-6 bg-azul-olinsesp rounded-full flex items-center justify-center'>
                <Camera className='h-8 w-8 sm:h-10 sm:w-10 text-white' />
              </div>
              <CardTitle className='text-2xl sm:text-3xl text-gray-800'>
                Conteúdo Multimídia
              </CardTitle>
              <CardDescription className='text-base sm:text-lg text-gray-600 max-w-2xl mx-auto'>
                Explore fotos, vídeos e releases do evento em uma experiência
                visual única
              </CardDescription>
            </CardHeader>

            <CardContent className='p-4 sm:p-6 lg:p-8'>
              <Tabs defaultValue='fotos' className='w-full'>
                <TabsList className='grid w-full grid-cols-1 sm:grid-cols-3 bg-gray-100 p-1 rounded-xl'>
                  <TabsTrigger
                    value='fotos'
                    className='flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-300 text-sm sm:text-base py-2 sm:py-3'
                  >
                    <ImageIcon className='h-4 w-4' />
                    <span className='hidden sm:inline'>Fotos</span>
                    <span className='sm:hidden'>Fotos</span>
                    <span className='ml-1'>({fotos.length})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='videos'
                    className='flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-600 transition-all duration-300 text-sm sm:text-base py-2 sm:py-3'
                  >
                    <PlayCircle className='h-4 w-4' />
                    <span className='hidden sm:inline'>Vídeos</span>
                    <span className='sm:hidden'>Vídeos</span>
                    <span className='ml-1'>({videos.length})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='releases'
                    className='flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-600 transition-all duration-300 text-sm sm:text-base py-2 sm:py-3'
                  >
                    <FileTextIcon className='h-4 w-4' />
                    <span className='hidden sm:inline'>Releases</span>
                    <span className='sm:hidden'>Releases</span>
                    <span className='ml-1'>({releases.length})</span>
                  </TabsTrigger>
                </TabsList>

                {/* Fotos */}
                <TabsContent
                  value='fotos'
                  className='space-y-6 sm:space-y-8 mt-6 sm:mt-8'
                >
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
                    {fotos.map((foto) => (
                      <PhotoCard
                        key={foto.id}
                        foto={foto as any}
                        onPreview={(src) => setSelectedImage(src)}
                      />
                    ))}
                  </div>
                </TabsContent>

                {/* Vídeos */}
                <TabsContent
                  value='videos'
                  className='space-y-6 sm:space-y-8 mt-6 sm:mt-8'
                >
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
                    {videos.map((video) => (
                      <VideoCard key={video.id} video={video as any} />
                    ))}
                  </div>
                </TabsContent>

                {/* Releases */}
                <TabsContent
                  value='releases'
                  className='space-y-6 sm:space-y-8 mt-6 sm:mt-8'
                >
                  <div className='space-y-4 sm:space-y-6'>
                    {releases.map((release) => (
                      <ReleaseCard key={release.id} release={release as any} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Modal para imagem ampliada */}
          {selectedImage && (
            <ImageModal
              src={selectedImage}
              onClose={() => setSelectedImage(null)}
            />
          )}
        </div>
      </div>
    </QueryStateHandler>
  );
}
