'use client';

import { Activity, Shield, Target, Users } from 'lucide-react';

export default function CategoryIcon({ categoria }: { categoria?: string }) {
  switch (categoria?.toLowerCase()) {
    case 'coletiva':
      return <Users className='h-5 w-5 text-blue-500' />;
    case 'individual':
      return <Target className='h-5 w-5 text-green-500' />;
    case 'equipe':
      return <Shield className='h-5 w-5 text-purple-500' />;
    case 'resistência':
      return <Target className='h-5 w-5 text-orange-500' />;
    default:
      return <Activity className='h-5 w-5 text-gray-500' />;
  }
}
