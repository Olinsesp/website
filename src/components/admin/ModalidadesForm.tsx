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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Trash2, Edit, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import QueryStateHandler from '../ui/query-state-handler';
import { DataTable } from '@/app/Dashboard/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const divisaoSchema = z.object({
  nome: z.string().min(1, 'Nome da divisão é obrigatório'),
});

const sexoSchema = z.object({
  nome: z.string().min(1, 'Nome do sexo é obrigatório'),
});

const faixaEtariaSchema = z.object({
  nome: z.string().min(1, 'Nome da faixa etária é obrigatório'),
});

const categoriaSchema = z.object({
  nome: z.string().min(1, 'Nome da categoria é obrigatório'),
});

const modalidadeSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  categoria: z.array(categoriaSchema).optional(),
  maxParticipantes: z
    .number()
    .min(1, 'Máximo de participantes deve ser maior que 0'),
  status: z.enum([
    'inscricoes-abertas',
    'inscricoes-fechadas',
    'em-andamento',
    'finalizada',
  ]),
  modalidadesSexo: z.array(sexoSchema).optional(),
  faixaEtaria: z.array(faixaEtariaSchema).optional(),
  divisoes: z.array(divisaoSchema).optional(),
});

type ModalidadeFormData = z.infer<typeof modalidadeSchema>;

import { Modalidade } from '@/types/modalidade';

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
      categoria: [],
      maxParticipantes: 0,
      status: 'inscricoes-abertas',
      modalidadesSexo: [],
      faixaEtaria: [],
      divisoes: [],
    },
  });

  const {
    fields: divisoesFields,
    append: appendDivisao,
    remove: removeDivisao,
  } = useFieldArray({
    control,
    name: 'divisoes',
  });

  const {
    fields: modalidadesSexoFields,
    append: appendModalidadeSexo,
    remove: removeModalidadeSexo,
  } = useFieldArray({
    control,
    name: 'modalidadesSexo',
  });

  const {
    fields: faixaEtariaFields,
    append: appendFaixaEtaria,
    remove: removeFaixaEtaria,
  } = useFieldArray({
    control,
    name: 'faixaEtaria',
  });

  const {
    fields: categoriasFields,
    append: appendCategoria,
    remove: removeCategoria,
  } = useFieldArray({
    control,
    name: 'categoria',
  });

  const mutation = useMutation<
    Response,
    Error,
    { data: ModalidadeFormData; id?: string | null }
  >({
    mutationFn: async ({ data, id }) => {
      const url = id ? `/api/modalidades/${id}` : '/api/modalidades';
      const method = id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar modalidade');
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
      let message = 'Erro ao salvar a modalidade.';

      if (error instanceof Error) {
        if (error.message.includes('categoria')) {
          message = 'A categoria informada é inválida ou está faltando.';
        } else if (error.message.includes('Duplicado')) {
          message = 'Já existe uma modalidade com esse nome.';
        } else if (error.message === 'Failed to fetch') {
          message = 'Falha de comunicação com o servidor.';
        } else {
          message = error.message;
        }
      }

      toast.error(message, {
        description: 'Verifique os dados e tente novamente.',
      });
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
    const formattedData = {
      ...data,
      categoria: data.categoria?.map((c) => c.nome),
      modalidadesSexo: data.modalidadesSexo?.map((s) => s.nome),
      faixaEtaria: data.faixaEtaria?.map((f) => f.nome),
      divisoes: data.divisoes?.map((d) => d.nome),
    };
    mutation.mutate({
      data: formattedData as ModalidadeFormData,
      id: editingId,
    });
  };

  const handleEdit = (modalidade: Modalidade) => {
    setEditingId(modalidade.id);
    setValue('nome', modalidade.nome);
    setValue('descricao', modalidade.descricao);
    setValue(
      'categoria',
      modalidade.categoria?.map((c) => ({ nome: c })) || [],
    );

    setValue('maxParticipantes', modalidade.maxParticipantes);
    setValue(
      'status',
      modalidade.status === 'inscricoes-encerradas'
        ? 'inscricoes-fechadas'
        : (modalidade.status as any),
    );
    setValue(
      'modalidadesSexo',
      modalidade.modalidadesSexo?.map((s) => ({ nome: s })) || [],
    );
    setValue(
      'faixaEtaria',
      modalidade.faixaEtaria?.map((f) => ({ nome: f })) || [],
    );
    setValue('divisoes', modalidade.divisoes?.map((d) => ({ nome: d })) || []);
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
      accessorKey: 'categoria',
      header: 'Categoria',
      cell: ({ row }) => {
        const categorias = row.original.categoria;
        if (!categorias || categorias.length === 0) return <span>N/A</span>;

        const displayedCategorias = categorias.slice(0, 2);
        const remainingCategoriasCount =
          categorias.length - displayedCategorias.length;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='flex flex-wrap gap-1 cursor-pointer'>
                  {displayedCategorias.map((categoria) => (
                    <Badge key={categoria} variant='secondary'>
                      {categoria}
                    </Badge>
                  ))}
                  {remainingCategoriasCount > 0 && (
                    <Badge variant='secondary'>
                      +{remainingCategoriasCount}
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className='flex flex-col gap-1'>
                  {categorias.map((categoria) => (
                    <span key={categoria}>{categoria}</span>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: 'modalidadesSexo',
      header: 'Sexo',
      cell: ({ row }) => {
        const sexos = row.original.modalidadesSexo;
        if (!sexos || sexos.length === 0) return <span>N/A</span>;

        const displayedSexos = sexos.slice(0, 2);
        const remainingSexosCount = sexos.length - displayedSexos.length;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='flex flex-wrap gap-1 cursor-pointer'>
                  {displayedSexos.map((sexo) => (
                    <Badge key={sexo} variant='secondary'>
                      {sexo}
                    </Badge>
                  ))}
                  {remainingSexosCount > 0 && (
                    <Badge variant='secondary'>+{remainingSexosCount}</Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className='flex flex-col gap-1'>
                  {sexos.map((sexo) => (
                    <span key={sexo}>{sexo}</span>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: 'faixaEtaria',
      header: 'Faixa Etária',
      cell: ({ row }) => {
        const faixas = row.original.faixaEtaria;
        if (!faixas || faixas.length === 0) return <span>N/A</span>;

        const displayedFaixas = faixas.slice(0, 2);
        const remainingFaixasCount = faixas.length - displayedFaixas.length;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='flex flex-wrap gap-1 cursor-pointer'>
                  {displayedFaixas.map((faixa) => (
                    <Badge key={faixa} variant='secondary'>
                      {faixa}
                    </Badge>
                  ))}
                  {remainingFaixasCount > 0 && (
                    <Badge variant='secondary'>+{remainingFaixasCount}</Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className='flex flex-col gap-1'>
                  {faixas.map((faixa) => (
                    <span key={faixa}>{faixa}</span>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: 'divisoes',
      header: 'Divisões',
      cell: ({ row }) => {
        const divisoes = row.original.divisoes;
        if (!divisoes || divisoes.length === 0) return <span>N/A</span>;

        const displayedDivisoes = divisoes.slice(0, 2);
        const remainingDivisoesCount =
          divisoes.length - displayedDivisoes.length;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='flex flex-wrap gap-1 cursor-pointer'>
                  {displayedDivisoes.map((divisao) => (
                    <Badge key={divisao} variant='outline'>
                      {divisao}
                    </Badge>
                  ))}
                  {remainingDivisoesCount > 0 && (
                    <Badge variant='outline'>+{remainingDivisoesCount}</Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className='flex flex-col gap-1'>
                  {divisoes.map((divisao) => (
                    <span key={divisao}>{divisao}</span>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
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
                  <Label>Categoria *</Label>
                  {categoriasFields.map((field, index) => (
                    <div
                      key={field.id}
                      className='flex items-center gap-2 p-2 border rounded-lg'
                    >
                      <div className='grid grid-cols-1 gap-2 flex-1'>
                        <Input
                          {...register(`categoria.${index}.nome`)}
                          placeholder='Ex: Individual, Coletivo, Duplas'
                        />
                      </div>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() => removeCategoria(index)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => appendCategoria({ nome: '' })}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Adicionar Categoria
                  </Button>
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
                <Label>Sexo da Modalidade</Label>
                {modalidadesSexoFields.map((field, index) => (
                  <div
                    key={field.id}
                    className='flex items-center gap-2 p-2 border rounded-lg'
                  >
                    <div className='grid grid-cols-1 gap-2 flex-1'>
                      <Input
                        {...register(`modalidadesSexo.${index}.nome`)}
                        placeholder='Ex: Masculino, Feminino, Misto'
                      />
                    </div>
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      onClick={() => removeModalidadeSexo(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => appendModalidadeSexo({ nome: '' })}
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Adicionar Sexo
                </Button>
              </div>

              <div className='space-y-4'>
                <Label>Faixa Etária</Label>
                {faixaEtariaFields.map((field, index) => (
                  <div
                    key={field.id}
                    className='flex items-center gap-2 p-2 border rounded-lg'
                  >
                    <div className='grid grid-cols-1 gap-2 flex-1'>
                      <Input
                        {...register(`faixaEtaria.${index}.nome`)}
                        placeholder='Ex: Sub-10, Adulto, Livre'
                      />
                    </div>
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      onClick={() => removeFaixaEtaria(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => appendFaixaEtaria({ nome: '' })}
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Adicionar Faixa Etária
                </Button>
              </div>

              <div className='space-y-4'>
                <Label>Divisões (Opcional)</Label>
                {divisoesFields.map((field, index) => (
                  <div
                    key={field.id}
                    className='flex items-center gap-2 p-2 border rounded-lg'
                  >
                    <div className='grid grid-cols-1 gap-2 flex-1'>
                      <Input
                        {...register(`divisoes.${index}.nome`)}
                        placeholder='Nome da divisão (Ex: Sub-20)'
                      />
                    </div>
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      onClick={() => removeDivisao(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => appendDivisao({ nome: '' })}
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Adicionar Divisão
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
