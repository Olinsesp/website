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
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Trophy,
  Users,
  CalendarDays,
  Timer,
  LocateIcon,
  Award,
} from 'lucide-react';

interface Evento {
  id: string;
  atividade: string;
  inicio: string;
  fim: string;
  detalhes?: string | null;
  horario?: string;
  tipo?: string;
  local?: string;
  status?: 'agendado' | 'em_andamento' | 'finalizado';
  participantes?: string;
  modalidade?: string;
  resultado?: string;
}

interface DiaCronograma {
  id: string;
  data: string;
  titulo: string;
  descricao: string;
  eventos: Evento[];
}

const fetchCronograma = async (): Promise<Evento[]> => {
  const res = await fetch('/api/cronograma');
  if (!res.ok) {
    throw new Error('Falha ao buscar dados do cronograma');
  }
  return res.json();
};

export default function Cronograma() {
  const {
    data: eventos,
    isLoading,
    isError,
    error,
  } = useQuery<Evento[]>({
    queryKey: ['cronograma'],
    queryFn: fetchCronograma,
  });

  const cronogramaDias = useMemo(() => {
    if (!eventos) return [];

    const groupedByDay = eventos.reduce(
      (acc, evento) => {
        const data = new Date(evento.inicio).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        if (!acc[data]) {
          acc[data] = {
            id: `dia-${Object.keys(acc).length + 1}`,
            data,
            titulo: `Dia ${Object.keys(acc).length + 1}`,
            descricao: `Eventos do dia ${data}`,
            eventos: [],
          };
        }
        acc[data].eventos.push({
          ...evento,
          horario: new Date(evento.inicio).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          tipo: evento.atividade.includes('Cerimônia') ? 'cerimonia' : 'jogo',
          local: evento.detalhes || 'A definir',
          status: 'agendado',
          participantes: 'Consulte detalhes',
        });
        return acc;
      },
      {} as Record<string, DiaCronograma>,
    );

    return Object.values(groupedByDay);
  }, [eventos]);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'finalizado':
        return (
          <Badge className='bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1'>
            <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
            Finalizado
          </Badge>
        );
      case 'em_andamento':
        return (
          <Badge className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-3 py-1 animate-pulse'>
            <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
            Em Andamento
          </Badge>
        );
      case 'agendado':
        return (
          <Badge className='bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-3 py-1'>
            <div className='w-2 h-2 bg-white rounded-full mr-2'></div>
            Agendado
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

  const getTipoIcon = (tipo: string | undefined) => {
    switch (tipo) {
      case 'cerimonia':
        return <Award className='h-5 w-5 text-yellow-500' />;
      case 'final':
        return <Trophy className='h-5 w-5 text-yellow-500' />;
      case 'congresso':
        return <Users className='h-5 w-5 text-blue-500' />;
      default:
        return <Calendar className='h-5 w-5 text-blue-500' />;
    }
  };

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-orange-50'>
        <div className='text-center'>
          <Loader2 className='inline-block h-12 w-12 animate-spin text-blue-600 mb-4' />
          <p className='text-lg text-gray-600'>Carregando cronograma...</p>
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
            <CalendarDays className='h-4 w-4' />
            Programação Atualizada
          </div>

          <h1 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent'>
            Cronograma do Evento
          </h1>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Confira os horários de todas as modalidades e não perca nenhum
            momento desta competição única!
          </p>
        </div>

        {/* Cards Informativos */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12'>
          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center'>
                <Calendar className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                15-17 Dezembro
              </h3>
              <p className='text-gray-600'>3 dias de competições intensas</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center'>
                <Timer className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                8h às 20h
              </h3>
              <p className='text-gray-600'>Horário de funcionamento</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center'>
                <LocateIcon className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                Centro Esportivo
              </h3>
              <p className='text-gray-600'>Local principal do evento</p>
            </CardContent>
          </Card>
        </div>

        {/* Cronograma Principal */}
        <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-2xl'>
          <CardHeader className='text-center pb-6'>
            <div className='h-20 w-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center'>
              <CalendarDays className='h-10 w-10 text-white' />
            </div>
            <CardTitle className='text-3xl text-gray-800'>
              Programação Detalhada
            </CardTitle>
            <CardDescription className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Navegue pelos dias para ver a programação completa de cada
              modalidade
            </CardDescription>
          </CardHeader>

          <CardContent className='p-8'>
            {cronogramaDias.length > 0 ? (
              <>
                {/* Navegação entre dias */}
                <div className='flex items-center justify-between mb-8'>
                  <Button
                    onClick={() => setCurrentDayIndex(currentDayIndex - 1)}
                    disabled={currentDayIndex === 0}
                    variant='outline'
                    className='border-2 border-gray-200 hover:border-blue-300 transition-colors px-6 py-3'
                  >
                    <ChevronLeft className='h-5 w-5 mr-2' />
                    Dia Anterior
                  </Button>

                  <div className='text-center'>
                    <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                      {cronogramaDias[currentDayIndex].titulo}
                    </h3>
                    <p className='text-gray-600 font-medium'>
                      {cronogramaDias[currentDayIndex].data}
                    </p>
                  </div>

                  <Button
                    onClick={() => setCurrentDayIndex(currentDayIndex + 1)}
                    disabled={currentDayIndex === cronogramaDias.length - 1}
                    variant='outline'
                    className='border-2 border-gray-200 hover:border-blue-300 transition-colors px-6 py-3'
                  >
                    Próximo Dia
                    <ChevronRight className='h-5 w-5 ml-2' />
                  </Button>
                </div>

                {/* Lista de eventos */}
                <div className='space-y-4'>
                  {cronogramaDias[currentDayIndex].eventos.map(
                    (evento, index) => (
                      <Card
                        key={index}
                        className='hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-r from-gray-50 to-white shadow-lg hover:shadow-blue-500/10'
                      >
                        <CardContent className='p-6'>
                          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
                            {/* Informações principais */}
                            <div className='flex items-start gap-6 flex-1'>
                              {/* Horário e ícone */}
                              <div className='flex flex-col items-center min-w-[100px]'>
                                <div className='text-2xl font-bold text-blue-600 mb-2'>
                                  {evento.horario}
                                </div>
                                <div className='flex items-center gap-2 text-gray-500'>
                                  {getTipoIcon(evento.tipo)}
                                  <span className='text-sm font-medium'>
                                    {evento.modalidade}
                                  </span>
                                </div>
                              </div>

                              {/* Detalhes do evento */}
                              <div className='flex-1'>
                                <h4 className='font-semibold text-xl mb-3 text-gray-800'>
                                  {evento.atividade}
                                </h4>

                                <div className='space-y-2'>
                                  <div className='flex items-center gap-2 text-gray-600'>
                                    <MapPin className='h-4 w-4 text-blue-500' />
                                    <span className='font-medium'>
                                      {evento.local}
                                    </span>
                                  </div>

                                  <div className='flex items-center gap-2 text-gray-600'>
                                    <Users className='h-4 w-4 text-green-500' />
                                    <span>{evento.participantes}</span>
                                  </div>

                                  {evento.resultado && (
                                    <div className='flex items-center gap-2 text-green-600 font-semibold'>
                                      <Trophy className='h-4 w-4' />
                                      🏆 {evento.resultado}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Status e ações */}
                            <div className='flex flex-col items-end gap-4'>
                              {getStatusBadge(evento.status)}

                              {evento.tipo === 'congresso' && (
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors'
                                >
                                  Ver Pauta
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              </>
            ) : (
              <div className='text-center py-12'>
                <Calendar className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-gray-600 mb-2'>
                  Nenhum evento agendado
                </h3>
                <p className='text-gray-500'>
                  Os eventos serão divulgados em breve.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
