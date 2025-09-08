'use client';

import { useState, useEffect } from 'react';
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

export default function GaleriaForm() {
  const [midias, setMidias] = useState<Midia[]>([]);
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

  useEffect(() => {
    fetchMidias();
  }, []);

  const fetchMidias = async () => {
    try {
      const response = await fetch('/api/midias');
      if (response.ok) {
        const data = await response.json();
        setMidias(data);
      } else {
        throw new Error('Erro ao carregar mídias');
      }
    } catch (err: any) {
      setError(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: MidiaFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/midias/${editingId}` : '/api/midias';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingId ? 'Mídia atualizada!' : 'Mídia adicionada!');
        fetchMidias();
        reset();
        setEditingId(null);
        setIsDialogOpen(false);
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch {
      toast.error('Erro ao salvar mídia');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (midia: Midia) => {
    setEditingId(midia.id);
    setValue('tipo', midia.tipo as any);
    setValue('url', midia.url);
    setValue('titulo', midia.titulo || '');
    setValue('destaque', midia.destaque);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mídia?')) return;

    try {
      const response = await fetch(`/api/midias/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Mídia excluída!');
        fetchMidias();
      } else {
        throw new Error('Erro ao excluir');
      }
    } catch {
      toast.error('Erro ao excluir mídia');
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

  return (
    <QueryStateHandler
      isLoading={loading}
      isError={!!error}
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
            <div className='space-y-4'>
              {midias.map((midia) => (
                <div key={midia.id} className='p-4 border rounded-lg space-y-3'>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-2 flex-1'>
                      <div className='flex items-center gap-2'>
                        {getTipoBadge(midia.tipo)}
                        {midia.destaque && (
                          <Badge
                            variant='outline'
                            className='flex items-center gap-1'
                          >
                            <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                            Destaque
                          </Badge>
                        )}
                      </div>

                      {midia.titulo && (
                        <h3 className='font-semibold'>{midia.titulo}</h3>
                      )}

                      <div className='space-y-2'>
                        <p className='text-sm text-gray-600 break-all'>
                          <strong>URL:</strong> {midia.url}
                        </p>
                        <p className='text-xs text-gray-500'>
                          Adicionado em: {formatDate(midia.createdAt)}
                        </p>
                      </div>

                      {/* Preview baseado no tipo */}
                      {midia.tipo === 'foto' && (
                        <div className='mt-3'>
                          <Image
                            src={midia.url}
                            alt={midia.titulo || 'Imagem'}
                            width={200}
                            height={128}
                            className='max-w-xs max-h-32 object-cover rounded border'
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                        </div>
                      )}

                      {midia.tipo === 'video' && (
                        <div className='mt-3'>
                          <video
                            src={midia.url}
                            className='max-w-xs max-h-32 rounded border'
                            controls
                            onError={(e) => {
                              (e.target as HTMLVideoElement).style.display =
                                'none';
                            }}
                          >
                            Seu navegador não suporta vídeos.
                          </video>
                        </div>
                      )}

                      {midia.tipo === 'release' && (
                        <div className='mt-3 p-3 bg-gray-50 rounded border'>
                          <p className='text-sm text-gray-600'>
                            <strong>Release:</strong> {midia.url}
                          </p>
                          <a
                            href={midia.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:text-blue-800 text-sm underline'
                          >
                            Abrir release
                          </a>
                        </div>
                      )}
                    </div>

                    <div className='flex gap-2 ml-4'>
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
                  </div>
                </div>
              ))}
              {midias.length === 0 && (
                <p className='text-center text-gray-500 py-8'>
                  Nenhuma mídia cadastrada
                </p>
              )}
            </div>
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
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? (
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
