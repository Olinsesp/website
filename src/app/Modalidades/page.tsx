'use client';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Trophy,
  Users,
  FileText,
  Volleyball,
  Waves,
  Swords,
  Footprints,
  BrainCircuit,
  FileDown,
} from 'lucide-react';
import Link from 'next/link';

interface Modalidade {
  id: string;
  nome: string;
  descricao: string;
  editalUrl: string;
  icon: string;
}

const fetchModalidades = async (): Promise<Modalidade[]> => {
  const res = await fetch('/api/modalidades');
  if (!res.ok) {
    throw new Error('Falha ao buscar modalidades');
  }
  return res.json();
};

const getModalidadeIcon = (iconName: string) => {
  switch (iconName) {
    case 'Futbol':
      return <Volleyball className='h-8 w-8 text-primary' />;
    case 'Volleyball':
      return <Volleyball className='h-8 w-8 text-primary' />;
    case 'Waves':
      return <Waves className='h-8 w-8 text-primary' />;
    case 'Swords':
      return <Swords className='h-8 w-8 text-primary' />;
    case 'Run':
      return <Footprints className='h-8 w-8 text-primary' />;
    case 'BrainCircuit':
      return <BrainCircuit className='h-8 w-8 text-primary' />;
    default:
      return <Trophy className='h-8 w-8 text-primary' />;
  }
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

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='inline-block h-6 w-6 animate-spin' />{' '}
      </div>
    );
  if (isError)
    return (
      <div className='container mx-auto px-4 py-8 text-center text-red-500'>
        Erro ao carregar modalidades: {error.message}
      </div>
    );

  return (
    <div className='min-h-screen py-8'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent'>
            Modalidades Esportivas
          </h1>
          <p className='text-base md:text-lg text-muted-foreground'>
            Conheça todas as modalidades da Olinsesp 2026 e acesse os editais
            para mais informações.
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
          <Card className='text-center bg-gradient-card shadow-card border border-zinc-300'>
            <CardContent className='p-6'>
              <Trophy className='h-8 w-8 text-blue-500 mx-auto mb-2' />
              <h3 className='text-2xl font-bold text-primary'>
                {modalidades?.length}+
              </h3>
              <p className='text-sm text-muted-foreground'>Modalidades</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-gradient-card shadow-card border border-zinc-300'>
            <CardContent className='p-6'>
              <Users className='h-8 w-8 text-blue-500 mx-auto mb-2' />
              <h3 className='font-semibold'>Competições</h3>
              <p className='text-sm text-muted-foreground'>
                Individuais e em equipe
              </p>
            </CardContent>
          </Card>

          <Card className='text-center bg-gradient-card shadow-card border border-zinc-300'>
            <CardContent className='p-6'>
              <FileText className='h-8 w-8 text-blue-500 mx-auto mb-2' />
              <h3 className='font-semibold'>Editais Disponíveis</h3>
              <p className='text-sm text-muted-foreground'>
                Regras e informações
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Modalidades */}
        <Card className='bg-gradient-card shadow-card border border-zinc-300'>
          <CardHeader>
            <CardTitle className='text-2xl'>Catálogo de Modalidades</CardTitle>
            <CardDescription>
              Explore as competições e baixe o edital de cada uma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {modalidades?.map((modalidade) => (
                <Card
                  key={modalidade.id}
                  className='flex flex-col justify-between hover:shadow-primary transition-smooth border border-zinc-300'
                >
                  <CardHeader>
                    <div className='flex items-start gap-4'>
                      {getModalidadeIcon(modalidade.icon)}
                      <div className='flex-1'>
                        <CardTitle className='text-xl'>
                          {modalidade.nome}
                        </CardTitle>
                        <CardDescription className='mt-1'>
                          {modalidade.descricao}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className='w-full cursor-pointer'>
                      <Link href={modalidade.editalUrl} target='_blank'>
                        <FileDown className='h-4 w-4 mr-2' />
                        Ver Edital
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
