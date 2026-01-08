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

import { Trash2, Edit, Plus, Save, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

import QueryStateHandler from '../ui/query-state-handler';
import { DataTable } from '@/app/Dashboard/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const modalidadeSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  maxParticipantes: z
    .number()
    .min(1, 'Máximo de participantes deve ser maior que 0'),
  status: z.enum([
    'inscricoes-abertas',
    'inscricoes-fechadas',
    'em-andamento',
    'finalizada',
  ]),
  vagasPorEquipe: z.array(z.record(z.string(), z.any())),
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
  const [addedFields, setAddedFields] = useState<string[]>([]);
  const [newFieldNames, setNewFieldNames] = useState<Record<number, string>>(
    {},
  );
  const [expandedVagas, setExpandedVagas] = useState<Record<number, boolean>>(
    {},
  );

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
    getValues,
    control,
    formState: { errors },
  } = useForm<ModalidadeFormData>({
    resolver: zodResolver(modalidadeSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      maxParticipantes: 0,
      status: 'inscricoes-abertas',
      vagasPorEquipe: [],
    },
  });

  const {
    fields: vagasPorEquipeFields,
    append: appendVaga,
    remove: removeVaga,
  } = useFieldArray({
    control: control as any,
    name: 'vagasPorEquipe',
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
    const { vagasPorEquipe, ...rest } = data;
    const formattedData: any = { ...rest };

    if (vagasPorEquipe) {
      formattedData.vagasPorEquipe = vagasPorEquipe.map((vaga) => {
        const newVaga: any = { ...vaga };
        if (newVaga.graduacoes && typeof newVaga.graduacoes === 'string')
          newVaga.graduacoes = newVaga.graduacoes
            .split(',')
            .map((s: string) => s.trim());
        if (newVaga.faixasEtarias && typeof newVaga.faixasEtarias === 'string')
          newVaga.faixasEtarias = newVaga.faixasEtarias
            .split(',')
            .map((s: string) => s.trim());
        if (
          newVaga.categoriasPeso &&
          typeof newVaga.categoriasPeso === 'string'
        )
          newVaga.categoriasPeso = newVaga.categoriasPeso
            .split(',')
            .map((s: string) => s.trim());
        if (newVaga.provas && typeof newVaga.provas === 'string')
          newVaga.provas = newVaga.provas
            .split(',')
            .map((s: string) => s.trim());

        Object.keys(newVaga).forEach((key) => {
          if (
            newVaga[key] === '' ||
            newVaga[key] === null ||
            newVaga[key] === undefined ||
            Number.isNaN(newVaga[key]) ||
            (Array.isArray(newVaga[key]) && newVaga[key].length === 0)
          ) {
            delete newVaga[key];
          }
        });
        return newVaga;
      });
    } else {
      formattedData.vagasPorEquipe = null;
    }

    mutation.mutate({
      data: formattedData,
      id: editingId,
    });
  };

  const handleEdit = (modalidade: Modalidade) => {
    setEditingId(modalidade.id);
    setValue('nome', modalidade.nome);
    setValue('descricao', modalidade.descricao);
    setValue('maxParticipantes', modalidade.maxParticipantes);
    setValue(
      'status',
      (modalidade.status as any) === 'inscricoes-encerradas'
        ? 'inscricoes-fechadas'
        : modalidade.status,
    );

    const vagas = modalidade.vagasPorEquipe
      ? (modalidade.vagasPorEquipe as any[]).map((vaga) => {
          const newVaga = { ...vaga };
          if (newVaga.graduacoes)
            newVaga.graduacoes = newVaga.graduacoes.join(', ');
          if (newVaga.faixasEtarias)
            newVaga.faixasEtarias = newVaga.faixasEtarias.join(', ');
          if (newVaga.categoriasPeso)
            newVaga.categoriasPeso = newVaga.categoriasPeso.join(', ');
          if (newVaga.provas) newVaga.provas = newVaga.provas.join(', ');
          return newVaga;
        })
      : [];

    setValue('vagasPorEquipe', vagas);
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

  const getExistingFields = (vaga: any): string[] => {
    const allFields = [
      'genero',
      'tipo',
      'categoria',
      'equipes',
      'atletasPorEquipe',
      'totalAtletas',
      'graduacoes',
      'faixasEtarias',
      'pesosPorCategoria',
      'vagasPorPeso',
      'categoriasPeso',
      'vagasPorCategoria',
      'vagasPorFaixa',
      'provas',
      'prova',
    ];
    return allFields.filter((field) => {
      const value = vaga[field];
      return (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        (!Array.isArray(value) || value.length > 0)
      );
    });
  };

  const columns: ColumnDef<Modalidade>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome',
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

                <div className='space-y-2 md:col-span-2'>
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
                <Label>Vagas por Equipe</Label>
                <div className='space-y-3'>
                  {vagasPorEquipeFields.map((field, index) => {
                    const existingFields = getExistingFields(field as any);

                    const fieldConfig: Record<
                      string,
                      { label: string; type?: string; placeholder: string }
                    > = {
                      genero: { label: 'Gênero', placeholder: 'Gênero' },
                      tipo: { label: 'Tipo', placeholder: 'Tipo' },
                      categoria: {
                        label: 'Categoria',
                        placeholder: 'Categoria',
                      },
                      equipes: {
                        label: 'Equipes',
                        type: 'number',
                        placeholder: 'Ex: 4',
                      },
                      atletasPorEquipe: {
                        label: 'Atletas / Equipe',
                        type: 'number',
                        placeholder: 'Ex: 5',
                      },
                      totalAtletas: {
                        label: 'Total de Atletas',
                        type: 'number',
                        placeholder: 'Ex: 20',
                      },
                      graduacoes: {
                        label: 'Graduações',
                        placeholder: 'Graduações (vírgula-separadas)',
                      },
                      faixasEtarias: {
                        label: 'Faixas Etárias',
                        placeholder: 'Faixas Etárias (vírgula-separadas)',
                      },
                      pesosPorCategoria: {
                        label: 'Pesos por Categoria',
                        type: 'number',
                        placeholder: '',
                      },
                      vagasPorPeso: {
                        label: 'Vagas por Peso',
                        type: 'number',
                        placeholder: '',
                      },
                      categoriasPeso: {
                        label: 'Categorias de Peso',
                        placeholder: 'Categorias (vírgula-separadas)',
                      },
                      vagasPorCategoria: {
                        label: 'Vagas por Categoria',
                        type: 'number',
                        placeholder: '',
                      },
                      vagasPorFaixa: {
                        label: 'Vagas por Faixa',
                        type: 'number',
                        placeholder: '',
                      },
                      provas: {
                        label: 'Provas',
                        placeholder: 'Provas (vírgula-separadas)',
                      },
                      prova: {
                        label: 'Prova',
                        placeholder: 'Prova (opcional)',
                      },
                    };

                    return (
                      <div
                        key={field.id}
                        className='border rounded-lg p-4 bg-muted/30 space-y-3'
                      >
                        <div className='flex items-center justify-between mb-3'>
                          <h4 className='font-medium text-sm'>
                            Vaga #{index + 1}
                          </h4>
                          <div className='flex items-center gap-2'>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                setExpandedVagas((prev) => ({
                                  ...prev,
                                  [index]: !prev[index],
                                }))
                              }
                              aria-label='Expandir/Colapsar'
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${expandedVagas[index] ? 'rotate-180' : ''}`}
                              />
                            </Button>
                            <Button
                              type='button'
                              variant='destructive'
                              size='sm'
                              onClick={() => removeVaga(index)}
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>

                        {expandedVagas[index] ? (
                          <>
                            <div className='space-y-3'>
                              {existingFields.length === 0 ? (
                                <p className='text-xs text-muted-foreground italic'>
                                  Sem campos preenchidos
                                </p>
                              ) : (
                                existingFields.map((fieldName) => (
                                  <div
                                    key={fieldName}
                                    className='flex items-end gap-2'
                                  >
                                    <div className='flex-1'>
                                      <Label className='text-xs'>
                                        {fieldConfig[fieldName]?.label}
                                      </Label>
                                      <Input
                                        type={
                                          fieldConfig[fieldName]?.type || 'text'
                                        }
                                        min={
                                          fieldConfig[fieldName]?.type ===
                                          'number'
                                            ? 0
                                            : undefined
                                        }
                                        placeholder={
                                          fieldConfig[fieldName]?.placeholder
                                        }
                                        {...register(
                                          `vagasPorEquipe.${index}.${fieldName}`,
                                        )}
                                      />
                                    </div>
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      size='sm'
                                      onClick={() => {
                                        const arr =
                                          (getValues(
                                            'vagasPorEquipe',
                                          ) as any[]) || [];
                                        const newArr = arr.map((v, i) =>
                                          i === index ? { ...(v || {}) } : v,
                                        );
                                        if (
                                          newArr[index] &&
                                          Object.prototype.hasOwnProperty.call(
                                            newArr[index],
                                            fieldName,
                                          )
                                        ) {
                                          delete newArr[index][fieldName];
                                          setValue('vagasPorEquipe', newArr);
                                          setAddedFields((prev) =>
                                            prev.filter((f) => f !== fieldName),
                                          );
                                          toast.success('Campo removido');
                                        }
                                      }}
                                      title='Remover campo'
                                    >
                                      <Trash2 className='h-4 w-4' />
                                    </Button>
                                  </div>
                                ))
                              )}
                            </div>

                            {Object.keys(fieldConfig).filter(
                              (f) => !existingFields.includes(f),
                            ).length > 0 && (
                              <div className='border-t pt-3'>
                                <div className='flex gap-2'>
                                  <Input
                                    placeholder='+ Adicionar campo'
                                    value={newFieldNames[index] || ''}
                                    onChange={(e) =>
                                      setNewFieldNames({
                                        ...newFieldNames,
                                        [index]: e.target.value,
                                      })
                                    }
                                  />
                                  <Button
                                    type='button'
                                    onClick={() => {
                                      const raw = (
                                        newFieldNames[index] || ''
                                      ).trim();
                                      if (!raw) {
                                        toast.error('Informe o nome do campo');
                                        return;
                                      }
                                      const fieldName = raw;
                                      if (
                                        existingFields.includes(fieldName) ||
                                        addedFields.includes(fieldName)
                                      ) {
                                        toast.error('Campo já adicionado');
                                        return;
                                      }
                                      setValue(
                                        `vagasPorEquipe.${index}.${fieldName}`,
                                        '',
                                      );
                                      setAddedFields([
                                        ...addedFields,
                                        fieldName,
                                      ]);
                                      setNewFieldNames({
                                        ...newFieldNames,
                                        [index]: '',
                                      });
                                    }}
                                  >
                                    Adicionar
                                  </Button>
                                </div>
                              </div>
                            )}
                          </>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <Button
                  type='button'
                  variant='outline'
                  onClick={() => appendVaga({})}
                  className='w-full'
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Adicionar Vaga
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
