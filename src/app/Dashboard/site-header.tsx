'use client';

import { Bell, Search } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface SiteHeaderProps {
  activeTab?: string;
}

export function SiteHeader({ activeTab }: SiteHeaderProps) {
  const getBreadcrumbTitle = (tab: string) => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      classificações: 'Classificações',
      modalidades: 'Modalidades',
      galeria: 'Galeria',
      cronograma: 'Cronograma',
      inscrições: 'Inscrições',
      confirmação: 'Confirmação',
    };
    return titles[tab];
  };

  return (
    <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className='hidden md:block'>
              <BreadcrumbLink href='#'>VIII Olinsesp</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='hidden md:block' />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {getBreadcrumbTitle(activeTab ?? '')}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='ml-auto flex items-center gap-2 px-4'>
        <div className='relative hidden md:block'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Buscar...'
            className='w-[200px] pl-8'
          />
        </div>
        <Separator orientation='vertical' className='mr-2 h-4' />
        <button className='relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
          <Bell className='h-4 w-4' />
          <span className='sr-only'>Notificações</span>
        </button>
      </div>
    </header>
  );
}
