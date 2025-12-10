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
} from 'lucide-react';

import CountdownTimer from '@/components/ui/CountdownTimer';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Inscrições Abertas',
      description:
        'Cadastre-se agora e participe do maior evento esportivo regional!',
      link: '/Inscricoes',
      variant: 'default' as const,
      color: 'bg-azul-olinsesp',
    },
    {
      icon: Calendar,
      title: 'Cronograma Completo',
      description:
        'Confira os horários de todas as modalidades e não perca nenhum jogo.',
      link: '/Cronograma',
      variant: 'default' as const,
      color: 'bg-azul-olinsesp',
    },
    {
      icon: Camera,
      title: 'Galeria de Mídias',
      description:
        'Reviva os melhores momentos através de fotos e vídeos exclusivos.',
      link: '/Galeria',
      variant: 'default' as const,
      color: 'bg-azul-olinsesp',
    },
    {
      icon: FileText,
      title: 'Classificações',
      description:
        'Acompanhe as pontuações e veja quem está liderando em cada modalidade.',
      link: '/Classificacoes',
      variant: 'default' as const,
      color: 'bg-azul-olinsesp',
    },
  ];

  const highlights = [
    {
      icon: Clock,
      title: '36 Dias',
      description: 'de competições intensas',
      color: 'text-azul-olinsesp',
    },
    {
      icon: Trophy,
      title: '19',
      description: 'modalidades esportivas',
      color: 'text-azul-olinsesp',
    },
    {
      icon: Users,
      title: '2000+',
      description: 'atletas participantes',
      color: 'text-azul-olinsesp',
    },
    {
      icon: MapPin,
      title: 'Centro',
      description: 'Esportivo',
      color: 'text-azul-olinsesp',
    },
  ];

  const quickInfo = [
    {
      Icon: Calendar,
      titulo: 'Período do Evento',
      conteudo: <>24/02/2026 a 31/03/2026</>,
    },
    {
      Icon: MapPin,
      titulo: 'Local de abertura',
      conteudo: (
        <>
          Centro Esportivo
          <br />
          Não informado
        </>
      ),
    },
    {
      Icon: Clock,
      titulo: 'Horários',
      conteudo: (
        <>
          Das 8h00 às 21h00
          <br />
          Todos os dias
        </>
      ),
    },
  ];

  return (
    <div className='min-h-screen bg-none'>
      {/* Hero Section */}
      <section className='w-full h-screen relative overflow-hidden m-0 p-0 flex items-center justify-center'>
        <Image
          src='/sports-hero.jpeg'
          alt='hero'
          fill
          className='w-full h-full object-cover object-bottom m-0 p-0 hidden md:block'
          priority
        />
        <Image
          src='/sports-hero-mobile.jpeg'
          alt='hero-mobile'
          fill
          className='w-full h-full object-cover object-bottom m-0 p-0 block md:hidden'
          priority
        />
        <div className='absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center'>
          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12 pt-11 lg:pt-64'>
            <Link href='/Inscricoes'>
              <Button
                variant='secondary'
                size='lg'
                className='text-lg px-8 py-4 bg-verde-olinsesp hover:bg-verde-olinsesp text-white border-0 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-azul-olinsesp'
              >
                <Users className='mr-2 h-5 w-5' />
                Inscrições Abertas
                <ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />
              </Button>
            </Link>
            <Link href='/Cronograma'>
              <Button
                variant='outline'
                size='lg'
                className='text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-azul-olinsesp hover:text-white cursor-pointer backdrop-blur-sm transform hover:scale-105 transition-all duration-300'
              >
                <Calendar className='mr-2 h-5 w-5' />
                Ver Cronograma
              </Button>
            </Link>
          </div>

          {/* Countdown Timer */}
          <div className='text-white backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-white/20 shadow-2xl'>
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16 text-white backdrop-blur-xl rounded-2xl p-6  border border-white/20 shadow-2xl'>
            <h2 className='text-4xl md:text-5xl font-extrabold mb-6 bg-azul-olinsesp bg-clip-text text-transparent'>
              Destaques do Evento
            </h2>
            <p className='text-2xl font-extrabold text-black max-w-2xl mx-auto'>
              Uma experiência única que reúne as principais forças de segurança
              em um evento esportivo de excelência
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <Card
                  key={index}
                  className='text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer'
                >
                  <CardContent className='p-8'>
                    <div
                      className={`h-16 w-16 mx-auto mb-6 ${highlight.color} bg-linear-to-br rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className='h-8 w-8' />
                    </div>
                    <h3 className='text-2xl font-bold text-gray-800 mb-3 group-hover:text-azul-olinsesp transition-colors'>
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
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16 backdrop-blur-xl rounded-2xl p-6  border border-white/20 shadow-2xl'>
            <h2 className='text-4xl md:text-5xl font-extrabold mb-6 bg-azul-olinsesp bg-clip-text text-transparent'>
              Explore o Evento
            </h2>
            <p className='text-2xl font-extrabold text-gray-950 max-w-3xl mx-auto'>
              Descubra todas as funcionalidades e recursos disponíveis para
              tornar sua experiência no VIII Olinsesp inesquecível
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className='group flex flex-col h-full hover:shadow-xl transition-all duration-500 cursor-pointer bg-white border-0 shadow-lg transform hover:-translate-y-2'
                >
                  <CardHeader className='pb-4 flex flex-col grow items-center text-center'>
                    <div
                      className={`h-16 w-16 mx-auto mb-6 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className='h-8 w-8 text-white' />
                    </div>

                    <CardTitle className='text-xl text-gray-800 group-hover:text-azul-olinsesp transition-colors text-center'>
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
                        className={`w-full bg-linear-to-r ${feature.color} hover:brightness-110 text-white border-0 transform group-hover:scale-105 transition-all duration-300`}
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
      <section className='py-20 text-white bg-azul-olinsesp relative overflow-hidden'>
        <div className='container mx-auto px-4 text-center relative z-10'>
          <Image
            src={'/OLINSESP_HORIZONTAL_MONOCROMATICA.png'}
            alt='Logo'
            width={250}
            height={250}
            className='mx-auto mb-4'
          />
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
