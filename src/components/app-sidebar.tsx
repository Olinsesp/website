'use client';

import * as React from 'react';
import {
  Calendar,
  Camera,
  Gamepad2,
  Settings,
  Trophy,
  Users,
  CheckCircle,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'Administrador',
    email: 'admin@olinsesp.com',
    avatar: '/avatars/admin.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: Settings,
      isActive: true,
    },
    {
      title: 'Classificações',
      url: '#',
      icon: Trophy,
      items: [
        {
          title: 'Gerenciar Resultados',
          url: '#',
        },
        {
          title: 'Medalhas',
          url: '#',
        },
      ],
    },
    {
      title: 'Modalidades',
      url: '#',
      icon: Gamepad2,
      items: [
        {
          title: 'Esportes',
          url: '#',
        },
        {
          title: 'Categorias',
          url: '#',
        },
      ],
    },
    {
      title: 'Galeria',
      url: '#',
      icon: Camera,
      items: [
        {
          title: 'Fotos',
          url: '#',
        },
        {
          title: 'Vídeos',
          url: '#',
        },
        {
          title: 'Releases',
          url: '#',
        },
      ],
    },
    {
      title: 'Cronograma',
      url: '#',
      icon: Calendar,
      items: [
        {
          title: 'Eventos',
          url: '#',
        },
        {
          title: 'Programação',
          url: '#',
        },
      ],
    },
    {
      title: 'Inscrições',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Participantes',
          url: '#',
        },
        {
          title: 'Aprovações',
          url: '#',
        },
      ],
    },
    {
      title: 'Confirmação',
      url: '#',
      icon: CheckCircle,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function AppSidebar({
  activeTab = 'dashboard',
  onTabChange,
  ...props
}: AppSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-2 py-2'>
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
            <Trophy className='size-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>Olinsesp VIII</span>
            <span className='truncate text-xs'>Dashboard Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onTabChange?.(item.title.toLowerCase())}
                    isActive={activeTab === item.title.toLowerCase()}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
