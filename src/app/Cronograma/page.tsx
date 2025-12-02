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
import { Calendar, CalendarDays, Timer, LocateIcon } from 'lucide-react';
import DayNavigation from '@/components/cronograma/DayNavigation';
import EventCard from '@/components/cronograma/EventCard';
import QueryStateHandler from '@/components/ui/query-state-handler';

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

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isError={isError}
      error={error as Error}
      loadingMessage='Carregando cronograma...'
    >
      <div className='min-h-screen py-12'>
        <div className='container mx-auto px-4'>
          {/* Header da Página */}
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 bg-azul-olinsesp text-white px-6 py-3 rounded-full text-sm font-medium mb-6'>
              <CalendarDays className='h-4 w-4' />
              Programação Atualizada
            </div>

            <h1 className='text-4xl md:text-5xl font-bold mb-6 bg-azul-olinsesp bg-clip-text text-transparent'>
              Cronograma do Evento
            </h1>
            <p className='text-2xl md:text-xl font-medium text-gray-950 max-w-3xl mx-auto leading-relaxed'>
              Confira os horários de todas as modalidades e não perca nenhum
              momento desta competição única!
            </p>
          </div>

          {/* Cards Informativos */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12'>
            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center'>
                  <Calendar className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3'>
                  24/02/2026 a 31/03/2026
                </h3>
                <p className='text-sm sm:text-base text-gray-600'>
                  36 dias de competições intensas
                </p>
              </CardContent>
            </Card>

            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center'>
                  <Timer className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3'>
                  8h às 20h
                </h3>
                <p className='text-sm sm:text-base text-gray-600'>
                  Horário dos jogos
                </p>
              </CardContent>
            </Card>

            <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1'>
              <CardContent className='p-4 sm:p-6 lg:p-8'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center'>
                  <LocateIcon className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
                </div>
                <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3'>
                  Centro Esportivo
                </h3>
                <p className='text-sm sm:text-base text-gray-600'>
                  Local principal do evento
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cronograma Principal */}
          <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-2xl'>
            <CardHeader className='text-center pb-4 sm:pb-6 px-4 sm:px-6'>
              <div className='h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 sm:mb-6 bg-azul-olinsesp rounded-full flex items-center justify-center'>
                <CalendarDays className='h-8 w-8 sm:h-10 sm:w-10 text-white' />
              </div>
              <CardTitle className='text-2xl sm:text-3xl text-gray-800'>
                Programação Detalhada
              </CardTitle>
              <CardDescription className='text-base sm:text-lg text-gray-600 max-w-2xl mx-auto'>
                Navegue pelos dias para ver a programação completa de cada
                modalidade
              </CardDescription>
            </CardHeader>

            <CardContent className='p-4 sm:p-6 lg:p-8'>
              {cronogramaDias.length > 0 ? (
                <>
                  {/* Navegação entre dias */}
                  <DayNavigation
                    title={cronogramaDias[currentDayIndex].titulo}
                    date={cronogramaDias[currentDayIndex].data}
                    canPrev={currentDayIndex !== 0}
                    canNext={currentDayIndex !== cronogramaDias.length - 1}
                    onPrev={() => setCurrentDayIndex(currentDayIndex - 1)}
                    onNext={() => setCurrentDayIndex(currentDayIndex + 1)}
                  />

                  {/* Lista de eventos */}
                  <div className='space-y-4'>
                    {cronogramaDias[currentDayIndex].eventos.map(
                      (evento, index) => (
                        <EventCard key={index} evento={evento} />
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
    </QueryStateHandler>
  );
}
