import { useMemo, useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, Edit, Plus } from 'lucide-react';
import { toast } from 'sonner';
import QueryStateHandler from '../ui/query-state-handler';
import { Classificacao } from '@/types/classificacao';
import { Modalidade } from '@/types/modalidade';
import { Inscricao } from '@/types/inscricao';
import { Equipe } from '@/types/equipe';
import { DataTable } from '@/app/Dashboard/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

async function fetchEquipes(): Promise<Equipe[]> {
  const res = await fetch('/api/equipes');
  if (!res.ok) throw new Error('Erro ao carregar equipes');
  const data = await res.json();
  return data.dados || data;
}

const classificacaoSchema = z.object({
  modalidadeId: z.string().min(1, 'Modalidade é obrigatória'),
  posicao: z.coerce.number().min(1, 'Posição é obrigatória'),
  inscricaoId: z.string().optional(),
  equipe: z.string().optional(),
  tempo: z.string().optional(),
  distancia: z.string().optional(),
  observacoes: z.string().optional(),
  atleta: z.string().optional(),
  dynamicFields: z.record(z.string(), z.string().optional()).optional(),
});
type ClassificacaoFormData = z.output<typeof classificacaoSchema>;

async function fetchClassificacoes(): Promise<Classificacao[]> {
  const res = await fetch('/api/classificacoes?estatisticas=false');
  if (!res.ok) throw new Error('Erro ao carregar classificações');
  const data = await res.json();
  return data.dados || data;
}
async function fetchModalidades(): Promise<Modalidade[]> {
  const res = await fetch('/api/modalidades?estatisticas=false');
  if (!res.ok) throw new Error('Erro ao carregar modalidades');
  const data = await res.json();
  return data.dados || data;
}

async function fetchInscricoesByModalidade(
  modalidadeId: string,
): Promise<Inscricao[]> {
  if (!modalidadeId) return [];
  const res = await fetch(`/api/inscricoes/modalidade/${modalidadeId}`);
  if (!res.ok) throw new Error('Erro ao carregar inscrições');
  const data = await res.json();
  return data.dados || data;
}

function SelectField({
  name,
  control,
  label,
  options,
  placeholder = 'Selecione',
}: {
  name: string;
  control: any;
  label: string;
  options: { value: string; label?: string }[];
  placeholder?: string;
}) {
  return (
    <div className='space-y-2'>
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label ?? o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

export default function ClassificacoesForm() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [atletaInputValue, setAtletaInputValue] = useState('');
  const [atletaShowOptions, setAtletaShowOptions] = useState(false);
  const atletaInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<ClassificacaoFormData>({
    resolver: zodResolver(classificacaoSchema) as any,
    defaultValues: { dynamicFields: {} },
  });

  const watchedInscricaoId = watch('inscricaoId');
  const watchedModalidadeId = watch('modalidadeId');
  const { data: inscricoes = [] } = useQuery<Inscricao[], Error>({
    queryKey: ['inscricoes', watchedModalidadeId],
    queryFn: () => fetchInscricoesByModalidade(watchedModalidadeId),
    enabled: !!watchedModalidadeId,
  });
  useEffect(() => {
    const selectedInscricao = inscricoes?.find(
      (i) => i.id === watchedInscricaoId,
    );
    if (selectedInscricao && atletaInputValue !== selectedInscricao.nome) {
      setAtletaInputValue(selectedInscricao.nome);
    }
    if (!selectedInscricao && atletaInputValue !== '') {
      setAtletaInputValue('');
    }
  }, [watchedInscricaoId, inscricoes, atletaInputValue]);
  const {
    data: classificacoes = [],
    isLoading: isLoadingClassificacoes,
    isError: isErrorClassificacoes,
    error: errorClassificacoes,
  } = useQuery<Classificacao[], Error>({
    queryKey: ['classificacoes'],
    queryFn: fetchClassificacoes,
  });

  const {
    data: modalidadesRaw = [],
    isLoading: isLoadingModalidades,
    isError: isErrorModalidades,
    error: errorModalidades,
  } = useQuery<Modalidade[], Error>({
    queryKey: ['modalidades'],
    queryFn: fetchModalidades,
  });

  const modalidades = useMemo(() => {
    return modalidadesRaw.map((mod) => {
      const vagas = (mod.vagasPorEquipe as any[]) || [];
      const allSexos = [...new Set(vagas.map((v) => v.genero).filter(Boolean))];
      const allCategorias = [
        ...new Set(
          vagas
            .flatMap((v) => v.categoria || v.graduacoes || v.provas || [])
            .filter(Boolean),
        ),
      ];
      const allFaixasEtarias = [
        ...new Set(vagas.flatMap((v) => v.faixasEtarias || []).filter(Boolean)),
      ];
      const allDivisoes = [
        ...new Set(
          vagas.flatMap((v) => v.categoriasPeso || []).filter(Boolean),
        ),
      ];

      return {
        ...mod,
        modalidadesSexo: allSexos,
        categoria: allCategorias,
        faixaEtaria: allFaixasEtarias,
        divisoes: allDivisoes,
      };
    });
  }, [modalidadesRaw]);

  const {
    data: equipes = [],
    isLoading: isLoadingEquipes,
    isError: isErrorEquipes,
    error: errorEquipes,
  } = useQuery<Equipe[], Error>({
    queryKey: ['equipes'],
    queryFn: fetchEquipes,
  });

  const [modalidadeTypeFilter, setModalidadeTypeFilter] =
    useState<string>('all');

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    modalidades.forEach((m) => {
      const vagas = (m.vagasPorEquipe as any[]) || [];
      vagas.forEach((v) => {
        if (v.tipo) categories.add(v.tipo);
      });
    });
    return Array.from(categories);
  }, [modalidades]);

  const filteredModalidades = useMemo(() => {
    return modalidades.filter((modalidade) => {
      if (modalidadeTypeFilter === 'all') return true;
      const vagas = (modalidade.vagasPorEquipe as any[]) || [];
      return vagas.some((v) => v.tipo === modalidadeTypeFilter);
    });
  }, [modalidades, modalidadeTypeFilter]);

  const selectedModalidade = useMemo(
    () => modalidades.find((m) => m.id === watchedModalidadeId) ?? null,
    [modalidades, watchedModalidadeId],
  );

  const selectedInscricao = useMemo(
    () => inscricoes.find((i) => i.id === watchedInscricaoId),
    [inscricoes, watchedInscricaoId],
  );

  const inscricaoDetalhes = useMemo(() => {
    if (!selectedInscricao || !selectedInscricao.modalidades?.[0]?.detalhes) {
      return null;
    }
    const detalhesRaw = selectedInscricao.modalidades[0].detalhes;

    if (typeof detalhesRaw === 'string') {
      try {
        return JSON.parse(detalhesRaw);
      } catch {
        return detalhesRaw;
      }
    }

    return detalhesRaw;
  }, [selectedInscricao]);

  const detalhesCampos = useMemo(() => {
    if (!inscricaoDetalhes) return [];

    return Object.keys(inscricaoDetalhes).map((key) => ({
      key,
      value: inscricaoDetalhes[key],
      label: String(inscricaoDetalhes[key]),
    }));
  }, [inscricaoDetalhes]);

  const mutation = useMutation<
    Response,
    Error,
    { data: ClassificacaoFormData; id?: string | null }
  >({
    mutationFn: async ({ data, id }) => {
      const modalidade = modalidades.find((m) => m.id === data.modalidadeId);
      const { ...rest } = data;
      const payload = {
        ...rest,
        modalidade: modalidade?.nome,
      };
      const url = id ? `/api/classificacoes/${id}` : '/api/classificacoes';
      const method = id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classificacoes'] });
      toast.success(
        editingId ? 'Classificação atualizada!' : 'Classificação criada!',
      );
      handleCancel();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation<Response, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/classificacoes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao excluir classificação');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classificacoes'] });
      toast.success('Classificação excluída!');
    },
    onError: (err) => toast.error(err.message),
  });

  const columns: ColumnDef<Classificacao>[] = [
    {
      accessorKey: 'atleta',
      header: 'Atleta/Equipe',
      cell: ({ row }) => row.original.atleta || 'Equipe',
    },
    { accessorKey: 'modalidade', header: 'Modalidade' },
    {
      accessorKey: 'posicao',
      header: 'Posição',
      cell: ({ row }) => `${row.original.posicao}º`,
    },
    {
      accessorKey: 'equipe',
      header: 'Equipe',
      cell: ({ row }) => {
        const equipeId = row.original.equipe;
        if (!equipeId) return 'N/A';
        const equipeObj = equipes.find((e) => e.id === equipeId);
        return equipeObj ? equipeObj.nome : equipeId;
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const classificacao = row.original;
        return (
          <div className='flex gap-2 justify-end'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => handleEdit(classificacao)}
            >
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant='destructive'
              onClick={() => handleDelete(classificacao.id)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        );
      },
    },
  ];

  const onSubmit = (data: ClassificacaoFormData) => {
    const { dynamicFields, ...rest } = data;
    mutation.mutate({
      data: { ...rest, detalhes: dynamicFields } as any,
      id: editingId,
    });
  };

  function handleEdit(classificacao: Classificacao) {
    setEditingId(classificacao.id);
    const detalhes =
      classificacao.detalhes || classificacao.dynamicFields || {};
    let equipeId = '';
    if (classificacao.equipe) {
      const equipeObj = equipes.find(
        (e) => e.id === classificacao.equipe || e.nome === classificacao.equipe,
      );
      equipeId = equipeObj ? equipeObj.id : classificacao.equipe;
    }
    reset({
      modalidadeId: classificacao.modalidadeId,
      posicao: classificacao.posicao,
      inscricaoId: classificacao.inscricaoId || '',
      equipe: equipeId,
      tempo: classificacao.tempo || '',
      distancia: classificacao.distancia || '',
      observacoes: classificacao.observacoes || '',
      atleta: classificacao.atleta || '',
      dynamicFields: detalhes,
    });
    setIsDialogOpen(true);
  }

  function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta classificação?')) return;
    deleteMutation.mutate(id);
  }

  function handleCancel() {
    reset();
    setEditingId(null);
    setIsDialogOpen(false);
  }

  function handleAddNew() {
    reset({
      modalidadeId: '',
      posicao: undefined,
      inscricaoId: '',
      equipe: '',
      tempo: '',
      distancia: '',
      observacoes: '',
      atleta: '',
      dynamicFields: {},
    });
    setEditingId(null);
    setIsDialogOpen(true);
  }

  const tipoProva = useMemo(() => {
    if (!selectedModalidade) return '';
    const vagas = (selectedModalidade.vagasPorEquipe as any[]) || [];
    return vagas.some((v) => v.tipo === 'individual')
      ? 'Individual'
      : 'Coletiva';
  }, [selectedModalidade]);

  return (
    <QueryStateHandler
      isLoading={
        isLoadingClassificacoes || isLoadingModalidades || isLoadingEquipes
      }
      isError={isErrorClassificacoes || isErrorModalidades || isErrorEquipes}
      error={errorClassificacoes || errorModalidades || errorEquipes}
      loadingMessage='Carregando classificações...'
    >
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Gerenciar Classificações</CardTitle>
              <Button onClick={handleAddNew}>
                <Plus className='h-4 w-4 mr-2' />
                Nova Classificação
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={classificacoes}
              filterColumn='atleta'
            />
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Classificação' : 'Nova Classificação'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label>Tipo de Modalidade</Label>
                  <Select
                    onValueChange={(value) => {
                      setModalidadeTypeFilter(value);
                      setValue('modalidadeId', '');
                    }}
                    value={modalidadeTypeFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Filtrar por categoria' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Todas as Categorias</SelectItem>
                      {uniqueCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label>Modalidade *</Label>
                  <Controller
                    name='modalidadeId'
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(v) => {
                          field.onChange(v);
                          setValue('inscricaoId', '');
                          setValue('atleta', '');
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione a modalidade' />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredModalidades.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.modalidadeId && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.modalidadeId.message}
                    </p>
                  )}
                </div>

                {tipoProva === 'Individual' && (
                  <div className='space-y-2 relative'>
                    <Label>Atleta Inscrito</Label>
                    <Controller
                      name='inscricaoId'
                      control={control}
                      render={({ field }) => {
                        const filtered = atletaInputValue
                          ? inscricoes.filter((i) =>
                              i.nome
                                .toLowerCase()
                                .includes(atletaInputValue.toLowerCase()),
                            )
                          : inscricoes;
                        return (
                          <div className='relative'>
                            <Input
                              ref={atletaInputRef}
                              placeholder='Digite o nome do atleta...'
                              value={atletaInputValue}
                              onChange={(e) => {
                                setAtletaInputValue(e.target.value);
                                setAtletaShowOptions(true);
                                field.onChange('');
                              }}
                              onFocus={() => setAtletaShowOptions(true)}
                              autoComplete='off'
                            />
                            {atletaShowOptions && filtered.length > 0 && (
                              <ul className='absolute z-10 bg-white border border-gray-200 rounded w-full max-h-48 overflow-auto shadow-lg mt-1'>
                                {filtered.map((i) => (
                                  <li
                                    key={i.id}
                                    className='px-3 py-2 cursor-pointer hover:bg-gray-100'
                                    onMouseDown={() => {
                                      setAtletaInputValue(i.nome);
                                      setAtletaShowOptions(false);
                                      field.onChange(i.id);
                                      setValue('atleta', i.nome);
                                    }}
                                  >
                                    {i.nome}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>
                )}

                {tipoProva === 'Individual' && detalhesCampos.length > 0 && (
                  <>
                    {detalhesCampos.map((detalhe) => (
                      <div key={detalhe.key} className='space-y-2'>
                        <Label htmlFor={detalhe.key}>
                          {detalhe.key.charAt(0).toUpperCase() +
                            detalhe.key.slice(1)}
                        </Label>
                        <Controller
                          name={`dynamicFields.${detalhe.key}`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ''}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={`Selecione ${detalhe.key}`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.isArray(detalhe.value) ? (
                                  detalhe.value.map((item, idx) => (
                                    <SelectItem key={idx} value={String(item)}>
                                      {String(item)}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value={detalhe.label}>
                                    {detalhe.label}
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    ))}
                  </>
                )}

                <div className='space-y-2'>
                  <Label htmlFor='posicao'>Posição *</Label>
                  <Input id='posicao' type='number' {...register('posicao')} />
                  {errors.posicao && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.posicao.message}
                    </p>
                  )}
                </div>

                <SelectField
                  name='equipe'
                  control={control}
                  label='Equipe'
                  options={Array.from(
                    new Map(
                      equipes
                        .filter((e) => e.nome !== 'ADMIN')
                        .map((e) => [e.nome, { value: e.id, label: e.nome }]),
                    ).values(),
                  )}
                  placeholder='Selecione a equipe'
                />

                <div className='space-y-2'>
                  <Label htmlFor='tempo'>Tempo</Label>
                  <Input id='tempo' {...register('tempo')} />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='distancia'>Distância</Label>
                  <Input id='distancia' {...register('distancia')} />
                </div>

                <div className='space-y-2 md:col-span-2'>
                  <Label htmlFor='observacoes'>Observações</Label>
                  <Textarea id='observacoes' {...register('observacoes')} />
                </div>
              </div>

              <DialogFooter>
                <Button type='button' variant='outline' onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </QueryStateHandler>
  );
}
