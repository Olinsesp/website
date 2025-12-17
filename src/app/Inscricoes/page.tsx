'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Phone, Mail } from 'lucide-react';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { pontosFocais } from './pontosFocais';

export default function Inscricoes() {
  return (
    <div className='min-h-screen py-12 bg-none'>
      <div className='container mx-auto px-4 max-w-5xl'>
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-azul-olinsesp text-white px-6 py-3 rounded-full text-sm font-medium mb-6'>
            <CheckCircle className='h-4 w-4' />
            Inscrições Abertas
          </div>
          <div className='backdrop-blur-xl rounded-2xl p-6  border border-white/20 shadow-2xl'>
            <h1 className='text-4xl md:text-5xl font-extrabold mb-6 bg-azul-olinsesp bg-clip-text text-transparent'>
              Inscrições VIII Olinsesp
            </h1>
            <p className='text-2xl md:text-xl font-extrabold text-gray-950 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Faça parte do maior evento esportivo da região! Junte-se a
              centenas de atletas das forças de segurança em uma competição
              única.
            </p>
          </div>
          <Card className='max-w-md mx-auto mb-8 bg-azul-olinsesp text-white border-0 shadow-2xl mt-8'>
            <CardContent className='p-6'>
              <CountdownTimer />
            </CardContent>
          </Card>
        </div>

        <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-2xl p-8 text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Atenção!</h2>
          <p className='text-lg text-gray-600'>
            Para finalizar sua inscrição, por favor, entre em contato com o
            Ponto Focal do seu órgão. Ele(a) poderá te auxiliar com o processo.
          </p>
          <p className='text-lg text-gray-600 mt-2'>
            Agradecemos o seu interesse e esperamos vê-lo(a) nos jogos!
          </p>
        </Card>
        <div className='mt-12'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
            Pontos Focais por Órgão
          </h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {pontosFocais?.map((ponto, index) => (
              <Card
                key={index}
                className='bg-white border border-gray-200 shadow-md hover:shadow-lg transition'
              >
                <CardHeader>
                  <CardTitle className='text-lg text-azul-olinsesp'>
                    {ponto.orgao}
                  </CardTitle>
                </CardHeader>

                <CardContent className='space-y-3'>
                  <p className='font-semibold text-gray-800'>{ponto.nome}</p>

                  <div className='flex items-center gap-2 text-gray-600 text-sm'>
                    <Phone className='h-4 w-4' />
                    <span>{ponto.telefone}</span>
                  </div>

                  {ponto.email && (
                    <div className='flex items-center gap-2 text-gray-600 text-sm break-all'>
                      <Mail className='h-4 w-4' />
                      <span>{ponto.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
