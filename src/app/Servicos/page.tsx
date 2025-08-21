'use client';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Heart,
  Utensils,
  Info,
  MapPin,
  Clock,
  Shield,
  Accessibility,
} from 'lucide-react';

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  localizacao: string;
  horario: string;
  createdAt: string;
}

const fetchServicos = async (): Promise<Servico[]> => {
  const res = await fetch('/api/servicos');
  if (!res.ok) {
    throw new Error('Falha ao buscar serviços');
  }
  return res.json();
};

export default function Servicos() {
  const {
    data: servicos,
    isLoading,
    isError,
    error,
  } = useQuery<Servico[]>({
    queryKey: ['servicos'],
    queryFn: fetchServicos,
  });

  if (isLoading)
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        Carregando serviços...
      </div>
    );
  if (isError)
    return (
      <div className='container mx-auto px-4 py-8 text-center text-red-500'>
        Erro ao carregar serviços: {error.message}
      </div>
    );

  return (
    <div className='min-h-screen py-8'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent'>
            Serviços Disponíveis
          </h1>
          <p className='text-lg text-muted-foreground'>
            Conte com uma estrutura completa para sua comodidade e segurança
          </p>
        </div>

        {/* Resumo dos Serviços */}
        <div className='grid md:grid-cols-4 gap-6 mb-8'>
          <Card className='text-center bg-gradient-card shadow-card'>
            <CardContent className='p-6'>
              <Shield className='h-8 w-8 text-primary mx-auto mb-2' />
              <h3 className='font-semibold'>Segurança</h3>
              <p className='text-sm text-muted-foreground'>24h monitorada</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-gradient-card shadow-card'>
            <CardContent className='p-6'>
              <Heart className='h-8 w-8 text-primary mx-auto mb-2' />
              <h3 className='font-semibold'>Saúde</h3>
              <p className='text-sm text-muted-foreground'>
                Atendimento médico
              </p>
            </CardContent>
          </Card>

          <Card className='text-center bg-gradient-card shadow-card'>
            <CardContent className='p-6'>
              <Utensils className='h-8 w-8 text-primary mx-auto mb-2' />
              <h3 className='font-semibold'>Alimentação</h3>
              <p className='text-sm text-muted-foreground'>Múltiplas opções</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-gradient-card shadow-card'>
            <CardContent className='p-6'>
              <Accessibility className='h-8 w-8 text-primary mx-auto mb-2' />
              <h3 className='font-semibold'>Acessibilidade</h3>
              <p className='text-sm text-muted-foreground'>
                Totalmente adaptado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Serviços */}
        <div className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6 mb-8'>
            {servicos?.map((servico) => {
              return (
                <Card
                  key={servico.id}
                  className='hover:shadow-primary transition-smooth bg-gradient-card'
                >
                  <CardHeader>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-primary/10 rounded-lg'>
                          <Info className='h-6 w-6 text-primary' />
                        </div>
                        <div>
                          <CardTitle className='text-xl'>
                            {servico.nome}
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                    <CardDescription className='text-base'>
                      {servico.descricao}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className='space-y-4'>
                    {/* Informações Básicas */}
                    <div className='grid gap-3'>
                      <div className='flex items-center gap-2 text-sm'>
                        <MapPin className='h-4 w-4 text-muted-foreground' />
                        <span>{servico.localizacao}</span>
                      </div>

                      <div className='flex items-center gap-2 text-sm'>
                        <Clock className='h-4 w-4 text-muted-foreground' />
                        <span>{servico.horario}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
