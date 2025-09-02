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
import { Loader2 } from 'lucide-react';

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
    OUTROS: '#9467bd',
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
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='inline-block h-6 w-6 animate-spin' />
      </div>
    );
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className='p-6 grid gap-6'>
      {/* Indicadores */}
      <div className='grid grid-cols-3 gap-4'>
        <Card className='border-2 border-zinc-400'>
          <CardHeader>
            <CardTitle>Total Inscritos</CardTitle>
          </CardHeader>
          <CardContent className='text-3xl font-bold text-blue-500'>
            {inscritosFiltrados.length}
          </CardContent>
        </Card>
        <Card className='border-2 border-zinc-400'>
          <CardHeader>
            <CardTitle>Modalidades</CardTitle>
          </CardHeader>
          <CardContent className='text-3xl font-bold text-blue-500'>
            {modalidadesCount.length}
          </CardContent>
        </Card>
        <Card className='border-2 border-zinc-400'>
          <CardHeader>
            <CardTitle>Afiliações</CardTitle>
          </CardHeader>
          <CardContent className='text-3xl font-bold text-blue-500'>
            {afiliacoesCount.length}
          </CardContent>
        </Card>
      </div>

      {/* Filtros e PDF */}
      <div className='flex gap-4'>
        <div className='flex gap-4'>
          <Select
            value={afiliacao ?? 'todos'}
            onValueChange={(val) => setAfiliacao(val === 'todos' ? null : val)}
          >
            <SelectTrigger className='w-[180px] border border-zinc-400'>
              <SelectValue placeholder='Filtrar Afiliação' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='todos'>Todos</SelectItem>
              {[...new Set(inscritos.map((i) => i.afiliacao))].map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={modalidade ?? 'todos'}
            onValueChange={(val) => setModalidade(val === 'todos' ? null : val)}
          >
            <SelectTrigger className='w-[180px] border border-zinc-400'>
              <SelectValue placeholder='Filtrar Modalidade' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='todos'>Todos</SelectItem>
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
          Gerar Relatório PDF
        </Button>
      </div>

      {/* Gráfico por afiliação */}
      <div className='grid grid-cols-2 gap-4'>
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
                <Bar dataKey='quantidade' radius={[8, 8, 0, 0]}>
                  {afiliacoesCount.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        afiliacaoColors[entry.name] || afiliacaoColors['OUTROS']
                      }
                    />
                  ))}
                  <LabelList dataKey='quantidade' position='top' />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico por modalidade */}
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
                  outerRadius={120}
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

      {/* DataTable de inscritos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Inscritos</CardTitle>
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
