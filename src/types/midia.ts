import { StaticImageData } from 'next/image';

export interface Midia {
  id: string;
  tipo: 'foto' | 'video' | 'release';
  url: string;
  titulo?: string | null;
  destaque: boolean;
  createdAt: string;
}

export interface MidiasResponse {
  dados?: Midia[];
  fotos?: Midia[];
  videos?: Midia[];
  releases?: Midia[];
  estatisticas?: {
    totalFotos: number;
    totalVideos: number;
    totalReleases: number;
    total: number;
  };
}

export type Foto = Omit<Midia, 'url'> & {
  tipo: 'foto';
  url: string | StaticImageData;
};

export type Video = Midia & {
  tipo: 'video';
};

export type Release = Midia & {
  tipo: 'release';
};
