import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const midiaSchema = z.object({
  tipo: z.enum(['foto', 'video', 'release']),
  url: z.string().min(1, 'A URL é obrigatória.'),
  titulo: z.string().optional(),
  destaque: z.boolean().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const incluirEstatisticas = searchParams.get('estatisticas') !== 'false';
    const separarPorTipo = searchParams.get('separar') === 'true';

    const where: any = {};
    if (tipo && ['foto', 'video', 'release'].includes(tipo)) {
      where.tipo = tipo;
    }

    const midias = await prisma.midia.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const midiasFormatadas = midias.map((m) => ({
      id: m.id,
      tipo: m.tipo,
      url: m.url,
      titulo: m.titulo,
      destaque: m.destaque,
      createdAt: m.createdAt.toISOString(),
    }));

    const response: any = {};

    if (separarPorTipo) {
      response.fotos = midiasFormatadas.filter((m) => m.tipo === 'foto');
      response.videos = midiasFormatadas.filter((m) => m.tipo === 'video');
      response.releases = midiasFormatadas.filter((m) => m.tipo === 'release');
    } else {
      response.dados = midiasFormatadas;
    }

    if (incluirEstatisticas) {
      const todasMidias = await prisma.midia.findMany();
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

    const novaMidia = await prisma.midia.create({
      data: {
        tipo: validatedData.tipo,
        url: validatedData.url,
        titulo: validatedData.titulo || null,
        destaque: validatedData.destaque || false,
      },
    });

    return NextResponse.json(
      {
        id: novaMidia.id,
        tipo: novaMidia.tipo,
        url: novaMidia.url,
        titulo: novaMidia.titulo,
        destaque: novaMidia.destaque,
        createdAt: novaMidia.createdAt.toISOString(),
      },
      { status: 201 },
    );
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
