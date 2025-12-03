'use client';
import { useState } from 'react';
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
import { generatePDF } from '@/lib/pdf-utils';
import ClassificacoesFilters from '@/components/classificacoes/ClassificacoesFilters';
import MedalTable from '@/components/classificacoes/MedalTable';
import AthleteResultCard from '@/components/classificacoes/AthleteResultCard';
import TeamResultCard from '@/components/classificacoes/TeamResultCard';
import { ClassificacoesResponse } from '@/types/api';
import QueryStateHandler from '@/components/ui/query-state-handler';

const fetchClassificacoes = async (
  tipo?: 'atletas' | 'equipes',
  modalidade?: string | null,
  categoria?: string | null,
  lotacao?: string | null,
): Promise<ClassificacoesResponse> => {
  const params = new URLSearchParams();
  if (tipo) params.append('tipo', tipo);
  if (modalidade) params.append('modalidade', modalidade);
  if (categoria) params.append('categoria', categoria);
  if (lotacao) params.append('lotacao', lotacao);
  params.append('estatisticas', 'true');
  params.append('medalhas', 'true');
  params.append('filtros', 'true');

  const res = await fetch(`/api/classificacoes?${params.toString()}`);
  if (!res.ok) throw new Error('Falha ao buscar classificações');
  return res.json();
};

export default function Classificacoes() {
  const [modalidade, setModalidade] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<string | null>(null);
  const [lotacao, setLotacao] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'atletas' | 'equipes'>('atletas');

  const {
    data: dadosCompletos,
    isLoading: isLoadingCompletos,
    isError: isErrorCompletos,
    error: errorCompletos,
  } = useQuery<ClassificacoesResponse>({
    queryKey: ['classificacoes', 'completos'],
    queryFn: () => fetchClassificacoes(),
  });

  const {
    data: dadosFiltrados,
    isLoading: isLoadingFiltrados,
    isError: isErrorFiltrados,
    error: errorFiltrados,
  } = useQuery<ClassificacoesResponse>({
    queryKey: ['classificacoes', activeTab, modalidade, categoria, lotacao],
    queryFn: () =>
      fetchClassificacoes(activeTab, modalidade, categoria, lotacao),
    enabled: !!dadosCompletos,
  });

  const dadosAtuais = dadosFiltrados || dadosCompletos;
  const isLoading = isLoadingCompletos || isLoadingFiltrados;
  const isError = isErrorCompletos || isErrorFiltrados;
  const error = errorCompletos || errorFiltrados;

  const classificacoes = dadosAtuais?.dados || [];
  const quadroMedalhas = dadosAtuais?.quadroMedalhas || [];
  const estatisticas = dadosAtuais?.estatisticas;
  const filtros = dadosAtuais?.filtros;

  const modalidades = filtros?.modalidades || [];
  const categorias = filtros?.categorias || [];
  const lotacoes = filtros?.lotacoes || [];

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
      <div className='min-h-screen py-12'>
        <div className='container mx-auto px-4'>
          {/* Header da Página */}
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 bg-azul-olinsesp text-white px-6 py-3 rounded-full text-sm font-medium mb-6'>
              <Trophy className='h-4 w-4' />
              Resultados Atualizados
            </div>
            <div className='backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl'>
              <h1 className='text-4xl md:text-5xl font-extrabold mb-6 bg-azul-olinsesp bg-clip-text text-transparent'>
                Classificações
              </h1>
              <p className='text-2xl md:text-xl font-extrabold text-gray-950 max-w-3xl mx-auto leading-relaxed'>
                Acompanhe em tempo real os resultados dos atletas e equipes em
                todas as modalidades do VIII Olinsesp
              </p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12'>
            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-azul-olinsesp rounded-2xl flex items-center justify-center'>
                  <Crown className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {estatisticas?.totalCampeoes || 0}
                </h3>
                <p className='text-xs sm:text-sm lg:text-base text-gray-600'>
                  Campeões
                </p>
              </CardContent>
            </Card>

            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-azul-olinsesp rounded-2xl flex items-center justify-center'>
                  <Trophy className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {estatisticas?.totalModalidades || 0}
                </h3>
                <p className='text-xs sm:text-sm lg:text-base text-gray-600'>
                  Modalidades
                </p>
              </CardContent>
            </Card>

            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-azul-olinsesp rounded-2xl flex items-center justify-center'>
                  <Users className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {estatisticas?.totalClassificacoes || 0}
                </h3>
                <p className='text-xs sm:text-sm lg:text-base text-gray-600'>
                  Classificações
                </p>
              </CardContent>
            </Card>

            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-azul-olinsesp rounded-2xl flex items-center justify-center'>
                  <TrendingUp className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {estatisticas?.totalLotacoes || 0}
                </h3>
                <p className='text-xs sm:text-sm lg:text-base text-gray-600'>
                  Forças
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quadro de Medalhas */}
          <MedalTable rows={quadroMedalhas} />

          {/* Filtros e Botão de Exportar PDF */}
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-8 sm:mt-12'>
            <ClassificacoesFilters
              modalidade={modalidade}
              categoria={categoria}
              lotacao={lotacao}
              modalidades={modalidades}
              categorias={categorias}
              lotacoes={lotacoes}
              onChangeModalidade={setModalidade}
              onChangeCategoria={setCategoria}
              onChangeLotacao={setLotacao}
            />
            <Button
              onClick={() =>
                generatePDF(classificacoes, `classificacoes-${activeTab}`)
              }
              className='bg-azul-olinsesp hover:bg-azul-olinsesp/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base'
            >
              <Download className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
              Exportar PDF
            </Button>
          </div>

          {/* Classificações Tabs */}
          <Tabs
            defaultValue='atletas'
            onValueChange={handleTabChange}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2 bg-gray-200/60 p-1 rounded-lg'>
              <TabsTrigger
                value='atletas'
                className='py-2 sm:py-2.5 text-xs sm:text-sm font-semibold leading-5 text-gray-700 rounded-md data-[state=active]:bg-white data-[state=active]:text-azul-olinsesp data-[state=active]:shadow-md transition-all'
              >
                <Users className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4' />
                <span className='hidden sm:inline'>Resultados de Atletas</span>
                <span className='sm:hidden'>Atletas</span>
              </TabsTrigger>
              <TabsTrigger
                value='equipes'
                className='py-2 sm:py-2.5 text-xs sm:text-sm font-semibold leading-5 text-gray-700 rounded-md data-[state=active]:bg-white data-[state=active]:text-azul-olinsesp data-[state=active]:shadow-md transition-all'
              >
                <Shield className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4' />
                <span className='hidden sm:inline'>Resultados de Equipes</span>
                <span className='sm:hidden'>Equipes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value='atletas' className='mt-6 sm:mt-8'>
              <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-2xl'>
                <CardHeader className='text-center pb-4 sm:pb-6 px-4 sm:px-6'>
                  <div className='h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 sm:mb-6 bg-azul-olinsesp rounded-full flex items-center justify-center'>
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
                  {classificacoes.length > 0 ? (
                    <div className='space-y-4'>
                      {classificacoes.map((classificacao) => (
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
                  <div className='h-20 w-20 mx-auto mb-6 bg-rosa-olinsesp rounded-full flex items-center justify-center'>
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
                  {classificacoes.length > 0 ? (
                    <div className='space-y-4'>
                      {classificacoes.map((classificacao) => (
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

          {/* Botão de Compartilhar */}
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-12'>
            <Button
              variant='outline'
              className='border-2 border-laranja-olinsesp text-laranja-olinsesp hover:bg-laranja-olinsesp/10 hover:border-laranja-olinsesp transition-colors px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base'
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
