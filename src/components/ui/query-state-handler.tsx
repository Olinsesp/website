import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface QueryStateHandlerProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  loadingMessage?: string;
  children: ReactNode;
}

export default function QueryStateHandler({
  isLoading,
  isError,
  error,
  loadingMessage = 'Carregando...',
  children,
}: QueryStateHandlerProps) {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-orange-50'>
        <div className='text-center'>
          <Loader2 className='inline-block h-12 w-12 animate-spin text-blue-600 mb-4' />
          <p>{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <Card className='max-w-md mx-auto bg-white/80 backdrop-blur-sm'>
          <CardContent className='p-8'>
            <div className='text-red-500 text-6xl mb-4'>⚠️</div>
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>
              Erro ao carregar
            </h2>
            <p className='text-gray-600 mb-4'>
              {error?.message || 'Ocorreu um erro desconhecido.'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
