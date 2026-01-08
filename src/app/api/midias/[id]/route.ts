import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

const midiaUpdateSchema = z.object({
  tipo: z.enum(['foto', 'video', 'release']).optional(),
  url: z.string().min(1, 'A URL é obrigatória.').optional(),
  titulo: z.string().optional(),
  destaque: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const midia = await prisma.midia.findUnique({
      where: { id },
    });

    if (!midia) {
      return NextResponse.json(
        { error: 'Mídia não encontrada.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: midia.id,
      tipo: midia.tipo,
      url: midia.url,
      titulo: midia.titulo,
      destaque: midia.destaque,
      createdAt: midia.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Erro ao buscar mídia:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao buscar a mídia.' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const validatedData = midiaUpdateSchema.parse(data);

    const midiaAtualizada = await prisma.midia.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({
      id: midiaAtualizada.id,
      tipo: midiaAtualizada.tipo,
      url: midiaAtualizada.url,
      titulo: midiaAtualizada.titulo,
      destaque: midiaAtualizada.destaque,
      createdAt: midiaAtualizada.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos.',
          details: error.issues,
        },
        { status: 400 },
      );
    }

    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Mídia não encontrada.' },
        { status: 404 },
      );
    }

    console.error('Erro ao atualizar mídia:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao atualizar a mídia.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const midiaToDelete = await prisma.midia.findUnique({
      where: { id },
      select: { url: true },
    });

    if (!midiaToDelete) {
      return NextResponse.json(
        { error: 'Mídia não encontrada.' },
        { status: 404 },
      );
    }

    const publicMidiasPathSegment = '/public/midias/';
    const indexOfPublicMidias = midiaToDelete.url.indexOf(
      publicMidiasPathSegment,
    );

    if (indexOfPublicMidias !== -1) {
      const filePath = midiaToDelete.url.substring(
        indexOfPublicMidias + publicMidiasPathSegment.length,
      );
      if (filePath) {
        const { error: deleteError } = await supabase.storage
          .from('midias')
          .remove([filePath]);

        if (deleteError) {
          console.error('Erro ao deletar arquivo do Supabase:', deleteError);
        }
      } else {
        console.warn(
          'Could not extract filePath from URL for Supabase deletion:',
          midiaToDelete.url,
        );
      }
    } else {
      console.warn(
        'Media URL does not seem to be a Supabase public media URL:',
        midiaToDelete.url,
      );
    }

    await prisma.midia.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Mídia não encontrada.' },
        { status: 404 },
      );
    }

    console.error('Erro ao deletar mídia:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro no servidor ao deletar a mídia.' },
      { status: 500 },
    );
  }
}
