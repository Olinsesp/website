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
} from 'recharts';
import { generatePDF } from '@/lib/pdf-utils';
import { Download, Filter } from 'lucide-react';

import { Inscricao } from '@/types/inscricao';

import { AppSidebar } from '@/app/Dashboard/app-sidebar';
import { SiteHeader } from '@/app/Dashboard/site-header';
import { SectionCards } from '@/app/Dashboard/section-cards';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ModalidadesForm from '@/components/admin/ModalidadesForm';
import GaleriaForm from '@/components/admin/GaleriaForm';
import CronogramaForm from '@/components/admin/CronogramaForm';
import InscricoesTable from '@/components/inscricoes/InscricoesTable';
import ClassificacoesForm from '@/components/admin/ClassificacoesForm';
import QueryStateHandler from '@/components/ui/query-state-handler';
import ConfirmacaoForm from '@/components/admin/ConfirmacaoForm';
import InscricoesForm from '@/components/admin/InscricoesForm';

export default function DashboardPage() {
  const [lotacao, setLotacao] = useState<string | null>(null);
  const [modalidade, setModalidade] = useState<string | null>(null);
  const [inscritos, setInscritos] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const lotacaoColors: Record<string, string> = {
    PMDF: '#0a3351ff',
    CBMDF: '#ff7f0e',
    PCDF: '#0f450fff',
    PRF: '#d62728',
    DEPEN: '#9467bd',
    'SSP-DF': '#28b3f3ff',
    OUTROS: '#e377c2',
    SSP: '#6a3d9a',
    'DETRAN-DF': '#b2df8a',
    PF: '#33a02c',
    PPDF: '#fb9a99',
    PPF: '#e31a1c',
    PLDF: '#fdbf6f',
    PLF: '#ff7f00',
    SEJUS: '#cab2d6',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [inscritosRes] = await Promise.all([fetch('/api/inscricoes')]);

        if (!inscritosRes.ok) throw new Error('Falha ao buscar inscrições');

        const inscritosData = await inscritosRes.json();
        const inscritosComStatus = inscritosData.map(
          (item: any, index: number) => ({
            ...item,
            id: item.id || `id-${index}`,
            status: ['aprovada', 'pendente', 'rejeitada'][index % 3],
          }),
        );

        setInscritos(inscritosComStatus);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const inscritosFiltrados = useMemo(() => {
    return inscritos.filter((i) => {
      const filtrolotacao = lotacao ? i.lotacao === lotacao : true;
      const filtroModalidade = modalidade
        ? i.modalidades.includes(modalidade)
        : true;
      return filtrolotacao && filtroModalidade;
    });
  }, [inscritos, lotacao, modalidade]);

  const lotacoesCount = useMemo(() => {
    const map = new Map<string, number>();
    inscritosFiltrados.forEach((i) => {
      map.set(i.lotacao, (map.get(i.lotacao) || 0) + 1);
    });
    return Array.from(map, ([name, quantidade]) => ({ name, quantidade }));
  }, [inscritosFiltrados]);

  const modalidadesCount = useMemo(() => {
    const map = new Map<string, number>();
    inscritosFiltrados.forEach((i) => {
      i.modalidades.forEach((m) => {
        if (!modalidade || m === modalidade) {
          map.set(m, (map.get(m) || 0) + 1);
        }
      });
    });
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [inscritosFiltrados, modalidade]);

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
          <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
            <SectionCards
              inscritosCount={inscritosFiltrados.length}
              modalidadesCount={modalidadesCount.length}
              lotacoesCount={lotacoesCount.length}
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
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                      Filtrar por Lotação
                    </label>
                    <Select
                      value={lotacao ?? 'todos'}
                      onValueChange={(val) =>
                        setLotacao(val === 'todos' ? null : val)
                      }
                    >
                      <SelectTrigger className='w-full lg:w-48'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='todos'>Todas as Lotações</SelectItem>
                        {[...new Set(inscritos.map((i) => i.lotacao))].map(
                          (a) => (
                            <SelectItem key={a} value={a}>
                              {a}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>

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
                        {[
                          ...new Set(inscritos.flatMap((i) => i.modalidades)),
                        ].map((m) => (
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
                        ...i,
                        modalidades: modalidade
                          ? i.modalidades.filter((m) => m === modalidade)
                          : i.modalidades,
                      }));
                      generatePDF(dadosParaPDF);
                    }}
                  >
                    <Download className='h-4 w-4 mr-2' />
                    Gerar Relatório PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Gráficos */}
            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Inscritos por Lotação</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={lotacoesCount}>
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey='quantidade' radius={[4, 4, 0, 0]}>
                        {lotacoesCount.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={
                              lotacaoColors[entry.name] ||
                              lotacaoColors['OUTROS']
                            }
                          />
                        ))}
                        <LabelList dataKey='quantidade' position='top' />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

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
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Inscrições */}
            <InscricoesTable />
          </div>
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
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset>
        <SiteHeader activeTab={activeTab} />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              <QueryStateHandler
                isLoading={loading}
                isError={!!error}
                error={error}
                loadingMessage='Carregando dashboard...'
              >
                {renderContent()}
              </QueryStateHandler>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
