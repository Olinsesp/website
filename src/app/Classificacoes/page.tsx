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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Medal, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AfiliacaoStanding {
  rank: number;
  name: string;
  gold: number;
  silver: number;
  bronze: number;
  points: number;
}

interface ModalidadeResult {
  rank: number;
  name: string;
  affiliation: string;
}

interface ClassificacoesData {
  byAfiliacao: AfiliacaoStanding[];
  byModalidade: ModalidadeResult[];
}

const fetchClassificacoes = async (): Promise<ClassificacoesData> => {
  const res = await fetch('/api/classificacoes');
  if (!res.ok) {
    throw new Error('Falha ao buscar classificações');
  }
  return res.json();
};

export default function ClassificacoesPage() {
  const {
    data: classificacoes,
    isLoading,
    isError,
    error,
  } = useQuery<ClassificacoesData>({
    queryKey: ['classificacoes'],
    queryFn: fetchClassificacoes,
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='inline-block h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='container mx-auto px-4 py-8 text-center text-red-500'>
        Erro ao carregar classificações: {error.message}
      </div>
    );
  }

  return (
    <div className='min-h-screen py-8'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent'>
            Quadro de Medalhas
          </h1>
          <p className='text-base md:text-lg text-muted-foreground'>
            Acompanhe a classificação geral e os resultados por modalidade.
          </p>
        </div>

        <Tabs defaultValue='geral' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 gap-2'>
            <TabsTrigger
              className='border-b-8 border-zinc-300 cursor-pointer data-[state=active]:border-zinc-600 transition-colors'
              value='geral'
            >
              Classificação Geral
            </TabsTrigger>
            <TabsTrigger
              className='border-b-8 border-zinc-300 cursor-pointer data-[state=active]:border-zinc-600 transition-colors'
              value='modalidade'
            >
              Resultados por Modalidade
            </TabsTrigger>
          </TabsList>

          <TabsContent value='geral'>
            <Card className='bg-gradient-card shadow-card'>
              <CardHeader>
                <CardTitle>Classificação Geral por Afiliação</CardTitle>
                <CardDescription>
                  Pontuação: Ouro (5), Prata (3), Bronze (1).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[80px]'>Posição</TableHead>
                      <TableHead>Afiliação</TableHead>
                      <TableHead className='text-center'>Medalhas</TableHead>
                      <TableHead className='text-right'>Pontuação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classificacoes?.byAfiliacao.map((item) => (
                      <TableRow key={item.rank}>
                        <TableCell className='font-bold text-lg'>
                          {item.rank}°
                        </TableCell>
                        <TableCell className='font-medium'>
                          {item.name}
                        </TableCell>
                        <TableCell className='text-center'>
                          <div className='flex items-center justify-center gap-2'>
                            <Badge
                              variant='gold'
                              className='flex items-center gap-1'
                            >
                              <Medal className='h-4 w-4' /> {item.gold}
                            </Badge>
                            <Badge
                              variant='silver'
                              className='flex items-center gap-1'
                            >
                              <Medal className='h-4 w-4' /> {item.silver}
                            </Badge>
                            <Badge
                              variant='bronze'
                              className='flex items-center gap-1'
                            >
                              <Medal className='h-4 w-4' /> {item.bronze}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className='text-right font-bold'>
                          {item.points}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='modalidade'>
            <Card className='bg-gradient-card shadow-card'>
              <CardHeader>
                <CardTitle>Campeões por Modalidade</CardTitle>
                <CardDescription>
                  Resultados finais de cada modalidade.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Modalidade</TableHead>
                      <TableHead>Campeão</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classificacoes?.byModalidade.map((item) => (
                      <TableRow key={item.rank}>
                        <TableCell className='font-medium'>
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Trophy className='h-5 w-5 text-yellow-500' />
                            <span className='font-medium'>
                              {item.affiliation}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
