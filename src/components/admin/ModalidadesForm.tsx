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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Save, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

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
});

type ModalidadeFormData = z.infer<typeof modalidadeSchema>;

interface Modalidade {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  maxParticipantes: number;
  status: 'inscricoes-abertas' | 'inscricoes-fechadas' | 'em-andamento' | 'finalizada';
  regras: string[];
  premios: string[];
  dataInicio?: string;
  dataFim?: string;
  local?: string;
  participantesAtuais: number;
}

export default function ModalidadesForm() {
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ModalidadeFormData>({
    resolver: zodResolver(modalidadeSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      categoria: '',
      maxParticipantes: 0,
      status: 'inscricoes-abertas',
    },
  });

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
        setIsDialogOpen(false);
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
    setValue('status', modalidade.status);
    setIsDialogOpen(true);
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
    setIsDialogOpen(false);
  };

  const handleAddNew = () => {
    reset();
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'inscricoes-abertas': { label: 'Inscrições Abertas', color: 'bg-green-500' },
      'inscricoes-fechadas': {
        label: 'Inscrições Fechadas',
        color: 'bg-yellow-500',
      },
      'em-andamento': { label: 'Em Andamento', color: 'bg-blue-500' },
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
          <div className='flex items-center justify-between'>
            <CardTitle>Modalidades</CardTitle>
            <Button onClick={handleAddNew}>
              <Plus className='h-4 w-4 mr-2' />
              Nova Modalidade
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {modalidades.map((modalidade) => (
              <div
                key={modalidade.id}
                className='p-4 border rounded-lg space-y-3'
              >
                <div className='flex items-start justify-between'>
                  <div className='space-y-2 flex-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-semibold text-lg'>
                        {modalidade.nome}
                      </h3>
                      {getStatusBadge(modalidade.status)}
                    </div>

                    <p className='text-gray-600'>{modalidade.descricao}</p>

                    <div className='flex items-center gap-4 text-sm text-gray-500'>
                      <span className='flex items-center gap-1'>
                        <MapPin className='h-4 w-4' />
                        {modalidade.categoria}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Clock className='h-4 w-4' />
                        {modalidade.participantesAtuais}/{modalidade.maxParticipantes}{' '}
                        participantes
                      </span>
                    </div>
                  </div>

                  <div className='flex gap-2 ml-4'>
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

      {/* Dialog para Adicionar/Editar */}
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
                  <p className='text-sm text-red-600'>{errors.nome.message}</p>
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
                    <SelectItem value='inscricoes-abertas'>Inscrições Abertas</SelectItem>
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

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
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
  );
}
