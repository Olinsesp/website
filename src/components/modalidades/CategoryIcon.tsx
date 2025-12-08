import Image from 'next/image';
import React from 'react';

interface Props {
  categoria: string;
}

export default function CategoryIcon({ categoria }: Props) {
  const iconMap: Record<string, string> = {
    Atletismo: '/icons/Icones das modalidades_01 - Atletismo.jpg',
    'Corrida de Orientação':
      '/icons/Icones das modalidades_02 - Corrida de Orientação.jpg',
    Triathlon: '/icons/Icones das modalidades_03 - Triathlon.jpg',
    Calistenia: '/icons/Icones das modalidades_04 - Calistenia.jpg',
    Natação: '/icons/Icones das modalidades_05 - Natação.jpg',
    'Futebol de Campo':
      '/icons/Icones das modalidades_06 -Futebol de Campo.jpg',
    'Futebol de Salão': '/icons/Icones das modalidades_09 - Futsal.jpg',
    Futsal: '/icons/Icones das modalidades_09 - Futsal.jpg',
    Basquetebol: '/icons/Icones das modalidades_07 - Basquetebol.jpg',
    'Vôlei de Quadra': '/icons/Icones das modalidades_08 - Vôlei de Quadra.jpg',
    'Vôlei de Praia': '/icons/Icones das modalidades_10 - Vôlei de Praia.jpg',
    Futevôlei: '/icons/Icones das modalidades_12 - Futevôlei.jpg',
    'Beach Tênis': '/icons/Icones das modalidades_11 - Beach Tênis .jpg',
    'Tênis de Mesa': '/icons/Icones das modalidades_15 - Tênis de Mesa.jpg',
    Judô: '/icons/Icones das modalidades_13 - Judô.jpg',
    'Jiu-Jitsu': '/icons/Icones das modalidades_14 - Jiu-Jitsu.jpg',
    Xadrez: '/icons/Icones das modalidades_16 - Xadrez.jpg',
    Dominó: '/icons/Icones das modalidades_17 - Dominó.jpg',
    Truco: '/icons/Icones das modalidades_18 - Truco.jpg',
    'Cabo de Guerra': '/icons/Icones das modalidades_19 - Cabo de Guerr-a.jpg',
  };

  const defaultIcon = '/icons/default.svg';

  const imageSrc = iconMap[categoria] ?? defaultIcon;
  return (
    <Image
      src={imageSrc}
      width={'80'}
      height={'80'}
      alt={categoria}
      className='w-auto h-auto object-contain rounded-2xl'
    />
  );
}
