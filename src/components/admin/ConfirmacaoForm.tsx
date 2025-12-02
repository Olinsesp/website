'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import QueryStateHandler from '@/components/ui/query-state-handler';
import { generatePDF } from '@/lib/pdf-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Calendar,
  CheckCircle,
  Search,
  Users,
  Download,
  X,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type Evento = {
  id: string;
  atividade: string;
  inicio: string;
  fim: string;
  detalhes?: string | null;
  modalidade?: string;
};

type Inscricao = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  camiseta: string;
  lotacao: string;
  matricula: string;
  modalidades: string[];
};

async function fetchEventos(): Promise<Evento[]> {
  const res = await fetch('/api/cronograma');
  if (!res.ok) throw new Error('Falha ao buscar cronograma');
  return res.json();
}

async function fetchInscricoes(): Promise<Inscricao[]> {
  const res = await fetch('/api/inscricoes');
  if (!res.ok) throw new Error('Falha ao buscar inscrições');
  return res.json();
}

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('pt-BR');
    const time = d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${date} ${time}`;
  } catch {
    return iso;
  }
}

function matchesModalidade(eventMod?: string, inscricaoMods: string[] = []) {
  if (!eventMod) return false;
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  const ev = norm(eventMod);
  return inscricaoMods.some((m) => {
    const im = norm(m);
    return ev.includes(im) || im.includes(ev);
  });
}

export default function ConfirmacaoForm() {
  const [eventoSelecionadoId, setEventoSelecionadoId] = useState<string>('');
  const [busca, setBusca] = useState('');
  const [confirmadosPorEvento, setConfirmadosPorEvento] = useState<
    Record<string, Set<string>>
  >({});
  const [ausentesPorEvento, setAusentesPorEvento] = useState<
    Record<string, Set<string>>
  >({});

  const {
    data: eventos = [],
    isLoading: isLoadingEventos,
    isError: isErrorEventos,
    error: errorEventos,
  } = useQuery<Evento[], Error>({
    queryKey: ['cronograma'],
    queryFn: fetchEventos,
  });

  const {
    data: inscricoes = [],
    isLoading: isLoadingInscricoes,
    isError: isErrorInscricoes,
    error: errorInscricoes,
  } = useQuery<Inscricao[], Error>({
    queryKey: ['inscricoes'],
    queryFn: fetchInscricoes,
  });

  useEffect(() => {
    if (eventos.length > 0 && !eventoSelecionadoId) {
      setEventoSelecionadoId(eventos[0].id);
    }
  }, [eventos, eventoSelecionadoId]);

  const eventoSelecionado = useMemo(
    () => eventos.find((e) => e.id === eventoSelecionadoId),
    [eventos, eventoSelecionadoId],
  );

  const elegiveis = useMemo(() => {
    if (!eventoSelecionado) return [] as Inscricao[];
    const list = inscricoes.filter((i) =>
      matchesModalidade(eventoSelecionado.modalidade, i.modalidades),
    );
    if (!busca) return list;
    const q = busca.toLowerCase();
    return list.filter(
      (i) =>
        i.nome.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.cpf.includes(q) ||
        i.lotacao.toLowerCase().includes(q),
    );
  }, [eventoSelecionado, inscricoes, busca]);

  const confirmadosSet =
    confirmadosPorEvento[eventoSelecionadoId] ?? new Set<string>();
  const ausentesSet =
    ausentesPorEvento[eventoSelecionadoId] ?? new Set<string>();

  const toggleConfirmado = (cpf: string) => {
    setConfirmadosPorEvento((prev) => {
      const set = new Set(prev[eventoSelecionadoId] ?? new Set<string>());
      if (set.has(cpf)) set.delete(cpf);
      else set.add(cpf);
      return { ...prev, [eventoSelecionadoId]: set };
    });
    setAusentesPorEvento((prev) => {
      const set = new Set(prev[eventoSelecionadoId] ?? new Set<string>());
      set.delete(cpf);
      return { ...prev, [eventoSelecionadoId]: set };
    });
  };

  const toggleAusente = (cpf: string) => {
    setAusentesPorEvento((prev) => {
      const set = new Set(prev[eventoSelecionadoId] ?? new Set<string>());
      if (set.has(cpf)) set.delete(cpf);
      else set.add(cpf);
      return { ...prev, [eventoSelecionadoId]: set };
    });
    setConfirmadosPorEvento((prev) => {
      const set = new Set(prev[eventoSelecionadoId] ?? new Set<string>());
      set.delete(cpf);
      return { ...prev, [eventoSelecionadoId]: set };
    });
  };

  const selecionarTodos = () => {
    setConfirmadosPorEvento((prev) => {
      const set = new Set<string>(elegiveis.map((i) => i.cpf));
      return { ...prev, [eventoSelecionadoId]: set };
    });
  };

  const limparSelecao = () => {
    setConfirmadosPorEvento((prev) => ({
      ...prev,
      [eventoSelecionadoId]: new Set<string>(),
    }));
    setAusentesPorEvento((prev) => ({
      ...prev,
      [eventoSelecionadoId]: new Set<string>(),
    }));
  };

  const gerarRelatorioPDF = (tipo: 'presentes' | 'ausentes' | 'todos') => {
    if (!eventoSelecionado) return;

    let dadosParaPDF = [];

    if (tipo === 'presentes') {
      dadosParaPDF = elegiveis.filter((i) => confirmadosSet.has(i.cpf));
    } else if (tipo === 'ausentes') {
      dadosParaPDF = elegiveis.filter((i) => ausentesSet.has(i.cpf));
    } else {
      dadosParaPDF = elegiveis;
    }

    const dadosFormatados = dadosParaPDF.map((i) => ({
      nome: i.nome,
      lotacao: i.lotacao,
      email: i.email,
      status: confirmadosSet.has(i.cpf)
        ? 'Presente'
        : ausentesSet.has(i.cpf)
          ? 'Ausente'
          : 'Não confirmado',
    }));

    const tituloEvento = `${eventoSelecionado.modalidade ? `${eventoSelecionado.modalidade} - ` : ''}${eventoSelecionado.atividade}`;
    const linhasEvento = [
      tituloEvento,
      `Início: ${formatDateTime(eventoSelecionado.inicio)}`,
      `Fim: ${formatDateTime(eventoSelecionado.fim)}`,
      ...(eventoSelecionado.detalhes
        ? [`Local: ${eventoSelecionado.detalhes}`]
        : []),
    ];

    generatePDF(dadosFormatados, 'confirmacao', {
      title: 'Confirmação de Participação',
      eventInfoLines: linhasEvento,
      filenameSuffix: `${eventoSelecionado.id}-${tipo}`,
    });
  };

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <QueryStateHandler
        isLoading={isLoadingEventos || isLoadingInscricoes}
        isError={isErrorEventos || isErrorInscricoes}
        error={errorEventos || errorInscricoes}
        loadingMessage='Carregando dados...'
      >
        <div className='grid gap-4 md:grid-cols-3'>
          <Card className='md:col-span-1'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                Selecionar Jogo/Evento
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Select
                value={eventoSelecionadoId}
                onValueChange={setEventoSelecionadoId}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Escolha um evento' />
                </SelectTrigger>
                <SelectContent>
                  {eventos.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.modalidade ? `${e.modalidade} - ` : ''}
                      {e.atividade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {eventoSelecionado && (
                <div className='text-sm text-muted-foreground space-y-1'>
                  <div>
                    <strong>Início:</strong>{' '}
                    {formatDateTime(eventoSelecionado.inicio)}
                  </div>
                  <div>
                    <strong>Fim:</strong>{' '}
                    {formatDateTime(eventoSelecionado.fim)}
                  </div>
                  {eventoSelecionado.detalhes && (
                    <div>
                      <strong>Local:</strong> {eventoSelecionado.detalhes}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                Confirmar Participação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col md:flex-row gap-2 md:items-center mb-4'>
                <div className='relative w-full md:max-w-sm'>
                  <Input
                    placeholder='Buscar por nome, CPF, email ou Lotação'
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className='pl-9'
                  />
                  <Search className='absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                </div>
                <div className='flex gap-2 ml-auto'>
                  <Button variant='secondary' onClick={selecionarTodos}>
                    Selecionar todos
                  </Button>
                  <Button variant='ghost' onClick={limparSelecao}>
                    Limpar
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => gerarRelatorioPDF('presentes')}
                  >
                    <Download className='h-4 w-4 mr-2' />
                    PDF Presentes
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => gerarRelatorioPDF('ausentes')}
                  >
                    <Download className='h-4 w-4 mr-2' />
                    PDF Ausentes
                  </Button>
                  <Button onClick={() => gerarRelatorioPDF('todos')}>
                    <Download className='h-4 w-4 mr-2' />
                    PDF Todos
                  </Button>
                </div>
              </div>

              <div className='text-sm text-muted-foreground mb-2'>
                {confirmadosSet.size} presentes, {ausentesSet.size} ausentes de{' '}
                {elegiveis.length} elegíveis
              </div>

              <ScrollArea className='h-[420px] rounded border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Modalidades</TableHead>
                      <TableHead>Confirmado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {elegiveis.length > 0 ? (
                      elegiveis.map((i) => (
                        <TableRow key={i.cpf}>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              <label className='flex items-center gap-2 cursor-pointer'>
                                <Checkbox
                                  checked={confirmadosSet.has(i.cpf)}
                                  onCheckedChange={() =>
                                    toggleConfirmado(i.cpf)
                                  }
                                />
                                <span className='text-sm text-verde-olinsesp'>
                                  P
                                </span>
                              </label>
                              <label className='flex items-center gap-2 cursor-pointer'>
                                <Checkbox
                                  checked={ausentesSet.has(i.cpf)}
                                  onCheckedChange={() => toggleAusente(i.cpf)}
                                />
                                <span className='text-sm text-vermelho-olinsesp'>
                                  A
                                </span>
                              </label>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='font-medium'>{i.nome}</div>
                            <div className='text-xs text-muted-foreground'>
                              CPF {i.cpf}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='text-xs text-muted-foreground'>
                              {i.email}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {i.lotacao}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='text-xs text-muted-foreground'>
                              {i.modalidades.join(', ')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              {confirmadosSet.has(i.cpf) && (
                                <CheckCircle className='h-4 w-4 text-verde-olinsesp' />
                              )}
                              {ausentesSet.has(i.cpf) && (
                                <X className='h-4 w-4 text-vermelho-olinsesp' />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className='h-24 text-center'>
                          Nenhum inscrito elegível para este evento.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </QueryStateHandler>
    </div>
  );
}
