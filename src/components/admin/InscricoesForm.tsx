'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import QueryStateHandler from '../ui/query-state-handler';
import { DataTable } from '@/app/Dashboard/data-table';
import { getInscricoesColumns } from '@/components/inscricoes/inscricoes-columns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modalidade } from '@/types/modalidade';
import { Inscricao } from '@/types/inscricao';

const modalidadeSelectionSchema = z.object({
  modalidadeId: z.string(),
  sexo: z.string().optional(),
  divisao: z.string().optional(),
  categoria: z.string().optional(),
  faixaEtaria: z.string().optional(),
});

const inscricaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.email('Email inválido'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  cpf: z
    .string()
    .min(11, 'CPF deve ter 11 dígitos')
    .regex(/^\d+$/, 'CPF deve conter apenas números'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  camiseta: z.string().min(1, 'Tamanho da camiseta é obrigatório'),
  matricula: z
    .string()
    .min(1, 'Matrícula é obrigatória')
    .regex(/^\d+$/, 'Matrícula deve conter apenas números'),
  lotacao: z.string().min(1, 'Lotação é obrigatória'),
  sexo: z.string().min(1, 'Sexo é obrigatório'),
  orgaoOrigem: z.string().min(1, 'Órgão de Origem é obrigatório'),
  modalidades: z
    .array(modalidadeSelectionSchema)
    .min(1, 'Selecione pelo menos uma modalidade'),
  status: z.enum(['pendente', 'aprovada', 'rejeitada']).optional(),
});

type InscricaoFormData = z.infer<typeof inscricaoSchema>;

async function fetchModalidades(): Promise<Modalidade[]> {
  const response = await fetch('/api/modalidades');
  if (!response.ok) {
    throw new Error('Erro ao carregar modalidades');
  }
  const data = await response.json();
  return data.dados || [];
}

async function fetchInscricoes(): Promise<Inscricao[]> {
  const response = await fetch('/api/inscricoes');
  if (!response.ok) {
    throw new Error('Erro ao carregar inscrições');
  }
  return response.json();
}

export default function InscricoesForm() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: inscricoes = [],
    isLoading,
    isError,
    error,
  } = useQuery<Inscricao[], Error>({
    queryKey: ['inscricoes'],
    queryFn: fetchInscricoes,
  });

  const {
    data: modalidadesData = [],
    isLoading: isLoadingModalidades,
    isError: isErrorModalidades,
    error: errorModalidades,
  } = useQuery<Modalidade[], Error>({
    queryKey: ['modalidades'],
    queryFn: fetchModalidades,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InscricaoFormData>({
    resolver: zodResolver(inscricaoSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      dataNascimento: '',
      camiseta: '',
      matricula: '',
      lotacao: '',
      orgaoOrigem: '',
      sexo: '',
      modalidades: [],
      status: 'pendente',
    },
  });

  const watchedModalidades = watch('modalidades');

  const mutation = useMutation<
    Response,
    Error,
    { data: InscricaoFormData; id?: string | null }
  >({
    mutationFn: async ({ data, id }) => {
      const url = id ? `/api/inscricoes/${id}` : '/api/inscricoes';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Erro ao salvar inscrição');
      }

      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscricoes'] });
      toast.success(editingId ? 'Inscrição atualizada!' : 'Inscrição criada!');
      handleCancel();
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation<Response, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/inscricoes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Erro ao excluir inscrição');
      }

      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscricoes'] });
      toast.success('Inscrição excluída!');
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: InscricaoFormData) => {
    mutation.mutate({ data, id: editingId });
  };

  const handleEdit = (inscricao: Inscricao) => {
    setEditingId(inscricao.id);
    setValue('nome', inscricao.nome);
    setValue('email', inscricao.email);
    setValue('telefone', inscricao.telefone);
    setValue('cpf', inscricao.cpf);
    setValue(
      'dataNascimento',
      inscricao.dataNascimento
        ? new Date(inscricao.dataNascimento).toISOString().split('T')[0]
        : '',
    );
    setValue('camiseta', inscricao.camiseta);
    setValue('matricula', inscricao.matricula);
    setValue('lotacao', inscricao.lotacao);
    setValue('orgaoOrigem', inscricao.orgaoOrigem);
    setValue('sexo', inscricao.sexo);
    setValue('modalidades', inscricao.modalidades || []);
    setValue('status', inscricao.status);

    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta inscrição?')) return;
    deleteMutation.mutate(id);
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleAddNew = () => {
    reset();
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const toggleModalidade = (modalidadeId: string, checked: boolean) => {
    const current = watchedModalidades || [];

    const updated = checked
      ? [...current, { modalidadeId }]
      : current.filter((m) => m.modalidadeId !== modalidadeId);

    setValue('modalidades', updated, { shouldValidate: true });
  };

  const handleModalidadeOptionChange = (
    modalidadeId: string,
    optionType: 'sexo' | 'divisao' | 'categoria' | 'faixaEtaria',
    value: string,
  ) => {
    const current = watchedModalidades || [];
    const updated = current.map((m) => {
      if (m.modalidadeId === modalidadeId) {
        return { ...m, [optionType]: value };
      }
      return m;
    });
    setValue('modalidades', updated, { shouldValidate: true });
  };

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingMessage='Carregando inscrições...'
    >
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Inscrições</CardTitle>
              <Button onClick={handleAddNew}>
                <Plus className='h-4 w-4 mr-2' />
                Nova Inscrição
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={getInscricoesColumns(handleEdit, handleDelete, true)}
              data={inscricoes}
              filterColumn='nome'
            />
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Inscrição' : 'Nova Inscrição'}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? 'Faça as alterações necessárias na inscrição.'
                  : 'Adicione uma nova inscrição ao sistema.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='nome'>Nome Completo *</Label>
                  <Input
                    id='nome'
                    {...register('nome')}
                    placeholder='Nome completo'
                  />
                  {errors.nome && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.nome.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email *</Label>
                  <Input
                    id='email'
                    type='email'
                    {...register('email')}
                    placeholder='email@exemplo.com'
                  />
                  {errors.email && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='telefone'>Telefone *</Label>
                  <Input
                    id='telefone'
                    {...register('telefone')}
                    placeholder='(61) 99999-9999'
                  />
                  {errors.telefone && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.telefone.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='cpf'>CPF *</Label>
                  <Input
                    id='cpf'
                    {...register('cpf')}
                    placeholder='000.000.000-00'
                  />
                  {errors.cpf && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.cpf.message}
                    </p>
                  )}
                </div>
                <div>
                  <div className='space-y-2'>
                    <Label htmlFor='sexo'>Sexo *</Label>
                    <Select
                      value={watch('sexo')}
                      onValueChange={(value) =>
                        setValue('sexo', value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o sexo' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Masculino'>Masculino</SelectItem>
                        <SelectItem value='Feminino'>Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sexo && (
                      <p className='text-sm text-vermelho-olinsesp'>
                        {errors.sexo.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='dataNascimento'>Data de Nascimento *</Label>
                  <Input
                    id='dataNascimento'
                    type='date'
                    {...register('dataNascimento')}
                  />
                  {errors.dataNascimento && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.dataNascimento.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='camiseta'>Tamanho da Camiseta *</Label>
                  <Select
                    value={watch('camiseta')}
                    onValueChange={(value) =>
                      setValue('camiseta', value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o tamanho' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='P'>P</SelectItem>
                      <SelectItem value='M'>M</SelectItem>
                      <SelectItem value='G'>G</SelectItem>
                      <SelectItem value='GG'>GG</SelectItem>
                      <SelectItem value='XG'>XG</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.camiseta && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.camiseta.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='matricula'>Matrícula *</Label>
                  <Input
                    id='matricula'
                    {...register('matricula')}
                    placeholder='Número da matrícula'
                  />
                  {errors.matricula && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.matricula.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='lotacao'>Lotação *</Label>
                  <Select
                    value={watch('lotacao')}
                    onValueChange={(value) =>
                      setValue('lotacao', value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione a lotação' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='PMDF'>PMDF</SelectItem>
                      <SelectItem value='CBMDF'>CBMDF</SelectItem>
                      <SelectItem value='PCDF'>PCDF</SelectItem>
                      <SelectItem value='PRF'>PRF</SelectItem>
                      <SelectItem value='SSPDF'>SSPDF</SelectItem>
                      <SelectItem value='DETRANDF'>DETRANDF</SelectItem>
                      <SelectItem value='PF'>PF</SelectItem>
                      <SelectItem value='PPDF'>PPDF</SelectItem>
                      <SelectItem value='PPF'>PPF</SelectItem>
                      <SelectItem value='PLDF'>PLDF</SelectItem>
                      <SelectItem value='PLF'>PLF</SelectItem>
                      <SelectItem value='SEJUS'>SEJUS</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.lotacao && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.lotacao.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='orgaoOrigem'>Órgão de Origem *</Label>
                  <Select
                    value={watch('orgaoOrigem')}
                    onValueChange={(value) =>
                      setValue('orgaoOrigem', value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o órgão de origem' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='PMDF'>PMDF</SelectItem>
                      <SelectItem value='CBMDF'>CBMDF</SelectItem>
                      <SelectItem value='PCDF'>PCDF</SelectItem>
                      <SelectItem value='PRF'>PRF</SelectItem>
                      <SelectItem value='SSPDF'>SSPDF</SelectItem>
                      <SelectItem value='DETRANDF'>DETRANDF</SelectItem>
                      <SelectItem value='PF'>PF</SelectItem>
                      <SelectItem value='PPDF'>PPDF</SelectItem>
                      <SelectItem value='PPF'>PPF</SelectItem>
                      <SelectItem value='PLDF'>PLDF</SelectItem>
                      <SelectItem value='PLF'>PLF</SelectItem>
                      <SelectItem value='SEJUS'>SEJUS</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.orgaoOrigem && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.orgaoOrigem.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Modalidades *</Label>

                <QueryStateHandler
                  isLoading={isLoadingModalidades}
                  isError={isErrorModalidades}
                  error={errorModalidades}
                  loadingMessage='Carregando modalidades...'
                >
                  <div className='space-y-2'>
                    <Accordion type='multiple' className='w-full'>
                      {modalidadesData.map((modalidade) => {
                        const selectedModalidade = watchedModalidades?.find(
                          (m) => m.modalidadeId === modalidade.id,
                        );

                        const isSelected = !!selectedModalidade;

                        return (
                          <AccordionItem
                            value={modalidade.id}
                            key={modalidade.id}
                            className='border rounded-md px-4'
                          >
                            <div className='flex items-center py-3 justify-between'>
                              <div className='flex items-center space-x-3'>
                                <Checkbox
                                  id={modalidade.id}
                                  checked={isSelected}
                                  className='border-2 border-azul-olinsesp'
                                  onCheckedChange={(checked) =>
                                    toggleModalidade(
                                      modalidade.id,
                                      checked === true,
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={modalidade.id}
                                  className='font-medium'
                                >
                                  {modalidade.nome}
                                </Label>
                              </div>

                              {/* Só deixa expandir se estiver selecionada */}
                              {isSelected && (
                                <AccordionTrigger className='ml-4'>
                                  Opções
                                </AccordionTrigger>
                              )}
                            </div>

                            {isSelected && (
                              <AccordionContent className='pb-4 space-y-4 pl-2'>
                                {/* SEXO */}
                                {modalidade.modalidadesSexo &&
                                  modalidade.modalidadesSexo.length > 0 && (
                                    <div className='space-y-1'>
                                      <Label>Sexo</Label>
                                      <Select
                                        value={selectedModalidade?.sexo}
                                        onValueChange={(value) =>
                                          handleModalidadeOptionChange(
                                            modalidade.id,
                                            'sexo',
                                            value,
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder='Selecione o sexo' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {modalidade.modalidadesSexo.map(
                                            (sexo) => (
                                              <SelectItem
                                                key={sexo}
                                                value={sexo}
                                              >
                                                {sexo}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}

                                {/* CATEGORIA */}
                                {modalidade.categoria &&
                                  modalidade.categoria.length > 0 && (
                                    <div className='space-y-1'>
                                      <Label>Categoria</Label>
                                      <Select
                                        value={selectedModalidade?.categoria}
                                        onValueChange={(value) =>
                                          handleModalidadeOptionChange(
                                            modalidade.id,
                                            'categoria',
                                            value,
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder='Selecione a categoria' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {modalidade.categoria.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                              {cat}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}

                                {/* FAIXA ETÁRIA */}
                                {modalidade.faixaEtaria &&
                                  modalidade.faixaEtaria.length > 0 && (
                                    <div className='space-y-1'>
                                      <Label>Faixa Etária</Label>
                                      <Select
                                        value={selectedModalidade?.faixaEtaria}
                                        onValueChange={(value) =>
                                          handleModalidadeOptionChange(
                                            modalidade.id,
                                            'faixaEtaria',
                                            value,
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder='Selecione a faixa etária' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {modalidade.faixaEtaria.map(
                                            (faixa) => (
                                              <SelectItem
                                                key={faixa}
                                                value={faixa}
                                              >
                                                {faixa}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}

                                {/* DIVISÃO */}
                                {modalidade.divisoes &&
                                  modalidade.divisoes.length > 0 && (
                                    <div className='space-y-1'>
                                      <Label>Divisão</Label>
                                      <Select
                                        value={selectedModalidade?.divisao}
                                        onValueChange={(value) =>
                                          handleModalidadeOptionChange(
                                            modalidade.id,
                                            'divisao',
                                            value,
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder='Selecione a divisão' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {modalidade.divisoes.map((div) => (
                                            <SelectItem key={div} value={div}>
                                              {div}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                              </AccordionContent>
                            )}
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </div>
                </QueryStateHandler>

                {errors.modalidades && (
                  <p className='text-sm text-vermelho-olinsesp'>
                    {typeof errors.modalidades.message === 'string'
                      ? errors.modalidades.message
                      : 'Um erro ocorreu nas modalidades'}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) =>
                    setValue(
                      'status',
                      value as 'pendente' | 'aprovada' | 'rejeitada',
                      {
                        shouldValidate: true,
                      },
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='pendente'>Pendente</SelectItem>
                    <SelectItem value='aprovada'>Aprovada</SelectItem>
                    <SelectItem value='rejeitada'>Rejeitada</SelectItem>
                  </SelectContent>
                </Select>

                {errors.status && (
                  <p className='text-sm text-vermelho-olinsesp'>
                    {errors.status.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type='button' variant='outline' onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  ) : (
                    <Save className='h-4 w-4 mr-2' />
                  )}
                  {editingId ? 'Atualizar' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </QueryStateHandler>
  );
}
