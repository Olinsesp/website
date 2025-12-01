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

Este é um sistema completo de gerenciamento de eventos esportivos que utiliza **dados estáticos** para demonstração, simulando todas as operações CRUD. O sistema é perfeito para:

- **Demonstrações** para stakeholders e organizadores
- **Validação** de funcionalidades e fluxos de usuário
- **Apresentação** de UX/UI moderna e responsiva
- **Base sólida** para desenvolvimento em produção
- **Prototipagem** de sistemas de gerenciamento de eventos

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

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo .env.local com suas configurações
# (Opcional - o sistema funciona sem configurações adicionais)
```

### 4. **Execute o Projeto**

```bash
# Modo desenvolvimento
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

### 5. **Acesse a Aplicação**

Abra seu navegador e acesse:

```
http://localhost:3000
```

### 6. **Build de Produção**

```bash
# Gerar build otimizado
npm run build

# Executar build de produção
npm run start
```

## 📁 Estrutura do Projeto

```
olinsesp/
├── public/                 # Arquivos estáticos
│   ├── LOGO SSPDF.png     # Logo oficial
│   ├── sports-hero.jpg    # Imagem hero
│   └── gallery-*.jpg      # Imagens da galeria
├── src/
│   ├── app/               # App Router do Next.js 15
│   │   ├── api/           # API Routes com dados estáticos
│   │   │   ├── classificacoes/  # CRUD de classificações
│   │   │   ├── cronograma/      # CRUD de cronograma
│   │   │   ├── inscricoes/      # CRUD de inscrições
│   │   │   ├── jogos/           # CRUD de jogos
│   │   │   ├── midias/          # CRUD de mídias
│   │   │   └── modalidades/     # CRUD de modalidades
│   │   ├── Classificacoes/      # Página pública de classificações
│   │   ├── Cronograma/          # Página pública do cronograma
│   │   ├── Dashboard/           # Dashboard administrativo
│   │   ├── Galeria/             # Galeria pública de mídias
│   │   ├── Inscricoes/          # Sistema de inscrições
│   │   ├── Modalidades/         # Lista pública de modalidades
│   │   ├── globals.css          # Estilos globais
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Página inicial
│   ├── components/              # Componentes reutilizáveis
│   │   ├── admin/               # Formulários administrativos
│   │   │   ├── ClassificacoesForm.tsx
│   │   │   ├── CronogramaForm.tsx
│   │   │   ├── GaleriaForm.tsx
│   │   │   ├── InscricoesForm.tsx
│   │   │   └── ModalidadesForm.tsx
│   │   ├── ui/                  # Componentes base (shadcn/ui)
│   │   ├── app-sidebar.tsx      # Sidebar administrativa
│   │   ├── pdf-utils.ts         # Utilitários para PDF
│   │   ├── section-cards.tsx    # Cards de seção
│   │   └── site-header.tsx      # Cabeçalho do site
│   ├── hooks/                   # Hooks customizados
│   │   └── use-mobile.ts        # Hook para detecção mobile
│   └── lib/                     # Utilitários e configurações
│       ├── Provider.tsx         # Providers do React Query
│       └── utils.ts             # Funções utilitárias
├── components.json              # Configuração shadcn/ui
├── next.config.ts               # Configuração Next.js
├── package.json                 # Dependências e scripts
├── tailwind.config.js           # Configuração Tailwind
└── tsconfig.json                # Configuração TypeScript
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

Modifique os arquivos em `src/app/api/` para:

- **Informações do evento** - Datas, local, descrições
- **Modalidades esportivas** - Adicionar/remover esportes
- **Cronograma** - Horários e programação
- **Classificações** - Resultados e pontuações
- **Mídias** - Fotos e vídeos da galeria

### **Interface e Componentes**

- **shadcn/ui** - Adicione novos componentes com `npx shadcn@latest add [component]`
- **Tailwind CSS** - Personalize classes e utilitários
- **Ícones** - Use Lucide React para ícones consistentes

## 🔮 Roadmap e Próximos Passos

### **Fase 1: MVP Completo ✅**

- [x] **Interface moderna** e responsiva
- [x] **Funcionalidades core** implementadas
- [x] **Dados estáticos** para demonstração
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
