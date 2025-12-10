import { useMemo, useState } from 'react';
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
import { DataTable } from '@/app/Dashboard/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const orgaos = [
  'PMDF',
  'CBMDF',
  'PCDF',
  'PRF',
  'SSP-DF',
  'DETRAN-DF',
  'PF',
  'PPDF',
  'PPF',
  'PLDF',
  'PLF',
  'SEJUS',
];

const classificacaoSchema = z.object({
  modalidadeId: z.string().min(1, 'Modalidade é obrigatória'),
  posicao: z.coerce.number().min(1, 'Posição é obrigatória'),
  inscricaoId: z.string().optional(),
  lotacao: z.string().optional(),
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
  const [modalidadeTypeFilter, setModalidadeTypeFilter] = useState<
    'all' | 'individual' | 'coletiva'
  >('all');

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
    data: modalidades = [],
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
    control,
    watch,
    formState: { errors },
  } = useForm<ClassificacaoFormData>({
    resolver: zodResolver(classificacaoSchema) as any,
    defaultValues: { dynamicFields: {} },
  });

  const watchedModalidadeId = watch('modalidadeId');

  const watchedDynamicFields = useMemo(
    () => watch('dynamicFields') || {},
    [watch],
  );

  const { data: inscricoes = [] } = useQuery<Inscricao[], Error>({
    queryKey: ['inscricoes', watchedModalidadeId],
    queryFn: () => fetchInscricoesByModalidade(watchedModalidadeId),
    enabled: !!watchedModalidadeId,
  });

  const filteredModalidades = useMemo(() => {
    return modalidades.filter(() => {
      if (modalidadeTypeFilter === 'all') return true;
      if (modalidadeTypeFilter === 'individual') return false;
      if (modalidadeTypeFilter === 'coletiva') return false;
      return true;
    });
  }, [modalidades, modalidadeTypeFilter]);

  const selectedModalidade = useMemo(
    () => modalidades.find((m) => m.id === watchedModalidadeId) ?? null,
    [modalidades, watchedModalidadeId],
  );

  const dynamicFields = useMemo(() => {
    if (!selectedModalidade) return null;
    const nodes: React.ReactNode[] = [];
    const { divisoes, modalidadesSexo, faixaEtaria } = selectedModalidade;

    if (modalidadesSexo?.length) {
      nodes.push(
        <SelectField
          key='sexo'
          name={'dynamicFields.sexo'}
          control={control}
          label='Sexo'
          options={modalidadesSexo.map((s) => ({ value: s }))}
          placeholder='Selecione o sexo'
        />,
      );
    }

    if (faixaEtaria?.length) {
      nodes.push(
        <SelectField
          key='faixaEtaria'
          name={'dynamicFields.faixaEtaria'}
          control={control}
          label='Faixa Etária'
          options={faixaEtaria.map((f) => ({ value: f }))}
          placeholder='Selecione a faixa etária'
        />,
      );
    }

    if (divisoes) {
      const isStringArray =
        Array.isArray(divisoes) && divisoes.every((d) => typeof d === 'string');
      if (isStringArray) {
        nodes.push(
          <SelectField
            key='divisao-string'
            name={'dynamicFields.divisao'}
            control={control}
            label='Divisão'
            options={(divisoes as string[]).map((d) => ({ value: d }))}
            placeholder='Selecione a divisão'
          />,
        );
      } else {
        const divs = divisoes as any[];
        const hasNomes = divs.every((d) => !!d.nome);

        nodes.push(
          <SelectField
            key='divisao-obj'
            name={'dynamicFields.divisao'}
            control={control}
            label={hasNomes ? 'Divisão' : 'Tipo'}
            options={(divs || []).map((d) => ({
              value: hasNomes ? d.nome : d.tipo,
              label: hasNomes ? d.nome : d.tipo,
            }))}
            placeholder='Selecione a divisão'
          />,
        );

        const selectedDiv = watchedDynamicFields?.divisao
          ? divs.find(
              (d) =>
                d.nome === watchedDynamicFields.divisao ||
                d.tipo === watchedDynamicFields.divisao,
            )
          : null;

        if (selectedDiv) {
          if (selectedDiv.pesos) {
            let pesos: string[] = [];
            const sexo = (watchedDynamicFields?.sexo || '').toLowerCase();
            if (Array.isArray(selectedDiv.pesos)) {
              pesos = selectedDiv.pesos;
            } else if (sexo && selectedDiv.pesos[sexo]) {
              pesos = selectedDiv.pesos[sexo];
            } else {
              if (selectedDiv.pesos.masculino)
                pesos.push(...(selectedDiv.pesos.masculino || []));
              if (selectedDiv.pesos.feminino)
                pesos.push(...(selectedDiv.pesos.feminino || []));
            }
            if (pesos.length) {
              nodes.push(
                <SelectField
                  key='peso'
                  name={'dynamicFields.peso'}
                  control={control}
                  label='Peso'
                  options={pesos.map((p: string) => ({ value: p }))}
                  placeholder='Selecione o peso'
                />,
              );
            }
          }

          if (selectedDiv.provas) {
            nodes.push(
              <SelectField
                key='prova'
                name={'dynamicFields.prova'}
                control={control}
                label='Prova'
                options={(selectedDiv.provas || []).map((p: string) => ({
                  value: p,
                }))}
                placeholder='Selecione a prova'
              />,
            );
          }

          if (selectedDiv.categorias) {
            nodes.push(
              <SelectField
                key='faixa'
                name={'dynamicFields.faixaEtaria'}
                control={control}
                label='Faixa Etária'
                options={(selectedDiv.categorias || []).map((c: any) => ({
                  value: `${c.sexo} - ${c.faixaEtaria}`,
                  label: `${c.sexo} - ${c.faixaEtaria}`,
                }))}
                placeholder='Selecione a faixa etária'
              />,
            );
          }
        }
      }
    }

    return nodes.length ? nodes : null;
  }, [selectedModalidade, control, watchedDynamicFields]);

  const mutation = useMutation<
    Response,
    Error,
    { data: ClassificacaoFormData; id?: string | null }
  >({
    mutationFn: async ({ data, id }) => {
      const modalidade = modalidades.find((m) => m.id === data.modalidadeId);
      const payload = { ...data, modalidade: modalidade?.nome };
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
      accessorKey: 'lotacao',
      header: 'Lotação',
      cell: ({ row }) => row.original.lotacao || 'N/A',
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

  const onSubmit = (data: ClassificacaoFormData) =>
    mutation.mutate({ data, id: editingId });

  function handleEdit(classificacao: Classificacao) {
    setEditingId(classificacao.id);
    reset();
    setValue('modalidadeId', classificacao.modalidadeId);
    setValue('posicao', classificacao.posicao);
    setValue('inscricaoId', classificacao.inscricaoId || '');
    setValue('lotacao', classificacao.lotacao || '');
    setValue('tempo', classificacao.tempo || '');
    setValue('distancia', classificacao.distancia || '');
    setValue('observacoes', classificacao.observacoes || '');
    setValue('atleta', classificacao.atleta || '');
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
    reset();
    setEditingId(null);
    setIsDialogOpen(true);
  }

  const tipoProva = useMemo(() => {
    if (!selectedModalidade) return 'Individual';
    return 'Individual';
  }, [selectedModalidade]);

  return (
    <QueryStateHandler
      isLoading={isLoadingClassificacoes || isLoadingModalidades}
      isError={isErrorClassificacoes || isErrorModalidades}
      error={errorClassificacoes || errorModalidades}
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
                    onValueChange={(
                      value: 'all' | 'individual' | 'coletiva',
                    ) => {
                      setModalidadeTypeFilter(value);
                      setValue('modalidadeId', '');
                    }}
                    value={modalidadeTypeFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Filtrar por tipo' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Todas</SelectItem>
                      <SelectItem value='individual'>Individual</SelectItem>
                      <SelectItem value='coletiva'>Coletiva</SelectItem>
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

                {dynamicFields}

                {tipoProva === 'Individual' && (
                  <div className='space-y-2'>
                    <Label>Atleta Inscrito</Label>
                    <Controller
                      name='inscricaoId'
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedInscricao = inscricoes.find(
                              (i) => i.id === value,
                            );
                            if (selectedInscricao) {
                              setValue('atleta', selectedInscricao.nome);
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione o atleta' />
                          </SelectTrigger>
                          <SelectContent>
                            {inscricoes.map((i) => (
                              <SelectItem key={i.id} value={i.id}>
                                {i.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
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
                {tipoProva === 'Coletiva' && (
                  <div className='space-y-2'>
                    <Label htmlFor='atleta'>Equipe</Label>
                    <Input id='atleta' {...register('atleta')} />
                  </div>
                )}

                <SelectField
                  name='lotacao'
                  control={control}
                  label='Lotação'
                  options={orgaos.map((o) => ({ value: o, label: o }))}
                  placeholder='Selecione a lotação'
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
