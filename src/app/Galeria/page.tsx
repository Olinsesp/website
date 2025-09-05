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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Camera,
  Eye,
  Loader2,
  ImageIcon,
  PlayCircle,
  FileTextIcon,
  Download,
  Share2,
} from 'lucide-react';
import Image, { StaticImageData } from 'next/image';

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

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-orange-50'>
        <div className='text-center'>
          <Loader2 className='inline-block h-12 w-12 animate-spin text-blue-600 mb-4' />
          <p className='text-lg text-gray-600'>Carregando galeria...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <Card className='max-w-md mx-auto bg-white/80 backdrop-blur-sm'>
          <CardContent className='p-8'>
            <div className='text-red-500 text-6xl mb-4'>⚠️</div>
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>
              Erro ao carregar
            </h2>
            <p className='text-gray-600 mb-4'>{(error as Error).message}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className='min-h-screen py-12 bg-gradient-to-br from-blue-50 via-white to-orange-50'>
      <div className='container mx-auto px-4'>
        {/* Header da Página */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium mb-6'>
            <Camera className='h-4 w-4' />
            Galeria Atualizada
          </div>

          <h1 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent'>
            Galeria de Mídias
          </h1>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Reviva os melhores momentos através de fotos, vídeos e notícias
            exclusivas do Olinsesp VIII
          </p>
        </div>

        {/* Estatísticas */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12'>
          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-4 sm:p-6 lg:p-8'>
              <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center'>
                <ImageIcon className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
              </div>
              <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                {fotos.length}+
              </h3>
              <p className='text-sm sm:text-base text-gray-600'>Fotos Exclusivas</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-4 sm:p-6 lg:p-8'>
              <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center'>
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
              <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center'>
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
            <div className='h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center'>
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
              <TabsContent value='fotos' className='space-y-6 sm:space-y-8 mt-6 sm:mt-8'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
                  {fotos.map((foto) => (
                    <Card
                      key={foto.id}
                      className='group cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden'
                    >
                      <div className='relative overflow-hidden'>
                        <Image
                          width={500}
                          height={300}
                          src={foto.url}
                          alt={foto.titulo || 'Foto do evento'}
                          className='w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500'
                          onClick={() => setSelectedImage(foto.url)}
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 sm:pb-4'>
                          <Button
                            variant='secondary'
                            size='sm'
                            onClick={() => setSelectedImage(foto.url)}
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
                          <span>
                            {new Date(foto.createdAt).toLocaleDateString(
                              'pt-BR',
                            )}
                          </span>
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
                  ))}
                </div>
              </TabsContent>

              {/* Vídeos */}
              <TabsContent value='videos' className='space-y-6 sm:space-y-8 mt-6 sm:mt-8'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
                  {videos.map((video) => (
                    <Card
                      key={video.id}
                      className='hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden'
                    >
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
                          <span>
                            {new Date(video.createdAt).toLocaleDateString(
                              'pt-BR',
                            )}
                          </span>
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
                  ))}
                </div>
              </TabsContent>

              {/* Releases */}
              <TabsContent value='releases' className='space-y-6 sm:space-y-8 mt-6 sm:mt-8'>
                <div className='space-y-4 sm:space-y-6'>
                  {releases.map((release) => (
                    <Card
                      key={release.id}
                      className='hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-r from-gray-50 to-white shadow-lg'
                    >
                      <CardContent className='p-4 sm:p-6 lg:p-8'>
                        <div className='flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6'>
                          <div className='flex-1'>
                            <h4 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 hover:text-blue-600 cursor-pointer transition-colors'>
                              {release.titulo}
                            </h4>
                            <p className='text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed'>
                              {release.url}
                            </p>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500'>
                              <span>
                                Publicado em:{' '}
                                {new Date(release.createdAt).toLocaleDateString(
                                  'pt-BR',
                                )}
                              </span>
                              {release.destaque && (
                                <span className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
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
                              className='border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors text-xs sm:text-sm w-full sm:w-auto'
                            >
                              <a
                                href={release.url}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
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
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Modal para imagem ampliada */}
        {selectedImage && (
          <div
            className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4'
            onClick={() => setSelectedImage(null)}
          >
            <div className='relative max-w-4xl max-h-full'>
              <Image
                width={1200}
                height={800}
                src={selectedImage}
                alt='Imagem ampliada'
                className='max-w-full max-h-full object-contain rounded-lg'
              />
              <Button
                variant='secondary'
                size='sm'
                className='absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 text-gray-800 hover:bg-white border-0 text-sm sm:text-base'
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
