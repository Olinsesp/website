'use client';

import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Trash2,
  Edit,
  Plus,
  Save,
  X,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

const modalidadeSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  maxParticipantes: z
    .number()
    .min(1, 'Máximo de participantes deve ser maior que 0'),
  dataInicio: z.string().min(1, 'Data de início é obrigatória'),
  dataFim: z.string().min(1, 'Data de fim é obrigatória'),
  local: z.string().min(1, 'Local é obrigatório'),
  horario: z.string().min(1, 'Horário é obrigatório'),
  regras: z.array(z.string()).optional(),
  premios: z.array(z.string()).optional(),
  status: z.enum([
    'inscricoes-abertas',
    'inscricoes-fechadas',
    'em-andamento',
    'finalizada',
  ]),
});

type ModalidadeFormData = z.infer<typeof modalidadeSchema>;

interface Modalidade {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  maxParticipantes: number;
  participantesAtuais: number;
  dataInicio: string;
  dataFim: string;
  local: string;
  horario: string;
  regras: string[];
  premios: string[];
  status:
    | 'inscricoes-abertas'
    | 'inscricoes-fechadas'
    | 'em-andamento'
    | 'finalizada';
}

export default function ModalidadesForm() {
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regraInput, setRegraInput] = useState('');
  const [premioInput, setPremioInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ModalidadeFormData>({
    resolver: zodResolver(modalidadeSchema),
    defaultValues: {
      regras: [],
      premios: [],
    },
  });

  const watchedRegras = watch('regras') || [];
  const watchedPremios = watch('premios') || [];

  useEffect(() => {
    fetchModalidades();
  }, []);

  const fetchModalidades = async () => {
    try {
      const response = await fetch('/api/modalidades');
      if (response.ok) {
        const data = await response.json();
        setModalidades(data);
      }
    } catch {
      toast.error('Erro ao carregar modalidades');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ModalidadeFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingId
        ? `/api/modalidades/${editingId}`
        : '/api/modalidades';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          editingId ? 'Modalidade atualizada!' : 'Modalidade criada!',
        );
        fetchModalidades();
        reset();
        setEditingId(null);
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch {
      toast.error('Erro ao salvar modalidade');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (modalidade: Modalidade) => {
    setEditingId(modalidade.id);
    setValue('nome', modalidade.nome);
    setValue('descricao', modalidade.descricao);
    setValue('categoria', modalidade.categoria);
    setValue('maxParticipantes', modalidade.maxParticipantes);
    setValue('dataInicio', modalidade.dataInicio);
    setValue('dataFim', modalidade.dataFim);
    setValue('local', modalidade.local);
    setValue('horario', modalidade.horario);
    setValue('regras', modalidade.regras);
    setValue('premios', modalidade.premios);
    setValue('status', modalidade.status);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta modalidade?')) return;

    try {
      const response = await fetch(`/api/modalidades/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Modalidade excluída!');
        fetchModalidades();
      } else {
        throw new Error('Erro ao excluir');
      }
    } catch {
      toast.error('Erro ao excluir modalidade');
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  const addRegra = () => {
    if (regraInput.trim()) {
      const novasRegras = [...watchedRegras, regraInput.trim()];
      setValue('regras', novasRegras);
      setRegraInput('');
    }
  };

  const removeRegra = (index: number) => {
    const novasRegras = watchedRegras.filter((_, i) => i !== index);
    setValue('regras', novasRegras);
  };

  const addPremio = () => {
    if (premioInput.trim()) {
      const novosPremios = [...watchedPremios, premioInput.trim()];
      setValue('premios', novosPremios);
      setPremioInput('');
    }
  };

  const removePremio = (index: number) => {
    const novosPremios = watchedPremios.filter((_, i) => i !== index);
    setValue('premios', novosPremios);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'inscricoes-abertas': {
        label: 'Inscrições Abertas',
        color: 'bg-green-500',
      },
      'inscricoes-fechadas': {
        label: 'Inscrições Fechadas',
        color: 'bg-yellow-500',
      },
      'em-andamento': { label: 'Em Andamento', color: 'bg-blue-500' },
      finalizada: { label: 'Finalizada', color: 'bg-gray-500' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} text-white`}>{config.label}</Badge>
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p>Carregando modalidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Plus className='h-5 w-5' />
            {editingId ? 'Editar Modalidade' : 'Nova Modalidade'}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                  <p className='text-sm text-red-600'>{errors.nome.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='categoria'>Categoria *</Label>
                <Select onValueChange={(value) => setValue('categoria', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione a categoria' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Coletivo'>Coletivo</SelectItem>
                    <SelectItem value='Individual'>Individual</SelectItem>
                    <SelectItem value='Aquático'>Aquático</SelectItem>
                    <SelectItem value='Combate'>Combate</SelectItem>
                    <SelectItem value='Precisão'>Precisão</SelectItem>
                    <SelectItem value='Resistência'>Resistência</SelectItem>
                  </SelectContent>
                </Select>
                {errors.categoria && (
                  <p className='text-sm text-red-600'>
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
                  <p className='text-sm text-red-600'>
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
                  <p className='text-sm text-red-600'>
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='dataInicio'>Data de Início *</Label>
                <Input
                  id='dataInicio'
                  type='date'
                  {...register('dataInicio')}
                />
                {errors.dataInicio && (
                  <p className='text-sm text-red-600'>
                    {errors.dataInicio.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='dataFim'>Data de Fim *</Label>
                <Input id='dataFim' type='date' {...register('dataFim')} />
                {errors.dataFim && (
                  <p className='text-sm text-red-600'>
                    {errors.dataFim.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='local'>Local *</Label>
                <Input
                  id='local'
                  {...register('local')}
                  placeholder='Ex: Ginásio Principal'
                />
                {errors.local && (
                  <p className='text-sm text-red-600'>{errors.local.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='horario'>Horário *</Label>
                <Input
                  id='horario'
                  {...register('horario')}
                  placeholder='Ex: 14:00'
                />
                {errors.horario && (
                  <p className='text-sm text-red-600'>
                    {errors.horario.message}
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
                <p className='text-sm text-red-600'>
                  {errors.descricao.message}
                </p>
              )}
            </div>

            <div className='space-y-4'>
              <div>
                <Label>Regras</Label>
                <div className='flex gap-2 mt-2'>
                  <Input
                    value={regraInput}
                    onChange={(e) => setRegraInput(e.target.value)}
                    placeholder='Adicionar regra...'
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addRegra())
                    }
                  />
                  <Button type='button' onClick={addRegra}>
                    Adicionar
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {watchedRegras.map((regra, index) => (
                    <Badge
                      key={index}
                      variant='secondary'
                      className='flex items-center gap-1'
                    >
                      {regra}
                      <button
                        type='button'
                        onClick={() => removeRegra(index)}
                        className='ml-1 hover:text-red-500'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Prêmios</Label>
                <div className='flex gap-2 mt-2'>
                  <Input
                    value={premioInput}
                    onChange={(e) => setPremioInput(e.target.value)}
                    placeholder='Adicionar prêmio...'
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addPremio())
                    }
                  />
                  <Button type='button' onClick={addPremio}>
                    Adicionar
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {watchedPremios.map((premio, index) => (
                    <Badge
                      key={index}
                      variant='secondary'
                      className='flex items-center gap-1'
                    >
                      {premio}
                      <button
                        type='button'
                        onClick={() => removePremio(index)}
                        className='ml-1 hover:text-red-500'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex gap-2'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                ) : (
                  <Save className='h-4 w-4 mr-2' />
                )}
                {editingId ? 'Atualizar' : 'Salvar'}
              </Button>
              {editingId && (
                <Button type='button' variant='outline' onClick={handleCancel}>
                  <X className='h-4 w-4 mr-2' />
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modalidades Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {modalidades.map((modalidade) => (
              <div
                key={modalidade.id}
                className='p-4 border rounded-lg space-y-3'
              >
                <div className='flex items-start justify-between'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-semibold text-lg'>
                        {modalidade.nome}
                      </h3>
                      {getStatusBadge(modalidade.status)}
                    </div>
                    <p className='text-sm text-gray-600'>
                      {modalidade.descricao}
                    </p>
                    <div className='flex items-center gap-4 text-sm text-gray-500'>
                      <span className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        {new Date(
                          modalidade.dataInicio,
                        ).toLocaleDateString()} -{' '}
                        {new Date(modalidade.dataFim).toLocaleDateString()}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Clock className='h-4 w-4' />
                        {modalidade.horario}
                      </span>
                      <span className='flex items-center gap-1'>
                        <MapPin className='h-4 w-4' />
                        {modalidade.local}
                      </span>
                    </div>
                    <div className='flex items-center gap-4 text-sm'>
                      <span>
                        Categoria:{' '}
                        <Badge variant='outline'>{modalidade.categoria}</Badge>
                      </span>
                      <span>
                        Participantes: {modalidade.participantesAtuais}/
                        {modalidade.maxParticipantes}
                      </span>
                    </div>
                  </div>
                  <div className='flex gap-2'>
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
                </div>

                {modalidade.regras.length > 0 && (
                  <div>
                    <h4 className='text-sm font-medium mb-2'>Regras:</h4>
                    <div className='flex flex-wrap gap-1'>
                      {modalidade.regras.map((regra, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='text-xs'
                        >
                          {regra}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {modalidade.premios.length > 0 && (
                  <div>
                    <h4 className='text-sm font-medium mb-2'>Prêmios:</h4>
                    <div className='flex flex-wrap gap-1'>
                      {modalidade.premios.map((premio, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='text-xs'
                        >
                          {premio}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {modalidades.length === 0 && (
              <p className='text-center text-gray-500 py-8'>
                Nenhuma modalidade cadastrada
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
