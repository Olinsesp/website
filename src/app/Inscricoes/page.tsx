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
import {
  Calendar,
  Users,
  Trophy,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import CountdownTimer from '@/components/ui/CountdownTimer';
import ModalidadesSelector from '@/components/inscricoes/ModalidadesSelector';
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
  sexo: z.string().nonempty('Selecione o sexo.'),
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
    'Futsal',
    'Futebol de Campo',
    'Basquetebol',
    'Vôlei de Quadra',
    'Vôlei de Praia',
    'Futevôlei',
    'Beach Tênis',
    'Atletismo',
    'Natação',
    'Tênis de Mesa',
    'Triathlon',
    'Calistenia',
    'Jiu Jitsu',
    'Judô',
    'Cabo de Guerra',
    'Truco',
    'Dominó',
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
    <div className='min-h-screen py-12 bg-gradient-to-br from-blue-50 via-white to-orange-50'>
      <div className='container mx-auto px-4 max-w-5xl'>
        {/* Header da Página */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium mb-6'>
            <CheckCircle className='h-4 w-4' />
            Inscrições Abertas
          </div>

          <h1 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent'>
            Inscrições Olinsesp VIII
          </h1>
          <p className='text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
            Faça parte do maior evento esportivo da região! Junte-se a centenas
            de atletas das forças de segurança em uma competição única.
          </p>

          {/* Countdown Timer */}
          <Card className='max-w-md mx-auto mb-8 bg-gradient-to-r from-blue-600 to-orange-500 text-white border-0 shadow-2xl'>
            <CardContent className='p-6'>
              <CountdownTimer />
            </CardContent>
          </Card>
        </div>

        {/* Cards Informativos */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12'>
          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center'>
                <Calendar className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                Período de Inscrições
              </h3>
              <p className='text-gray-600'>22/12/2025 - 06/02/2026</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center'>
                <Trophy className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                15+ Modalidades
              </h3>
              <p className='text-gray-600'>Diversas opções esportivas</p>
            </CardContent>
          </Card>

          <Card className='text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='p-8'>
              <div className='h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center'>
                <Users className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                Inscrição Gratuita
              </h3>
              <p className='text-gray-600'>Sem taxas de participação</p>
            </CardContent>
          </Card>
        </div>

        {/* Formulário Principal */}
        <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-2xl'>
          <CardHeader className='text-center pb-6'>
            <div className='h-20 w-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center'>
              <Users className='h-10 w-10 text-white' />
            </div>
            <CardTitle className='text-3xl text-gray-800'>
              Formulário de Inscrição
            </CardTitle>
            <CardDescription className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Preencha todos os campos obrigatórios para garantir sua
              participação no Olinsesp VIII.
            </CardDescription>
          </CardHeader>

          <CardContent className='p-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
              {/* Dados Pessoais */}
              <div className='space-y-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='h-8 w-1 bg-gradient-to-b from-blue-500 to-orange-500 rounded-full'></div>
                  <h3 className='text-xl font-semibold text-gray-800'>
                    Dados Pessoais
                  </h3>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='nome' className='text-gray-700 font-medium'>
                      Nome Completo *
                    </Label>
                    <Input
                      id='nome'
                      {...register('nome')}
                      className='border-2 border-gray-200 focus:border-blue-500 transition-colors h-12'
                      placeholder='Digite seu nome completo'
                    />
                    {errors.nome && (
                      <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.nome.message}
                      </div>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='email'
                      className='text-gray-700 font-medium'
                    >
                      Email *
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      {...register('email')}
                      className='border-2 border-gray-200 focus:border-blue-500 transition-colors h-12'
                      placeholder='seu@email.com'
                    />
                    {errors.email && (
                      <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.email.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className='grid md:grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='telefone'
                      className='text-gray-700 font-medium'
                    >
                      Telefone *
                    </Label>
                    <Input
                      id='telefone'
                      {...register('telefone')}
                      placeholder='(11) 99999-9999'
                      className='border-2 border-gray-200 focus:border-blue-500 transition-colors h-12'
                    />
                    {errors.telefone && (
                      <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.telefone.message}
                      </div>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='cpf' className='text-gray-700 font-medium'>
                      CPF *
                    </Label>
                    <Input
                      id='cpf'
                      {...register('cpf')}
                      placeholder='12345678901'
                      className='border-2 border-gray-200 focus:border-blue-500 transition-colors h-12'
                    />
                    {errors.cpf && (
                      <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.cpf.message}
                      </div>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='dataNascimento'
                      className='text-gray-700 font-medium'
                    >
                      Data de Nascimento *
                    </Label>
                    <Input
                      id='dataNascimento'
                      type='date'
                      {...register('dataNascimento')}
                      className='border-2 border-gray-200 focus:border-blue-500 transition-colors h-12'
                    />
                    {errors.dataNascimento && (
                      <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.dataNascimento.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className='grid md:grid-cols-4 gap-6'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='camiseta'
                      className='text-gray-700 font-medium'
                    >
                      Tamanho da Camiseta *
                    </Label>
                    <Select
                      onValueChange={(value) => setValue('camiseta', value)}
                    >
                      <SelectTrigger className='border-2 border-gray-200 focus:border-blue-500 transition-colors h-12'>
                        <SelectValue placeholder='Selecione o tamanho' />
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
                      <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.camiseta.message}
                      </div>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='sexo' className='text-gray-700 font-medium'>
                      Sexo *
                    </Label>
                    <Select onValueChange={(value) => setValue('sexo', value)}>
                      <SelectTrigger className='border-2 border-gray-200 focus:border-blue-500 transition-colors h-12'>
                        <SelectValue placeholder='Selecione o sexo' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='m'>Masculino</SelectItem>
                        <SelectItem value='f'>Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sexo && (
                      <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.sexo.message}
                      </div>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='matricula'
                      className='text-gray-700 font-medium'
                    >
                      Matrícula
                    </Label>
                    <Input
                      id='matricula'
                      {...register('matricula')}
                      placeholder='Ex: 123456'
                      className='border-2 border-gray-200 focus:border-blue-500 transition-colors h-12'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='afiliacao'
                      className='text-gray-700 font-medium'
                    >
                      Afiliação/Força
                    </Label>
                    <Input
                      id='afiliacao'
                      {...register('afiliacao')}
                      placeholder='Ex: SSP-DF, PMDF, CBMDF, etc.'
                      className='border-2 border-gray-200 focus:border-blue-500 transition-colors h-12'
                    />
                  </div>
                </div>
              </div>

              {/* Modalidades */}
              <div className='space-y-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='h-8 w-1 bg-gradient-to-b from-orange-500 to-red-500 rounded-full'></div>
                  <h3 className='text-xl font-semibold text-gray-800'>
                    Modalidades de Interesse
                  </h3>
                </div>

                <p className='text-gray-600 leading-relaxed'>
                  Selecione as modalidades que deseja participar:
                </p>

                <ModalidadesSelector
                  options={modalidadesOptions}
                  selected={watchedModalidades || []}
                  onChange={(newValues) =>
                    setValue('modalidades', newValues, { shouldValidate: true })
                  }
                />

                {errors.modalidades && (
                  <div className='flex items-center gap-2 text-red-500 text-sm mt-2'>
                    <AlertCircle className='h-4 w-4' />
                    {errors.modalidades.message}
                  </div>
                )}
              </div>

              {/* Botão de Envio */}
              <div className='text-center pt-8'>
                <Button
                  type='submit'
                  variant='default'
                  size='lg'
                  disabled={loading}
                  className='px-16 py-6 text-lg bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? (
                    <>
                      <Loader2 className='animate-spin mr-3 h-6 w-6' />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Users className='mr-3 h-6 w-6' />
                      Finalizar Inscrição
                    </>
                  )}
                </Button>

                <p className='text-sm text-gray-500 mt-6 max-w-md mx-auto leading-relaxed'>
                  Ao submeter este formulário, você concorda com os termos e
                  condições do evento Olinsesp VIII.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
