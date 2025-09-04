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
  Clock,
  MapPin,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

const eventoSchema = z.object({
  atividade: z.string().min(1, 'Atividade é obrigatória'),
  inicio: z.string().min(1, 'Data de início é obrigatória'),
  fim: z.string().min(1, 'Data de fim é obrigatória'),
  detalhes: z.string().optional(),
  horario: z.string().optional(),
  tipo: z.string().optional(),
  local: z.string().optional(),
  status: z.enum(['agendado', 'em_andamento', 'finalizado']).optional(),
  participantes: z.string().optional(),
  modalidade: z.string().optional(),
  resultado: z.string().optional(),
});

type EventoFormData = z.infer<typeof eventoSchema>;

interface Evento {
  id: string;
  atividade: string;
  inicio: string;
  fim: string;
  detalhes?: string | null;
  horario?: string;
  tipo?: string;
  local?: string;
  status?: 'agendado' | 'em_andamento' | 'finalizado';
  participantes?: string;
  modalidade?: string;
  resultado?: string;
}

export default function CronogramaForm() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema),
  });

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await fetch('/api/cronograma');
      if (response.ok) {
        const data = await response.json();
        setEventos(data);
      }
    } catch {
      toast.error('Erro ao carregar cronograma');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EventoFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingId
        ? `/api/cronograma/${editingId}`
        : '/api/cronograma';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingId ? 'Evento atualizado!' : 'Evento criado!');
        fetchEventos();
        reset();
        setEditingId(null);
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch {
      toast.error('Erro ao salvar evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (evento: Evento) => {
    setEditingId(evento.id);
    setValue('atividade', evento.atividade);
    setValue('inicio', evento.inicio);
    setValue('fim', evento.fim);
    setValue('detalhes', evento.detalhes || '');
    setValue('horario', evento.horario || '');
    setValue('tipo', evento.tipo || '');
    setValue('local', evento.local || '');
    setValue('status', evento.status || 'agendado');
    setValue('participantes', evento.participantes || '');
    setValue('modalidade', evento.modalidade || '');
    setValue('resultado', evento.resultado || '');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const response = await fetch(`/api/cronograma/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Evento excluído!');
        fetchEventos();
      } else {
        throw new Error('Erro ao excluir');
      }
    } catch {
      toast.error('Erro ao excluir evento');
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  const getStatusBadge = (status: string | undefined) => {
    const statusConfig = {
      agendado: { label: 'Agendado', color: 'bg-blue-500' },
      em_andamento: { label: 'Em Andamento', color: 'bg-yellow-500' },
      finalizado: { label: 'Finalizado', color: 'bg-green-500' },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.agendado;
    return (
      <Badge className={`${config.color} text-white`}>{config.label}</Badge>
    );
  };

  const getTipoIcon = (tipo: string | undefined) => {
    switch (tipo) {
      case 'competicao':
        return '🏆';
      case 'cerimonia':
        return '🎭';
      case 'treinamento':
        return '🏃';
      case 'reuniao':
        return '👥';
      default:
        return '📅';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p>Carregando cronograma...</p>
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
            {editingId ? 'Editar Evento' : 'Novo Evento'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='atividade'>Atividade *</Label>
                <Input
                  id='atividade'
                  {...register('atividade')}
                  placeholder='Ex: Abertura do Evento'
                />
                {errors.atividade && (
                  <p className='text-sm text-red-600'>
                    {errors.atividade.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='tipo'>Tipo</Label>
                <Select onValueChange={(value) => setValue('tipo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='competicao'>🏆 Competição</SelectItem>
                    <SelectItem value='cerimonia'>🎭 Cerimônia</SelectItem>
                    <SelectItem value='treinamento'>🏃 Treinamento</SelectItem>
                    <SelectItem value='reuniao'>👥 Reunião</SelectItem>
                    <SelectItem value='outro'>📅 Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='inicio'>Data/Hora de Início *</Label>
                <Input
                  id='inicio'
                  type='datetime-local'
                  {...register('inicio')}
                />
                {errors.inicio && (
                  <p className='text-sm text-red-600'>
                    {errors.inicio.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='fim'>Data/Hora de Fim *</Label>
                <Input id='fim' type='datetime-local' {...register('fim')} />
                {errors.fim && (
                  <p className='text-sm text-red-600'>{errors.fim.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='local'>Local</Label>
                <Input
                  id='local'
                  {...register('local')}
                  placeholder='Ex: Ginásio Principal'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='modalidade'>Modalidade</Label>
                <Input
                  id='modalidade'
                  {...register('modalidade')}
                  placeholder='Ex: Futebol'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='participantes'>Participantes</Label>
                <Input
                  id='participantes'
                  {...register('participantes')}
                  placeholder='Ex: 20 atletas'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>
                <Select
                  onValueChange={(value) => setValue('status', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='agendado'>Agendado</SelectItem>
                    <SelectItem value='em_andamento'>Em Andamento</SelectItem>
                    <SelectItem value='finalizado'>Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='detalhes'>Detalhes</Label>
              <Textarea
                id='detalhes'
                {...register('detalhes')}
                placeholder='Detalhes do evento...'
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='resultado'>Resultado</Label>
              <Textarea
                id='resultado'
                {...register('resultado')}
                placeholder='Resultado do evento (se finalizado)...'
                rows={2}
              />
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
          <CardTitle>Cronograma do Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {eventos.map((evento) => (
              <div key={evento.id} className='p-4 border rounded-lg space-y-3'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-2 flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='text-2xl'>
                        {getTipoIcon(evento.tipo)}
                      </span>
                      <h3 className='font-semibold text-lg'>
                        {evento.atividade}
                      </h3>
                      {getStatusBadge(evento.status)}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-4 w-4' />
                          <span>
                            {formatDate(evento.inicio)} -{' '}
                            {formatDate(evento.fim)}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Clock className='h-4 w-4' />
                          <span>
                            {formatTime(evento.inicio)} -{' '}
                            {formatTime(evento.fim)}
                          </span>
                        </div>
                        {evento.local && (
                          <div className='flex items-center gap-2'>
                            <MapPin className='h-4 w-4' />
                            <span>{evento.local}</span>
                          </div>
                        )}
                      </div>

                      <div className='space-y-1'>
                        {evento.modalidade && (
                          <div>
                            <strong>Modalidade:</strong> {evento.modalidade}
                          </div>
                        )}
                        {evento.participantes && (
                          <div className='flex items-center gap-2'>
                            <Users className='h-4 w-4' />
                            <span>{evento.participantes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {evento.detalhes && (
                      <div className='mt-3'>
                        <p className='text-sm text-gray-700'>
                          {evento.detalhes}
                        </p>
                      </div>
                    )}

                    {evento.resultado && (
                      <div className='mt-3 p-3 bg-green-50 border border-green-200 rounded'>
                        <h4 className='font-medium text-green-800 mb-1'>
                          Resultado:
                        </h4>
                        <p className='text-sm text-green-700'>
                          {evento.resultado}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className='flex gap-2 ml-4'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleEdit(evento)}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => handleDelete(evento.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {eventos.length === 0 && (
              <p className='text-center text-gray-500 py-8'>
                Nenhum evento cadastrado
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
