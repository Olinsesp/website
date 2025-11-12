'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { modalidades as allModalidades } from '@/app/api/modalidades/modalidadesData';
import { SearchableSelect } from '@/components/ui/SearchableSelect';

// Tipos para as props

interface Inscricao {
  id: string;
  nome: string;
  lotacao: string;
}

interface Classificacao {
  id: string;
  modalidadeId: string;
  categoria: string;
  posicao: number;
  inscricaoId?: string;
  lotacao?: string;
  pontuacao: number;
  tempo?: string;
  distancia?: string;
  observacoes?: string;
}

const classificacaoSchema = z
  .object({
    tipo: z.enum(['individual', 'equipe']),
    modalidadeId: z.string().min(1, 'Modalidade é obrigatória'),
    categoria: z.string().min(1, 'Categoria é obrigatória'),
    posicao: z.number().min(1, 'Posição deve ser maior que 0'),
    inscricaoId: z.string().optional(),
    lotacao: z.string().optional(),
    pontuacao: z.number().min(0, 'Pontuação deve ser maior ou igual a 0'),
    tempo: z.string().optional(),
    distancia: z.string().optional(),
    observacoes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === 'individual' && !data.inscricaoId) {
      ctx.addIssue({
        code: 'custom',
        message: 'É obrigatório selecionar um atleta.',
        path: ['inscricaoId'],
      });
    }

    if (
      data.tipo === 'equipe' &&
      (!data.lotacao || data.lotacao.trim() === '')
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'É obrigatório informar a lotação da equipe.',
        path: ['lotacao'],
      });
    }
  });

type ClassificacaoFormData = z.infer<typeof classificacaoSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  classificacaoToEdit: Classificacao | null;
  inscricoes: Inscricao[];
}

export default function ClassificacoesForm({
  isOpen,
  onClose,
  onSave,
  classificacaoToEdit,
  inscricoes,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sexo, setSexo] = useState<'Masculino' | 'Feminino' | ''>('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClassificacaoFormData>({
    resolver: zodResolver(classificacaoSchema),
    defaultValues: {
      tipo: 'individual',
      modalidadeId: '',
      categoria: '',
      inscricaoId: '',
      lotacao: '',
      posicao: 1,
      pontuacao: 0,
    },
  });

  const watchedTipo = watch('tipo');
  const watchedModalidadeId = watch('modalidadeId');
  const watchedInscricaoId = watch('inscricaoId');

  const flattenedModalidades = useMemo(() => {
    return allModalidades.map((mod) => ({
      ...mod,
      parentCategory: mod.categoria,
    }));
  }, []);

  // 🧠 Lógica aprimorada para exibir categorias
  const uniqueCategorias: string[] = useMemo(() => {
    if (!watchedModalidadeId) return [];
    const selectedModalidade = flattenedModalidades.find(
      (m) => m.id === watchedModalidadeId,
    );
    if (!selectedModalidade) return [];

    // 1️⃣ Filtra campos específicos por gênero
    const genderFilteredFields = selectedModalidade.camposExtras?.filter(
      (field) => {
        const lowerId = field.id.toLowerCase();
        if (!sexo) return false;
        if (sexo === 'Masculino') return lowerId.includes('masculino');
        if (sexo === 'Feminino') return lowerId.includes('feminino');
        return false;
      },
    );

    if (genderFilteredFields?.length) {
      return genderFilteredFields.flatMap((f) => f.options ?? []);
    }

    // 2️⃣ Se não tiver diferenciação por gênero, busca campos relevantes
    const genericFields = selectedModalidade.camposExtras?.filter(
      (field) =>
        field.type === 'select' &&
        (field.id.toLowerCase().includes('categoria') ||
          field.id.toLowerCase().includes('prova') ||
          field.id.toLowerCase().includes('faixa') ||
          field.id.toLowerCase().includes('peso') ||
          field.id.toLowerCase().includes('distancia') ||
          field.id.toLowerCase().includes('modalidade')),
    );

    if (genericFields?.length) {
      return genericFields.flatMap((f) => f.options ?? []);
    }

    // 3️⃣ Fallback - evita lista vazia
    return [selectedModalidade.nome];
  }, [watchedModalidadeId, sexo, flattenedModalidades]);

  useEffect(() => {
    if (isOpen) {
      if (classificacaoToEdit) {
        const tipoClassificacao = classificacaoToEdit.inscricaoId
          ? 'individual'
          : 'equipe';
        setValue('tipo', tipoClassificacao);
        setValue('modalidadeId', classificacaoToEdit.modalidadeId);
        setValue('categoria', classificacaoToEdit.categoria);
        setValue('posicao', classificacaoToEdit.posicao);
        setValue('pontuacao', classificacaoToEdit.pontuacao);
        setValue('inscricaoId', classificacaoToEdit.inscricaoId);
        setValue('lotacao', classificacaoToEdit.lotacao);
        setValue('tempo', classificacaoToEdit.tempo || '');
        setValue('distancia', classificacaoToEdit.distancia || '');
        setValue('observacoes', classificacaoToEdit.observacoes || '');
      } else {
        reset({
          tipo: 'individual',
          posicao: 1,
          pontuacao: 0,
        });
      }
    }
  }, [classificacaoToEdit, isOpen, reset, setValue]);

  const onSubmit = async (data: ClassificacaoFormData) => {
    setIsSubmitting(true);
    const payload = {
      ...data,
      inscricaoId: data.tipo === 'individual' ? data.inscricaoId : undefined,
      lotacao: data.tipo === 'equipe' ? data.lotacao : undefined,
    };

    try {
      const url = classificacaoToEdit
        ? `/api/classificacoes/${classificacaoToEdit.id}`
        : '/api/classificacoes';
      const method = classificacaoToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          classificacaoToEdit
            ? 'Classificação atualizada!'
            : 'Classificação criada!',
        );
        onSave();
        handleClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar');
      }
    } catch (e: any) {
      toast.error(`Erro ao salvar: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {classificacaoToEdit
              ? 'Editar Classificação'
              : 'Nova Classificação'}
          </DialogTitle>
          <DialogDescription>
            {classificacaoToEdit
              ? 'Faça as alterações necessárias.'
              : 'Adicione uma nova classificação.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 pt-4'>
          {/* Tipo */}
          <div className='space-y-2'>
            <Label>Tipo de Classificação *</Label>
            <RadioGroup
              value={watchedTipo}
              onValueChange={(value: 'individual' | 'equipe') => {
                setValue('tipo', value);
              }}
              className='flex gap-4'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='individual' id='r-individual' />
                <Label htmlFor='r-individual'>Individual</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='equipe' id='r-equipe' />
                <Label htmlFor='r-equipe'>Equipe</Label>
              </div>
            </RadioGroup>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Modalidade */}
            <div className='space-y-2'>
              <Label htmlFor='modalidadeId'>Modalidade *</Label>
              <Select
                value={watchedModalidadeId}
                onValueChange={(value) => {
                  setValue('modalidadeId', value);
                  setValue('categoria', '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione a Modalidade' />
                </SelectTrigger>
                <SelectContent>
                  {flattenedModalidades.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.modalidadeId && (
                <p className='text-sm text-red-600'>
                  {errors.modalidadeId.message}
                </p>
              )}
            </div>

            {/* Sexo */}
            <div className='space-y-2'>
              <Label htmlFor='sexo'>Sexo *</Label>
              <Select
                value={sexo}
                onValueChange={(value: 'Masculino' | 'Feminino') => {
                  setSexo(value);
                  setValue('categoria', '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione o Sexo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Masculino'>Masculino</SelectItem>
                  <SelectItem value='Feminino'>Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Categoria */}
            <div className='space-y-2'>
              <Label htmlFor='categoria'>Categoria *</Label>
              <Select
                value={watch('categoria')}
                onValueChange={(value) => setValue('categoria', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione a Categoria' />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria && (
                <p className='text-sm text-red-600'>
                  {errors.categoria.message}
                </p>
              )}
            </div>

            {/* Atleta / Lotação */}
            {watchedTipo === 'individual' ? (
              <div className='space-y-2'>
                <Label htmlFor='inscricaoId'>Atleta *</Label>
                <SearchableSelect
                  options={inscricoes.map((i) => ({
                    value: i.id,
                    label: `${i.nome} (${i.lotacao})`,
                  }))}
                  placeholder='Selecione o Atleta'
                  value={watchedInscricaoId}
                  onValueChange={(value) => setValue('inscricaoId', value)}
                />
                {errors.inscricaoId && (
                  <p className='text-sm text-red-600'>
                    {errors.inscricaoId.message}
                  </p>
                )}
              </div>
            ) : (
              <div className='space-y-2'>
                <Label htmlFor='lotacao'>Lotação *</Label>
                <Select
                  onValueChange={(value) => setValue('lotacao', value)}
                  defaultValue={classificacaoToEdit?.lotacao}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione a Lotação' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='PMDF'>PMDF</SelectItem>
                    <SelectItem value='PCDF'>PCDF</SelectItem>
                    <SelectItem value='CBMDF'>CBMDF</SelectItem>
                    <SelectItem value='PF'>PF</SelectItem>
                  </SelectContent>
                </Select>
                {errors.lotacao && (
                  <p className='text-sm text-red-600'>
                    {errors.lotacao.message}
                  </p>
                )}
              </div>
            )}

            {/* Posição */}
            <div className='space-y-2'>
              <Label htmlFor='posicao'>Posição *</Label>
              <Input
                id='posicao'
                type='number'
                {...register('posicao', { valueAsNumber: true })}
                placeholder='1'
              />
              {errors.posicao && (
                <p className='text-sm text-red-600'>{errors.posicao.message}</p>
              )}
            </div>

            {/* Pontuação */}
            <div className='space-y-2'>
              <Label htmlFor='pontuacao'>Pontuação *</Label>
              <Input
                id='pontuacao'
                type='number'
                {...register('pontuacao', { valueAsNumber: true })}
                placeholder='0'
              />
              {errors.pontuacao && (
                <p className='text-sm text-red-600'>
                  {errors.pontuacao.message}
                </p>
              )}
            </div>

            {/* Tempo e Distância */}
            {watchedTipo === 'individual' && (
              <>
                <div className='space-y-2'>
                  <Label htmlFor='tempo'>Tempo</Label>
                  <Input
                    id='tempo'
                    {...register('tempo')}
                    placeholder='Ex: 1:23:45'
                  />
                </div>

                <div className='space-y-2 md:col-span-2'>
                  <Label htmlFor='distancia'>Distância</Label>
                  <Input
                    id='distancia'
                    {...register('distancia')}
                    placeholder='Ex: 100m'
                  />
                </div>
              </>
            )}
          </div>

          {/* Observações */}
          <div className='space-y-2'>
            <Label htmlFor='observacoes'>Observações</Label>
            <Textarea
              id='observacoes'
              {...register('observacoes')}
              placeholder='Observações adicionais...'
              rows={3}
            />
          </div>

          {/* Botões */}
          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleClose}>
              <X className='h-4 w-4 mr-2' />
              Cancelar
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
              ) : (
                <Save className='h-4 w-4 mr-2' />
              )}
              {classificacaoToEdit ? 'Atualizar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
