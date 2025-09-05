'use client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Users,
  Target,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  Award,
  Star,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  Info,
} from 'lucide-react';

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'inscricoes-abertas':
        return (
          <Badge className='bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1 animate-pulse'>
            <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
            Inscrições Abertas
          </Badge>
        );
      case 'inscricoes-fechadas':
        return (
          <Badge className='bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-3 py-1'>
            <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
            Inscrições Fechadas
          </Badge>
        );
      case 'em-andamento':
        return (
          <Badge className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-3 py-1 animate-pulse'>
            <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
            Em Andamento
          </Badge>
        );
      case 'finalizada':
        return (
          <Badge className='bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-3 py-1'>
            <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
            Finalizada
          </Badge>
        );
      default:
        return (
          <Badge variant='outline' className='border-gray-300 text-gray-600'>
            -
          </Badge>
        );
    }
  };

  const getCategoriaIcon = (categoria?: string) => {
    switch (categoria?.toLowerCase()) {
      case 'coletiva':
        return <Users className='h-5 w-5 text-blue-500' />;
      case 'individual':
        return <Target className='h-5 w-5 text-green-500' />;
      case 'equipe':
        return <Shield className='h-5 w-5 text-purple-500' />;
      case 'resistência':
        return <Zap className='h-5 w-5 text-orange-500' />;
      default:
        return <Activity className='h-5 w-5 text-gray-500' />;
    }
  };

  const getCategoriaColor = (categoria?: string) => {
    switch (categoria?.toLowerCase()) {
      case 'coletiva':
        return 'from-blue-500 to-blue-600';
      case 'individual':
        return 'from-green-500 to-green-600';
      case 'equipe':
        return 'from-purple-500 to-purple-600';
      case 'resistência':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-orange-50'>
        <div className='text-center'>
          <Loader2 className='inline-block h-12 w-12 animate-spin text-blue-600 mb-4' />
          <p className='text-lg text-gray-600'>Carregando modalidades...</p>
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
            Modalidades Disponíveis
          </div>

          <h1 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent'>
            Modalidades Esportivas
          </h1>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Descubra todas as modalidades disponíveis no Olinsesp VIII e escolha
            as que melhor se adequam ao seu perfil
          </p>
        </div>

        {/* Estatísticas */}
        <div className='grid grid-cols-1 sm:grid-cols-4 gap-8 mb-12'>
          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center'>
                <Trophy className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                {modalidades?.length || 0}
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
                {modalidades?.reduce((acc, m) => acc + m.maxParticipantes, 0) ||
                  0}
              </h3>
              <p className='text-gray-600'>Vagas Totais</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center'>
                <TrendingUp className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                {modalidades?.reduce((total, m) => {
                  const vagasDisponiveis =
                    m.maxParticipantes - m.participantesAtuais;
                  return total + Math.max(0, vagasDisponiveis);
                }, 0) || 0}
              </h3>
              <p className='text-gray-600'>Vagas Disponíveis</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center'>
                <Award className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                {modalidades?.reduce(
                  (acc, m) => acc + (m.premios?.length || 0),
                  0,
                ) || 0}
              </h3>
              <p className='text-gray-600'>Prêmios</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Modalidades */}
        <div className='space-y-8'>
          {modalidades?.map((modalidade) => (
            <Card
              key={modalidade.id}
              className='bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden'
            >
              <CardHeader className='pb-6'>
                <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
                  <div className='flex items-start gap-6'>
                    {/* Ícone da Categoria */}
                    <div
                      className={`h-20 w-20 bg-gradient-to-br ${getCategoriaColor(modalidade.categoria)} rounded-2xl flex items-center justify-center flex-shrink-0`}
                    >
                      {getCategoriaIcon(modalidade.categoria)}
                      <div className='h-12 w-12 text-white' />
                    </div>

                    {/* Informações Principais */}
                    <div className='flex-1'>
                      <div className='flex items-center gap-4 mb-4'>
                        <h2 className='text-3xl font-bold text-gray-800'>
                          {modalidade.nome}
                        </h2>
                        {getStatusBadge(modalidade.status)}
                      </div>

                      <p className='text-lg text-gray-600 mb-4 leading-relaxed'>
                        {modalidade.descricao}
                      </p>

                      <div className='flex flex-wrap gap-4 text-sm text-gray-500'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-4 w-4 text-blue-500' />
                          <span>
                            {new Date(modalidade.dataInicio).toLocaleDateString(
                              'pt-BR',
                            )}{' '}
                            -{' '}
                            {new Date(modalidade.dataFim).toLocaleDateString(
                              'pt-BR',
                            )}
                          </span>
                        </div>

                        <div className='flex items-center gap-2'>
                          <MapPin className='h-4 w-4 text-green-500' />
                          <span>{modalidade.local}</span>
                        </div>

                        <div className='flex items-center gap-2'>
                          <Clock className='h-4 w-4 text-orange-500' />
                          <span>{modalidade.horario}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status e Participantes */}
                  <div className='flex flex-col items-end gap-4 lg:min-w-[200px]'>
                    <div className='text-right'>
                      <div className='text-2xl font-bold text-blue-600'>
                        {modalidade.participantesAtuais}/
                        {modalidade.maxParticipantes}
                      </div>
                      <p className='text-sm text-gray-500'>Participantes</p>
                    </div>

                    <div className='w-full bg-gray-200 rounded-full h-2'>
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

              <CardContent className='p-8 pt-0'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                  {/* Regras */}
                  <div>
                    <h3 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                      <Info className='h-5 w-5 text-blue-500' />
                      Regras e Regulamentos
                    </h3>
                    <ul className='space-y-2'>
                      {(modalidade.regras ?? []).map((regra, index) => (
                        <li
                          key={index}
                          className='flex items-start gap-2 text-gray-600'
                        >
                          <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
                          <span>{regra}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prêmios */}
                  <div>
                    <h3 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                      <Star className='h-5 w-5 text-yellow-500' />
                      Prêmios e Reconhecimentos
                    </h3>
                    <ul className='space-y-2'>
                      {(modalidade.premios ?? []).map((premio, index) => (
                        <li
                          key={index}
                          className='flex items-start gap-2 text-gray-600'
                        >
                          <div className='w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0'></div>
                          <span>{premio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className='flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t border-gray-200'>
                  {modalidade.status === 'inscricoes-abertas' ? (
                    <Button className='bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4'>
                      <Users className='h-5 w-5 mr-2' />
                      Inscrever-se
                    </Button>
                  ) : (
                    <Button
                      variant='outline'
                      disabled
                      className='border-2 border-gray-300 text-gray-400 px-8 py-4 cursor-not-allowed'
                    >
                      <Info className='h-5 w-5 mr-2' />
                      Inscrições Fechadas
                    </Button>
                  )}

                  <Button
                    variant='outline'
                    className='border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors px-8 py-4'
                  >
                    <Target className='h-5 w-5 mr-2' />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className='mt-16 bg-gradient-to-r from-blue-600 to-orange-500 text-white border-0 shadow-2xl'>
          <CardContent className='p-12 text-center'>
            <h2 className='text-3xl font-bold mb-4'>
              Pronto para a Competição?
            </h2>
            <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
              Escolha suas modalidades favoritas e faça parte deste evento
              histórico. As inscrições estão abertas para várias modalidades!
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                size='lg'
                className='bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4'
              >
                <Users className='h-5 w-5 mr-2' />
                Ver Inscrições
              </Button>
              <Button
                size='lg'
                variant='ghost'
                className='border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 px-8 py-4'
              >
                <Calendar className='h-5 w-5 mr-2' />
                Ver Cronograma
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
