import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type PdfRow = {
  nome: string;
  afiliacao: string;
  modalidades: string[];
  email: string;
};

type ClassificacaoRow = {
  posicao: number;
  atleta?: string;
  modalidade: string;
  categoria: string;
  afiliacao: string;
  pontuacao: number;
  tempo?: string;
  distancia?: string;
};

export function generatePDF(
  data: PdfRow[] | ClassificacaoRow[],
  type:
    | 'inscritos'
    | 'classificacoes-atletas'
    | 'classificacoes-equipes' = 'inscritos',
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
      row.atleta || row.afiliacao,
      row.modalidade,
      row.categoria,
      row.afiliacao,
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
          'Afiliação',
          'Pontos',
          'Tempo',
          'Distância',
        ],
      ],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
  } else {
    doc.setFontSize(18);
    doc.text('Relatório de Inscritos', 14, 20);

    const tableData = (data as PdfRow[]).map((row) => [
      row.nome,
      row.afiliacao,
      row.modalidades.join(', '),
      row.email,
    ]);

    autoTable(doc, {
      head: [['Nome', 'Afiliação', 'Modalidades', 'Email']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 12 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
  }

  doc.save(`relatorio-${type}.pdf`);
}
