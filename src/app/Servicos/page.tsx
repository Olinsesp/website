import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Utensils,
  Info,
  Bus,
  MapPin,
  Clock,
  Phone,
  Shield,
  Wifi,
  Car,
  Baby,
  Accessibility,
} from 'lucide-react';

const Servicos = () => {
  const servicos = [
    {
      id: 1,
      titulo: 'Primeiros Socorros',
      descricao:
        'Atendimento médico de emergência e primeiros socorros durante todo o evento',
      icon: Heart,
      categoria: 'Emergência',
      localizacao: 'Posto Médico - Arena Principal (Portão 1)',
      horarios: '24h durante o evento',
      contato: '(11) 99999-1111',
      detalhes: [
        'Equipe médica especializada',
        'Ambulância de plantão',
        'Atendimento a atletas e público',
        'Medicamentos básicos disponíveis',
      ],
      status: 'disponivel',
      gratuito: true,
    },
    {
      id: 2,
      titulo: 'Alimentação',
      descricao: 'Praça de alimentação com diversas opções gastronômicas',
      icon: Utensils,
      categoria: 'Alimentação',
      localizacao: 'Praça de Alimentação - Área Central',
      horarios: '07:00 às 20:00',
      contato: '(11) 99999-2222',
      detalhes: [
        '10+ opções gastronômicas',
        'Opções vegetarianas e veganas',
        'Lanches rápidos e refeições completas',
        'Bebidas geladas e cafeteria',
      ],
      status: 'disponivel',
      gratuito: false,
    },
    {
      id: 3,
      titulo: 'Informações',
      descricao:
        'Central de informações para atletas, acompanhantes e visitantes',
      icon: Info,
      categoria: 'Suporte',
      localizacao: 'Entrada Principal - Recepção',
      horarios: '06:00 às 22:00',
      contato: '(11) 99999-3333',
      detalhes: [
        'Orientações sobre o evento',
        'Mapas e direcionamentos',
        'Perdidos e achados',
        'Suporte em múltiplos idiomas',
      ],
      status: 'disponivel',
      gratuito: true,
    },
    {
      id: 4,
      titulo: 'Transporte',
      descricao:
        'Ônibus shuttle gratuito conectando pontos estratégicos da cidade',
      icon: Bus,
      categoria: 'Transporte',
      localizacao: 'Pontos de Embarque Sinalizados',
      horarios: '06:30 às 21:30 (intervalos de 30min)',
      contato: '(11) 99999-4444',
      detalhes: [
        'Rota: Centro - Terminal - Arena',
        'Ônibus adaptados',
        'Ar condicionado',
        'Capacidade para 40 passageiros',
      ],
      status: 'disponivel',
      gratuito: true,
    },
    {
      id: 5,
      titulo: 'Estacionamento',
      descricao: 'Área de estacionamento segura e monitorada',
      icon: Car,
      categoria: 'Transporte',
      localizacao: 'Anexo ao Centro Esportivo',
      horarios: '24h durante o evento',
      contato: 'Entrada gratuita',
      detalhes: [
        '500 vagas disponíveis',
        'Segurança 24h',
        'Vagas para PCD',
        'Área coberta VIP',
      ],
      status: 'disponivel',
      gratuito: true,
    },
    {
      id: 6,
      titulo: 'Wi-Fi Gratuito',
      descricao: 'Internet gratuita em toda área do evento',
      icon: Wifi,
      categoria: 'Tecnologia',
      localizacao: 'Toda área do evento',
      horarios: '24h durante o evento',
      contato: 'Rede: Olinsesp2026',
      detalhes: [
        'Cobertura completa',
        'Alta velocidade',
        'Sem limite de tempo',
        'Suporte técnico disponível',
      ],
      status: 'disponivel',
      gratuito: true,
    },
    {
      id: 7,
      titulo: 'Fraldário',
      descricao: 'Espaço dedicado para cuidados com bebês e crianças pequenas',
      icon: Baby,
      categoria: 'Família',
      localizacao: 'Banheiros Familiares - Área Central',
      horarios: 'Durante horário do evento',
      contato: 'Acesso livre',
      detalhes: [
        'Trocador equipado',
        'Aquecedor para mamadeiras',
        'Área de amamentação',
        'Produtos de higiene disponíveis',
      ],
      status: 'disponivel',
      gratuito: true,
    },
    {
      id: 8,
      titulo: 'Acessibilidade',
      descricao: 'Recursos completos para pessoas com deficiência',
      icon: Accessibility,
      categoria: 'Acessibilidade',
      localizacao: 'Todo o complexo',
      horarios: 'Durante todo o evento',
      contato: '(11) 99999-5555',
      detalhes: [
        'Rampas de acesso',
        'Banheiros adaptados',
        'Cadeiras de rodas disponíveis',
        'Intérprete de libras',
      ],
      status: 'disponivel',
      gratuito: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disponivel':
        return (
          <Badge variant="secondary" className="bg-success">
            Disponível
          </Badge>
        );
      case 'limitado':
        return (
          <Badge variant="secondary" className="bg-accent">
            Limitado
          </Badge>
        );
      case 'indisponivel':
        return <Badge variant="destructive">Indisponível</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const categorias = [...new Set(servicos.map((s) => s.categoria))];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Serviços Disponíveis
          </h1>
          <p className="text-lg text-muted-foreground">
            Conte com uma estrutura completa para sua comodidade e segurança
          </p>
        </div>

        {/* Resumo dos Serviços */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Segurança</h3>
              <p className="text-sm text-muted-foreground">24h monitorada</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Saúde</h3>
              <p className="text-sm text-muted-foreground">
                Atendimento médico
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <Utensils className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Alimentação</h3>
              <p className="text-sm text-muted-foreground">Múltiplas opções</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <Accessibility className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Acessibilidade</h3>
              <p className="text-sm text-muted-foreground">
                Totalmente adaptado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Serviços */}
        <div className="space-y-6">
          {categorias.map((categoria) => (
            <div key={categoria}>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                {categoria}
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {servicos
                  .filter((servico) => servico.categoria === categoria)
                  .map((servico) => {
                    const Icon = servico.icon;
                    return (
                      <Card
                        key={servico.id}
                        className="hover:shadow-primary transition-smooth bg-gradient-card"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Icon className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-xl">
                                  {servico.titulo}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  {getStatusBadge(servico.status)}
                                  {servico.gratuito && (
                                    <Badge
                                      variant="outline"
                                      className="text-success border-success"
                                    >
                                      Gratuito
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <CardDescription className="text-base">
                            {servico.descricao}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Informações Básicas */}
                          <div className="grid gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{servico.localizacao}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{servico.horarios}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{servico.contato}</span>
                            </div>
                          </div>

                          {/* Detalhes */}
                          <div>
                            <h4 className="font-semibold mb-2">
                              Detalhes do Serviço:
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {servico.detalhes.map((detalhe, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                  {detalhe}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Ações */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <MapPin className="h-4 w-4 mr-1" />
                              Ver no Mapa
                            </Button>
                            {servico.contato.includes('(') && (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1"
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Contatar
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Mapa e Contatos */}
        <Card className="mt-8 bg-gradient-hero text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Localização e Contatos</CardTitle>
            <CardDescription className="text-white/80">
              Informações gerais para sua melhor experiência
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localização Principal
                </h3>
                <div className="space-y-2 text-sm">
                  <p>Centro Esportivo Municipal</p>
                  <p>Rua dos Esportes, 123 - Centro</p>
                  <p>CEP: 12345-678 - São Paulo/SP</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contatos de Emergência
                </h3>
                <div className="space-y-2 text-sm">
                  <p>Central de Informações: (11) 99999-0000</p>
                  <p>Emergência Médica: (11) 99999-1111</p>
                  <p>Segurança: (11) 99999-9999</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button variant="secondary" size="lg">
                <MapPin className="h-5 w-5 mr-2" />
                Ver Mapa Completo das Instalações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Servicos;
