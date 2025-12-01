import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type PdfRow = {
  nome: string;
  lotacao: string;
  modalidades: string[];
  email: string;
};

type ClassificacaoRow = {
  posicao: number;
  atleta?: string;
  modalidade: string;
  categoria: string;
  lotacao: string;
  pontuacao: number;
  tempo?: string;
  distancia?: string;
};

export function generatePDF(
  data: PdfRow[] | ClassificacaoRow[] | any[],
  type:
    | 'inscritos'
    | 'classificacoes-atletas'
    | 'classificacoes-equipes'
    | 'confirmacao' = 'inscritos',
  options?: {
    title?: string;
    subtitle?: string;
    eventInfoLines?: string[];
    filenameSuffix?: string;
  },
) {
  const doc = new jsPDF();

  if (type.startsWith('classificacoes')) {
    const isEquipe = type === 'classificacoes-equipes';
    doc.setFontSize(18);
    doc.text(
      `Relatório de Classificações - ${isEquipe ? 'Equipes' : 'Atletas'}`,
      14,
      20,
    );

    const tableData = (data as ClassificacaoRow[]).map((row) => [
      row.posicao.toString(),
      row.atleta || row.lotacao,
      row.modalidade,
      row.categoria,
      row.lotacao,
      row.pontuacao.toString(),
      row.tempo || '-',
      row.distancia || '-',
    ]);

    autoTable(doc, {
      head: [
        [
          'Pos',
          isEquipe ? 'Equipe' : 'Atleta',
          'Modalidade',
          'Categoria',
          'Lotação',
          'Pontos',
          'Tempo',
        ],
      ],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
  } else if (type === 'confirmacao') {
    const title = options?.title ?? 'Relatório de Confirmação';
    doc.setFontSize(18);
    doc.text(title, 14, 20);

    let y = 28;
    if (options?.eventInfoLines && options.eventInfoLines.length > 0) {
      doc.setFontSize(12);
      options.eventInfoLines.forEach((line) => {
        doc.text(line, 14, y);
        y += 6;
      });
    }

    const sorted = [...(data as any[])].sort((a, b) =>
      (a.nome || '').localeCompare(b.nome || '', 'pt-BR', {
        sensitivity: 'base',
      }),
    );

    const tableData = sorted.map((row) => [
      row.nome,
      row.lotacao,
      row.status ?? '-',
      row.email,
    ]);

    autoTable(doc, {
      head: [['Nome', 'Lotação', 'Status', 'Email']],
      body: tableData,
      startY: Math.max(y, 30),
      styles: { fontSize: 12 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
  } else {
    doc.setFontSize(18);
    doc.text('Relatório de Inscritos', 14, 20);

    const sorted = [...(data as PdfRow[])].sort((a, b) =>
      (a.nome || '').localeCompare(b.nome || '', 'pt-BR', {
        sensitivity: 'base',
      }),
    );

    const tableData = sorted.map((row) => [
      row.nome,
      row.lotacao,
      row.modalidades.join(', '),
      row.email,
    ]);

    autoTable(doc, {
      head: [['Nome', 'Lotação', 'Modalidades', 'Email']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 12 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
  }

  const suffix = options?.filenameSuffix ? `-${options.filenameSuffix}` : '';
  doc.save(`relatorio-${type}${suffix}.pdf`);
}
