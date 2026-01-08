'use client';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
  Legend,
} from 'recharts';
import { generatePDF } from '@/lib/pdf-utils';
import { Download, Filter } from 'lucide-react';

import { AppSidebar } from '@/app/Dashboard/app-sidebar';
import { SiteHeader } from '@/app/Dashboard/site-header';
import { SectionCards } from '@/app/Dashboard/section-cards';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ModalidadesForm from '@/components/admin/ModalidadesForm';
import GaleriaForm from '@/components/admin/GaleriaForm';
import CronogramaForm from '@/components/admin/CronogramaForm';
import InscricoesTable from '@/components/inscricoes/InscricoesTable';
import { getInscricoesColumns } from '@/components/inscricoes/inscricoes-columns';
import ClassificacoesForm from '@/components/admin/ClassificacoesForm';
import QueryStateHandler from '@/components/ui/query-state-handler';
import ConfirmacaoForm from '@/components/admin/ConfirmacaoForm';
import InscricoesForm from '@/components/admin/InscricoesForm';
import { useQuery } from '@tanstack/react-query';
import { Inscricao } from '@/types/inscricao';

interface DashboardSummary {
  inscritosCount: number;
  modalidadesCount: { name: string; value: number }[];
  lotacoesCount: { name: string; quantidade: number }[];
  uniqueLotacoes: string[];
  uniqueModalidades: string[];
  uniqueEquipes: string[];
  inscricoes: Inscricao[];
}

async function fetchDashboardSummary(
  orgaoDeOrigem: string | null,
): Promise<DashboardSummary> {
  let url = '/api/dashboard-summary';
  if (orgaoDeOrigem) {
    url += `?orgaoDeOrigem=${orgaoDeOrigem}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro ao carregar resumo do dashboard');
  }
  return response.json();
}

export default function Dashboard() {
  const [equipe, setEquipe] = useState<string | null>(null);
  const [modalidade, setModalidade] = useState<string | null>(null);
  const [equipeRole, setequipeRole] = useState<string | null>(null);
  const [userOrgao, setUserOrgao] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchequipeRole = async () => {
      try {
        const verifyRes = await fetch('/api/auth/verify');
        if (!verifyRes.ok) throw new Error('Falha ao verificar usuário');
        const verifyData = await verifyRes.json();
        setequipeRole(verifyData.role);
        setUserOrgao(verifyData.equipeNome);

        if (verifyData.role === 'PONTOFOCAL') {
          setActiveTab('dashboard');
        }
      } catch (err: any) {
        console.error('Erro ao buscar papel do usuário:', err);
      }
    };

    fetchequipeRole();
  }, []);

  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
    error: errorSummary,
  } = useQuery<DashboardSummary, Error>({
    queryKey: ['dashboardSummary', userOrgao, equipeRole],
    queryFn: () =>
      fetchDashboardSummary(equipeRole === 'ADMIN' ? null : userOrgao),
    enabled: !!equipeRole && (equipeRole === 'ADMIN' || !!userOrgao),
  });

  const handleTabChange = (tab: string) => {
    if (equipeRole === 'PONTOFOCAL') {
      if (tab === 'dashboard' || tab === 'inscrições') {
        setActiveTab(tab);
      } else {
        setActiveTab('dashboard');
      }
    } else {
      setActiveTab(tab);
    }
  };

  const equipesCount = useMemo(() => {
    if (!summaryData) return [];
    const count: Record<string, number> = {};
    summaryData.inscricoes.forEach((i: any) => {
      if (i.equipeName) {
        if (count[i.equipeName]) {
          count[i.equipeName]++;
        } else {
          count[i.equipeName] = 1;
        }
      }
    });
    return Object.entries(count).map(([name, value]) => ({
      name,
      value,
    }));
  }, [summaryData]);

  const inscritosFiltrados = useMemo(() => {
    if (!summaryData) return [];
    return summaryData.inscricoes.filter((i: any) => {
      const equipeMatch = equipe ? i.equipeName === equipe : true;
      const modalidadeMatch = modalidade
        ? i.modalidades.some((m: any) => m.nome === modalidade)
        : true;
      return equipeMatch && modalidadeMatch;
    });
  }, [summaryData, equipe, modalidade]);

  const modalidadesCount = useMemo(() => {
    if (!summaryData) return [];
    const count: Record<string, number> = {};
    inscritosFiltrados.forEach((i) => {
      i.modalidades.forEach((m) => {
        if (m.nome) {
          if (count[m.nome]) {
            count[m.nome]++;
          } else {
            count[m.nome] = 1;
          }
        }
      });
    });
    return Object.entries(count).map(([name, value]) => ({ name, value }));
  }, [summaryData, inscritosFiltrados]);

  const renderContent = () => {
    switch (activeTab) {
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
      case 'classificações':
        return <ClassificacoesForm />;
      default:
        return (
          <QueryStateHandler
            isLoading={isLoadingSummary}
            isError={isErrorSummary}
            error={errorSummary}
            loadingMessage='Carregando resumo do dashboard...'
          >
            <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
              <SectionCards
                inscritosCount={summaryData?.inscritosCount || 0}
                modalidadesCount={summaryData?.uniqueModalidades.length || 0}
                equipesCount={summaryData?.uniqueEquipes.length || 0}
              />

              {/* Filtros e Controles */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Filter className='h-5 w-5' />
                    Filtros e Relatórios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-col lg:flex-row items-start lg:items-end gap-4 w-full'>
                    {equipeRole === 'ADMIN' && (
                      <div className='space-y-2'>
                        <label className='text-sm font-medium'>
                          Filtrar por Equipe
                        </label>
                        <Select
                          value={equipe ?? 'todos'}
                          onValueChange={(val) =>
                            setEquipe(val === 'todos' ? null : val)
                          }
                        >
                          <SelectTrigger className='w-full lg:w-48'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='todos'>
                              Todas as Equipes
                            </SelectItem>
                            {(summaryData?.uniqueEquipes || []).map((e) => (
                              <SelectItem key={e} value={e}>
                                {e}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>
                        Filtrar por Modalidade
                      </label>
                      <Select
                        value={modalidade ?? 'todos'}
                        onValueChange={(val) =>
                          setModalidade(val === 'todos' ? null : val)
                        }
                      >
                        <SelectTrigger className='w-full lg:w-48'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='todos'>
                            Todas as Modalidades
                          </SelectItem>
                          {summaryData?.uniqueModalidades.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={() => {
                        const dadosParaPDF = inscritosFiltrados.map((i) => ({
                          nome: i.nome,
                          cpf: i.cpf,
                          lotacao: i.lotacao,
                          email: i.email,
                          telefone: i.telefone,
                          modalidades: i.modalidades
                            .map((m) => m.nome)
                            .join(', '),
                          camiseta: i.camiseta,
                          sexo: i.sexo,
                        }));
                        generatePDF(dadosParaPDF);
                      }}
                      disabled={
                        !inscritosFiltrados || inscritosFiltrados.length === 0
                      }
                    >
                      <Download className='h-4 w-4 mr-2' />
                      Gerar Relatório PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Gráficos */}
              <div className='grid gap-4 md:grid-cols-2'>
                {equipeRole === 'ADMIN' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Inscritos por Equipe</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width='100%' height={300}>
                        <BarChart data={equipesCount}>
                          <XAxis dataKey='name' />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey='value' radius={[4, 4, 0, 0]}>
                            {equipesCount.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`hsl(${index * 60}, 70%, 50%)`}
                              />
                            ))}
                            <LabelList dataKey='value' position='top' />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Inscritos por Modalidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={300}>
                      <PieChart>
                        <Pie
                          data={modalidadesCount}
                          dataKey='value'
                          nameKey='name'
                          outerRadius='80%'
                          label
                        >
                          {modalidadesCount.map((_, i) => (
                            <Cell key={i} fill={`hsl(${i * 40}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Tabela de Inscrições */}
              <InscricoesTable
                columns={getInscricoesColumns(
                  undefined as any,
                  undefined as any,
                  false,
                )}
                data={inscritosFiltrados}
                equipeRole={equipeRole}
                orgaoDeOrigem={userOrgao}
                showNewButton={false}
              />
            </div>
          </QueryStateHandler>
        );
    }
  };

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '16rem',
          '--sidebar-width-mobile': '18rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar
        equipeRole={equipeRole}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <SidebarInset>
        <SiteHeader activeTab={activeTab} />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              {renderContent()}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
