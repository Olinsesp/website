'use client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Users,
  Target,
  Calendar,
  MapPin,
  Clock,
  Award,
  Star,
  TrendingUp,
  Info,
} from 'lucide-react';
import StatusBadge from '@/components/modalidades/StatusBadge';
import CategoryIcon from '@/components/modalidades/CategoryIcon';
import getCategoryGradient from '@/components/modalidades/CategoryColor';
import QueryStateHandler from '@/components/ui/query-state-handler';
import Image from 'next/image';

interface Modalidade {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  maxParticipantes: number;
  participantesAtuais: number;
  dataInicio: string;
  dataFim: string;
  local: string;
  horario: string;
  regras: string[];
  premios: string[];
  status:
    | 'inscricoes-abertas'
    | 'inscricoes-fechadas'
    | 'em-andamento'
    | 'finalizada';
}

const fetchModalidades = async (): Promise<Modalidade[]> => {
  const res = await fetch('/api/modalidades');
  if (!res.ok) {
    throw new Error('Falha ao buscar modalidades');
  }
  return res.json();
};

export default function Modalidades() {
  const {
    data: modalidades,
    isLoading,
    isError,
    error,
  } = useQuery<Modalidade[]>({
    queryKey: ['modalidades'],
    queryFn: fetchModalidades,
  });

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingMessage='Carregando modalidades...'
    >
      <div className='min-h-screen py-12 bg-gradient-to-br from-blue-50 via-white to-orange-50'>
        <div className='container mx-auto px-4'>
          {/* Header da Página */}
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium mb-6'>
              <Trophy className='h-4 w-4' />
              Modalidades Disponíveis
            </div>

            <h1 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent'>
              Modalidades Esportivas
            </h1>
            <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              Descubra todas as modalidades disponíveis no Olinsesp VIII e
              escolha as que melhor se adequam ao seu perfil
            </p>
          </div>

          {/* Estatísticas */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12'>
            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center'>
                  <Trophy className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {modalidades?.length || 0}
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
                  {modalidades?.reduce(
                    (acc, m) => acc + m.maxParticipantes,
                    0,
                  ) || 0}
                </h3>
                <p className='text-xs sm:text-sm lg:text-base text-gray-600'>
                  Vagas Totais
                </p>
              </CardContent>
            </Card>

            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center'>
                  <TrendingUp className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {modalidades?.reduce((total, m) => {
                    const vagasDisponiveis =
                      m.maxParticipantes - m.participantesAtuais;
                    return total + Math.max(0, vagasDisponiveis);
                  }, 0) || 0}
                </h3>
                <p className='text-xs sm:text-sm lg:text-base text-gray-600'>
                  Vagas Disponíveis
                </p>
              </CardContent>
            </Card>

            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center'>
                  <Award className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2'>
                  {modalidades?.reduce(
                    (acc, m) => acc + (m.premios?.length || 0),
                    0,
                  ) || 0}
                </h3>
                <p className='text-xs sm:text-sm lg:text-base text-gray-600'>
                  Prêmios
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Modalidades */}
          <div className='space-y-6 sm:space-y-8'>
            {modalidades?.map((modalidade) => (
              <Card
                key={modalidade.id}
                className='bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden'
              >
                <CardHeader className='pb-4 sm:pb-6 px-4 sm:px-6'>
                  <div className='flex flex-col gap-4 sm:gap-6'>
                    {/* Header - Ícone, Nome e Status */}
                    <div className='flex items-start gap-4 sm:gap-6'>
                      {/* Ícone da Categoria */}
                      <div
                        className={`h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br ${getCategoryGradient(
                          modalidade.categoria,
                        )} rounded-2xl flex items-center justify-center flex-shrink-0`}
                      >
                        <CategoryIcon categoria={modalidade.categoria} />
                        <div className='h-10 w-10 sm:h-12 sm:w-12 text-white' />
                      </div>

                      {/* Informações Principais */}
                      <div className='flex-1'>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4'>
                          <h2 className='text-2xl sm:text-3xl font-bold text-gray-800'>
                            {modalidade.nome}
                          </h2>
                          <StatusBadge status={modalidade.status} />
                        </div>

                        <p className='text-base sm:text-lg text-gray-600 mb-3 sm:mb-4 leading-relaxed'>
                          {modalidade.descricao}
                        </p>

                        <div className='flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500'>
                          <div className='flex items-center gap-2'>
                            <Calendar className='h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0' />
                            <span>
                              {new Date(
                                modalidade.dataInicio,
                              ).toLocaleDateString('pt-BR')}{' '}
                              -{' '}
                              {new Date(modalidade.dataFim).toLocaleDateString(
                                'pt-BR',
                              )}
                            </span>
                          </div>

                          <div className='flex items-center gap-2'>
                            <MapPin className='h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0' />
                            <span>{modalidade.local}</span>
                          </div>

                          <div className='flex items-center gap-2'>
                            <Clock className='h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0' />
                            <span>{modalidade.horario}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status e Participantes */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                      <div className='flex items-center gap-4'>
                        <div className='text-center sm:text-left'>
                          <div className='text-xl sm:text-2xl font-bold text-blue-600'>
                            {modalidade.participantesAtuais}/
                            {modalidade.maxParticipantes}
                          </div>
                          <p className='text-xs sm:text-sm text-gray-500'>
                            Participantes
                          </p>
                        </div>
                      </div>

                      <div className='w-full sm:w-48 bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500'
                          style={{
                            width: `${(modalidade.participantesAtuais / modalidade.maxParticipantes) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='p-4 sm:p-6 lg:p-8 pt-0'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
                    {/* Regras */}
                    <div>
                      <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2'>
                        <Info className='h-4 w-4 sm:h-5 sm:w-5 text-blue-500' />
                        Regras e Regulamentos
                      </h3>
                      <ul className='space-y-2'>
                        {(modalidade.regras ?? []).map((regra, index) => (
                          <li
                            key={index}
                            className='flex items-start gap-2 text-gray-600 text-sm sm:text-base'
                          >
                            <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
                            <span>{regra}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prêmios */}
                    <div>
                      <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2'>
                        <Star className='h-4 w-4 sm:h-5 sm:w-5 text-yellow-500' />
                        Prêmios e Reconhecimentos
                      </h3>
                      <ul className='space-y-2'>
                        {(modalidade.premios ?? []).map((premio, index) => (
                          <li
                            key={index}
                            className='flex items-start gap-2 text-gray-600 text-sm sm:text-base'
                          >
                            <div className='w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0'></div>
                            <span>{premio}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200'>
                    <Button
                      variant='outline'
                      className='border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base'
                    >
                      <Target className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <Card className='mt-12 sm:mt-16 bg-gradient-to-r from-blue-600 to-orange-500 text-white border-0 shadow-2xl'>
            <CardContent className='p-6 sm:p-8 lg:p-12 text-center'>
              <Image
                src={'/LOGO_OLINSESP.png'}
                alt='Logo'
                width={250}
                height={250}
                className='mx-auto mb-4'
              />
              <h2 className='text-2xl sm:text-3xl font-bold mb-3 sm:mb-4'>
                Pronto para a Competição?
              </h2>
              <p className='text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto'>
                Escolha suas modalidades favoritas e faça parte deste evento
                histórico. As inscrições estão abertas para várias modalidades!
              </p>
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center'>
                <Button
                  size='lg'
                  className='bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base'
                  asChild
                >
                  <a href='/Inscricoes'>
                    <Users className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
                    Ver Inscrições
                  </a>
                </Button>
                <Button
                  size='lg'
                  variant='ghost'
                  className='border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base'
                  asChild
                >
                  <a href='/Cronograma'>
                    <Calendar className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
                    Ver Cronograma
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </QueryStateHandler>
  );
}
