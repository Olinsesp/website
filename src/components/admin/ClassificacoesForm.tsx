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
import { Trash2, Edit, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import QueryStateHandler from '../ui/query-state-handler';

const classificacaoSchema = z.object({
  modalidade: z.string().min(1, 'Modalidade é obrigatória'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  posicao: z.number().min(1, 'Posição deve ser maior que 0'),
  atleta: z.string().optional(),
  afiliacao: z.string().min(1, 'Afiliação é obrigatória'),
  pontuacao: z.number().min(0, 'Pontuação deve ser maior ou igual a 0'),
  tempo: z.string().optional(),
  distancia: z.string().optional(),
  observacoes: z.string().optional(),
});

type ClassificacaoFormData = z.infer<typeof classificacaoSchema>;

interface Classificacao {
  id: string;
  modalidade: string;
  categoria: string;
  posicao: number;
  atleta?: string;
  afiliacao: string;
  pontuacao: number;
  tempo?: string;
  distancia?: string;
  observacoes?: string;
}

export default function ClassificacoesForm() {
  const [classificacoes, setClassificacoes] = useState<Classificacao[]>([]);
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
  } = useForm<ClassificacaoFormData>({
    resolver: zodResolver(classificacaoSchema),
  });

  useEffect(() => {
    fetchClassificacoes();
  }, []);

  const fetchClassificacoes = async () => {
    try {
      const response = await fetch('/api/classificacoes');
      if (response.ok) {
        const data = await response.json();
        setClassificacoes(data);
      } else {
        throw new Error('Erro ao carregar classificações');
      }
    } catch (err: any) {
      setError(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ClassificacaoFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingId
        ? `/api/classificacoes/${editingId}`
        : '/api/classificacoes';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          editingId ? 'Classificação atualizada!' : 'Classificação criada!',
        );
        fetchClassificacoes();
        reset();
        setEditingId(null);
        setIsDialogOpen(false);
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch {
      toast.error('Erro ao salvar classificação');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (classificacao: Classificacao) => {
    setEditingId(classificacao.id);
    setValue('modalidade', classificacao.modalidade);
    setValue('categoria', classificacao.categoria);
    setValue('posicao', classificacao.posicao);
    setValue('atleta', classificacao.atleta || '');
    setValue('afiliacao', classificacao.afiliacao);
    setValue('pontuacao', classificacao.pontuacao);
    setValue('tempo', classificacao.tempo || '');
    setValue('distancia', classificacao.distancia || '');
    setValue('observacoes', classificacao.observacoes || '');
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta classificação?')) return;

    try {
      const response = await fetch(`/api/classificacoes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Classificação excluída!');
        fetchClassificacoes();
      } else {
        throw new Error('Erro ao excluir');
      }
    } catch {
      toast.error('Erro ao excluir classificação');
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

  const getPosicaoBadge = (posicao: number) => {
    const colors = {
      1: 'bg-yellow-500 text-white',
      2: 'bg-gray-400 text-white',
      3: 'bg-amber-600 text-white',
    };
    return (
      <Badge
        className={colors[posicao as keyof typeof colors] || 'bg-gray-200'}
      >
        {posicao}º
      </Badge>
    );
  };

  return (
    <QueryStateHandler
      isLoading={loading}
      isError={!!error}
      error={error}
      loadingMessage='Carregando classificações...'
    >
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Classificações</CardTitle>
              <Button onClick={handleAddNew}>
                <Plus className='h-4 w-4 mr-2' />
                Nova Classificação
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {classificacoes.map((classificacao) => (
                <div
                  key={classificacao.id}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div className='flex items-center gap-4'>
                    {getPosicaoBadge(classificacao.posicao)}
                    <div>
                      <h3 className='font-semibold'>
                        {classificacao.modalidade} - {classificacao.categoria}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {classificacao.atleta && `${classificacao.atleta} - `}
                        {classificacao.afiliacao} - {classificacao.pontuacao}{' '}
                        pontos
                      </p>
                      {classificacao.tempo && (
                        <p className='text-xs text-gray-500'>
                          Tempo: {classificacao.tempo}
                        </p>
                      )}
                      {classificacao.distancia && (
                        <p className='text-xs text-gray-500'>
                          Distância: {classificacao.distancia}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='flex gap-2'>
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
                </div>
              ))}
              {classificacoes.length === 0 && (
                <p className='text-center text-gray-500 py-8'>
                  Nenhuma classificação cadastrada
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
                {editingId ? 'Editar Classificação' : 'Nova Classificação'}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? 'Faça as alterações necessárias na classificação.'
                  : 'Adicione uma nova classificação ao sistema.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='modalidade'>Modalidade *</Label>
                  <Input
                    id='modalidade'
                    {...register('modalidade')}
                    placeholder='Ex: Futebol'
                  />
                  {errors.modalidade && (
                    <p className='text-sm text-red-600'>
                      {errors.modalidade.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='categoria'>Categoria *</Label>
                  <Input
                    id='categoria'
                    {...register('categoria')}
                    placeholder='Ex: Masculino'
                  />
                  {errors.categoria && (
                    <p className='text-sm text-red-600'>
                      {errors.categoria.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='posicao'>Posição *</Label>
                  <Input
                    id='posicao'
                    type='number'
                    {...register('posicao', { valueAsNumber: true })}
                    placeholder='1'
                  />
                  {errors.posicao && (
                    <p className='text-sm text-red-600'>
                      {errors.posicao.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='atleta'>Atleta</Label>
                  <Input
                    id='atleta'
                    {...register('atleta')}
                    placeholder='Nome do atleta (opcional)'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='afiliacao'>Afiliação *</Label>
                  <Select
                    onValueChange={(value) => setValue('afiliacao', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione a afiliação' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='PMDF'>PMDF</SelectItem>
                      <SelectItem value='CBMDF'>CBMDF</SelectItem>
                      <SelectItem value='PCDF'>PCDF</SelectItem>
                      <SelectItem value='PRF'>PRF</SelectItem>
                      <SelectItem value='DEPEN'>DEPEN</SelectItem>
                      <SelectItem value='SSP-DF'>SSP-DF</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.afiliacao && (
                    <p className='text-sm text-red-600'>
                      {errors.afiliacao.message}
                    </p>
                  )}
                </div>

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

                <div className='space-y-2'>
                  <Label htmlFor='tempo'>Tempo</Label>
                  <Input
                    id='tempo'
                    {...register('tempo')}
                    placeholder='Ex: 1:23:45'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='distancia'>Distância</Label>
                  <Input
                    id='distancia'
                    {...register('distancia')}
                    placeholder='Ex: 100m'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='observacoes'>Observações</Label>
                <Textarea
                  id='observacoes'
                  {...register('observacoes')}
                  placeholder='Observações adicionais...'
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
