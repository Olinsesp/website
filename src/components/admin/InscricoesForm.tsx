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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Save, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import QueryStateHandler from '../ui/query-state-handler';

const inscricaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.email('Email inválido'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  camiseta: z.string().min(1, 'Tamanho da camiseta é obrigatório'),
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  lotacao: z.string().min(1, 'Lotação é obrigatória'),
  orgaoOrigem: z.string().min(1, 'Órgão de Origem é obrigatório'),
  modalidades: z
    .array(z.string())
    .min(1, 'Selecione pelo menos uma modalidade'),
  status: z.enum(['pendente', 'aprovada', 'rejeitada']).optional(),
});

type InscricaoFormData = z.infer<typeof inscricaoSchema>;

interface Inscricao {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  camiseta: string;
  matricula: string;
  lotacao: string;
  orgaoOrigem: string;
  modalidades: string[];
  status: 'pendente' | 'aprovada' | 'rejeitada';
  createdAt: string;
}

export default function InscricoesForm() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
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
      modalidades: [],
      status: 'pendente',
    },
  });

  const watchedModalidades = watch('modalidades');

  useEffect(() => {
    fetchInscricoes();
  }, []);

  const fetchInscricoes = async () => {
    try {
      const response = await fetch('/api/inscricoes');
      if (response.ok) {
        const data = await response.json();
        setInscricoes(data);
      } else {
        throw new Error('Erro ao carregar inscrições');
      }
    } catch (err: any) {
      setError(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: InscricaoFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingId
        ? `/api/inscricoes/${editingId}`
        : '/api/inscricoes';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          editingId ? 'Inscrição atualizada!' : 'Inscrição criada!',
        );
        fetchInscricoes();
        reset();
        setEditingId(null);
        setIsDialogOpen(false);
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch {
      toast.error('Erro ao salvar inscrição');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (inscricao: Inscricao) => {
    setEditingId(inscricao.id);
    setValue('nome', inscricao.nome);
    setValue('email', inscricao.email);
    setValue('telefone', inscricao.telefone);
    setValue('cpf', inscricao.cpf);
    setValue('dataNascimento', inscricao.dataNascimento);
    setValue('camiseta', inscricao.camiseta);
    setValue('matricula', inscricao.matricula);
    setValue('lotacao', inscricao.lotacao);
    setValue('orgaoOrigem', inscricao.orgaoOrigem);
    setValue('modalidades', inscricao.modalidades);
    setValue('status', inscricao.status);

    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta inscrição?')) return;

    try {
      const response = await fetch(`/api/inscricoes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Inscrição excluída!');
        fetchInscricoes();
      } else {
        throw new Error('Erro ao excluir');
      }
    } catch {
      toast.error('Erro ao excluir inscrição');
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

  const toggleModalidade = (modalidade: string) => {
    const current = watchedModalidades || [];
    const updated = current.includes(modalidade)
      ? current.filter((m) => m !== modalidade)
      : [...current, modalidade];
    setValue('modalidades', updated);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { label: 'Pendente', color: 'bg-yellow-500' },
      aprovada: { label: 'Aprovada', color: 'bg-green-500' },
      rejeitada: { label: 'Rejeitada', color: 'bg-red-500' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: 'Desconhecido',
      color: 'bg-gray-500',
    };
    return (
      <Badge className={`${config.color} text-white`}>{config.label}</Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <QueryStateHandler
      isLoading={loading}
      isError={!!error}
      error={error}
      loadingMessage='Carregando inscrições...'
    >
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Inscrições</CardTitle>
              <Button onClick={handleAddNew}>
                <Plus className='h-4 w-4 mr-2' />
                Nova Inscrição
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {inscricoes.map((inscricao) => (
                <div
                  key={inscricao.id}
                  className='p-4 border rounded-lg space-y-3'
                >
                  <div className='flex items-start justify-between'>
                    <div className='space-y-2 flex-1'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-semibold text-lg'>
                          {inscricao.nome}
                        </h3>
                        {getStatusBadge(inscricao.status)}
                      </div>

                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <span className='flex items-center gap-1'>
                          <Mail className='h-4 w-4' />
                          {inscricao.email}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Phone className='h-4 w-4' />
                          {inscricao.telefone}
                        </span>
                      </div>

                      <div className='text-sm text-gray-600'>
                        <p>
                          <strong>Lotação:</strong> {inscricao.lotacao}
                        </p>
                        <p>
                          <strong>Órgão de Origem:</strong>{' '}
                          {inscricao.orgaoOrigem}
                        </p>
                        <p>
                          <strong>Modalidades:</strong>{' '}
                          {inscricao.modalidades.join(', ')}
                        </p>
                        <p>
                          <strong>Inscrito em:</strong>{' '}
                          {formatDate(inscricao.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className='flex gap-2 ml-4'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleEdit(inscricao)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => handleDelete(inscricao.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {inscricoes.length === 0 && (
                <p className='text-center text-gray-500 py-8'>
                  Nenhuma inscrição cadastrada
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dialog para Adicionar/Editar */}
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
                    <p className='text-sm text-red-600'>
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
                    <p className='text-sm text-red-600'>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='telefone'>Telefone *</Label>
                  <Input
                    id='telefone'
                    {...register('telefone')}
                    placeholder='(61) 99999-9999'
                  />
                  {errors.telefone && (
                    <p className='text-sm text-red-600'>
                      {errors.telefone.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='cpf'>CPF *</Label>
                  <Input
                    id='cpf'
                    {...register('cpf')}
                    placeholder='000.000.000-00'
                  />
                  {errors.cpf && (
                    <p className='text-sm text-red-600'>{errors.cpf.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='dataNascimento'>Data de Nascimento *</Label>
                  <Input
                    id='dataNascimento'
                    type='date'
                    {...register('dataNascimento')}
                  />
                  {errors.dataNascimento && (
                    <p className='text-sm text-red-600'>
                      {errors.dataNascimento.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='camiseta'>Tamanho da Camiseta *</Label>
                  <Select
                    onValueChange={(value) => setValue('camiseta', value)}
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
                    <p className='text-sm text-red-600'>
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
                    <p className='text-sm text-red-600'>
                      {errors.matricula.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='lotacao'>Lotação *</Label>
                  <Select onValueChange={(value) => setValue('lotacao', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione a lotação' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='PCDF'>PCDF</SelectItem>
                      <SelectItem value='PMDF'>PMDF</SelectItem>
                      <SelectItem value='CBMDF'>CBMDF</SelectItem>
                      <SelectItem value='PF'>PF</SelectItem>
                      <SelectItem value='PRF'>PRF</SelectItem>
                      <SelectItem value='DEPEN'>DEPEN</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.lotacao && (
                    <p className='text-sm text-red-600'>
                      {errors.lotacao.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='orgaoOrigem'>Órgão de Origem *</Label>
                  <Select
                    onValueChange={(value) => setValue('orgaoOrigem', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o órgão de origem' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='PCDF'>PCDF</SelectItem>
                      <SelectItem value='PMDF'>PMDF</SelectItem>
                      <SelectItem value='CBMDF'>CBMDF</SelectItem>
                      <SelectItem value='PF'>PF</SelectItem>
                      <SelectItem value='PRF'>PRF</SelectItem>
                      <SelectItem value='DEPEN'>DEPEN</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.orgaoOrigem && (
                    <p className='text-sm text-red-600'>
                      {errors.orgaoOrigem.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Modalidades *</Label>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                  {[
                    'Futebol',
                    'Vôlei',
                    'Basquete',
                    'Natação',
                    'Atletismo',
                    'Tênis',
                  ].map((modalidade) => (
                    <div
                      key={modalidade}
                      className='flex items-center space-x-2'
                    >
                      <Checkbox
                        id={modalidade}
                        checked={
                          watchedModalidades?.includes(modalidade) || false
                        }
                        onCheckedChange={() => toggleModalidade(modalidade)}
                      />
                      <Label htmlFor={modalidade} className='text-sm'>
                        {modalidade}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.modalidades && (
                  <p className='text-sm text-red-600'>
                    {errors.modalidades.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      'status',
                      value as 'pendente' | 'aprovada' | 'rejeitada',
                    )
                  }
                  defaultValue={watch('status')}
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
                  <p className='text-sm text-red-600'>
                    {errors.status.message}
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
    </QueryStateHandler>
  );
}
