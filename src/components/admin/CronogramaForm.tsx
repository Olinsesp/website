'use client';

import { useState } from 'react';
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
import { Trash2, Edit, Plus, Save, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import QueryStateHandler from '../ui/query-state-handler';
import { DataTable } from '@/app/Dashboard/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

async function fetchEventos(): Promise<Evento[]> {
  const response = await fetch('/api/cronograma');
  if (!response.ok) {
    throw new Error('Erro ao carregar cronograma');
  }
  return response.json();
}

export default function CronogramaForm() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: eventos = [],
    isLoading,
    isError,
    error,
  } = useQuery<Evento[], Error>({
    queryKey: ['cronograma'],
    queryFn: fetchEventos,
  });

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

  const mutation = useMutation<
    Response,
    Error,
    { data: EventoFormData; id?: string | null }
  >({
    mutationFn: async ({ data, id }) => {
      const url = id ? `/api/cronograma/${id}` : '/api/cronograma';
      const method = id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar evento');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cronograma'] });
      toast.success(editingId ? 'Evento atualizado!' : 'Evento criado!');
      handleCancel();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation<Response, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/cronograma/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir evento');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cronograma'] });
      toast.success('Evento excluído!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: EventoFormData) => {
    mutation.mutate({ data, id: editingId });
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

  const handleDelete = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const columns: ColumnDef<Evento>[] = [
    {
      accessorKey: 'atividade',
      header: 'Atividade',
    },
    {
      accessorKey: 'modalidade',
      header: 'Modalidade',
      cell: ({ row }) => row.original.modalidade || 'N/A',
    },
    {
      accessorKey: 'inicio',
      header: 'Início',
      cell: ({ row }) => formatDate(row.original.inicio),
    },
    {
      accessorKey: 'fim',
      header: 'Fim',
      cell: ({ row }) => formatDate(row.original.fim),
    },
    {
      accessorKey: 'dia',
      header: 'Dia',
      cell: ({ row }) => (
        <Badge variant='outline' className='flex items-center gap-1'>
          <Calendar className='h-3 w-3' />
          {row.original.dia}
        </Badge>
      ),
    },
    {
      accessorKey: 'detalhes',
      header: 'Detalhes',
      cell: ({ row }) => row.original.detalhes || 'N/A',
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const evento = row.original;
        return (
          <div className='flex gap-2 justify-end'>
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
        );
      },
    },
  ];

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isError={isError}
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
            <DataTable
              columns={columns}
              data={eventos}
              filterColumn='atividade'
            />
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
