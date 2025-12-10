import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Medal } from 'lucide-react';

const pointsData = [
  {
    position: '1º lugar',
    points: '20 pontos',
    medal: 'Ouro',
    color: 'text-yellow-500',
  },
  {
    position: '2º lugar',
    points: '15 pontos',
    medal: 'Prata',
    color: 'text-gray-400',
  },
  {
    position: '3º lugar',
    points: '12 pontos',
    medal: 'Bronze',
    color: 'text-orange-600',
  },
  { position: '4º lugar', points: '9 pontos' },
  { position: '5º lugar', points: '7 pontos' },
  { position: '6º lugar', points: '5 pontos' },
  { position: '7º lugar', points: '4 pontos' },
  { position: '8º lugar', points: '3 pontos' },
  { position: '9º lugar', points: '2 pontos' },
  { position: '10º lugar', points: '1 ponto' },
];

export default function PointsTable() {
  return (
    <Card className='mt-8 sm:mt-12 bg-white/80 backdrop-blur-sm border-0 shadow-xl'>
      <CardHeader>
        <CardTitle>Tabela de Pontuação</CardTitle>
        <CardDescription>
          Pontuação atribuída por classificação nas modalidades.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Classificação</TableHead>
              <TableHead className='text-right'>Pontuação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pointsData.map((data) => (
              <TableRow key={data.position}>
                <TableCell className='font-medium flex items-center'>
                  {data.medal && <Medal className={`mr-2 ${data.color}`} />}
                  {data.position}
                </TableCell>
                <TableCell className='text-right'>{data.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
