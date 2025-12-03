import React from 'react';
import {
  Dumbbell,
  Activity,
  Bike,
  Waves,
  Volleyball,
  Swords,
  Target,
  Puzzle,
  ChessKing,
  Spade,
  Footprints,
  BicepsFlexed,
} from 'lucide-react';
import SportsBasketballOutlinedIcon from '@mui/icons-material/SportsBasketballOutlined';
import SportsSoccerOutlinedIcon from '@mui/icons-material/SportsSoccerOutlined';
import SportsTennisOutlinedIcon from '@mui/icons-material/SportsTennisOutlined';
interface Props {
  categoria: string;
}

export default function CategoryIcon({ categoria }: Props) {
  const icons: Record<string, React.ReactNode> = {
    Atletismo: <Footprints size={32} className='text-white' />,
    'Corrida de Orientação': <Target size={32} className='text-white' />,
    Triathlon: <Bike size={32} className='text-white' />,
    Calistenia: <Dumbbell size={32} className='text-white' />,
    Natação: <Waves size={32} className='text-white' />,
    'Futebol de Campo': (
      <SportsSoccerOutlinedIcon fontSize='large' className='text-white' />
    ),
    'Futebol de Salão': (
      <SportsSoccerOutlinedIcon fontSize='large' className='text-white' />
    ),
    Basquetebol: (
      <SportsBasketballOutlinedIcon fontSize='large' className='text-white' />
    ),
    'Vôlei de Quadra': <Volleyball size={32} className='text-white' />,
    Futsal: (
      <SportsSoccerOutlinedIcon fontSize='large' className='text-white' />
    ),
    'Vôlei de Praia': <Volleyball size={32} className='text-white' />,
    'Beach Tênis': (
      <SportsTennisOutlinedIcon fontSize='large' className='text-white' />
    ),
    Futevôlei: <Volleyball size={32} className='text-white' />,
    Judô: <Swords size={32} className='text-white' />,
    'Jiu-Jitsu': <Swords size={32} className='text-white' />,
    'Tênis de Mesa': (
      <SportsTennisOutlinedIcon fontSize='large' className='text-white' />
    ),
    Xadrez: <ChessKing size={32} className='text-white' />,
    Dominó: <Puzzle size={32} className='text-white' />,
    Truco: <Spade size={32} className='text-white' />,
    'Cabo de Guerra': <BicepsFlexed size={32} className='text-white' />,
  };

  return icons[categoria] ?? <Activity size={32} className='text-white' />;
}
