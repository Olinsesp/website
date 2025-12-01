import { NextResponse } from 'next/server';
import { inscricoes } from '../../inscriçoesData';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ modalidadeName: string }> },
) {
  try {
    const { modalidadeName } = await params;

    const filteredInscricoes = inscricoes.filter((inscricao) =>
      inscricao.modalidades.includes(modalidadeName),
    );

    if (filteredInscricoes.length === 0) {
      return NextResponse.json(
        {
          message: `Nenhuma inscrição encontrada para a modalidade: ${modalidadeName}.`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(filteredInscricoes);
  } catch (error) {
    console.error('Erro ao buscar inscrições por modalidade:', error);
    return NextResponse.json(
      {
        error:
          'Ocorreu um erro no servidor ao buscar inscrições por modalidade.',
      },
      { status: 500 },
    );
  }
}
