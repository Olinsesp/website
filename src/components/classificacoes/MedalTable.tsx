'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Medal, Award, Crown } from 'lucide-react';
import React from 'react';
import { MedalRow } from '@/types/classificacao';

type Props = {
  rows: MedalRow[];
};

export default function MedalTable({ rows }: Props) {
  return (
    <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6 sm:mb-8'>
      <CardHeader className='pb-3 sm:pb-4 px-4 sm:px-6'>
        <div className='flex items-center gap-2'>
          <Medal className='h-4 w-4 sm:h-5 sm:w-5 text-yellow-600' />
          <CardTitle className='text-lg sm:text-xl text-gray-800'>
            Quadro de Medalhas por Afiliação
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='p-4 sm:p-6'>
        {rows.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-12 text-center'>#</TableHead>
                <TableHead>Afiliação</TableHead>
                <TableHead className='text-center'>
                  <span className='inline-flex items-center gap-1 text-yellow-700'>
                    <Crown className='h-4 w-4 text-yellow-500' /> Ouro
                  </span>
                </TableHead>
                <TableHead className='text-center'>
                  <span className='inline-flex items-center gap-1 text-gray-600'>
                    <Medal className='h-4 w-4 text-gray-400' /> Prata
                  </span>
                </TableHead>
                <TableHead className='text-center'>
                  <span className='inline-flex items-center gap-1 text-orange-700'>
                    <Award className='h-4 w-4 text-orange-500' /> Bronze
                  </span>
                </TableHead>
                <TableHead className='text-center'>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={row.afiliacao}>
                  <TableCell className='text-center font-semibold text-gray-700'>
                    {idx + 1}
                  </TableCell>
                  <TableCell className='font-medium text-gray-800'>
                    {row.afiliacao}
                  </TableCell>
                  <TableCell className='text-center text-yellow-700'>
                    {row.ouro}
                  </TableCell>
                  <TableCell className='text-center text-gray-700'>
                    {row.prata}
                  </TableCell>
                  <TableCell className='text-center text-orange-700'>
                    {row.bronze}
                  </TableCell>
                  <TableCell className='text-center font-semibold'>
                    {row.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='text-center py-8 text-gray-500'>
            Nenhuma medalha encontrada para os filtros selecionados.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
