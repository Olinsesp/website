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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Trophy, Users } from 'lucide-react';

// Definindo a interface para os eventos do cronograma
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

// Função para buscar os dados do cronograma
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
        // Adicionando dados mockados para manter a UI, já que o model não os possui
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

  const [selectedDay, setSelectedDay] = useState('dia1');

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'finalizado':
        return (
          <Badge variant='secondary' className='bg-green-500'>
            Finalizado
          </Badge>
        );
      case 'em_andamento':
        return (
          <Badge variant='secondary' className='bg-yellow-500 animate-pulse'>
            Em Andamento
          </Badge>
        );
      case 'agendado':
        return <Badge variant='secondary'>Agendado</Badge>;
      default:
        return <Badge variant='outline'>-</Badge>;
    }
  };

  const getTipoIcon = (tipo: string | undefined) => {
    switch (tipo) {
      case 'cerimonia':
        return <Trophy className='h-4 w-4' />;
      case 'final':
        return <Trophy className='h-4 w-4 text-yellow-500' />;
      case 'congresso':
        return <Users className='h-4 w-4' />;
      default:
        return <Calendar className='h-4 w-4' />;
    }
  };

  if (isLoading)
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        Carregando cronograma...
      </div>
    );
  if (isError)
    return (
      <div className='container mx-auto px-4 py-8 text-center text-red-500'>
        Erro ao carregar cronograma: {error.message}
      </div>
    );

  return (
    <div className='min-h-screen py-8'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent'>
            Cronograma do Evento
          </h1>
          <p className='text-lg text-muted-foreground'>
            Confira os horários de todas as modalidades e não perca nenhum
            momento!
          </p>
        </div>

        {/* Informações Gerais */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          <Card className='text-center bg-gradient-card shadow-card border border-zinc-300'>
            <CardContent className='p-6'>
              <Calendar className='h-8 w-8 text-blue-500 mx-auto mb-2' />
              <h3 className='font-semibold'>15-17 Dezembro</h3>
              <p className='text-sm text-muted-foreground'>
                3 dias de competições
              </p>
            </CardContent>
          </Card>

          <Card className='text-center bg-gradient-card shadow-card border border-zinc-300'>
            <CardContent className='p-6'>
              <Clock className='h-8 w-8 text-blue-500 mx-auto mb-2' />
              <h3 className='font-semibold'>8h às 20h</h3>
              <p className='text-sm text-muted-foreground'>
                Horário de funcionamento
              </p>
            </CardContent>
          </Card>

          <Card className='text-center bg-gradient-card shadow-card border border-zinc-300'>
            <CardContent className='p-6'>
              <MapPin className='h-8 w-8 text-blue-500 mx-auto mb-2' />
              <h3 className='font-semibold'>Centro Esportivo</h3>
              <p className='text-sm text-muted-foreground'>Local principal</p>
            </CardContent>
          </Card>
        </div>

        {/* Cronograma por Dias */}
        <Card className='bg-gradient-card shadow-card border border-zinc-300'>
          <CardHeader>
            <CardTitle className='text-2xl'>Programação Detalhada</CardTitle>
            <CardDescription>
              Selecione o dia para ver a programação completa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedDay} onValueChange={setSelectedDay}>
              <TabsList className='grid w-full grid-cols-3 mb-6'>
                {cronogramaDias.map((dia) => (
                  <TabsTrigger
                    key={dia.id}
                    value={dia.id}
                    className='flex flex-col'
                  >
                    <span className='font-semibold'>{dia.titulo}</span>
                    <span className='text-xs'>{dia.data}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {cronogramaDias.map((dia) => (
                <TabsContent key={dia.id} value={dia.id} className='space-y-4'>
                  <div className='text-center mb-6'>
                    <h3 className='text-2xl font-bold text-primary'>
                      {dia.titulo}
                    </h3>
                    <p className='text-muted-foreground'>{dia.descricao}</p>
                  </div>

                  <div className='space-y-3'>
                    {dia.eventos.map((evento, index) => (
                      <Card
                        key={index}
                        className='hover:shadow-primary transition-smooth border border-zinc-300'
                      >
                        <CardContent className='p-4'>
                          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                            <div className='flex items-start gap-4'>
                              <div className='flex flex-col items-center min-w-[80px]'>
                                <div className='text-lg font-bold text-primary'>
                                  {evento.horario}
                                </div>
                                <div className='flex items-center gap-1 text-muted-foreground'>
                                  {getTipoIcon(evento.tipo)}
                                </div>
                              </div>

                              <div className='flex-1'>
                                <h4 className='font-semibold text-lg mb-1'>
                                  {evento.modalidade}
                                </h4>
                                <div className='space-y-1 text-sm text-muted-foreground'>
                                  <div className='flex items-center gap-1'>
                                    <MapPin className='h-3 w-3' />
                                    {evento.local}
                                  </div>
                                  <div className='flex items-center gap-1'>
                                    <Users className='h-3 w-3' />
                                    {evento.participantes}
                                  </div>
                                  {evento.resultado && (
                                    <div className='text-green-500 font-medium'>
                                      🏆 {evento.resultado}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className='flex flex-col items-end gap-2'>
                              {getStatusBadge(evento.status)}
                              {evento.tipo === 'congresso' && (
                                <Button variant='outline' size='sm'>
                                  Ver Pauta
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
