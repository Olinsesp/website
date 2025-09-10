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
import { generatePDF } from '@/components/pdf-utils';
import { Download, Filter } from 'lucide-react';

import { columns, Inscricoes } from './columns';
import { DataTable } from './data-table';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SectionCards } from '@/components/section-cards';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ClassificacoesForm from '@/components/admin/ClassificacoesForm';
import ModalidadesForm from '@/components/admin/ModalidadesForm';
import GaleriaForm from '@/components/admin/GaleriaForm';
import CronogramaForm from '@/components/admin/CronogramaForm';
import InscricoesForm from '@/components/admin/InscricoesForm';
import QueryStateHandler from '@/components/ui/query-state-handler';
import ConfirmacaoForm from '@/components/admin/ConfirmacaoForm';

export default function DashboardPage() {
  const [afiliacao, setAfiliacao] = useState<string | null>(null);
  const [modalidade, setModalidade] = useState<string | null>(null);
  const [inscritos, setInscritos] = useState<Inscricoes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const afiliacaoColors: Record<string, string> = {
    PMDF: '#0a3351ff',
    CBMDF: '#ff7f0e',
    PCDF: '#0f450fff',
    PRF: '#d62728',
    DEPEN: '#9467bd',
    'SSP-DF': '#28b3f3ff',
    OUTROS: '#e377c2',
  };

  useEffect(() => {
    const fetchInscricoes = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/inscricoes');
        if (!res.ok) throw new Error('Falha ao buscar inscrições');
        const data: Inscricoes[] = await res.json();
        setInscritos(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInscricoes();
  }, []);

  const inscritosFiltrados = useMemo(() => {
    return inscritos.filter((i) => {
      const filtroAfiliacao = afiliacao ? i.afiliacao === afiliacao : true;
      const filtroModalidade = modalidade
        ? i.modalidades.includes(modalidade)
        : true;
      return filtroAfiliacao && filtroModalidade;
    });
  }, [inscritos, afiliacao, modalidade]);

  const afiliacoesCount = useMemo(() => {
    const map = new Map<string, number>();
    inscritosFiltrados.forEach((i) => {
      map.set(i.afiliacao, (map.get(i.afiliacao) || 0) + 1);
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
      case 'classificações':
        return <ClassificacoesForm />;
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
        return (
          <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
            <SectionCards
              inscritosCount={inscritosFiltrados.length}
              modalidadesCount={modalidadesCount.length}
              afiliacoesCount={afiliacoesCount.length}
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
                      Filtrar por Afiliação
                    </label>
                    <Select
                      value={afiliacao ?? 'todos'}
                      onValueChange={(val) =>
                        setAfiliacao(val === 'todos' ? null : val)
                      }
                    >
                      <SelectTrigger className='w-full lg:w-48'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='todos'>
                          Todas as Afiliações
                        </SelectItem>
                        {[...new Set(inscritos.map((i) => i.afiliacao))].map(
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
                  <CardTitle>Inscritos por Afiliação</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={afiliacoesCount}>
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey='quantidade' radius={[4, 4, 0, 0]}>
                        {afiliacoesCount.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={
                              afiliacaoColors[entry.name] ||
                              afiliacaoColors['OUTROS']
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

            {/* Tabela de Inscritos */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Lista de Inscritos
                  <span className='text-sm font-normal text-muted-foreground ml-2'>
                    ({inscritosFiltrados.length} registros)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columns}
                  data={inscritosFiltrados.map((i) => ({
                    ...i,
                    modalidades: modalidade
                      ? i.modalidades.filter((m) => m === modalidade)
                      : i.modalidades,
                  }))}
                />
              </CardContent>
            </Card>
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
