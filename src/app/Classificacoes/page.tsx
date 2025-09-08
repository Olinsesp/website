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
  Trophy,
  Users,
  TrendingUp,
  Download,
  Share2,
  Shield,
  Crown,
} from 'lucide-react';
import { generatePDF } from '@/components/pdf-utils';
import ClassificacoesFilters from '@/components/classificacoes/ClassificacoesFilters';
import MedalTable from '@/components/classificacoes/MedalTable';
import AthleteResultCard from '@/components/classificacoes/AthleteResultCard';
import TeamResultCard from '@/components/classificacoes/TeamResultCard';
import {
  Classificacao as ClassificacaoType,
  MedalRow as MedalRowType,
} from '@/types/classificacao';
import QueryStateHandler from '@/components/ui/query-state-handler';

const fetchClassificacoes = async (): Promise<ClassificacaoType[]> => {
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
  } = useQuery<ClassificacaoType[]>({
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

  const quadroMedalhas: MedalRowType[] = useMemo(() => {
    if (!classificacoes) return [];

    const filtradas = classificacoes.filter((c) => {
      if (modalidade && c.modalidade !== modalidade) return false;
      if (categoria && c.categoria !== categoria) return false;
      return true;
    });

    const mapa = new Map<string, MedalRowType>();
    for (const c of filtradas) {
      if (c.posicao > 3) continue;
      const atual =
        mapa.get(c.afiliacao) ||
        ({
          afiliacao: c.afiliacao,
          ouro: 0,
          prata: 0,
          bronze: 0,
          total: 0,
        } as MedalRowType);
      if (c.posicao === 1) atual.ouro += 1;
      if (c.posicao === 2) atual.prata += 1;
      if (c.posicao === 3) atual.bronze += 1;
      atual.total = atual.ouro + atual.prata + atual.bronze;
      mapa.set(c.afiliacao, atual);
    }

    return Array.from(mapa.values()).sort((a, b) => {
      if (b.ouro !== a.ouro) return b.ouro - a.ouro;
      if (b.prata !== a.prata) return b.prata - a.prata;
      if (b.bronze !== a.bronze) return b.bronze - a.bronze;
      return b.total - a.total;
    });
  }, [classificacoes, modalidade, categoria]);

  const handleTabChange = (value: string) => {
    if (value === 'atletas' || value === 'equipes') {
      setActiveTab(value);
    }
  };

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingMessage='Carregando classificações...'
    >
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
              Acompanhe em tempo real os resultados dos atletas e equipes em
              todas as modalidades do Olinsesp VIII
            </p>
          </div>

          {/* Estatísticas */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12'>
            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center'>
                  <Crown className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {classificacoes?.filter((c) => c.posicao === 1).length || 0}
                </h3>
                <p className='text-xs sm:text-sm lg:text-base text-gray-600'>
                  Campeões
                </p>
              </CardContent>
            </Card>

            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center'>
                  <Trophy className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {modalidades.length}
                </h3>
                <p className='text-xs sm:text-sm lg:text-base text-gray-600'>
                  Modalidades
                </p>
              </CardContent>
            </Card>

            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center'>
                  <Users className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {classificacoes?.length || 0}
                </h3>
                <p className='text-xs sm:text-sm lg:text-base text-gray-600'>
                  Classificações
                </p>
              </CardContent>
            </Card>

            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center'>
                  <TrendingUp className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {afiliacoes.length}
                </h3>
                <p className='text-xs sm:text-sm lg:text-base text-gray-600'>
                  Forças
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <ClassificacoesFilters
            modalidade={modalidade}
            categoria={categoria}
            afiliacao={afiliacao}
            modalidades={modalidades}
            categorias={categorias}
            afiliacoes={afiliacoes}
            onChangeModalidade={setModalidade}
            onChangeCategoria={setCategoria}
            onChangeAfiliacao={setAfiliacao}
          />

          {/* Quadro de Medalhas */}
          <MedalTable rows={quadroMedalhas} />

          {/* Classificações Tabs */}
          <Tabs
            defaultValue='atletas'
            onValueChange={handleTabChange}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2 bg-gray-200/60 p-1 rounded-lg'>
              <TabsTrigger
                value='atletas'
                className='py-2 sm:py-2.5 text-xs sm:text-sm font-semibold leading-5 text-gray-700 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md transition-all'
              >
                <Users className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4' />
                <span className='hidden sm:inline'>Resultados de Atletas</span>
                <span className='sm:hidden'>Atletas</span>
              </TabsTrigger>
              <TabsTrigger
                value='equipes'
                className='py-2 sm:py-2.5 text-xs sm:text-sm font-semibold leading-5 text-gray-700 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md transition-all'
              >
                <Shield className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4' />
                <span className='hidden sm:inline'>Resultados de Equipes</span>
                <span className='sm:hidden'>Equipes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value='atletas' className='mt-6 sm:mt-8'>
              <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-2xl'>
                <CardHeader className='text-center pb-4 sm:pb-6 px-4 sm:px-6'>
                  <div className='h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center'>
                    <Users className='h-8 w-8 sm:h-10 sm:w-10 text-white' />
                  </div>
                  <CardTitle className='text-2xl sm:text-3xl text-gray-800'>
                    Resultados dos Atletas
                  </CardTitle>
                  <CardDescription className='text-base sm:text-lg text-gray-600 max-w-2xl mx-auto'>
                    Confira as posições e pontuações dos competidores
                    individuais.
                  </CardDescription>
                </CardHeader>

                <CardContent className='p-4 sm:p-6 lg:p-8'>
                  {atletasFiltrados.length > 0 ? (
                    <div className='space-y-4'>
                      {atletasFiltrados.map((classificacao) => (
                        <AthleteResultCard
                          key={classificacao.id}
                          classificacao={classificacao}
                        />
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
                    Resultados das Equipes
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
                        <TeamResultCard
                          key={classificacao.id}
                          classificacao={classificacao}
                        />
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
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-12'>
            <Button
              onClick={() =>
                generatePDF(
                  activeTab === 'atletas' ? atletasFiltrados : equipesFiltradas,
                  `classificacoes-${activeTab}`,
                )
              }
              className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base'
            >
              <Download className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
              Exportar PDF
            </Button>

            <Button
              variant='outline'
              className='border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-colors px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base'
            >
              <Share2 className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>
    </QueryStateHandler>
  );
}
