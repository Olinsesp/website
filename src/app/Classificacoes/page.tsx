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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Medal,
  Users,
  Target,
  Loader2,
  TrendingUp,
  Award,
  Crown,
  Zap,
  Filter,
  Download,
  Share2,
  Shield,
} from 'lucide-react';
import { generatePDF } from '@/components/pdf-utils';

interface Classificacao {
  id: string;
  modalidade: string;
  categoria: string;
  posicao: number;
  atleta?: string;
  afiliacao: string;
  pontuacao: number;
  tempo?: string;
  distancia?: string;
  observacoes?: string;
}

const fetchClassificacoes = async (): Promise<Classificacao[]> => {
  const res = await fetch('/api/classificacoes');
  if (!res.ok) {
    throw new Error('Falha ao buscar classificações');
  }
  return res.json();
};

export default function Classificacoes() {
  const [modalidade, setModalidade] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<string | null>(null);
  const [afiliacao, setAfiliacao] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'atletas' | 'equipes'>('atletas');

  const {
    data: classificacoes,
    isLoading,
    isError,
    error,
  } = useQuery<Classificacao[]>({
    queryKey: ['classificacoes'],
    queryFn: fetchClassificacoes,
  });

  const { atletas, equipes } = useMemo(() => {
    if (!classificacoes) return { atletas: [], equipes: [] };
    return {
      atletas: classificacoes.filter((c) => c.atleta),
      equipes: classificacoes.filter((c) => !c.atleta),
    };
  }, [classificacoes]);

  const atletasFiltrados = useMemo(() => {
    return atletas.filter((c) => {
      if (modalidade && c.modalidade !== modalidade) return false;
      if (categoria && c.categoria !== categoria) return false;
      if (afiliacao && c.afiliacao !== afiliacao) return false;
      return true;
    });
  }, [atletas, modalidade, categoria, afiliacao]);

  const equipesFiltradas = useMemo(() => {
    return equipes.filter((c) => {
      if (modalidade && c.modalidade !== modalidade) return false;
      if (categoria && c.categoria !== categoria) return false;
      if (afiliacao && c.afiliacao !== afiliacao) return false;
      return true;
    });
  }, [equipes, modalidade, categoria, afiliacao]);

  const modalidades = useMemo(() => {
    if (!classificacoes) return [];
    return [...new Set(classificacoes.map((c) => c.modalidade))];
  }, [classificacoes]);

  const categorias = useMemo(() => {
    if (!classificacoes) return [];
    return [...new Set(classificacoes.map((c) => c.categoria))];
  }, [classificacoes]);

  const afiliacoes = useMemo(() => {
    if (!classificacoes) return [];
    return [...new Set(classificacoes.map((c) => c.afiliacao))];
  }, [classificacoes]);

  const handleTabChange = (value: string) => {
    if (value === 'atletas' || value === 'equipes') {
      setActiveTab(value);
    }
  };

  const getPosicaoBadge = (posicao: number) => {
    switch (posicao) {
      case 1:
        return (
          <Badge className='bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0 px-3 py-1 text-sm font-bold'>
            <Crown className='h-3 w-3 mr-1' />
            1º Lugar
          </Badge>
        );
      case 2:
        return (
          <Badge className='bg-gradient-to-r from-gray-300 to-gray-400 text-white border-0 px-3 py-1 text-sm font-bold'>
            <Medal className='h-3 w-3 mr-1' />
            2º Lugar
          </Badge>
        );
      case 3:
        return (
          <Badge className='bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0 px-3 py-1 text-sm font-bold'>
            <Award className='h-3 w-3 mr-1' />
            3º Lugar
          </Badge>
        );
      default:
        return (
          <Badge variant='outline' className='border-gray-300 text-gray-600'>
            {posicao}º Lugar
          </Badge>
        );
    }
  };

  const getPontuacaoColor = (pontuacao: number) => {
    if (pontuacao >= 90) return 'text-green-600';
    if (pontuacao >= 80) return 'text-blue-600';
    if (pontuacao >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-orange-50'>
        <div className='text-center'>
          <Loader2 className='inline-block h-12 w-12 animate-spin text-blue-600 mb-4' />
          <p className='text-lg text-gray-600'>Carregando classificações...</p>
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
            <p className='text-gray-600 mb-4'>{error.message}</p>
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
            <Trophy className='h-4 w-4' />
            Resultados Atualizados
          </div>

          <h1 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent'>
            Classificações
          </h1>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Acompanhe em tempo real o ranking dos atletas e equipes em todas as
            modalidades do Olinsesp VIII
          </p>
        </div>

        {/* Estatísticas */}
        <div className='grid grid-cols-1 sm:grid-cols-4 gap-8 mb-12'>
          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center'>
                <Crown className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                {classificacoes?.filter((c) => c.posicao === 1).length || 0}
              </h3>
              <p className='text-gray-600'>Campeões</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center'>
                <Trophy className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                {modalidades.length}
              </h3>
              <p className='text-gray-600'>Modalidades</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center'>
                <Users className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                {classificacoes?.length || 0}
              </h3>
              <p className='text-gray-600'>Classificações</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center'>
                <TrendingUp className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                {afiliacoes.length}
              </h3>
              <p className='text-gray-600'>Forças</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8'>
          <CardHeader className='pb-4'>
            <div className='flex items-center gap-2'>
              <Filter className='h-5 w-5 text-blue-600' />
              <CardTitle className='text-xl text-gray-800'>
                Filtros de Busca
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='p-6'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                  Modalidade
                </label>
                <Select
                  value={modalidade ?? 'todos'}
                  onValueChange={(val) =>
                    setModalidade(val === 'todos' ? null : val)
                  }
                >
                  <SelectTrigger className='w-full border-2 border-gray-200 bg-white hover:border-blue-300 transition-colors'>
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
                <label className='text-sm font-medium text-gray-700'>
                  Categoria
                </label>
                <Select
                  value={categoria ?? 'todos'}
                  onValueChange={(val) =>
                    setCategoria(val === 'todos' ? null : val)
                  }
                >
                  <SelectTrigger className='w-full border-2 border-gray-200 bg-white hover:border-blue-300 transition-colors'>
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
                <label className='text-sm font-medium text-gray-700'>
                  Afiliação
                </label>
                <Select
                  value={afiliacao ?? 'todos'}
                  onValueChange={(val) =>
                    setAfiliacao(val === 'todos' ? null : val)
                  }
                >
                  <SelectTrigger className='w-full border-2 border-gray-200 bg-white hover:border-blue-300 transition-colors'>
                    <SelectValue placeholder='Todas as afiliações' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='todos'>Todas as Afiliações</SelectItem>
                    {afiliacoes.map((a) => (
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

        {/* Classificações Tabs */}
        <Tabs
          defaultValue='atletas'
          onValueChange={handleTabChange}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-2 bg-gray-200/60 p-1 rounded-lg'>
            <TabsTrigger
              value='atletas'
              className='py-2.5 text-sm font-semibold leading-5 text-gray-700 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md transition-all'
            >
              <Users className='mr-2 h-4 w-4' />
              Ranking de Atletas
            </TabsTrigger>
            <TabsTrigger
              value='equipes'
              className='py-2.5 text-sm font-semibold leading-5 text-gray-700 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md transition-all'
            >
              <Shield className='mr-2 h-4 w-4' />
              Ranking de Equipes
            </TabsTrigger>
          </TabsList>

          <TabsContent value='atletas' className='mt-8'>
            <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-2xl'>
              <CardHeader className='text-center pb-6'>
                <div className='h-20 w-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center'>
                  <Users className='h-10 w-10 text-white' />
                </div>
                <CardTitle className='text-3xl text-gray-800'>
                  Ranking dos Atletas
                </CardTitle>
                <CardDescription className='text-lg text-gray-600 max-w-2xl mx-auto'>
                  Confira as posições e pontuações dos competidores individuais.
                </CardDescription>
              </CardHeader>

              <CardContent className='p-8'>
                {atletasFiltrados.length > 0 ? (
                  <div className='space-y-4'>
                    {atletasFiltrados.map((classificacao) => (
                      <Card
                        key={classificacao.id}
                        className='hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-r from-gray-50 to-white shadow-lg hover:shadow-blue-500/10'
                      >
                        <CardContent className='p-6'>
                          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
                            <div className='flex items-center gap-6'>
                              <div className='flex flex-col items-center min-w-[80px]'>
                                <div className='text-3xl font-bold text-blue-600 mb-2'>
                                  {classificacao.posicao}º
                                </div>
                                {getPosicaoBadge(classificacao.posicao)}
                              </div>
                              <div className='flex-1'>
                                <h4 className='font-semibold text-xl mb-3 text-gray-800'>
                                  {classificacao.atleta}
                                </h4>
                                <div className='space-y-2'>
                                  <div className='flex items-center gap-2 text-gray-600'>
                                    <Target className='h-4 w-4 text-blue-500' />
                                    <span className='font-medium'>
                                      {classificacao.modalidade}
                                    </span>
                                    <span className='text-gray-400'>•</span>
                                    <span>{classificacao.categoria}</span>
                                  </div>
                                  <div className='flex items-center gap-2 text-gray-600'>
                                    <Users className='h-4 w-4 text-green-500' />
                                    <span>{classificacao.afiliacao}</span>
                                  </div>
                                  {classificacao.tempo && (
                                    <div className='flex items-center gap-2 text-gray-600'>
                                      <Zap className='h-4 w-4 text-orange-500' />
                                      <span>Tempo: {classificacao.tempo}</span>
                                    </div>
                                  )}
                                  {classificacao.distancia && (
                                    <div className='flex items-center gap-2 text-gray-600'>
                                      <Target className='h-4 w-4 text-purple-500' />
                                      <span>
                                        Distância: {classificacao.distancia}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className='flex flex-col items-end gap-4'>
                              <div className='text-right'>
                                <div
                                  className={`text-3xl font-bold ${getPontuacaoColor(classificacao.pontuacao)}`}
                                >
                                  {classificacao.pontuacao}
                                </div>
                                <p className='text-sm text-gray-500'>pontos</p>
                              </div>
                              <div className='flex gap-2'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-8 w-8 p-0 hover:bg-gray-100'
                                >
                                  <Share2 className='h-4 w-4' />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {classificacao.observacoes && (
                            <div className='mt-4 pt-4 border-t border-gray-200'>
                              <p className='text-sm text-gray-600 italic'>
                                💡 {classificacao.observacoes}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-12'>
                    <Trophy className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                    <h3 className='text-xl font-semibold text-gray-600 mb-2'>
                      Nenhuma classificação encontrada
                    </h3>
                    <p className='text-gray-500'>
                      Tente ajustar os filtros de busca.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='equipes' className='mt-8'>
            <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-2xl'>
              <CardHeader className='text-center pb-6'>
                <div className='h-20 w-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center'>
                  <Shield className='h-10 w-10 text-white' />
                </div>
                <CardTitle className='text-3xl text-gray-800'>
                  Ranking das Equipes
                </CardTitle>
                <CardDescription className='text-lg text-gray-600 max-w-2xl mx-auto'>
                  Confira as posições e pontuações das equipes nas modalidades
                  coletivas.
                </CardDescription>
              </CardHeader>

              <CardContent className='p-8'>
                {equipesFiltradas.length > 0 ? (
                  <div className='space-y-4'>
                    {equipesFiltradas.map((classificacao) => (
                      <Card
                        key={classificacao.id}
                        className='hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-r from-gray-50 to-white shadow-lg hover:shadow-purple-500/10'
                      >
                        <CardContent className='p-6'>
                          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
                            <div className='flex items-center gap-6'>
                              <div className='flex flex-col items-center min-w-[80px]'>
                                <div className='text-3xl font-bold text-purple-600 mb-2'>
                                  {classificacao.posicao}º
                                </div>
                                {getPosicaoBadge(classificacao.posicao)}
                              </div>
                              <div className='flex-1'>
                                <h4 className='font-semibold text-xl mb-3 text-gray-800'>
                                  {classificacao.afiliacao}
                                </h4>
                                <div className='space-y-2'>
                                  <div className='flex items-center gap-2 text-gray-600'>
                                    <Trophy className='h-4 w-4 text-purple-500' />
                                    <span className='font-medium'>
                                      {classificacao.modalidade}
                                    </span>
                                    <span className='text-gray-400'>•</span>
                                    <span>{classificacao.categoria}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='flex flex-col items-end gap-4'>
                              <div className='text-right'>
                                <div
                                  className={`text-3xl font-bold ${getPontuacaoColor(classificacao.pontuacao)}`}
                                >
                                  {classificacao.pontuacao}
                                </div>
                                <p className='text-sm text-gray-500'>pontos</p>
                              </div>
                              <div className='flex gap-2'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-8 w-8 p-0 hover:bg-gray-100'
                                >
                                  <Share2 className='h-4 w-4' />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {classificacao.observacoes && (
                            <div className='mt-4 pt-4 border-t border-gray-200'>
                              <p className='text-sm text-gray-600 italic'>
                                💡 {classificacao.observacoes}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-12'>
                    <Shield className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                    <h3 className='text-xl font-semibold text-gray-600 mb-2'>
                      Nenhuma classificação de equipe encontrada
                    </h3>
                    <p className='text-gray-500'>
                      Tente ajustar os filtros de busca.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botões de Ação */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center mt-12'>
          <Button
            onClick={() =>
              generatePDF(
                activeTab === 'atletas' ? atletasFiltrados : equipesFiltradas,
                `classificacoes-${activeTab}`,
              )
            }
            className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4'
          >
            <Download className='h-5 w-5 mr-2' />
            Exportar PDF
          </Button>

          <Button
            variant='outline'
            className='border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-colors px-8 py-4'
          >
            <Share2 className='h-5 w-5 mr-2' />
            Compartilhar
          </Button>
        </div>
      </div>
    </div>
  );
}
