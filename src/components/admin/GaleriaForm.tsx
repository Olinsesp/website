'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
  Trash2,
  Edit,
  Plus,
  Save,
  Image as ImageIcon,
  Video,
  FileText,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import QueryStateHandler from '../ui/query-state-handler';
import { DataTable } from '@/app/Dashboard/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const midiaSchema = z
  .object({
    tipo: z.enum(['foto', 'video', 'release']),
    url: z.string().min(1, 'Campo obrigatório'),
    titulo: z.string().optional(),
    destaque: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.tipo === 'release') {
        return data.url.length > 0;
      }
      try {
        new URL(data.url);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: 'Informe uma URL válida',
      path: ['url'],
    },
  );

type MidiaFormData = z.infer<typeof midiaSchema>;

interface Midia {
  id: string;
  tipo: string;
  url: string;
  titulo?: string | null;
  destaque: boolean;
  createdAt: string;
}

async function fetchMidias(): Promise<Midia[]> {
  const response = await fetch('/api/midias');
  if (!response.ok) {
    throw new Error('Erro ao carregar mídias');
  }
  return response.json();
}

export default function GaleriaForm() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: midias = [],
    isLoading,
    isError,
    error,
  } = useQuery<Midia[], Error>({
    queryKey: ['midias'],
    queryFn: fetchMidias,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MidiaFormData>({
    resolver: zodResolver(midiaSchema),
    defaultValues: {
      tipo: 'foto',
      url: '',
      titulo: '',
      destaque: false,
    },
  });

  const watchedDestaque = watch('destaque');

  const mutation = useMutation<
    Response,
    Error,
    { data: MidiaFormData; id?: string | null }
  >({
    mutationFn: async ({ data, id }) => {
      const url = id ? `/api/midias/${id}` : '/api/midias';
      const method = id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar mídia');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['midias'] });
      toast.success(editingId ? 'Mídia atualizada!' : 'Mídia adicionada!');
      handleCancel();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation<Response, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/midias/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir mídia');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['midias'] });
      toast.success('Mídia excluída!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: MidiaFormData) => {
    mutation.mutate({ data, id: editingId });
  };

  const handleEdit = (midia: Midia) => {
    setEditingId(midia.id);
    setValue('tipo', midia.tipo as any);
    setValue('url', midia.url);
    setValue('titulo', midia.titulo || '');
    setValue('destaque', midia.destaque);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mídia?')) return;
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

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'foto':
        return <ImageIcon className='h-4 w-4' />;
      case 'video':
        return <Video className='h-4 w-4' />;
      case 'release':
        return <FileText className='h-4 w-4' />;
      default:
        return <ImageIcon className='h-4 w-4' />;
    }
  };

  const getTipoBadge = (tipo: string) => {
    const tipoConfig = {
      foto: { label: 'Foto', color: 'bg-blue-500' },
      video: { label: 'Vídeo', color: 'bg-red-500' },
      release: { label: 'Release', color: 'bg-green-500' },
    };
    const config = tipoConfig[tipo as keyof typeof tipoConfig] || {
      label: 'Desconhecido',
      color: 'bg-gray-500',
    };
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        {getTipoIcon(tipo)}
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns: ColumnDef<Midia>[] = [
    {
      id: 'preview',
      header: 'Preview',
      cell: ({ row }) => {
        const midia = row.original;
        return (
          <>
            {midia.tipo === 'foto' && (
              <Image
                src={midia.url}
                alt={midia.titulo || 'Imagem'}
                width={100}
                height={64}
                className='object-cover rounded border'
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            {midia.tipo === 'video' && (
              <video
                src={midia.url}
                className='w-24 h-16 rounded border'
                controls
                onError={(e) => {
                  (e.target as HTMLVideoElement).style.display = 'none';
                }}
              />
            )}
            {midia.tipo === 'release' && (
              <div className='p-2 bg-gray-50 rounded border'>
                <FileText className='h-8 w-8 text-gray-500' />
              </div>
            )}
          </>
        );
      },
    },
    {
      accessorKey: 'titulo',
      header: 'Título',
      cell: ({ row }) => row.original.titulo || 'N/A',
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => getTipoBadge(row.original.tipo),
    },
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }) => (
        <a
          href={row.original.url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500 hover:underline truncate max-w-xs'
        >
          {row.original.url}
        </a>
      ),
    },
    {
      accessorKey: 'destaque',
      header: 'Destaque',
      cell: ({ row }) =>
        row.original.destaque && (
          <Badge variant='outline' className='flex items-center gap-1'>
            <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
            Destaque
          </Badge>
        ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Adicionado em',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const midia = row.original;
        return (
          <div className='flex gap-2 justify-end'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => handleEdit(midia)}
            >
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant='destructive'
              onClick={() => handleDelete(midia.id)}
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
      loadingMessage='Carregando galeria...'
    >
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Mídias da Galeria</CardTitle>
              <Button onClick={handleAddNew}>
                <Plus className='h-4 w-4 mr-2' />
                Adicionar Mídia
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={midias} filterColumn='titulo' />
          </CardContent>
        </Card>

        {/* Dialog para Adicionar/Editar */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Mídia' : 'Adicionar Mídia'}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? 'Faça as alterações necessárias na mídia.'
                  : 'Adicione uma nova mídia à galeria.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='tipo'>Tipo de Mídia *</Label>
                  <Select
                    onValueChange={(value) => setValue('tipo', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o tipo' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='foto'>
                        <div className='flex items-center gap-2'>
                          <ImageIcon className='h-4 w-4' />
                          Foto
                        </div>
                      </SelectItem>
                      <SelectItem value='video'>
                        <div className='flex items-center gap-2'>
                          <Video className='h-4 w-4' />
                          Vídeo
                        </div>
                      </SelectItem>
                      <SelectItem value='release'>
                        <div className='flex items-center gap-2'>
                          <FileText className='h-4 w-4' />
                          Release
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo && (
                    <p className='text-sm text-red-600'>
                      {errors.tipo.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='url'>
                    {watch('tipo') === 'release'
                      ? 'Texto ou URL do Release *'
                      : 'URL *'}
                  </Label>
                  <Input
                    id='url'
                    {...register('url')}
                    placeholder={
                      watch('tipo') === 'release'
                        ? 'Digite o release ou cole o link'
                        : 'https://exemplo.com/imagem.jpg'
                    }
                  />
                  {errors.url && (
                    <p className='text-sm text-red-600'>{errors.url.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='titulo'>Título</Label>
                  <Input
                    id='titulo'
                    {...register('titulo')}
                    placeholder='Título da mídia (opcional)'
                  />
                </div>

                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='destaque'
                    checked={watchedDestaque}
                    onCheckedChange={(checked) =>
                      setValue('destaque', checked as boolean)
                    }
                  />
                  <Label htmlFor='destaque' className='flex items-center gap-2'>
                    <Star className='h-4 w-4' />
                    Destacar na galeria
                  </Label>
                </div>
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
                  {editingId ? 'Atualizar' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </QueryStateHandler>
  );
}
