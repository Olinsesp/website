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
import { Camera, Video, FileText, Share2, Download, Eye } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';

interface Midia {
  id: string;
  tipo: string; // "imagem", "video", "release"
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

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState<
    string |
    StaticImageData |
    null
  >(null);

  const { data: midias, isLoading, isError, error } = useQuery<Midia[]>({ 
    queryKey: ['midias'], 
    queryFn: fetchMidias 
  });

  const { fotos, videos, releases } = useMemo(() => {
    const fotos = midias?.filter((m) => m.tipo === 'imagem') || [];
    const videos = midias?.filter((m) => m.tipo === 'video') || [];
    const releases = midias?.filter((m) => m.tipo === 'release') || [];
    return { fotos, videos, releases };
  }, [midias]);

  if (isLoading) return <div className="container mx-auto px-4 py-8 text-center">Carregando mídias...</div>;
  if (isError) return <div className="container mx-auto px-4 py-8 text-center text-red-500">Erro ao carregar mídias: {error.message}</div>;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Galeria de Mídias
          </h1>
          <p className="text-lg text-muted-foreground">
            Reviva os melhores momentos através de fotos, vídeos e notícias
            exclusivas
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center bg-gradient-card shadow-card border border-zinc-300">
            <CardContent className="p-6">
              <Camera className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-primary">{fotos.length}+</h3>
              <p className="text-sm text-muted-foreground">Fotos Exclusivas</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-card shadow-card border border-zinc-300">
            <CardContent className="p-6">
              <Video className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-primary">{videos.length}+</h3>
              <p className="text-sm text-muted-foreground">Vídeos HD</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-card shadow-card border border-zinc-300">
            <CardContent className="p-6">
              <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-primary">{releases.length}+</h3>
              <p className="text-sm text-muted-foreground">Releases</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">Conteúdo Multimídia</CardTitle>
            <CardDescription>
              Explore fotos, vídeos e releases do evento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="fotos" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="fotos" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Fotos
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Vídeos
                </TabsTrigger>
                <TabsTrigger
                  value="releases"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Releases
                </TabsTrigger>
              </TabsList>

              {/* Fotos */}
              <TabsContent value="fotos" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fotos.map((foto) => (
                    <Card
                      key={foto.id}
                      className="group cursor-pointer hover:shadow-primary transition-smooth"
                    >
                      <div className="relative overflow-hidden">
                        <Image
                          width={500}
                          height={300}
                          src={foto.url}
                          alt={foto.titulo || 'Foto do evento'}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                          onClick={() => setSelectedImage(foto.url)}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                          <Button variant="secondary" size="sm" onClick={() => setSelectedImage(foto.url)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Ampliada
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-1">{foto.titulo || 'Foto do Evento'}</h4>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">
                            {new Date(foto.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Vídeos */}
              <TabsContent value="videos" className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <Card
                      key={video.id}
                      className="group cursor-pointer hover:shadow-primary transition-smooth"
                    >
                      <div className="relative overflow-hidden">
                        <Image
                          width={500}
                          height={300}
                          src={video.url} // Assuming url is a thumbnail
                          alt={video.titulo || 'Vídeo do evento'}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="lg"
                            className="rounded-full h-16 w-16 p-0"
                            onClick={()=> window.open(video.url, '_blank')}
                          >
                            <Video className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-1">{video.titulo || 'Vídeo do Evento'}</h4>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Releases */}
              <TabsContent value="releases" className="space-y-6">
                <div className="space-y-4">
                  {releases.map((release) => (
                    <Card
                      key={release.id}
                      className="hover:shadow-primary transition-smooth"
                    >
                      <CardContent className="p-6">
                         <h4 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer">
                          {release.titulo}
                        </h4>
                        <p className="text-muted-foreground mb-3">
                          {release.url} 
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Publicado em: {new Date(release.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                          <Button asChild variant="outline" size="sm">
                             <a href={release.url} target="_blank" rel="noopener noreferrer">Ler Mais</a>
                          </Button>
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
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Image
              width={1200}
              height={800}
              src={selectedImage}
              alt="Imagem ampliada"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Galeria;