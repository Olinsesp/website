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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Trash2,
  Edit,
  Plus,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  Shirt,
} from 'lucide-react';
import { toast } from 'sonner';

const inscricaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  camiseta: z.string().min(1, 'Tamanho da camiseta é obrigatório'),
  afiliacao: z.string().min(1, 'Afiliação é obrigatória'),
  modalidades: z
    .array(z.string())
    .min(1, 'Selecione pelo menos uma modalidade'),
});

type InscricaoFormData = z.infer<typeof inscricaoSchema>;

interface Inscricao {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  camiseta: string;
  afiliacao: string;
  modalidades: string[];
  createdAt: string;
}

export default function InscricoesForm() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [modalidades, setModalidades] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      modalidades: [],
    },
  });

  const watchedModalidades = watch('modalidades') || [];

  useEffect(() => {
    fetchInscricoes();
    fetchModalidades();
  }, []);

  const fetchInscricoes = async () => {
    try {
      const response = await fetch('/api/inscricoes');
      if (response.ok) {
        const data = await response.json();
        setInscricoes(data);
      }
    } catch {
      toast.error('Erro ao carregar inscrições');
    } finally {
      setLoading(false);
    }
  };

  const fetchModalidades = async () => {
    try {
      const response = await fetch('/api/modalidades');
      if (response.ok) {
        const data = await response.json();
        const nomesModalidades = data.map((m: any) => m.nome);
        setModalidades(nomesModalidades);
      }
    } catch {
      console.error('Erro ao carregar modalidades');
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
    setValue('cpf', inscricao.cpf);
    setValue('dataNascimento', inscricao.dataNascimento);
    setValue('telefone', inscricao.telefone);
    setValue('camiseta', inscricao.camiseta);
    setValue('afiliacao', inscricao.afiliacao);
    setValue('modalidades', inscricao.modalidades);
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
  };

  const toggleModalidade = (modalidade: string) => {
    const novasModalidades = watchedModalidades.includes(modalidade)
      ? watchedModalidades.filter((m) => m !== modalidade)
      : [...watchedModalidades, modalidade];
    setValue('modalidades', novasModalidades);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p>Carregando inscrições...</p>
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
            {editingId ? 'Editar Inscrição' : 'Nova Inscrição'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='nome'>Nome Completo *</Label>
                <Input
                  id='nome'
                  {...register('nome')}
                  placeholder='Nome completo do atleta'
                />
                {errors.nome && (
                  <p className='text-sm text-red-600'>{errors.nome.message}</p>
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
                  <p className='text-sm text-red-600'>{errors.email.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='cpf'>CPF *</Label>
                <Input
                  id='cpf'
                  {...register('cpf')}
                  placeholder='00000000000'
                  maxLength={11}
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
                <Label htmlFor='telefone'>Telefone *</Label>
                <Input
                  id='telefone'
                  {...register('telefone')}
                  placeholder='11999999999'
                />
                {errors.telefone && (
                  <p className='text-sm text-red-600'>
                    {errors.telefone.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='camiseta'>Tamanho da Camiseta *</Label>
                <Select onValueChange={(value) => setValue('camiseta', value)}>
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
                <Label htmlFor='afiliacao'>Afiliação *</Label>
                <Select onValueChange={(value) => setValue('afiliacao', value)}>
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
            </div>

            <div className='space-y-2'>
              <Label>Modalidades *</Label>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mt-2'>
                {modalidades.map((modalidade) => (
                  <div key={modalidade} className='flex items-center space-x-2'>
                    <Checkbox
                      id={modalidade}
                      checked={watchedModalidades.includes(modalidade)}
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
          <CardTitle>Inscrições Existentes</CardTitle>
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
                      <Badge variant='outline'>{inscricao.afiliacao}</Badge>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <Mail className='h-4 w-4' />
                          <span>{inscricao.email}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Phone className='h-4 w-4' />
                          <span>{formatPhone(inscricao.telefone)}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-4 w-4' />
                          <span>
                            Nascimento: {formatDate(inscricao.dataNascimento)}
                          </span>
                        </div>
                      </div>

                      <div className='space-y-1'>
                        <div>
                          <strong>CPF:</strong> {formatCPF(inscricao.cpf)}
                        </div>
                        <div className='flex items-center gap-2'>
                          <Shirt className='h-4 w-4' />
                          <span>Camiseta: {inscricao.camiseta}</span>
                        </div>
                        <div>
                          <strong>Inscrito em:</strong>{' '}
                          {formatDate(inscricao.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className='mt-3'>
                      <h4 className='text-sm font-medium mb-2'>Modalidades:</h4>
                      <div className='flex flex-wrap gap-1'>
                        {inscricao.modalidades.map((modalidade, index) => (
                          <Badge
                            key={index}
                            variant='secondary'
                            className='text-xs'
                          >
                            {modalidade}
                          </Badge>
                        ))}
                      </div>
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
    </div>
  );
}
