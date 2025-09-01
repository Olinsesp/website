import { NextResponse } from 'next/server';

const staticServicos = [
  {
    id: '1',
    nome: 'Posto Médico',
    descricao: 'Atendimento de primeiros socorros e emergências médicas.',
    localizacao: 'Ao lado do Ginásio Principal',
    horario: '08:00 - 20:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Praça de Alimentação',
    descricao:
      'Diversas opções de lanches, refeições e bebidas para atletas e público.',
    localizacao: 'Área central do complexo',
    horario: '09:00 - 21:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    nome: 'Achados e Perdidos',
    descricao: 'Central para itens encontrados ou perdidos durante o evento.',
    localizacao: 'Balcão de Informações',
    horario: '08:00 - 19:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    nome: 'Balcão de Informações',
    descricao: 'Tire suas dúvidas sobre horários, locais e programação geral.',
    localizacao: 'Entrada principal',
    horario: '08:00 - 19:00',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json(staticServicos);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar os serviços.' },
      { status: 500 },
    );
  }
}
