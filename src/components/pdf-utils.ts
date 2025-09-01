import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type PdfRow = {
  nome: string;
  afiliacao: string;
  modalidades: string[];
  email: string;
};

export function generatePDF(data: PdfRow[]) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Relatório de Inscritos', 14, 20);

  const tableData = data.map((row) => [
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

  doc.save('relatorio.pdf');
}
