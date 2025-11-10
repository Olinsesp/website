'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Trash2, Edit, Plus, Save, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import QueryStateHandler from '../ui/query-state-handler';

const eventoSchema = z.object({
  atividade: z.string().min(1, 'Atividade é obrigatória'),
  inicio: z.string().min(1, 'Horário de início é obrigatório'),
  fim: z.string().min(1, 'Horário de fim é obrigatório'),
  detalhes: z.string().optional(),
  modalidade: z.string().optional(),
});

type EventoFormData = z.infer<typeof eventoSchema>;

interface Evento {
  id: string;
  atividade: string;
  inicio: string;
  fim: string;
  detalhes?: string;
  modalidade?: string;
  dia: string;
}

export default function CronogramaForm() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      atividade: '',
      inicio: '',
      fim: '',
      detalhes: '',
      modalidade: '',
    },
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
      } else {
        throw new Error('Erro ao carregar cronograma');
      }
    } catch (err: any) {
      setError(err);
      toast.error(err.message);
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
        setIsDialogOpen(false);
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
    setValue('modalidade', evento.modalidade || '');
    setIsDialogOpen(true);
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
    setIsDialogOpen(false);
  };

  const handleAddNew = () => {
    reset();
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <QueryStateHandler
      isLoading={loading}
      isError={!!error}
      error={error}
      loadingMessage='Carregando cronograma...'
    >
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Cronograma de Eventos</CardTitle>
              <Button onClick={handleAddNew}>
                <Plus className='h-4 w-4 mr-2' />
                Novo Evento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {eventos.map((evento) => (
                <div
                  key={evento.id}
                  className='p-4 border rounded-lg space-y-3'
                >
                  <div className='flex items-start justify-between'>
                    <div className='space-y-2 flex-1'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-semibold text-lg'>
                          {evento.atividade}
                        </h3>
                        <Badge
                          variant='outline'
                          className='flex items-center gap-1'
                        >
                          <Calendar className='h-3 w-3' />
                          {evento.dia}
                        </Badge>
                      </div>

                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <span className='flex items-center gap-1'>
                          <Clock className='h-4 w-4' />
                          {formatDate(evento.inicio)} - {formatDate(evento.fim)}
                        </span>
                        {evento.modalidade && (
                          <span className='text-blue-600 font-medium'>
                            {evento.modalidade}
                          </span>
                        )}
                      </div>

                      {evento.detalhes && (
                        <p className='text-gray-600 text-sm'>
                          {evento.detalhes}
                        </p>
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

        {/* Dialog para Adicionar/Editar */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Evento' : 'Novo Evento'}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? 'Faça as alterações necessárias no evento.'
                  : 'Adicione um novo evento ao cronograma.'}
              </DialogDescription>
            </DialogHeader>
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
                  <Label htmlFor='modalidade'>Modalidade</Label>
                  <Input
                    id='modalidade'
                    {...register('modalidade')}
                    placeholder='Ex: Futebol (opcional)'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='inicio'>Horário de Início *</Label>
                  <Input id='inicio' type='time' {...register('inicio')} />
                  {errors.inicio && (
                    <p className='text-sm text-red-600'>
                      {errors.inicio.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='fim'>Horário de Fim *</Label>
                  <Input id='fim' type='time' {...register('fim')} />
                  {errors.fim && (
                    <p className='text-sm text-red-600'>{errors.fim.message}</p>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='detalhes'>Detalhes</Label>
                <Textarea
                  id='detalhes'
                  {...register('detalhes')}
                  placeholder='Detalhes adicionais sobre o evento...'
                  rows={3}
                />
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
    </QueryStateHandler>
  );
}
