import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

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
    const formData = await req.formData();
    const tipo = formData.get('tipo') as 'foto' | 'video' | 'release';
    const titulo = formData.get('titulo') as string | null;
    const destaque = formData.get('destaque') === 'true';
    const file = formData.get('file') as File | null;
    const url = formData.get('url') as string | null;

    let finalUrl: string;

    if (file) {
      if (tipo === 'foto' && !file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Tipo de arquivo inválido para foto. Esperado imagem.' },
          { status: 400 },
        );
      }

      if (tipo === 'video' && !file.type.startsWith('video/')) {
        return NextResponse.json(
          { error: 'Tipo de arquivo inválido para vídeo. Esperado vídeo.' },
          { status: 400 },
        );
      }

      if (tipo === 'release' && file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'Tipo de arquivo inválido para release. Esperado PDF.' },
          { status: 400 },
        );
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('midias')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(
          `Erro no upload para o Supabase: ${uploadError.message}`,
        );
      }

      const { data } = supabase.storage.from('midias').getPublicUrl(fileName);

      finalUrl = data.publicUrl;
    } else if (url) {
      finalUrl = url;
    } else {
      return NextResponse.json(
        { error: 'URL ou arquivo é obrigatório.' },
        { status: 400 },
      );
    }

    const validatedData = midiaSchema.parse({
      tipo,
      titulo,
      destaque,
      url: finalUrl,
    });

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
