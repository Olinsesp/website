'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import QueryStateHandler from '../ui/query-state-handler';
import { DataTable } from '@/app/Dashboard/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const campoExtraSchema = z.object({
  id: z.string().min(1, 'ID do campo é obrigatório'),
  label: z.string().min(1, 'Label do campo é obrigatório'),
  type: z.enum(['text', 'select']),
  options: z.array(z.string()).optional(),
});

const modalidadeSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  maxParticipantes: z
    .number()
    .min(1, 'Máximo de participantes deve ser maior que 0'),
  status: z.enum([
    'inscricoes-abertas',
    'inscricoes-fechadas',
    'em-andamento',
    'finalizada',
  ]),
  camposExtras: z.array(campoExtraSchema).optional(),
});

type ModalidadeFormData = z.infer<typeof modalidadeSchema>;

import { Modalidade } from '@/types/modalidade';

export interface CampoExtra {
  id: string;
  label: string;
  type: 'text' | 'select';
  options?: string[];
}

async function fetchModalidades(): Promise<Modalidade[]> {
  const response = await fetch('/api/modalidades?estatisticas=false');
  if (!response.ok) {
    throw new Error('Erro ao carregar modalidades');
  }
  const data = await response.json();
  return data.dados || data;
}

export default function ModalidadesForm() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: modalidades = [],
    isLoading,
    isError,
    error,
  } = useQuery<Modalidade[], Error>({
    queryKey: ['modalidades'],
    queryFn: fetchModalidades,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<ModalidadeFormData>({
    resolver: zodResolver(modalidadeSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      categoria: '',
      maxParticipantes: 0,
      status: 'inscricoes-abertas',
      camposExtras: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'camposExtras',
  });

  const mutation = useMutation<
    Response,
    Error,
    { data: ModalidadeFormData; id?: string | null }
  >({
    mutationFn: async ({ data, id }) => {
      const url = id ? `/api/modalidades/${id}` : '/api/modalidades';
      const method = id ? 'PUT' : 'POST';
      const dataToSend = {
        ...data,
        camposExtras: data.camposExtras?.map((field: any) => ({
          ...field,
          options:
            typeof field.options === 'string'
              ? field.options.split('\n').map((opt: string) => opt.trim())
              : field.options,
        })),
      };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar modalidade');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modalidades'] });
      toast.success(
        editingId ? 'Modalidade atualizada!' : 'Modalidade criada!',
      );
      handleCancel();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation<Response, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/modalidades/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir modalidade');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modalidades'] });
      toast.success('Modalidade excluída!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: ModalidadeFormData) => {
    mutation.mutate({ data, id: editingId });
  };

  const handleEdit = (modalidade: Modalidade) => {
    setEditingId(modalidade.id);
    setValue('nome', modalidade.nome);
    setValue('descricao', modalidade.descricao);
    setValue('categoria', modalidade.categoria);
    setValue('maxParticipantes', modalidade.maxParticipantes);
    setValue(
      'status',
      modalidade.status === 'inscricoes-encerradas'
        ? 'inscricoes-fechadas'
        : (modalidade.status as any),
    );
    setValue(
      'camposExtras',
      (modalidade as any).camposExtras?.map((ce: any) => ({
        ...ce,
        options: ce.options?.join('\n'),
      })) || [],
    );
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta modalidade?')) return;
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'inscricoes-abertas': {
        label: 'Inscrições Abertas',
        color: 'bg-verde-olinsesp',
      },
      'inscricoes-fechadas': {
        label: 'Inscrições Fechadas',
        color: 'bg-amarelo-olinsesp',
      },
      'em-andamento': { label: 'Em Andamento', color: 'bg-azul-olinsesp' },
      finalizada: { label: 'Finalizada', color: 'bg-gray-500' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: 'Desconhecido',
      color: 'bg-gray-500',
    };
    return (
      <Badge className={`${config.color} text-white`}>{config.label}</Badge>
    );
  };

  const columns: ColumnDef<Modalidade>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome',
    },
    {
      accessorKey: 'descricao',
      header: 'Descrição',
    },
    {
      accessorKey: 'categoria',
      header: 'Categoria',
    },
    {
      accessorKey: 'participantes',
      header: 'Participantes',
      cell: ({ row }) =>
        `${row.original.participantesAtuais}/${row.original.maxParticipantes}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const modalidade = row.original;
        return (
          <div className='flex gap-2 justify-end'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => handleEdit(modalidade)}
            >
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant='destructive'
              onClick={() => handleDelete(modalidade.id)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingMessage='Carregando modalidades...'
    >
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Modalidades</CardTitle>
              <Button onClick={handleAddNew}>
                <Plus className='h-4 w-4 mr-2' />
                Nova Modalidade
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={modalidades}
              filterColumn='nome'
            />
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Modalidade' : 'Nova Modalidade'}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? 'Faça as alterações necessárias na modalidade.'
                  : 'Adicione uma nova modalidade ao sistema.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='nome'>Nome *</Label>
                  <Input
                    id='nome'
                    {...register('nome')}
                    placeholder='Ex: Futebol'
                  />
                  {errors.nome && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.nome.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='categoria'>Categoria *</Label>
                  <Input
                    id='categoria'
                    {...register('categoria')}
                    placeholder='Ex: Coletivo'
                  />
                  {errors.categoria && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.categoria.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='maxParticipantes'>
                    Máximo de Participantes *
                  </Label>
                  <Input
                    id='maxParticipantes'
                    type='number'
                    {...register('maxParticipantes', { valueAsNumber: true })}
                    placeholder='20'
                  />
                  {errors.maxParticipantes && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.maxParticipantes.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='status'>Status *</Label>
                  <Select
                    onValueChange={(value) => setValue('status', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='inscricoes-abertas'>
                        Inscrições Abertas
                      </SelectItem>
                      <SelectItem value='inscricoes-fechadas'>
                        Inscrições Fechadas
                      </SelectItem>
                      <SelectItem value='em-andamento'>Em Andamento</SelectItem>
                      <SelectItem value='finalizada'>Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='descricao'>Descrição *</Label>
                <Textarea
                  id='descricao'
                  {...register('descricao')}
                  placeholder='Descrição da modalidade...'
                  rows={3}
                />
                {errors.descricao && (
                  <p className='text-sm text-vermelho-olinsesp'>
                    {errors.descricao.message}
                  </p>
                )}
              </div>

              <div className='space-y-4'>
                <Label>Campos Extras</Label>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className='flex items-center gap-2 p-2 border rounded-lg'
                  >
                    <div className='grid grid-cols-2 gap-2 flex-1'>
                      <Input
                        {...register(`camposExtras.${index}.id`)}
                        placeholder='ID do campo (e.g., peso_categoria)'
                      />
                      <Input
                        {...register(`camposExtras.${index}.label`)}
                        placeholder='Label do campo (e.g., Categoria de Peso)'
                      />
                      <Select
                        onValueChange={(value) =>
                          setValue(
                            `camposExtras.${index}.type`,
                            value as 'text' | 'select',
                          )
                        }
                        defaultValue={field.type}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Tipo de campo' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='text'>Texto</SelectItem>
                          <SelectItem value='select'>Seleção</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea
                        {...register(`camposExtras.${index}.options` as any)}
                        placeholder='Opções (uma por linha)'
                        rows={2}
                      />
                    </div>
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      onClick={() => remove(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    append({ id: '', label: '', type: 'text', options: [] })
                  }
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Adicionar Campo Extra
                </Button>
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
