import { NextResponse } from 'next/server';
import { z } from 'zod';
import { staticMidias } from './midiasData';

const midiaSchema = z.object({
  tipo: z.enum(['foto', 'video', 'release']),
  url: z.string().min(1, 'A URL é obrigatória.'),
  titulo: z.string().min(1, 'O título é obrigatório.'),
  destaque: z.boolean(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const incluirEstatisticas = searchParams.get('estatisticas') !== 'false';
    const separarPorTipo = searchParams.get('separar') === 'true';

    let midias = staticMidias.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    if (tipo && ['foto', 'video', 'release'].includes(tipo)) {
      midias = midias.filter((m) => m.tipo === tipo);
    }

    const response: any = {};

    if (separarPorTipo) {
      response.fotos = midias.filter((m) => m.tipo === 'foto');
      response.videos = midias.filter((m) => m.tipo === 'video');
      response.releases = midias.filter((m) => m.tipo === 'release');
    } else {
      response.dados = midias;
    }

    if (incluirEstatisticas) {
      const todasMidias = staticMidias;
      response.estatisticas = {
        totalFotos: todasMidias.filter((m) => m.tipo === 'foto').length,
        totalVideos: todasMidias.filter((m) => m.tipo === 'video').length,
        totalReleases: todasMidias.filter((m) => m.tipo === 'release').length,
        total: todasMidias.length,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao buscar mídias:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar as mídias.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = midiaSchema.parse(body);

    const novaMidia = {
      id: (staticMidias.length + 1).toString(),
      ...validatedData,
      createdAt: new Date().toISOString(),
    };

    staticMidias.push(novaMidia);

    return NextResponse.json(novaMidia, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Erro ao criar mídia:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao criar a mídia.' },
      { status: 500 },
    );
  }
}
