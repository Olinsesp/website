'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import QueryStateHandler from '../ui/query-state-handler';
import { DataTable } from '@/app/Dashboard/data-table';
import { getInscricoesColumns } from '@/components/inscricoes/inscricoes-columns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Inscricao } from '@/types/inscricao';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const inscricaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  camiseta: z.string().min(1, 'Tamanho da camiseta é obrigatório'),
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  lotacao: z.string().min(1, 'Lotação é obrigatória'),
  orgaoOrigem: z.string().min(1, 'Órgão de Origem é obrigatório'),
  modalidades: z
    .array(z.string())
    .min(1, 'Selecione pelo menos uma modalidade'),
  status: z.enum(['pendente', 'aprovada', 'rejeitada']).optional(),
});

type InscricaoFormData = z.infer<typeof inscricaoSchema>;

async function fetchInscricoes(): Promise<Inscricao[]> {
  const response = await fetch('/api/inscricoes');
  if (!response.ok) {
    throw new Error('Erro ao carregar inscrições');
  }
  return response.json();
}

export default function InscricoesTable() {
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
        throw new Error('Erro ao salvar inscrição');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscricoes'] });
      toast.success(editingId ? 'Inscrição atualizada!' : 'Inscrição criada!');
      handleCancel();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation<Response, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/inscricoes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir inscrição');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscricoes'] });
      toast.success('Inscrição excluída!');
    },
    onError: (error) => {
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
      inscricao.dataNascimento instanceof Date
        ? inscricao.dataNascimento.toISOString().split('T')[0]
        : inscricao.dataNascimento,
    );
    setValue('camiseta', inscricao.camiseta);
    setValue('matricula', inscricao.matricula);
    setValue('lotacao', inscricao.lotacao);
    setValue('orgaoOrigem', inscricao.orgaoOrigem);
    setValue('modalidades', inscricao.modalidades);
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

  const toggleModalidade = (modalidade: string) => {
    const current = watchedModalidades || [];
    const updated = current.includes(modalidade)
      ? current.filter((m) => m !== modalidade)
      : [...current, modalidade];
    setValue('modalidades', updated);
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
              columns={getInscricoesColumns(handleEdit, handleDelete)}
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
                    onValueChange={(value) => setValue('camiseta', value)}
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
                  <Select onValueChange={(value) => setValue('lotacao', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione a lotação' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='PCDF'>PCDF</SelectItem>
                      <SelectItem value='PMDF'>PMDF</SelectItem>
                      <SelectItem value='CBMDF'>CBMDF</SelectItem>
                      <SelectItem value='PF'>PF</SelectItem>
                      <SelectItem value='PRF'>PRF</SelectItem>
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
                    onValueChange={(value) => setValue('orgaoOrigem', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o órgão de origem' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='PCDF'>PCDF</SelectItem>
                      <SelectItem value='PMDF'>PMDF</SelectItem>
                      <SelectItem value='CBMDF'>CBMDF</SelectItem>
                      <SelectItem value='PF'>PF</SelectItem>
                      <SelectItem value='PRF'>PRF</SelectItem>
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
                <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                  {[
                    'Futebol',
                    'Vôlei',
                    'Basquete',
                    'Natação',
                    'Atletismo',
                    'Tênis',
                  ].map((modalidade) => (
                    <div
                      key={modalidade}
                      className='flex items-center space-x-2'
                    >
                      <Checkbox
                        id={modalidade}
                        checked={
                          watchedModalidades?.includes(modalidade) || false
                        }
                        onCheckedChange={() => toggleModalidade(modalidade)}
                      />
                      <Label htmlFor={modalidade} className='text-sm'>
                        {modalidade}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.modalidades && (
                  <p className='text-sm text-vermelho-olinsesp'>
                    {errors.modalidades.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      'status',
                      value as 'pendente' | 'aprovada' | 'rejeitada',
                    )
                  }
                  defaultValue={watch('status')}
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
