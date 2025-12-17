# 🏆 VIII Olinsesp - Sistema de Gerenciamento

> **O maior evento esportivo de integração das forças de segurança**

Sistema completo de gerenciamento desenvolvido com [Next.js](https://nextjs.org) para o evento VIII Olinsesp, oferecendo uma plataforma moderna e intuitiva para participantes e organizadores.

## 🚀 Funcionalidades Implementadas

### 🎯 **Sistema de Inscrições**

- ✅ Formulário completo com validação em tempo real
- ✅ Seleção múltipla de modalidades
- ✅ Validação de CPF e dados pessoais
- ✅ Envio de confirmação por email
- ✅ Gerenciamento de status (pendente/aprovada/rejeitada)

### 📅 **Cronograma do Evento**

- ✅ Programação detalhada por dia e horário
- ✅ Status dos eventos (agendado/em andamento/finalizado)
- ✅ Filtros por modalidade e tipo de evento
- ✅ Interface responsiva com visualização otimizada

### 🏆 **Sistema de Classificações**

- ✅ Quadro de medalhas e resultados
- ✅ Classificação por modalidade e categoria
- ✅ Pontuação e tempos registrados
- ✅ Visualização por atletas e equipes
- ✅ Filtragem dinâmica de modalidades por categoria (Individual/Coletiva)
- ✅ Entrada de atleta/equipe condicional (Atleta para modalidades individuais, Equipe para coletivas)

### 🎮 **Modalidades Esportivas**

- ✅ Catálogo completo com 15+ modalidades
- ✅ Informações detalhadas (regras, prêmios, participantes)
- ✅ Status de inscrições e vagas disponíveis
- ✅ Categorização por tipo de esporte

### 📸 **Galeria de Mídias**

- ✅ Upload e gerenciamento de fotos e vídeos
- ✅ Sistema de destaques
- ✅ Organização por tipo de mídia
- ✅ Interface de visualização otimizada

### 📊 **Dashboard Administrativo**

- ✅ Relatórios e estatísticas em tempo real
- ✅ Gráficos interativos (barras e pizza)
- ✅ Filtros avançados por lotação e modalidade
- ✅ Exportação de dados em PDF
- ✅ Gerenciamento completo de todas as entidades

### 🔧 **Recursos Técnicos**

- ✅ API REST completa com CRUD operations
- ✅ Geração de PDFs para relatórios
- ✅ Sistema de notificações (Sonner)
- ✅ Interface responsiva e acessível
- ✅ Countdown timer para o evento

## 🎯 Sobre o Sistema

Este é um sistema completo de gerenciamento de eventos esportivos construído com uma arquitetura de aplicação real, utilizando **Prisma ORM** para se conectar a um banco de dados relacional. Ele não utiliza dados estáticos, sendo uma base sólida e pronta para produção. O sistema é perfeito para:

- **Gerenciamento de ponta a ponta** de eventos esportivos reais
- **Base sólida** para desenvolvimento e expansão em produção
- **Validação** de funcionalidades e fluxos de usuário em um ambiente real
- **Apresentação** de uma aplicação full-stack moderna e responsiva

## 🛠️ Stack Tecnológica

### **Frontend & Framework**

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca de interface de usuário
- **TypeScript** - Tipagem estática para JavaScript

### **UI & Styling**

- **Tailwind CSS 4** - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes modernos
- **Radix UI** - Componentes primitivos acessíveis
- **Lucide React** - Ícones modernos e consistentes

### **Banco de Dados & ORM**

- **Prisma** - ORM para Node.js e TypeScript

### **Validação & Formulários**

- **Zod** - Validação de schemas TypeScript
- **React Hook Form** - Gerenciamento de formulários
- **@hookform/resolvers** - Integração Zod + React Hook Form

### **Visualização & Relatórios**

- **Recharts** - Gráficos e visualizações interativas
- **jsPDF** - Geração de relatórios em PDF
- **jspdf-autotable** - Tabelas em PDF

### **Estado & Dados**

- **TanStack Query** - Gerenciamento de estado servidor
- **TanStack Table** - Tabelas avançadas e interativas

### **Notificações & UX**

- **Sonner** - Sistema de notificações toast
- **next-themes** - Suporte a temas claro/escuro
- **Vercel Analytics** - Análise de uso

## 📋 Pré-requisitos

- **Node.js 18+** (recomendado: versão LTS)
- **npm** ou **yarn** ou **pnpm**
- **Git** para clonagem do repositório

## ⚙️ Instalação e Configuração

### 1. **Clone o Repositório**

```bash
git clone https://github.com/seu-usuario/olinsesp.git
cd olinsesp
```

### 2. **Instale as Dependências**

```bash
# Usando npm
npm install

# Usando yarn
yarn install

# Usando pnpm
pnpm install
```

### 3. **Configure as Variáveis de Ambiente**

Crie um arquivo chamado `.env.local` na raiz do projeto. Este arquivo centralizará todas as chaves de API e segredos necessários para a aplicação.

Copie e cole o conteúdo abaixo no seu `.env.local` e substitua os valores de exemplo pelos seus.

```bash
# .env.local

# URL de conexão do banco de dados (PostgreSQL recomendado)
# Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://docker:docker@localhost:5432/olinsesp"

# Segredo para assinatura dos tokens JWT (JSON Web Tokens)
# Use um valor longo, aleatório e seguro. Pode ser gerado com: openssl rand -base64 32
JWT_SECRET="COLOQUE_SEU_SEGREDO_AQUI"

# Credenciais para envio de emails via Gmail
# É altamente recomendável usar uma "Senha de App" gerada no Google, não sua senha principal.
GMAIL_HOST='smtp.gmail.com'
GMAIL_USER="seu-email@gmail.com"
GMAIL_PASSWORD="sua-senha-de-app-do-google"

```

### 4. **Execute o Banco de Dados e as Migrações**

Para um ambiente de desenvolvimento limpo, é recomendado usar o Docker.

```bash
# Suba o container do banco de dados (se estiver usando Docker)
docker-compose up -d

# Aplique as migrações do Prisma para criar as tabelas
npx prisma migrate dev

# (Opcional) Popule o banco com dados iniciais
npx prisma db seed
```

### 5. **Execute o Projeto**

```bash
# Modo desenvolvimento
npm run dev
```

### 6. **Acesse a Aplicação**

Abra seu navegador e acesse:

```
http://localhost:3000
```

### 7. **Build de Produção**

```bash
# Gerar build otimizado para produção
npm run build

# Executar o servidor de produção
npm run start
```

## 📁 Estrutura do Projeto

```
olinsesp/
├── prisma/                   # Schema, migrações e seed do Prisma
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/                   # Arquivos estáticos
├── src/
│   ├── app/                 # App Router do Next.js
│   │   ├── api/             # API Routes conectadas ao Prisma
│   │   │   ├── auth/
│   │   │   ├── classificacoes/
│   │   │   ├── cronograma/
│   │   │   ├── dashboard-summary/
│   │   │   ├── equipes/
│   │   │   ├── inscricoes/
│   │   │   ├── midias/
│   │   │   └── modalidades/
│   │   ├── Classificacoes/
│   │   ├── Cronograma/
│   │   ├── Dashboard/         # Dashboard administrativo
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── section-cards.tsx
│   │   │   └── site-header.tsx
│   │   ├── Galeria/
│   │   ├── Inscricoes/
│   │   ├── Modalidades/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # Componentes reutilizáveis
│   │   ├── admin/             # Formulários administrativos
│   │   └── ui/                # Componentes base (shadcn/ui)
│   ├── hooks/                 # Hooks customizados
│   └── lib/                   # Utilitários e configurações
│       ├── prisma.ts          # Cliente Prisma
│       ├── pdf-utils.ts       # Utilitários para PDF
│       └── utils.ts
├── components.json            # Configuração shadcn/ui
├── next.config.ts             # Configuração Next.js
├── package.json               # Dependências e scripts
├── postcss.config.mjs         # Configuração PostCSS (inclui Tailwind)
└── tsconfig.json              # Configuração TypeScript
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Executa em modo desenvolvimento com hot reload
npm run build        # Gera build otimizado de produção
npm run start        # Executa build de produção
npm run lint         # Executa ESLint e Prettier para formatação

# Alternativas com outros gerenciadores
yarn dev             # ou pnpm dev
yarn build           # ou pnpm build
yarn start           # ou pnpm start
yarn lint            # ou pnpm lint
```

## 🎨 Personalização e Configuração

### **Cores e Tema**

Edite `src/app/globals.css` para personalizar:

- **Variáveis CSS** - Cores primárias, secundárias e de fundo
- **Tema escuro/claro** - Configurações de dark mode
- **Animações** - Efeitos de transição e hover
- **Gradientes** - Cores de destaque e backgrounds

### **Dados e Conteúdo**

A estrutura dos dados é a fonte da verdade do sistema. Para modificá-la:

- **Modelo de Dados**: Edite o arquivo `prisma/schema.prisma` para alterar tabelas, colunas e relações. Após alterar, gere uma nova migração com `npx prisma migrate dev`.
- **Gerenciamento de Conteúdo**: Os dados (modalidades, inscrições, etc.) são gerenciados diretamente pelo **Dashboard Administrativo** da aplicação, não por arquivos estáticos.

### **Interface e Componentes**

- **shadcn/ui** - Adicione novos componentes com `npx shadcn@latest add [component]`
- **Tailwind CSS** - Personalize classes e utilitários
- **Ícones** - Use Lucide React para ícones consistentes

## 🔮 Roadmap e Próximos Passos

### **Fase 1: MVP Completo ✅**

- [x] **Interface moderna** e responsiva
- [x] **Funcionalidades core** implementadas
- [x] **Banco de dados com Prisma** para gestão de dados
- [x] **API routes** completas
- [x] **Dashboard administrativo** funcional
- [x] **Sistema de relatórios** em PDF

## 📄 Licença e Uso

Este projeto é um **sistema interno** desenvolvido para demonstração e uso no evento VIII Olinsesp.

---

## 🏆 **VIII Olinsesp - 2026**

**O maior evento esportivo de integração das forças de segurança**

_Desenvolvido com ❤️ para promover a integração e o esporte entre as forças de segurança_

---
