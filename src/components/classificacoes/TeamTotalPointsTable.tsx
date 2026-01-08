import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ShieldCheck } from 'lucide-react';
import React from 'react';

type Props = {
  pointsPerTeam: { equipe: string; pontuacao: number }[];
};

export default function TeamTotalPointsTable({ pointsPerTeam }: Props) {
  return (
    <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 mb-8 sm:mb-12'>
      <CardHeader className='text-center'>
        <div className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 bg-verde-olinsesp rounded-2xl flex items-center justify-center'>
          <ShieldCheck className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white' />
        </div>
        <CardTitle className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800'>
          Pontuação Geral por Equipe
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4 sm:p-6 lg:p-8'>
        {pointsPerTeam.length > 0 ? (
          <div className='overflow-x-auto'>
            <Table className='rounded-md overflow-hidden'>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-left text-azul-olinsesp'>
                    Equipe
                  </TableHead>
                  <TableHead className='text-right text-azul-olinsesp'>
                    Pontuação
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pointsPerTeam.map((team, index) => (
                  <TableRow key={team.equipe} className='hover:bg-gray-50'>
                    <TableCell className='font-medium text-lg'>
                      {index + 1}. {team.equipe}
                    </TableCell>
                    <TableCell className='text-right text-lg font-bold text-verde-olinsesp'>
                      {team.pontuacao}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className='text-center text-gray-500'>
            Nenhuma pontuação de equipe encontrada.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
