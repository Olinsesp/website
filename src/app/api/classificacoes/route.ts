import { NextResponse } from 'next/server';

export async function GET() {
  const dummyData = {
    byAfiliacao: [
      {
        rank: 1,
        name: 'PMDF',
        gold: 5,
        silver: 3,
        bronze: 2,
        points: 0,
      },
      {
        rank: 2,
        name: 'CBMDF',
        gold: 3,
        silver: 4,
        bronze: 5,
        points: 0,
      },
      {
        rank: 3,
        name: 'PCDF',
        gold: 2,
        silver: 3,
        bronze: 4,
        points: 0,
      },
      {
        rank: 4,
        name: 'DEPEN',
        gold: 1,
        silver: 2,
        bronze: 3,
        points: 0,
      },
    ],
    byModalidade: [
      {
        rank: 1,
        name: 'Futsal Masculino',
        affiliation: 'PMDF',
      },
      {
        rank: 2,
        name: 'Futsal Feminino',
        affiliation: 'CBMDF',
      },
      {
        rank: 3,
        name: 'Vôlei Masculino',
        affiliation: 'PCDF',
      },
      {
        rank: 4,
        name: 'Vôlei Feminino',
        affiliation: 'DEPEN',
      },
      {
        rank: 5,
        name: 'Basquete Masculino',
        affiliation: 'PMDF',
      },
    ],
  };

  dummyData.byAfiliacao.forEach((item) => {
    item.points = item.gold * 5 + item.silver * 3 + item.bronze * 1;
  });

  dummyData.byAfiliacao.sort((a, b) => b.points - a.points);
  dummyData.byAfiliacao.forEach((item, index) => {
    item.rank = index + 1;
  });

  return NextResponse.json(dummyData);
}
