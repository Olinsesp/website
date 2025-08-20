import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, Camera, Trophy, Users, Clock, MapPin } from 'lucide-react';

import CountdownTimer from '@/components/ui/CountdownTimer';
import Link from 'next/link';

export default function Home() {
  // Data de fim das inscrições (exemplo: 30 dias a partir de hoje)
  const inscricoesEndDate = new Date();
  inscricoesEndDate.setDate(inscricoesEndDate.getDate() + 30);
  const features = [
    {
      icon: Users,
      title: 'Inscrições Abertas',
      description:
        'Cadastre-se agora e participe do maior evento esportivo regional!',
      link: '/inscricoes',
      variant: 'default' as const,
    },
    {
      icon: Calendar,
      title: 'Cronograma Completo',
      description:
        'Confira os horários de todas as modalidades e não perca nenhum jogo.',
      link: '/Cronograma',
      variant: 'default' as const,
    },
    {
      icon: Camera,
      title: 'Galeria de Mídias',
      description:
        'Reviva os melhores momentos através de fotos e vídeos exclusivos.',
      link: '/Galeria',
      variant: 'default' as const,
    },
    {
      icon: Trophy,
      title: 'Serviços Completos',
      description:
        'Alimentação, primeiros socorros e muito mais para sua comodidade.',
      link: '/Servicos',
      variant: 'default' as const,
    },
  ];

  const highlights = [
    { icon: Clock, title: '3 Dias', description: 'de competições intensas' },
    { icon: Trophy, title: '15+', description: 'modalidades esportivas' },
    { icon: Users, title: '500+', description: 'atletas participantes' },
    { icon: MapPin, title: 'Centro', description: 'Esportivo Municipal' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.3)),url('/sports-hero.jpg')] bg-cover bg-center bg-fixed">
        <div className="text-center z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-pulse-glow">
            Olinsesp 2026
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            O maior evento esportivo de integração das forças de segurança está
            chegando! Garanta sua vaga e faça parte deste grande momento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/Inscricoes">
              <Button
                variant="secondary"
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-400 to-orange-400 text-white border-0 hover:brightness-110 cursor-pointer"
              >
                <Users className="mr-2 h-5 w-5" />
                Inscrever-se Agora
              </Button>
            </Link>
            <Link href="/Cronograma">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20 cursor-pointer"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Ver Cronograma
              </Button>
            </Link>
          </div>

          {/* Countdown Timer */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <CountdownTimer
              targetDate={inscricoesEndDate}
              title="Inscrições Encerram Em:"
            />
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Destaques do Evento
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <Card
                  key={index}
                  className="text-center p-6 bg-gradient-card shadow-card hover:shadow-primary transition-smooth"
                >
                  <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {highlight.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore o Evento
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-primary transition-smooth cursor-pointer bg-gradient-card"
                >
                  <CardHeader className="text-center">
                    <Icon className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-bounce" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Link href={feature.link}>
                      <Button
                        variant={feature.variant}
                        className="w-full cursor-pointer"
                      >
                        Saiba Mais
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-16 text-white bg-gradient-to-r from-blue-600 via-blue-400 to-orange-400">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Informações Importantes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Calendar className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Período do Evento</h3>
              <p>15 a 17 de Fevereiro de 2026</p>
            </div>
            <div>
              <MapPin className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Local</h3>
              <p>
                Centro Esportivo Municipal
                <br />
                Rua dos Esportes, 123
              </p>
            </div>
            <div>
              <Clock className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Horários</h3>
              <p>
                Das 8h00 às 18h00
                <br />
                Todos os dias
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
