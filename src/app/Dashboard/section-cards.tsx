'use client';

import { Building2, Trophy, Users } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SectionCardsProps {
  inscritosCount?: number;
  modalidadesCount?: number;
  lotacoesCount?: number;
}

export function SectionCards({
  inscritosCount = 0,
  modalidadesCount = 0,
  lotacoesCount = 0,
}: SectionCardsProps) {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total de Inscritos
          </CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{inscritosCount}</div>
          <CardDescription className='text-xs text-muted-foreground'>
            {inscritosCount > 0
              ? 'Atletas confirmados'
              : 'Aguardando inscrições'}
          </CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Modalidades</CardTitle>
          <Trophy className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{modalidadesCount}</div>
          <CardDescription className='text-xs text-muted-foreground'>
            Quantidade de modalidades com inscrições
          </CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Lotações</CardTitle>
          <Building2 className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{lotacoesCount}</div>
          <CardDescription className='text-xs text-muted-foreground'>
            Forças representadas
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
