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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Trophy, Users } from 'lucide-react';

const Cronograma = () => {
  const [selectedDay, setSelectedDay] = useState('dia1');

  const cronogramaDias = [
    {
      id: 'dia1',
      data: '15/12/2024',
      titulo: 'Primeiro Dia',
      descricao: 'Cerimônia de Abertura e Eliminatórias',
      eventos: [
        {
          horario: '08:00',
          modalidade: 'Cerimônia de Abertura',
          tipo: 'cerimonia',
          local: 'Arena Principal',
          status: 'agendado',
          participantes: 'Todos os atletas',
        },
        {
          horario: '09:30',
          modalidade: 'Futebol - Fase de Grupos',
          tipo: 'jogo',
          local: 'Campo 1',
          status: 'agendado',
          participantes: 'Grupo A vs Grupo B',
        },
        {
          horario: '11:00',
          modalidade: 'Basquete - Eliminatórias',
          tipo: 'jogo',
          local: 'Quadra 1',
          status: 'agendado',
          participantes: 'Equipes 1-4',
        },
        {
          horario: '14:00',
          modalidade: 'Vôlei - Fase de Grupos',
          tipo: 'jogo',
          local: 'Quadra 2',
          status: 'agendado',
          participantes: 'Chaves A e B',
        },
        {
          horario: '16:00',
          modalidade: 'Atletismo - 100m',
          tipo: 'prova',
          local: 'Pista de Atletismo',
          status: 'agendado',
          participantes: 'Classificatórias',
        },
        {
          horario: '18:00',
          modalidade: 'Congresso Técnico',
          tipo: 'congresso',
          local: 'Auditório',
          status: 'agendado',
          participantes: 'Técnicos e Dirigentes',
        },
      ],
    },
    {
      id: 'dia2',
      data: '16/12/2024',
      titulo: 'Segundo Dia',
      descricao: 'Semifinais e Provas Técnicas',
      eventos: [
        {
          horario: '08:30',
          modalidade: 'Natação - 50m Livre',
          tipo: 'prova',
          local: 'Piscina Olímpica',
          status: 'agendado',
          participantes: 'Finais',
        },
        {
          horario: '10:00',
          modalidade: 'Tênis - Semifinais',
          tipo: 'jogo',
          local: 'Quadras de Tênis',
          status: 'agendado',
          participantes: '4 melhores',
        },
        {
          horario: '11:30',
          modalidade: 'Futsal - Semifinais',
          tipo: 'jogo',
          local: 'Ginásio',
          status: 'em_andamento',
          participantes: 'Semi A vs Semi B',
        },
        {
          horario: '14:00',
          modalidade: 'Judô - Finais',
          tipo: 'luta',
          local: 'Tatame',
          status: 'finalizado',
          participantes: 'Finalistas por categoria',
          resultado: 'Ouro: João Silva, Prata: Maria Santos',
        },
        {
          horario: '16:00',
          modalidade: 'Ciclismo - 20km',
          tipo: 'prova',
          local: 'Circuito Urbano',
          status: 'agendado',
          participantes: 'Pelotão geral',
        },
        {
          horario: '19:00',
          modalidade: 'Handebol - Final Feminina',
          tipo: 'jogo',
          local: 'Arena Principal',
          status: 'agendado',
          participantes: 'Equipe A vs Equipe B',
        },
      ],
    },
    {
      id: 'dia3',
      data: '17/12/2024',
      titulo: 'Terceiro Dia',
      descricao: 'Grandes Finais e Encerramento',
      eventos: [
        {
          horario: '09:00',
          modalidade: 'Corrida 10km',
          tipo: 'prova',
          local: 'Circuito da Cidade',
          status: 'agendado',
          participantes: 'Categorias masculina e feminina',
        },
        {
          horario: '11:00',
          modalidade: 'Futebol - Final',
          tipo: 'final',
          local: 'Estádio Principal',
          status: 'agendado',
          participantes: 'Finalistas',
        },
        {
          horario: '14:00',
          modalidade: 'Basquete - Final',
          tipo: 'final',
          local: 'Arena Principal',
          status: 'agendado',
          participantes: 'Finalistas',
        },
        {
          horario: '16:00',
          modalidade: 'Vôlei - Final',
          tipo: 'final',
          local: 'Quadra Central',
          status: 'agendado',
          participantes: 'Finalistas',
        },
        {
          horario: '18:00',
          modalidade: 'Cerimônia de Encerramento',
          tipo: 'cerimonia',
          local: 'Arena Principal',
          status: 'agendado',
          participantes: 'Premiação geral',
        },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finalizado':
        return (
          <Badge variant="secondary" className="bg-success">
            Finalizado
          </Badge>
        );
      case 'em_andamento':
        return (
          <Badge variant="secondary" className="bg-accent animate-pulse">
            Em Andamento
          </Badge>
        );
      case 'agendado':
        return <Badge variant="secondary">Agendado</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'cerimonia':
        return <Trophy className="h-4 w-4" />;
      case 'final':
        return <Trophy className="h-4 w-4 text-accent" />;
      case 'congresso':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Cronograma do Evento
          </h1>
          <p className="text-lg text-muted-foreground">
            Confira os horários de todas as modalidades e não perca nenhum
            momento!
          </p>
        </div>

        {/* Informações Gerais */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">15-17 Dezembro</h3>
              <p className="text-sm text-muted-foreground">
                3 dias de competições
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">8h às 20h</h3>
              <p className="text-sm text-muted-foreground">
                Horário de funcionamento
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Centro Esportivo</h3>
              <p className="text-sm text-muted-foreground">Local principal</p>
            </CardContent>
          </Card>
        </div>

        {/* Cronograma por Dias */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">Programação Detalhada</CardTitle>
            <CardDescription>
              Selecione o dia para ver a programação completa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedDay} onValueChange={setSelectedDay}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                {cronogramaDias.map((dia) => (
                  <TabsTrigger
                    key={dia.id}
                    value={dia.id}
                    className="flex flex-col"
                  >
                    <span className="font-semibold">{dia.titulo}</span>
                    <span className="text-xs">{dia.data}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {cronogramaDias.map((dia) => (
                <TabsContent key={dia.id} value={dia.id} className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-primary">
                      {dia.titulo}
                    </h3>
                    <p className="text-muted-foreground">{dia.descricao}</p>
                  </div>

                  <div className="space-y-3">
                    {dia.eventos.map((evento, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-primary transition-smooth"
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center min-w-[80px]">
                                <div className="text-lg font-bold text-primary">
                                  {evento.horario}
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  {getTipoIcon(evento.tipo)}
                                </div>
                              </div>

                              <div className="flex-1">
                                <h4 className="font-semibold text-lg mb-1">
                                  {evento.modalidade}
                                </h4>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {evento.local}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {evento.participantes}
                                  </div>
                                  {evento.resultado && (
                                    <div className="text-success font-medium">
                                      🏆 {evento.resultado}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(evento.status)}
                              {evento.tipo === 'congresso' && (
                                <Button variant="outline" size="sm">
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

        {/* Congressos Técnicos */}
        <Card className="mt-8 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Congressos Técnicos
            </CardTitle>
            <CardDescription>
              Reuniões importantes para técnicos e dirigentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold">Congresso Técnico - Dia 1</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  15/12/2024 às 18:00 - Auditório Principal
                </p>
                <div className="text-sm">
                  <strong>Pauta:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Apresentação das regras gerais</li>
                    <li>Sorteio das chaves e grupos</li>
                    <li>Orientações sobre cronograma</li>
                    <li>Esclarecimentos sobre arbitragem</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h4 className="font-semibold">Reunião de Resultados - Dia 2</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  16/12/2024 às 20:30 - Sala de Imprensa
                </p>
                <div className="text-sm">
                  <strong>Pauta:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Divulgação dos resultados do dia</li>
                    <li>Definição das finais</li>
                    <li>Ajustes no cronograma final</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cronograma;
