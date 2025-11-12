'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { AppSidebar } from '@/app/Dashboard/app-sidebar';
import { SiteHeader } from '@/app/Dashboard/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import QueryStateHandler from '@/components/ui/query-state-handler';
import { DataTable } from './data-table';
import {
  getClassificacoesColumns,
  ClassificacaoEnriquecida,
} from './classificacoes-columns';
import ClassificacoesForm from '@/components/admin/ClassificacoesForm';
import ModalidadesForm from '@/components/admin/ModalidadesForm';
import GaleriaForm from '@/components/admin/GaleriaForm';
import CronogramaForm from '@/components/admin/CronogramaForm';
import InscricoesForm from '@/components/admin/InscricoesForm';
import ConfirmacaoForm from '@/components/admin/ConfirmacaoForm';

// Tipos de dados brutos
interface ClassificacaoRaw {
  id: string;
  modalidadeId: string;
  categoria: string;
  posicao: number;
  inscricaoId?: string;
  lotacao?: string;
  pontuacao: number;
}
interface Inscricao {
  id: string;
  nome: string;
  lotacao: string;
}
interface Modalidade {
  id: string;
  nome: string;
}

// Funções de fetch
const fetchData = async (url: string, errorMessage: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(errorMessage);
  return res.json();
};

const fetchClassificacoes = () =>
  fetchData('/api/classificacoes', 'Falha ao buscar classificações');
const fetchInscricoes = () =>
  fetchData('/api/inscricoes', 'Falha ao buscar inscrições');
const fetchModalidades = () =>
  fetchData('/api/modalidades', 'Falha ao buscar modalidades');

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('classificações');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [classificacaoToEdit, setClassificacaoToEdit] =
    useState<ClassificacaoRaw | null>(null);

  const queryClient = useQueryClient();

  const {
    data: classificacoesRaw,
    isLoading: isLoadingClassificacoes,
    isError: isErrorClassificacoes,
    error: errorClassificacoes,
  } = useQuery<ClassificacaoRaw[]>({
    queryKey: ['classificacoes'],
    queryFn: fetchClassificacoes,
  });

  const {
    data: inscricoes,
    isLoading: isLoadingInscricoes,
    isError: isErrorInscricoes,
    error: errorInscricoes,
  } = useQuery<Inscricao[]>({
    queryKey: ['inscricoes'],
    queryFn: fetchInscricoes,
  });

  const {
    data: modalidades,
    isLoading: isLoadingModalidades,
    isError: isErrorModalidades,
    error: errorModalidades,
  } = useQuery<Modalidade[]>({
    queryKey: ['modalidades'],
    queryFn: fetchModalidades,
  });

  const classificacoesEnriquecidas = useMemo<ClassificacaoEnriquecida[]>(() => {
    if (!classificacoesRaw || !inscricoes || !modalidades) return [];

    const inscricoesMap = new Map(inscricoes.map((i) => [i.id, i]));
    const modalidadesMap = new Map(modalidades.map((m) => [m.id, m]));

    return classificacoesRaw.map((c) => {
      const modalidade = modalidadesMap.get(c.modalidadeId);
      const inscricao = c.inscricaoId
        ? inscricoesMap.get(c.inscricaoId)
        : undefined;

      return {
        ...c,
        modalidade: modalidade?.nome || 'Desconhecida',
        atleta: inscricao?.nome,
        lotacao: inscricao?.lotacao || c.lotacao,
      };
    });
  }, [classificacoesRaw, inscricoes, modalidades]);

  const handleAddNew = () => {
    setClassificacaoToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = useCallback(
    (classificacao: ClassificacaoEnriquecida) => {
      const original = classificacoesRaw?.find(
        (c) => c.id === classificacao.id,
      );
      if (original) {
        setClassificacaoToEdit(original);
        setIsFormOpen(true);
      }
    },
    [classificacoesRaw],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Tem certeza que deseja excluir esta classificação?'))
        return;

      try {
        const response = await fetch(`/api/classificacoes/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toast.success('Classificação excluída!');
          queryClient.invalidateQueries({ queryKey: ['classificacoes'] });
        } else {
          throw new Error('Erro ao excluir');
        }
      } catch {
        toast.error('Erro ao excluir classificação');
      }
    },
    [queryClient],
  );

  const handleSave = () => {
    queryClient.invalidateQueries({ queryKey: ['classificacoes'] });
  };

  const columns = useMemo(
    () =>
      getClassificacoesColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete],
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'classificações':
        return (
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Gerenciar Classificações</CardTitle>
                <Button onClick={handleAddNew}>
                  <Plus className='h-4 w-4 mr-2' />
                  Nova Classificação
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={classificacoesEnriquecidas} />
            </CardContent>
          </Card>
        );
      case 'modalidades':
        return <ModalidadesForm />;
      case 'galeria':
        return <GaleriaForm />;
      case 'cronograma':
        return <CronogramaForm />;
      case 'inscrições':
        return <InscricoesForm />;
      case 'confirmação':
        return <ConfirmacaoForm />;
      default:
        return <div>Selecione uma opção no menu.</div>;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset>
        <SiteHeader activeTab={activeTab} />
        <main className='flex-1 p-4 md:p-6'>
          <QueryStateHandler
            isLoading={
              isLoadingClassificacoes ||
              isLoadingInscricoes ||
              isLoadingModalidades
            }
            isError={
              isErrorClassificacoes || isErrorInscricoes || isErrorModalidades
            }
            error={errorClassificacoes || errorInscricoes || errorModalidades}
            loadingMessage='Carregando dados do dashboard...'
          >
            {renderContent()}
          </QueryStateHandler>
        </main>
        {isFormOpen && (
          <ClassificacoesForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSave}
            classificacaoToEdit={classificacaoToEdit}
            inscricoes={inscricoes || []}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
