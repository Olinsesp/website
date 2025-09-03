'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Users, Trophy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { useState } from 'react';

const inscricaoSchema = z.object({
  nome: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.email({ message: 'Email inválido.' }),
  telefone: z.string().min(10, { message: 'Telefone inválido.' }),
  cpf: z
    .string()
    .min(11, { message: 'CPF deve ter 11 caracteres.' })
    .max(11, { message: 'CPF deve ter 11 caracteres.' })
    .regex(/^\d+$/, { message: 'CPF deve conter apenas números.' }),
  dataNascimento: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data de nascimento inválida',
  }),
  camiseta: z.string().nonempty('Selecione um tamanho de camiseta.'),
  matricula: z
    .string()
    .min(5, { message: 'Matrícula deve ter ao menos 5 caracteres.' }),
  afiliacao: z.string().optional(),
  modalidades: z
    .array(z.string())
    .min(1, { message: 'Selecione ao menos uma modalidade.' }),
});

type InscricaoFormData = z.infer<typeof inscricaoSchema>;

export default function Inscricoes() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<InscricaoFormData>({
    resolver: zodResolver(inscricaoSchema),
    defaultValues: {
      modalidades: [],
    },
  });
  const modalidadesOptions = [
    'Futebol',
    'Basquete',
    'Vôlei',
    'Tênis',
    'Atletismo',
    'Natação',
    'Futsal',
    'Handebol',
    'Tênis de Mesa',
    'Jiu-jitsu',
    'Ciclismo',
    'Corrida',
    'Xadrez',
  ];

  const onSubmit = async (data: InscricaoFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/inscricoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          dataNascimento: new Date(data.dataNascimento),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Falha ao realizar inscrição.');
      }

      const messageSuccess = (
        <p className='text-black'>
          Sua inscrição foi processada com sucesso. Você receberá um email de
          confirmação em breve.
        </p>
      );
      toast.success('Inscrição Realizada!', {
        description: messageSuccess,
      });
      reset();
    } catch (error: unknown) {
      let message = 'Ocorreu um erro. Tente novamente.';
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error('Erro na Inscrição', {
        description: <p className='text-black'>{message}</p>,
      });
    } finally {
      setLoading(false);
    }
  };

  const watchedModalidades = watch('modalidades');

  return (
    <div className='min-h-screen py-8'>
      <div className='container mx-auto px-4 max-w-4xl'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent'>
            Inscrições Olinsesp VIII
          </h1>
          <p className='text-base md:text-lg text-muted-foreground mb-6'>
            Faça parte do maior evento esportivo da região!
          </p>
          <Card className='max-w-md mx-auto mb-8 bg-gradient-accent text-white'>
            <CardContent className='p-6'>
              <CountdownTimer />
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
          <Card className='text-center bg-gradient-card shadow-card border border-zinc-300'>
            <CardContent className='p-6'>
              <Calendar className='h-8 w-8 text-primary mx-auto mb-2' />
              <h3 className='font-semibold'>Período de Inscrições</h3>
              <p className='text-sm text-muted-foreground'>
                01/11/2026 - 30/11/2026
              </p>
            </CardContent>
          </Card>
          <Card className='text-center bg-gradient-card shadow-card border border-zinc-300'>
            <CardContent className='p-6'>
              <Trophy className='h-8 w-8 text-primary mx-auto mb-2' />
              <h3 className='font-semibold'>15+ Modalidades</h3>
              <p className='text-sm text-muted-foreground'>
                Diversas opções esportivas
              </p>
            </CardContent>
          </Card>
          <Card className='text-center bg-gradient-card shadow-card border border-zinc-300'>
            <CardContent className='p-6'>
              <Users className='h-8 w-8 text-primary mx-auto mb-2' />
              <h3 className='font-semibold'>Inscrição Gratuita</h3>
              <p className='text-sm text-muted-foreground'>
                Sem taxas de participação
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className='bg-gradient-card shadow-card border border-zinc-300'>
          <CardHeader>
            <CardTitle className='text-2xl'>Formulário de Inscrição</CardTitle>
            <CardDescription>
              Preencha todos os campos obrigatórios para garantir sua
              participação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-blue-600'>
                  Dados Pessoais
                </h3>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='nome'>Nome Completo *</Label>
                    <Input
                      id='nome'
                      {...register('nome')}
                      className='border border-zinc-300'
                    />
                    {errors.nome && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.nome.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='email'>Email *</Label>
                    <Input
                      id='email'
                      type='email'
                      {...register('email')}
                      className='border border-zinc-300'
                    />
                    {errors.email && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='grid md:grid-cols-3 gap-4'>
                  <div>
                    <Label htmlFor='telefone'>Telefone *</Label>
                    <Input
                      id='telefone'
                      {...register('telefone')}
                      placeholder='(11) 99999-9999'
                      className='border border-zinc-300'
                    />
                    {errors.telefone && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.telefone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='cpf'>CPF *</Label>
                    <Input
                      id='cpf'
                      {...register('cpf')}
                      placeholder='000.000.000-00'
                      className='border border-zinc-300'
                    />
                    {errors.cpf && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.cpf.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='dataNascimento'>Data de Nascimento *</Label>
                    <Input
                      id='dataNascimento'
                      type='date'
                      {...register('dataNascimento')}
                      className='border border-zinc-300'
                    />
                    {errors.dataNascimento && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.dataNascimento.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='camiseta'>Tamanho da Camiseta *</Label>
                    <Select
                      onValueChange={(value) => setValue('camiseta', value)}
                    >
                      <SelectTrigger className='border border-zinc-300'>
                        <SelectValue placeholder='Selecione' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='pp'>PP</SelectItem>
                        <SelectItem value='p'>P</SelectItem>
                        <SelectItem value='m'>M</SelectItem>
                        <SelectItem value='g'>G</SelectItem>
                        <SelectItem value='gg'>GG</SelectItem>
                        <SelectItem value='xg'>XG</SelectItem>
                        <SelectItem value='xxg'>XXG</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.camiseta && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.camiseta.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='matricula'>Matrícula</Label>
                    <Input
                      id='matricula'
                      {...register('matricula')}
                      placeholder='Ex: 123456'
                      className='border border-zinc-300'
                    />
                  </div>
                  <div>
                    <Label htmlFor='afiliacao'>Afiliação/Força</Label>
                    <Input
                      id='afiliacao'
                      {...register('afiliacao')}
                      placeholder='Ex: SSP-DF, PMDF, CBMDF, etc.'
                      className='border border-zinc-300'
                    />
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-primary'>
                  Modalidades de Interesse
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Selecione as modalidades que deseja participar:
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                  {modalidadesOptions.map((modalidade) => (
                    <div
                      key={modalidade}
                      className='flex items-center space-x-2'
                    >
                      <Checkbox
                        id={modalidade}
                        className='border border-zinc-300'
                        onCheckedChange={(checked) => {
                          const currentModalidades = watchedModalidades || [];
                          const newModalidades = checked
                            ? [...currentModalidades, modalidade]
                            : currentModalidades.filter(
                                (m) => m !== modalidade,
                              );
                          setValue('modalidades', newModalidades);
                        }}
                      />
                      <Label htmlFor={modalidade} className='text-sm'>
                        {modalidade}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.modalidades && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.modalidades.message}
                  </p>
                )}
              </div>

              <div className='text-center pt-6'>
                <Button
                  type='submit'
                  variant='default'
                  size='lg'
                  disabled={loading}
                  className='px-12 cursor-pointer hover:bg-orange-500 hover:text-white transition-colors'
                >
                  {loading ? (
                    <Loader2 className='animate-spin mr-2 h-5 w-5' />
                  ) : (
                    <>
                      <Users className='mr-2 h-5 w-5' />
                      Finalizar Inscrição
                    </>
                  )}
                </Button>
                <p className='text-xs text-muted-foreground mt-4'>
                  Ao submeter este formulário, você concorda com os termos e
                  condições do evento.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
