'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Users, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import CountdownTimer from '@/components/ui/CountdownTimer';

const Inscricoes = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    idade: '',
    sexo: '',
    camiseta: '',
    afiliacao: '',
    modalidadesPrimarias: [] as string[],
    interesseOutrasModalidades: false,
    outrasModalidades: '',
    observacoes: '',
  });

  const inscricoesEndDate = new Date();
  inscricoesEndDate.setDate(inscricoesEndDate.getDate() + 30);

  const modalidades = [
    'Futebol',
    'Basquete',
    'Vôlei',
    'Tênis',
    'Atletismo',
    'Natação',
    'Futsal',
    'Handebol',
    'Tênis de Mesa',
    'Badminton',
    'Judô',
    'Karatê',
    'Ciclismo',
    'Corrida',
    'Xadrez',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Inscrição Realizada!', {
      description:
        'Sua inscrição foi processada com sucesso. Você receberá um email de confirmação em breve.',
    });
  };

  const handleModalidadeChange = (modalidade: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      modalidadesPrimarias: checked
        ? [...prev.modalidadesPrimarias, modalidade]
        : prev.modalidadesPrimarias.filter((m) => m !== modalidade),
    }));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text">
            Inscrições SportEvent 2024
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Faça parte do maior evento esportivo da região!
          </p>

          {/* Countdown */}
          <Card className="max-w-md mx-auto mb-8 bg-gradient-accent text-white">
            <CardContent className="p-6">
              <CountdownTimer
                targetDate={inscricoesEndDate}
                title="⏰ Inscrições Encerram Em:"
              />
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Período de Inscrições</h3>
              <p className="text-sm text-muted-foreground">
                01/11/2024 - 30/11/2024
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">15+ Modalidades</h3>
              <p className="text-sm text-muted-foreground">
                Diversas opções esportivas
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Inscrição Gratuita</h3>
              <p className="text-sm text-muted-foreground">
                Sem taxas de participação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Formulário */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">Formulário de Inscrição</CardTitle>
            <CardDescription>
              Preencha todos os campos obrigatórios para garantir sua
              participação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Dados Pessoais
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          nome: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          telefone: e.target.value,
                        }))
                      }
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cpf: e.target.value,
                        }))
                      }
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="idade">Idade *</Label>
                    <Input
                      id="idade"
                      type="number"
                      value={formData.idade}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          idade: e.target.value,
                        }))
                      }
                      min="16"
                      max="80"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sexo">Sexo *</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, sexo: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="camiseta">Tamanho da Camiseta *</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, camiseta: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pp">PP</SelectItem>
                        <SelectItem value="p">P</SelectItem>
                        <SelectItem value="m">M</SelectItem>
                        <SelectItem value="g">G</SelectItem>
                        <SelectItem value="gg">GG</SelectItem>
                        <SelectItem value="xg">XG</SelectItem>
                        <SelectItem value="xxg">XXG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="afiliacao">Afiliação/Força</Label>
                    <Input
                      id="afiliacao"
                      value={formData.afiliacao}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          afiliacao: e.target.value,
                        }))
                      }
                      placeholder="Ex: Clube, Academia, Independente"
                    />
                  </div>
                </div>
              </div>

              {/* Modalidades */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Modalidades de Interesse
                </h3>
                <p className="text-sm text-muted-foreground">
                  Selecione as modalidades que deseja participar (máximo 3):
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {modalidades.map((modalidade) => (
                    <div
                      key={modalidade}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={modalidade}
                        checked={formData.modalidadesPrimarias.includes(
                          modalidade
                        )}
                        onCheckedChange={(checked) =>
                          handleModalidadeChange(modalidade, checked as boolean)
                        }
                        disabled={
                          formData.modalidadesPrimarias.length >= 3 &&
                          !formData.modalidadesPrimarias.includes(modalidade)
                        }
                      />
                      <Label htmlFor={modalidade} className="text-sm">
                        {modalidade}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="outrasModalidades"
                    checked={formData.interesseOutrasModalidades}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        interesseOutrasModalidades: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="outrasModalidades">
                    Tenho interesse em outras modalidades
                  </Label>
                </div>

                {formData.interesseOutrasModalidades && (
                  <Textarea
                    placeholder="Descreva quais outras modalidades você gostaria que fossem incluídas no evento..."
                    value={formData.outrasModalidades}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        outrasModalidades: e.target.value,
                      }))
                    }
                  />
                )}
              </div>

              {/* Observações */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Observações
                </h3>
                <Textarea
                  placeholder="Informações adicionais, necessidades especiais, ou comentários..."
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      observacoes: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Submit */}
              <div className="text-center pt-6">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="px-12 cursor-pointer hover:bg-orange-500 hover:text-white transition-colors"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Finalizar Inscrição
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Ao submeter este formulário, você concorda com os termos e
                  condições do evento.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inscricoes;
