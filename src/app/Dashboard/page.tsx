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
import {
  Loader2,
  Users,
  Trophy,
  Building2,
  FileText,
  Download,
  Filter,
} from 'lucide-react';

import { columns, Inscricoes } from './columns';
import { DataTable } from './data-table';

export default function DashboardPage() {
  const [afiliacao, setAfiliacao] = useState<string | null>(null);
  const [modalidade, setModalidade] = useState<string | null>(null);
  const [inscritos, setInscritos] = useState<Inscricoes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const afiliacaoColors: Record<string, string> = {
    PMDF: '#1f77b4',
    CBMDF: '#ff7f0e',
    PCDF: '#2ca02c',
    PRF: '#d62728',
    DEPEN: '#9467bd',
    'SSP-DF': '#8c564b',
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
        setError(err.message);
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

  if (loading)
    return (
      <div className='flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-orange-50'>
        <div className='text-center'>
          <Loader2 className='inline-block h-12 w-12 animate-spin text-blue-600 mb-4' />
          <p className='text-lg text-gray-600'>Carregando dashboard...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className='flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-50'>
        <Card className='max-w-md mx-auto text-center'>
          <CardContent className='p-8'>
            <div className='text-red-500 text-6xl mb-4'>⚠️</div>
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>
              Erro ao carregar
            </h2>
            <p className='text-gray-600 mb-4'>{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header do Dashboard */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent'>
            Dashboard Olinsesp VIII
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Acompanhe em tempo real as estatísticas e informações do maior
            evento esportivo de integração das forças de segurança
          </p>
        </div>

        {/* Indicadores Principais */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <Card className='bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-3 text-white'>
                <Users className='h-6 w-6' />
                Total de Inscritos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-4xl font-bold'>
                {inscritosFiltrados.length}
              </div>
              <p className='text-blue-100 text-sm mt-2'>
                {inscritosFiltrados.length > 0
                  ? 'Atletas confirmados'
                  : 'Aguardando inscrições'}
              </p>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-3 text-white'>
                <Trophy className='h-6 w-6' />
                Modalidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-4xl font-bold'>
                {modalidadesCount.length}
              </div>
              <p className='text-orange-100 text-sm mt-2'>
                Categorias disponíveis
              </p>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-3 text-white'>
                <Building2 className='h-6 w-6' />
                Afiliações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-4xl font-bold'>{afiliacoesCount.length}</div>
              <p className='text-green-100 text-sm mt-2'>
                Forças representadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Controles */}
        <Card className='mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-gray-800'>
              <Filter className='h-5 w-5 text-blue-600' />
              Filtros e Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col lg:flex-row items-start lg:items-end gap-4 w-full'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                  Filtrar por Afiliação
                </label>
                <Select
                  value={afiliacao ?? 'todos'}
                  onValueChange={(val) =>
                    setAfiliacao(val === 'todos' ? null : val)
                  }
                >
                  <SelectTrigger className='w-full lg:w-48 border-2 border-gray-200 bg-white hover:border-blue-300 transition-colors'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='todos'>Todas as Afiliações</SelectItem>
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
                <label className='text-sm font-medium text-gray-700'>
                  Filtrar por Modalidade
                </label>
                <Select
                  value={modalidade ?? 'todos'}
                  onValueChange={(val) =>
                    setModalidade(val === 'todos' ? null : val)
                  }
                >
                  <SelectTrigger className='w-full lg:w-48 border-2 border-gray-200 bg-white hover:border-blue-300 transition-colors'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='todos'>Todas as Modalidades</SelectItem>
                    {[...new Set(inscritos.flatMap((i) => i.modalidades))].map(
                      (m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2'
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
                <Download className='h-4 w-4' />
                Gerar Relatório PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          <Card className='border-0 shadow-lg bg-white/80 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='text-gray-800 flex items-center gap-2'>
                <BarChart className='h-5 w-5 text-blue-600' />
                Inscritos por Afiliação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={afiliacoesCount}>
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey='quantidade' radius={[8, 8, 0, 0]}>
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

          <Card className='border-0 shadow-lg bg-white/80 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='text-gray-800 flex items-center gap-2'>
                <PieChart className='h-5 w-5 text-orange-600' />
                Inscritos por Modalidade
              </CardTitle>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Inscritos */}
        <Card className='border-0 shadow-lg bg-white/80 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='text-gray-800 flex items-center gap-2'>
              <FileText className='h-5 w-5 text-green-600' />
              Lista de Inscritos
              <span className='text-sm font-normal text-gray-500 ml-2'>
                ({inscritosFiltrados.length} registros)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className='overflow-x-auto'>
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
    </div>
  );
}
