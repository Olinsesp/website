'use client';
import { useState } from 'react';
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

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState<
    string | StaticImageData | null
  >(null);

  const fotos = [
    {
      id: 1,
      url: '/gallery-1.jpg',
      titulo: 'Final de Futebol',
      descricao: 'Momento emocionante da final de futebol com gol da vitória',
      categoria: 'Futebol',
      data: '16/12/2024',
    },
    {
      id: 2,
      url: '/gallery-2.jpg',
      titulo: 'Basquete em Ação',
      descricao: 'Lance espetacular durante a semifinal de basquete',
      categoria: 'Basquete',
      data: '16/12/2024',
    },
    {
      id: 3,
      url: '/gallery-1.jpg',
      titulo: 'Cerimônia de Abertura',
      descricao: 'Desfile dos atletas na cerimônia de abertura',
      categoria: 'Cerimônias',
      data: '15/12/2024',
    },
    {
      id: 4,
      url: '/gallery-2.jpg',
      titulo: 'Vôlei Feminino',
      descricao: 'Jogada decisiva no vôlei feminino',
      categoria: 'Vôlei',
      data: '15/12/2024',
    },
    {
      id: 5,
      url: '/gallery-1.jpg',
      titulo: 'Atletismo 100m',
      descricao: 'Chegada emocionante dos 100m rasos',
      categoria: 'Atletismo',
      data: '15/12/2024',
    },
    {
      id: 6,
      url: '/gallery-2.jpg',
      titulo: 'Natação',
      descricao: 'Competição de natação 50m livre',
      categoria: 'Natação',
      data: '16/12/2024',
    },
  ];

  const videos = [
    {
      id: 1,
      thumbnail: '/gallery-1.jpg',
      titulo: 'Melhores Momentos - Dia 1',
      descricao: 'Resumo dos principais lances do primeiro dia',
      duracao: '5:32',
      visualizacoes: '1.2K',
    },
    {
      id: 2,
      thumbnail: '/gallery-2.jpg',
      titulo: 'Final de Futebol Completa',
      descricao: 'Transmissão completa da final de futebol',
      duracao: '15:20',
      visualizacoes: '856',
    },
    {
      id: 3,
      thumbnail: '/gallery-1.jpg',
      titulo: 'Cerimônia de Abertura',
      descricao: 'Cerimônia completa de abertura do evento',
      duracao: '12:45',
      visualizacoes: '2.1K',
    },
  ];

  const releases = [
    {
      id: 1,
      titulo: 'SportEvent 2024 Bate Recorde de Participação',
      data: '17/12/2024',
      categoria: 'Notícia',
      resumo:
        'Evento registra mais de 500 atletas inscritos, superando todas as edições anteriores.',
      autor: 'Assessoria de Imprensa',
    },
    {
      id: 2,
      titulo: 'Atleta Local Conquista Ouro no Judô',
      data: '16/12/2024',
      categoria: 'Destaque',
      resumo:
        'João Silva, de apenas 19 anos, vence final do judô categoria até 70kg.',
      autor: 'Redação SportEvent',
    },
    {
      id: 3,
      titulo: 'Programação do Último Dia Confirma Grandes Finais',
      data: '16/12/2024',
      categoria: 'Programação',
      resumo:
        'Domingo promete ser emocionante com as finais das principais modalidades.',
      autor: 'Organização',
    },
    {
      id: 4,
      titulo: 'Resultados Completos do Segundo Dia',
      data: '16/12/2024',
      categoria: 'Resultados',
      resumo:
        'Confira todos os resultados e classificados para as finais de domingo.',
      autor: 'Departamento Técnico',
    },
  ];

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
          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-primary">150+</h3>
              <p className="text-sm text-muted-foreground">Fotos Exclusivas</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <Video className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-primary">25+</h3>
              <p className="text-sm text-muted-foreground">Vídeos HD</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-primary">20+</h3>
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
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Galeria de Fotos</h3>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Todas
                  </Button>
                </div>

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
                          alt={foto.titulo}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                          onClick={() => setSelectedImage(foto.url)}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                          <Button variant="secondary" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Ampliada
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-1">{foto.titulo}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {foto.descricao}
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                            {foto.categoria}
                          </span>
                          <span className="text-muted-foreground">
                            {foto.data}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Baixar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Share2 className="h-3 w-3 mr-1" />
                            Compartilhar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Vídeos */}
              <TabsContent value="videos" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Vídeos do Evento</h3>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Canal Completo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <Card
                      key={video.id}
                      className="group cursor-pointer hover:shadow-primary transition-smooth"
                    >
                      <div className="relative overflow-hidden">
                        <Image
                          src={video.thumbnail}
                          alt={video.titulo}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="lg"
                            className="rounded-full h-16 w-16 p-0"
                          >
                            <Video className="h-6 w-6" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {video.duracao}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-1">{video.titulo}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {video.descricao}
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{video.visualizacoes} visualizações</span>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-3 w-3 mr-1" />
                            Compartilhar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Releases */}
              <TabsContent value="releases" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Releases e Notícias</h3>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Assinar Newsletter
                  </Button>
                </div>

                <div className="space-y-4">
                  {releases.map((release) => (
                    <Card
                      key={release.id}
                      className="hover:shadow-primary transition-smooth"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                              {release.categoria}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {release.data}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <h4 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer">
                          {release.titulo}
                        </h4>
                        <p className="text-muted-foreground mb-3">
                          {release.resumo}
                        </p>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Por: {release.autor}
                          </span>
                          <Button variant="outline" size="sm">
                            Ler Mais
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

        {/* Social Media Integration */}
        <Card className="mt-8 bg-gradient-accent text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Siga nas Redes Sociais</h3>
            <p className="mb-6">
              Acompanhe em tempo real e compartilhe seus momentos favoritos!
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" size="sm">
                📸 Instagram
              </Button>
              <Button variant="secondary" size="sm">
                📱 Facebook
              </Button>
              <Button variant="secondary" size="sm">
                🐦 Twitter
              </Button>
              <Button variant="secondary" size="sm">
                📺 YouTube
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal para imagem ampliada */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Image
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
