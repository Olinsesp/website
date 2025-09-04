import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Calendar,
  Camera,
  Trophy,
  Users,
  Clock,
  MapPin,
  FileText,
  ArrowRight,
  Star,
} from 'lucide-react';

import CountdownTimer from '@/components/ui/CountdownTimer';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Inscrições Abertas',
      description:
        'Cadastre-se agora e participe do maior evento esportivo regional!',
      link: '/Inscricoes',
      variant: 'default' as const,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Calendar,
      title: 'Cronograma Completo',
      description:
        'Confira os horários de todas as modalidades e não perca nenhum jogo.',
      link: '/Cronograma',
      variant: 'default' as const,
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Camera,
      title: 'Galeria de Mídias',
      description:
        'Reviva os melhores momentos através de fotos e vídeos exclusivos.',
      link: '/Galeria',
      variant: 'default' as const,
      color: 'from-green-500 to-green-600',
    },
    {
      icon: FileText,
      title: 'Classificações',
      description:
        'Acompanhe as pontuações e veja quem está liderando em cada modalidade.',
      link: '/Classificacoes',
      variant: 'default' as const,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const highlights = [
    {
      icon: Clock,
      title: '3 Dias',
      description: 'de competições intensas',
      color: 'text-blue-600',
    },
    {
      icon: Trophy,
      title: '15+',
      description: 'modalidades esportivas',
      color: 'text-orange-600',
    },
    {
      icon: Users,
      title: '500+',
      description: 'atletas participantes',
      color: 'text-green-600',
    },
    {
      icon: MapPin,
      title: 'Centro',
      description: 'Esportivo',
      color: 'text-purple-600',
    },
  ];

  const quickInfo = [
    {
      Icon: Calendar,
      titulo: 'Período do Evento',
      conteudo: <>15 a 17 de Fevereiro de 2026</>,
    },
    {
      Icon: MapPin,
      titulo: 'Local',
      conteudo: (
        <>
          Centro Esportivo Municipal
          <br />
          Rua dos Esportes, 123
        </>
      ),
    },
    {
      Icon: Clock,
      titulo: 'Horários',
      conteudo: (
        <>
          Das 8h00 às 18h00
          <br />
          Todos os dias
        </>
      ),
    },
  ];

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.3)),url('/sports-hero.jpg')] bg-cover bg-center bg-fixed">
        <div className='text-center z-10 max-w-4xl mx-auto px-4'>
          {/* Badge de Destaque */}
          <div className='inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-bounce'>
            <Star className='h-4 w-4' />
            Evento Oficial 2026
          </div>

          <h1 className='text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-pulse-glow'>
            Olinsesp VIII
          </h1>
          <p className='text-lg sm:text-xl md:text-2xl mb-8 text-white/90 leading-relaxed'>
            O maior evento esportivo de integração das forças de segurança está
            chegando! Garanta sua vaga e faça parte deste grande momento.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
            <Link href='/Inscricoes'>
              <Button
                variant='secondary'
                size='lg'
                className='text-lg px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-400 to-orange-400 text-white border-0 hover:brightness-110 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25'
              >
                <Users className='mr-2 h-5 w-5' />
                Inscrever-se Agora
                <ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />
              </Button>
            </Link>
            <Link href='/Cronograma'>
              <Button
                variant='outline'
                size='lg'
                className='text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20 cursor-pointer backdrop-blur-sm transform hover:scale-105 transition-all duration-300'
              >
                <Calendar className='mr-2 h-5 w-5' />
                Ver Cronograma
              </Button>
            </Link>
          </div>

          {/* Countdown Timer */}
          <div className='bg-black/30 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-white/20 shadow-2xl'>
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className='py-20 bg-gradient-to-br from-blue-50 via-white to-orange-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent'>
              Destaques do Evento
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Uma experiência única que reúne as principais forças de segurança
              em um evento esportivo de excelência
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <Card
                  key={index}
                  className='text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer'
                >
                  <CardContent className='p-8'>
                    <div
                      className={`h-16 w-16 mx-auto mb-6 ${highlight.color} bg-gradient-to-br rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className='h-8 w-8' />
                    </div>
                    <h3 className='text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors'>
                      {highlight.title}
                    </h3>
                    <p className='text-gray-600 leading-relaxed'>
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
              Explore o Evento
            </h2>
            <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
              Descubra todas as funcionalidades e recursos disponíveis para
              tornar sua experiência no Olinsesp VIII inesquecível
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className='group flex flex-col h-full hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-2'
                >
                  <CardHeader className='pb-4 flex flex-col flex-grow items-center text-center'>
                    <div
                      className={`h-16 w-16 mx-auto mb-6 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className='h-8 w-8 text-white' />
                    </div>

                    <CardTitle className='text-xl text-gray-800 group-hover:text-blue-600 transition-colors text-center'>
                      {feature.title}
                    </CardTitle>
                    <CardDescription className='text-gray-600 leading-relaxed text-center'>
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className='text-center pt-0 mt-auto'>
                    <Link href={feature.link}>
                      <Button
                        variant={feature.variant}
                        className={`w-full bg-gradient-to-r ${feature.color} hover:brightness-110 text-white border-0 transform group-hover:scale-105 transition-all duration-300`}
                      >
                        Saiba Mais
                        <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
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
      <section className='py-20 text-white bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 relative overflow-hidden'>
        <div className='container mx-auto px-4 text-center relative z-10'>
          <h2 className='text-4xl md:text-5xl font-bold mb-12'>
            Informações Importantes
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-12'>
            {quickInfo.map(({ Icon, titulo, conteudo }, idx) => (
              <div
                key={idx}
                className='group transform hover:scale-105 transition-transform duration-300 h-full flex'
              >
                <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/30 transition-colors flex flex-col flex-1 justify-between h-full'>
                  <Icon className='h-12 w-12 mx-auto mb-6 text-white' />
                  <h3 className='text-2xl font-semibold mb-4'>{titulo}</h3>
                  <p className='text-lg text-white/90 leading-relaxed'>
                    {conteudo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
