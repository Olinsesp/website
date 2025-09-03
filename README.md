# 🏆 Olinsesp VIII - MVP

> **O maior evento esportivo de integração das forças de segurança**

Este é um MVP (Minimum Viable Product) desenvolvido com [Next.js](https://nextjs.org) para demonstrar o sistema de gerenciamento do evento Olinsesp VIII.

## 🚀 Funcionalidades

- ✅ **Sistema de Inscrições** - Formulário completo com validação
- ✅ **Cronograma do Evento** - Programação detalhada por dia
- ✅ **Galeria de Mídias** - Fotos, vídeos e releases
- ✅ **Classificações** - Quadro de medalhas e resultados
- ✅ **Modalidades Esportivas** - Catálogo completo com editais
- ✅ **Dashboard Administrativo** - Relatórios e estatísticas
- ✅ **Geração de PDF** - Relatórios exportáveis
- ✅ **API REST** - Endpoints para integração futura

## 🎯 Sobre o MVP

Este projeto utiliza **dados estáticos** para demonstração, simulando todas as operações CRUD. É perfeito para:

- Apresentações para stakeholders
- Validação de funcionalidades
- Demonstração de UX/UI
- Base para desenvolvimento futuro

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Validação**: Zod, React Hook Form
- **Charts**: Recharts
- **PDF**: jsPDF
- **State Management**: TanStack Query
- **Icons**: Lucide React

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## ⚙️ Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/olinsesp.git
cd olinsesp
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações
```

4. **Execute o projeto**

```bash
npm run dev
# ou
yarn dev
```

5. **Acesse a aplicação**

```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js 15
│   ├── api/               # API Routes com dados estáticos
│   ├── Classificacoes/    # Página de classificações
│   ├── Cronograma/        # Página do cronograma
│   ├── Dashboard/          # Dashboard administrativo
│   ├── Galeria/           # Galeria de mídias
│   ├── Inscricoes/        # Sistema de inscrições
│   └── Modalidades/       # Lista de modalidades
├── components/             # Componentes reutilizáveis
│   └── ui/                # Componentes base (shadcn/ui)
└── lib/                    # Utilitários e configurações
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Gera build de produção
npm run start        # Executa build de produção
npm run lint         # Executa linting e formatação
```

## 🎨 Personalização

### Cores e Tema

Edite `src/app/globals.css` para personalizar:

- Cores do tema
- Variáveis CSS
- Estilos globais

### Dados Estáticos

Modifique os arquivos em `src/app/api/` para:

- Alterar informações do evento
- Adicionar modalidades
- Modificar cronograma
- Atualizar classificações

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas

- Netlify
- Railway
- Heroku

## 🔮 Roadmap

### Fase 1: MVP ✅

- [x] Interface básica
- [x] Funcionalidades core
- [x] Dados estáticos
- [x] API routes

### Fase 2: Produção (Futuro)

- [ ] Banco de dados real
- [ ] Autenticação de usuários
- [ ] Sistema de pagamentos
- [ ] Notificações em tempo real
- [ ] App mobile

## 📞 Suporte

Para dúvidas ou problemas:

- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

## 📄 Licença

Este projeto é um MVP interno para demonstração.

---

**Desenvolvido com ❤️ para o Olinsesp VIII**
