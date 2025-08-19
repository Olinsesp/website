'use client';
import { Button } from '@/components/ui/button';
import { Calendar, Camera, FileText, Medal, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const navItems = [
    { name: 'Início', path: '/', icon: Medal },
    { name: 'Inscrições', path: '/Inscricoes', icon: Users },
    { name: 'Cronograma', path: '/Cronograma', icon: Calendar },
    { name: 'Galeria', path: '/Galeria', icon: Camera },
    { name: 'Serviços', path: '/Servicos', icon: FileText },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 ">
            <Medal className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
              Olinsesp 2026
            </span>
          </Link>
          <div className="flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex items-center space-x-2 "
                >
                  <Button
                    variant={isActive ? 'default' : 'secondary'}
                    size="sm"
                    className={`flex items-center space-x-2 cursor-pointer hover:bg-orange-500 hover:text-white transition-colors`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Medal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
