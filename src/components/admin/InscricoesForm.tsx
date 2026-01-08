'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Plus, Save, Download } from 'lucide-react';
import { toast } from 'sonner';
import { generatePDF } from '@/lib/pdf-utils';
import QueryStateHandler from '../ui/query-state-handler';
import { DataTable } from '@/app/Dashboard/data-table';
import { getInscricoesColumns } from '@/components/inscricoes/inscricoes-columns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modalidade } from '@/types/modalidade';
import { Inscricao } from '@/types/inscricao';

interface Equipe {
  id: string;
  nome: string;
}

interface FlattenedInscricaoData {
  modalidade: string;
  atleta: string;
  lotacao: string;
  camiseta: string;
  telefone: string;
  tipo: string;
  sexo_modalidade: string;
  categoria: string;
  faixaEtaria: string;
  divisao: string;
}

const LOTACOES_ORGAOS = [
  'PMDF',
  'CBMDF',
  'PCDF',
  'PRF',
  'SSPDF',
  'DETRANDF',
  'PF',
  'PPDF',
  'PPF',
  'PLDF',
  'PLSF',
  'PLCD',
  'SEJUS',
  'outro',
];

const modalidadeSelectionSchema = z.object({
  modalidadeId: z.string(),
  detalhes: z.record(z.string(), z.array(z.string())).optional(),
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
  equipeId: z.string().min(1, 'Equipe é obrigatória'),
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

async function fetchEquipes(): Promise<Equipe[]> {
  const response = await fetch('/api/equipes');
  if (!response.ok) {
    throw new Error('Erro ao carregar equipes');
  }
  return response.json();
}

async function fetchInscricoes(equipeId?: string | null): Promise<Inscricao[]> {
  const url = equipeId
    ? `/api/inscricoes?equipeId=${equipeId}`
    : '/api/inscricoes';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro ao carregar inscrições');
  }
  return response.json();
}

export default function InscricoesForm() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [equipeRole, setEquipeRole] = useState<string | null>(null);
  const [equipeNome, setEquipeNome] = useState<string | null>(null);
  const [loggedInEquipeId, setLoggedInEquipeId] = useState<string | null>(null);
  const [selectedModalidade, setSelectedModalidade] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchEquipeRole = async () => {
      try {
        const res = await fetch('/api/auth/verify');
        if (!res.ok) throw new Error('Não autenticado');
        const data = await res.json();
        setEquipeRole(data.role);
        setEquipeNome(data.equipeNome);
        setLoggedInEquipeId(data.equipeId);
      } catch (error) {
        console.error('Falha ao verificar o usuário:', error);
      }
    };
    fetchEquipeRole();
  }, []);

  const {
    data: inscricoes = [],
    isLoading,
    isError,
    error,
  } = useQuery<Inscricao[], Error>({
    queryKey: ['inscricoes', loggedInEquipeId],
    queryFn: () =>
      fetchInscricoes(equipeRole === 'ADMIN' ? null : loggedInEquipeId),
    enabled: !!equipeRole && (equipeRole === 'ADMIN' || !!loggedInEquipeId),
  });

  const { data: equipes = [] } = useQuery<Equipe[]>({
    queryKey: ['equipes'],
    queryFn: fetchEquipes,
    enabled: true,
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

  const filteredInscricoes = useMemo(() => {
    if (!selectedModalidade) {
      return inscricoes;
    }
    return inscricoes.filter((i) =>
      i.modalidades.some((m) => m.modalidadeId === selectedModalidade),
    );
  }, [inscricoes, selectedModalidade]);

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
      equipeId: '',
      sexo: '',
      modalidades: [],
      status: 'pendente',
    },
  });

  const watchedModalidades = watch('modalidades');

  const mutation = useMutation<
    Response,
    any,
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
        throw errorBody;
      }
      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscricoes'] });
      toast.success(editingId ? 'Inscrição atualizada!' : 'Inscrição criada!');
      handleCancel();
    },

    onError: (error: any) => {
      if (error && error.details && Array.isArray(error.details)) {
        const messages = error.details.map(
          (issue: { path: (string | number)[]; message: string }) =>
            `${issue.path.join('.')}: ${issue.message}`,
        );
        toast.error(`Erros de validação:\n- ${messages.join('\n- ')}`);
      } else if (error && error.error) {
        toast.error(error.error);
      } else {
        toast.error('Erro ao salvar inscrição. Tente novamente.');
      }
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
    const { equipeId, modalidades: selectedModalidades } = data;
    if (!equipeId) {
      toast.error('Nenhuma equipe selecionada.');
      return;
    }
    const equipe = equipes.find((e) => e.id === equipeId);

    for (const selectedMod of selectedModalidades) {
      const modalidade = modalidadesData.find(
        (m) => m.id === selectedMod.modalidadeId,
      );
      if (
        !modalidade ||
        !modalidade.vagasPorEquipe ||
        (modalidade.vagasPorEquipe as any[]).length === 0
      ) {
        continue;
      }

      const detalhesForm = selectedMod.detalhes || {};
      const formGenero = detalhesForm.sexo?.[0];
      const formTipo = detalhesForm.tipo?.[0];
      const formCategoria = detalhesForm.categoria?.[0];

      const vagaConfig = (modalidade.vagasPorEquipe as any[]).find((v) => {
        let isMatch = true;
        if (v.genero && v.genero !== 'Misto' && v.genero !== formGenero) {
          isMatch = false;
        }
        if (v.tipo && v.tipo !== formTipo) {
          isMatch = false;
        }

        const vagaCategorias = [
          v.categoria,
          ...(v.graduacoes || []),
          ...(v.provas || []),
        ].filter(Boolean);
        if (vagaCategorias.length > 0) {
          if (!formCategoria || !vagaCategorias.includes(formCategoria)) {
            isMatch = false;
          }
        }
        return isMatch;
      });

      if (vagaConfig && vagaConfig.totalAtletas) {
        const limite = vagaConfig.totalAtletas;

        let count = 0;
        const inscricoesDaEquipe = inscricoes.filter(
          (i) => i.equipeId === equipeId,
        );

        for (const inscricao of inscricoesDaEquipe) {
          if (inscricao.id === editingId) {
            continue;
          }

          const modInscrito = inscricao.modalidades.find(
            (m) => m.modalidadeId === selectedMod.modalidadeId,
          );
          if (modInscrito) {
            const detalhesInscrito = (modInscrito.detalhes as any) || {};
            const inscritoGenero = detalhesInscrito.sexo?.[0];
            const inscritoTipo = detalhesInscrito.tipo?.[0];
            const inscritoCategoria = detalhesInscrito.categoria?.[0];

            let isInVaga = true;
            if (
              vagaConfig.genero &&
              vagaConfig.genero !== 'Misto' &&
              vagaConfig.genero !== inscritoGenero
            )
              isInVaga = false;
            if (vagaConfig.tipo && vagaConfig.tipo !== inscritoTipo)
              isInVaga = false;

            const vagaCategorias = [
              vagaConfig.categoria,
              ...(vagaConfig.graduacoes || []),
              ...(vagaConfig.provas || []),
            ].filter(Boolean);
            if (vagaCategorias.length > 0) {
              if (
                !inscritoCategoria ||
                !vagaCategorias.includes(inscritoCategoria)
              ) {
                isInVaga = false;
              }
            }

            if (isInVaga) {
              count++;
            }
          }
        }

        if (count >= limite) {
          let msg = `A equipe "${equipe?.nome}" atingiu o limite de ${limite} atletas para "${modalidade.nome}"`;
          if (formGenero) msg += ` (${formGenero})`;
          if (formCategoria) msg += ` - ${formCategoria}`;
          msg += `.`;
          toast.error(msg);
          return;
        }
      }
    }

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
    setValue('equipeId', inscricao.equipeId || '');
    setValue('sexo', inscricao.sexo);
    const modalidadesForForm = (inscricao.modalidades || []).map((m: any) => ({
      modalidadeId: m.modalidadeId,
      detalhes: m.detalhes || {},
    }));
    setValue('modalidades', modalidadesForForm);
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
    reset({
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      dataNascimento: '',
      camiseta: '',
      matricula: '',
      lotacao: '',
      orgaoOrigem: '',
      equipeId: equipeRole === 'PONTOFOCAL' ? (loggedInEquipeId ?? '') : '',
      sexo: '',
      modalidades: [],
      status: 'pendente',
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleDetalhesChange = useCallback(
    (
      modalidadeId: string,
      detalheType: string,
      value: string,
      checked: boolean,
      isMultiSelect: boolean,
    ) => {
      const current = watchedModalidades || [];
      const updated = current.map((m) => {
        if (m.modalidadeId === modalidadeId) {
          const detalhes = m.detalhes || {};
          const currentSelection = detalhes[detalheType] || [];

          let newSelection: string[];
          if (isMultiSelect) {
            newSelection = checked
              ? [...currentSelection, value]
              : currentSelection.filter((v) => v !== value);
          } else {
            newSelection = checked ? [value] : [];
          }

          return {
            ...m,
            detalhes: { ...detalhes, [detalheType]: newSelection },
          };
        }
        return m;
      });
      setValue('modalidades', updated, { shouldValidate: true });
    },
    [watchedModalidades, setValue],
  );

  const toggleModalidade = useCallback(
    (modalidadeId: string, checked: boolean) => {
      const current = watchedModalidades || [];
      let updated: typeof current;

      if (checked) {
        const modalidadeToAdd = modalidadesData.find(
          (m) => m.id === modalidadeId,
        );
        if (modalidadeToAdd) {
          const vagas = (modalidadeToAdd.vagasPorEquipe as any[]) || [];
          const allTipos = [
            ...new Set(vagas.map((v) => v.tipo).filter(Boolean)),
          ];

          const newDetalhes: Record<string, string[]> = {};
          if (allTipos.length === 1) {
            newDetalhes.tipo = [allTipos[0]];
          }
          updated = [...current, { modalidadeId, detalhes: newDetalhes }];
        } else {
          updated = current;
        }
      } else {
        updated = current.filter((m) => m.modalidadeId !== modalidadeId);
      }
      setValue('modalidades', updated, { shouldValidate: true });
    },
    [watchedModalidades, modalidadesData, setValue],
  );

  const handleGenerateModalidadePDF = () => {
    if (!filteredInscricoes || filteredInscricoes.length === 0) {
      toast.error('Não há inscrições para gerar o PDF.');
      return;
    }

    const flattenedData = filteredInscricoes
      .flatMap((inscricao) => {
        const modalidadesToProcess = selectedModalidade
          ? inscricao.modalidades.filter(
              (m) => m.modalidadeId === selectedModalidade,
            )
          : inscricao.modalidades;

        return modalidadesToProcess
          .map((inscricaoModalidade) => {
            const fullModalidade = modalidadesData.find(
              (m) => m.id === inscricaoModalidade.modalidadeId,
            );

            if (!fullModalidade) {
              return null;
            }

            const detalhes = (inscricaoModalidade.detalhes as any) || {};
            return {
              modalidade: fullModalidade.nome,
              atleta: inscricao.nome,
              lotacao: inscricao.lotacao,
              camiseta: inscricao.camiseta,
              telefone: inscricao.telefone,
              tipo: detalhes.tipo?.join(', ') || '-',
              sexo_modalidade: detalhes.sexo?.join(', ') || '-',
              categoria: detalhes.categoria?.join(', ') || '-',
              faixaEtaria: detalhes.faixaEtaria?.join(', ') || '-',
              divisao: detalhes.divisao?.join(', ') || '-',
            };
          })
          .filter((item): item is FlattenedInscricaoData => item !== null);
      })
      .sort((a, b) => {
        const modCompare = (a.modalidade || '').localeCompare(
          b.modalidade || '',
        );
        if (modCompare !== 0) return modCompare;
        return (a.atleta || '').localeCompare(b.atleta || '');
      });

    generatePDF(flattenedData, 'inscritos-por-modalidade');
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
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <Label htmlFor='modalidade-filter'>Filtrar por Modalidade</Label>
              <Select
                value={selectedModalidade ?? 'todos'}
                onValueChange={(value) =>
                  setSelectedModalidade(value === 'todos' ? null : value)
                }
              >
                <SelectTrigger id='modalidade-filter' className='w-[280px]'>
                  <SelectValue placeholder='Selecione a modalidade' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='todos'>Todas as Modalidades</SelectItem>
                  {modalidadesData.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Inscrições</CardTitle>
              <div className='flex gap-2'>
                <Button onClick={handleGenerateModalidadePDF}>
                  <Download className='h-4 w-4 mr-2' />
                  PDF por Modalidade
                </Button>
                <Button
                  onClick={handleAddNew}
                  disabled={equipeRole === 'PONTOFOCAL' && !loggedInEquipeId}
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Nova Inscrição
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={getInscricoesColumns(handleEdit, handleDelete, true)}
              data={filteredInscricoes}
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
                    placeholder='61999999999'
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
                    placeholder='123456789011'
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
                      {LOTACOES_ORGAOS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
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
                      {LOTACOES_ORGAOS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.orgaoOrigem && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.orgaoOrigem.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='equipeId'>Equipe *</Label>
                  <Select
                    value={watch('equipeId')}
                    onValueChange={(value) =>
                      setValue('equipeId', value, { shouldValidate: true })
                    }
                    disabled={equipeRole === 'PONTOFOCAL'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione a equipe' />
                    </SelectTrigger>
                    <SelectContent>
                      {equipeRole === 'ADMIN'
                        ? Array.from(
                            new Map(
                              equipes
                                .filter((e) => e.nome !== 'ADMIN')
                                .map((e) => [e.nome, e]),
                            ).values(),
                          ).map((equipe) => (
                            <SelectItem key={equipe.id} value={equipe.id}>
                              {equipe.nome}
                            </SelectItem>
                          ))
                        : loggedInEquipeId &&
                          equipeNome && (
                            <SelectItem value={loggedInEquipeId}>
                              {equipeNome.split(' - ')[1] || equipeNome}
                            </SelectItem>
                          )}
                    </SelectContent>
                  </Select>
                  {errors.equipeId && (
                    <p className='text-sm text-vermelho-olinsesp'>
                      {errors.equipeId.message}
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

                        const vagas =
                          (modalidade.vagasPorEquipe as any[]) || [];
                        const allTipos = [
                          ...new Set(vagas.map((v) => v.tipo).filter(Boolean)),
                        ];
                        const allSexos = [
                          ...new Set(
                            vagas.map((v) => v.genero).filter(Boolean),
                          ),
                        ];
                        const allCategorias = [
                          ...new Set(
                            vagas
                              .flatMap(
                                (v) =>
                                  v.categoria || v.graduacoes || v.provas || [],
                              )
                              .filter(Boolean),
                          ),
                        ];
                        const allFaixasEtarias = [
                          ...new Set(
                            vagas
                              .flatMap((v) => v.faixasEtarias || [])
                              .filter(Boolean),
                          ),
                        ];
                        const allDivisoes = [
                          ...new Set(
                            vagas
                              .flatMap((v) => v.categoriasPeso || [])
                              .filter(Boolean),
                          ),
                        ];

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
                              {isSelected && (
                                <AccordionTrigger className='ml-4'>
                                  Opções
                                </AccordionTrigger>
                              )}
                            </div>

                            {isSelected && (
                              <AccordionContent className='pb-4 space-y-4 pl-2'>
                                {/* TIPO */}
                                {allTipos.length > 0 && (
                                  <div className='space-y-2'>
                                    <Label>Tipo</Label>
                                    <div className='space-y-2'>
                                      {allTipos.map((tipo) => (
                                        <div
                                          key={tipo}
                                          className='flex items-center space-x-2'
                                        >
                                          <Checkbox
                                            id={`${modalidade.id}-${tipo}`}
                                            checked={
                                              selectedModalidade.detalhes?.tipo?.includes(
                                                tipo,
                                              ) || false
                                            }
                                            onCheckedChange={(checked) =>
                                              handleDetalhesChange(
                                                modalidade.id,
                                                'tipo',
                                                tipo,
                                                checked === true,
                                                true,
                                              )
                                            }
                                          />
                                          <Label
                                            htmlFor={`${modalidade.id}-${tipo}`}
                                          >
                                            {tipo}
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* SEXO */}
                                {allSexos.length > 0 && (
                                  <div className='space-y-1'>
                                    <Label>Sexo</Label>
                                    <div className='space-y-2'>
                                      {allSexos.map((sexo) => (
                                        <div
                                          key={sexo}
                                          className='flex items-center space-x-2'
                                        >
                                          <Checkbox
                                            id={`${modalidade.id}-sexo-${sexo}`}
                                            checked={
                                              selectedModalidade.detalhes?.sexo?.includes(
                                                sexo,
                                              ) || false
                                            }
                                            onCheckedChange={(checked) =>
                                              handleDetalhesChange(
                                                modalidade.id,
                                                'sexo',
                                                sexo,
                                                checked === true,
                                                true,
                                              )
                                            }
                                          />
                                          <Label
                                            htmlFor={`${modalidade.id}-sexo-${sexo}`}
                                          >
                                            {sexo}
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* CATEGORIA */}
                                {allCategorias.length > 0 && (
                                  <div className='space-y-2'>
                                    <Label>Categoria</Label>
                                    <div className='space-y-2'>
                                      {allCategorias.map((cat) => (
                                        <div
                                          key={cat}
                                          className='flex items-center space-x-2'
                                        >
                                          <Checkbox
                                            id={`${modalidade.id}-${cat}`}
                                            checked={
                                              selectedModalidade.detalhes?.categoria?.includes(
                                                cat,
                                              ) || false
                                            }
                                            onCheckedChange={(checked) =>
                                              handleDetalhesChange(
                                                modalidade.id,
                                                'categoria',
                                                cat,
                                                checked === true,
                                                true,
                                              )
                                            }
                                          />
                                          <Label
                                            htmlFor={`${modalidade.id}-${cat}`}
                                          >
                                            {cat}
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* FAIXA ETÁRIA */}
                                {allFaixasEtarias.length > 0 && (
                                  <div className='space-y-2'>
                                    <Label>Faixa Etária</Label>
                                    <div className='space-y-2'>
                                      {allFaixasEtarias.map((faixa) => (
                                        <div
                                          key={faixa}
                                          className='flex items-center space-x-2'
                                        >
                                          <Checkbox
                                            id={`${modalidade.id}-${faixa}`}
                                            checked={
                                              selectedModalidade.detalhes?.faixaEtaria?.includes(
                                                faixa,
                                              ) || false
                                            }
                                            onCheckedChange={(checked) =>
                                              handleDetalhesChange(
                                                modalidade.id,
                                                'faixaEtaria',
                                                faixa,
                                                checked === true,
                                                true,
                                              )
                                            }
                                          />
                                          <Label
                                            htmlFor={`${modalidade.id}-${faixa}`}
                                          >
                                            {faixa}
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* DIVISÃO */}
                                {allDivisoes.length > 0 && (
                                  <div className='space-y-2'>
                                    <Label>Divisão</Label>
                                    <div className='space-y-2'>
                                      {allDivisoes.map((div) => (
                                        <div
                                          key={div}
                                          className='flex items-center space-x-2'
                                        >
                                          <Checkbox
                                            id={`${modalidade.id}-${div}`}
                                            checked={
                                              selectedModalidade.detalhes?.divisao?.includes(
                                                div,
                                              ) || false
                                            }
                                            onCheckedChange={(checked) =>
                                              handleDetalhesChange(
                                                modalidade.id,
                                                'divisao',
                                                div,
                                                checked === true,
                                                true,
                                              )
                                            }
                                          />
                                          <Label
                                            htmlFor={`${modalidade.id}-${div}`}
                                          >
                                            {div}
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
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

              {equipeRole === 'ADMIN' && (
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
              )}

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
