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
import { Users, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import CountdownTimer from '@/components/ui/CountdownTimer';

const baseInscricaoSchema = z
  .object({
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
    sexo: z.string().nonempty({ message: 'Selecione o sexo.' }),
    camiseta: z.string().nonempty('Selecione um tamanho de camiseta.'),
    matricula: z
      .string()
      .min(5, { message: 'Matrícula deve ter ao menos 5 caracteres.' }),
    lotacao: z.string().nonempty({ message: 'Selecione a lotação.' }),
    orgaoOrigem: z
      .string()
      .nonempty({ message: 'Selecione o órgão de origem.' }),
  })
  .catchall(z.any());

type InscricaoFormData = z.infer<typeof baseInscricaoSchema>;

export default function Inscricoes() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm<InscricaoFormData>({
    resolver: zodResolver(baseInscricaoSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      dataNascimento: '',
      sexo: '',
      camiseta: '',
      matricula: '',
      lotacao: '',
      orgaoOrigem: '',
    },
  });

  const onSubmit = async (data: InscricaoFormData) => {
    setLoading(true);
    clearErrors();

    try {
      const response = await fetch('/api/inscricoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          dataNascimento: new Date(data.dataNascimento),
        }),
      });

      const responseData = await response.json();
      if (!response.ok)
        throw new Error(responseData.error || 'Falha ao realizar inscrição.');

      toast.success('Inscrição Realizada!', {
        description: (
          <p className='text-black'>
            Sua inscrição foi processada com sucesso. Você receberá um email de
            confirmação em breve.
          </p>
        ),
      });
      reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro. Tente novamente.';
      toast.error('Erro na Inscrição', {
        description: <p className='text-black'>{message}</p>,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen py-12 bg-none'>
      <div className='container mx-auto px-4 max-w-5xl'>
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-azul-olinsesp text-white px-6 py-3 rounded-full text-sm font-medium mb-6'>
            <CheckCircle className='h-4 w-4' />
            Inscrições Abertas
          </div>
          <h1 className='text-4xl md:text-5xl font-bold mb-6 bg-azul-olinsesp bg-clip-text text-transparent'>
            Inscrições VIII Olinsesp
          </h1>
          <p className='text-2xl md:text-xl font-medium text-gray-950 mb-8 max-w-3xl mx-auto leading-relaxed'>
            Faça parte do maior evento esportivo da região! Junte-se a centenas
            de atletas das forças de segurança em uma competição única.
          </p>
          <Card className='max-w-md mx-auto mb-8 bg-azul-olinsesp text-white border-0 shadow-2xl'>
            <CardContent className='p-6'>
              <CountdownTimer />
            </CardContent>
          </Card>
        </div>

        <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-2xl'>
          <CardHeader className='text-center pb-6'>
            <div className='h-20 w-20 mx-auto mb-6 bg-azul-olinsesp rounded-full flex items-center justify-center'>
              <Users className='h-10 w-10 text-white' />
            </div>
            <CardTitle className='text-3xl text-gray-800'>
              Formulário de Inscrição
            </CardTitle>
            <CardDescription className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Preencha todos os campos obrigatórios para garantir sua
              participação no VIII Olinsesp.
            </CardDescription>
          </CardHeader>

          <CardContent className='p-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
              {/* DADOS PESSOAIS */}
              <div className='space-y-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='h-8 w-1 bg-azul-olinsesp rounded-full'></div>
                  <h3 className='text-xl font-semibold text-gray-800'>
                    Dados Pessoais
                  </h3>
                </div>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='nome'>Nome Completo *</Label>
                    <Input
                      id='nome'
                      {...register('nome')}
                      placeholder='Digite seu nome completo'
                      className='border-2 border-gray-200 focus:border-azul-olinsesp transition-colors h-12'
                    />
                    {errors.nome && (
                      <div className='flex items-center gap-2 text-vermelho-olinsesp text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.nome.message}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email *</Label>
                    <Input
                      id='email'
                      type='email'
                      {...register('email')}
                      placeholder='seu@email.com'
                      className='border-2 border-gray-200 focus:border-azul-olinsesp transition-colors h-12'
                    />
                    {errors.email && (
                      <div className='flex items-center gap-2 text-vermelho-olinsesp text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.email.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className='grid md:grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='telefone'>Telefone *</Label>
                    <Input
                      id='telefone'
                      {...register('telefone')}
                      placeholder='(11) 99999-9999'
                      className='border-2 border-gray-200 focus:border-azul-olinsesp transition-colors h-12'
                    />
                    {errors.telefone && (
                      <div className='flex items-center gap-2 text-vermelho-olinsesp text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.telefone.message}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='cpf'>CPF *</Label>
                    <Input
                      id='cpf'
                      {...register('cpf')}
                      placeholder='12345678901'
                      className='border-2 border-gray-200 focus:border-azul-olinsesp transition-colors h-12'
                    />
                    {errors.cpf && (
                      <div className='flex items-center gap-2 text-vermelho-olinsesp text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.cpf.message}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='dataNascimento'>Data de Nascimento *</Label>
                    <Input
                      id='dataNascimento'
                      type='date'
                      {...register('dataNascimento')}
                      className='border-2 border-gray-200 focus:border-azul-olinsesp transition-colors h-12'
                    />
                    {errors.dataNascimento && (
                      <div className='flex items-center gap-2 text-vermelho-olinsesp text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.dataNascimento.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className='grid md:grid-cols-4 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='camiseta'>Tamanho da Camiseta *</Label>
                    <Select
                      onValueChange={(value) => setValue('camiseta', value)}
                    >
                      <SelectTrigger className='border-2 border-gray-200 focus:border-azul-olinsesp transition-colors h-12'>
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
                      <div className='flex items-center gap-2 text-vermelho-olinsesp text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.camiseta.message}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='sexo'>Sexo *</Label>
                    <Select onValueChange={(value) => setValue('sexo', value)}>
                      <SelectTrigger className='border-2 border-gray-200 focus:border-azul-olinsesp transition-colors h-12'>
                        <SelectValue placeholder='Selecione o sexo' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='m'>Masculino</SelectItem>
                        <SelectItem value='f'>Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sexo && (
                      <div className='flex items-center gap-2 text-vermelho-olinsesp text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.sexo.message}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='matricula'>Matrícula *</Label>
                    <Input
                      id='matricula'
                      {...register('matricula')}
                      placeholder='Ex: 123456'
                      className='border-2 border-gray-200 focus:border-azul-olinsesp transition-colors h-12'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lotacao'>Lotação *</Label>
                    <Select
                      onValueChange={(value) => setValue('lotacao', value)}
                    >
                      <SelectTrigger className='border-2 border-gray-200 focus:border-azul-olinsesp transition-colors h-12'>
                        <SelectValue placeholder='Selecione a lotação' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='PCDF'>PCDF</SelectItem>
                        <SelectItem value='PMDF'>PMDF</SelectItem>
                        <SelectItem value='CBMDF'>CBMDF</SelectItem>
                        <SelectItem value='PF'>PF</SelectItem>
                        <SelectItem value='PRF'>PRF</SelectItem>
                        <SelectItem value='DEPEN'>DEPEN</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.lotacao && (
                      <div className='flex items-center gap-2 text-vermelho-olinsesp text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.lotacao.message}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='orgaoOrigem'>Órgão de Origem *</Label>
                    <Select
                      onValueChange={(value) => setValue('orgaoOrigem', value)}
                    >
                      <SelectTrigger className='border-2 border-gray-200 focus:border-azul-olinsesp transition-colors h-12'>
                        <SelectValue placeholder='Selecione o órgão' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='PCDF'>PCDF</SelectItem>
                        <SelectItem value='PMDF'>PMDF</SelectItem>
                        <SelectItem value='CBMDF'>CBMDF</SelectItem>
                        <SelectItem value='PF'>PF</SelectItem>
                        <SelectItem value='PRF'>PRF</SelectItem>
                        <SelectItem value='DEPEN'>DEPEN</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.orgaoOrigem && (
                      <div className='flex items-center gap-2 text-vermelho-olinsesp text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.orgaoOrigem.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* BOTÃO DE ENVIO */}
              <div className='text-center pt-8'>
                <Button
                  type='submit'
                  variant='default'
                  size='lg'
                  disabled={loading}
                  className='px-16 py-6 text-lg bg-azul-olinsesp hover:bg-azul-olinsesp/90 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
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
                  condições do evento VIII Olinsesp.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
