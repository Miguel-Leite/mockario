# AVISO IMPORTANTE
**Este arquivo NUNCA deve ser commitado no repositório.**
Ele está no .gitignore e serve apenas para documentação local da equipe.

---

# Mockario - Documentação do Projeto

## Objetivo do Projeto

**Mockario** é uma ferramenta para gerar APIs simuladas localmente, permitindo que desenvolvedores de front-end trabalhem sem depender do backend.

- **Slogan**: "Mock APIs rapidinho, desenvolva sem esperar o backend"
- **Propósito**: Criar um ambiente de desenvolvimento onde frontend developers podem prototipar e testar suas aplicações sem depender do backend

---

## Regra de Negócio

### Princípios Fundamentais

1. **Servidor é o Core**
   - O servidor é o núcleo do sistema
   - Deve iniciar sempre primeiro
   - Nunca depende do Front Web

2. **Front Web é Apenas Visual**
   - Interface para gerenciar endpoints
   - Consome o servidor via API REST
   - **Não inicializa o servidor**

3. **CLI é o Orquestrador**
   - Controla a inicialização do servidor e front web
   - Comando único para iniciar tudo
   - `npx mockly start`

### Fluxo de Uso

```
Dev → npx mockly start → Servidor (porta 3001) + Front Web (porta 5173) + Browser
```

---

## Arquitetura do Projeto

```
Mockario (Monorepo)
├── packages/
│   ├── server/    → Core - cria e responde endpoints mock
│   ├── web/      → Interface visual - painel de gestão
│   ├── cli/      → Orquestrador - controla inicialização
│   └── hooks/    → React hooks - consumo em apps React
```

| Módulo | Responsabilidade | Dependência |
|--------|-----------------|--------------|
| **Server** | Criar/responder endpoints mock | Nenhuma (independente) |
| **Web** | UI para gerenciar endpoints | Consome Server via API |
| **CLI** | Orquestrar start do server e web | Coordena ambos |
| **Hooks** | React hooks para consumo | TanStack Query + Axios |

---

## Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| Servidor | Node.js + Express + TypeScript |
| Front Web | React + Vite + Tailwind CSS v3 + Shadcn UI |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| CLI | Commander.js + Node.js |
| Hooks | React + TanStack Query v5 + Axios |
| Testes | Jest |
| Pacote NPM | TypeScript (build) |
| Documentação | Storybook v8 |
| Dados Fake | @faker-js/faker |

---

## Design System

### Cores

| Propósito | Cor | Hex |
|-----------|-----|-----|
| **Primary** | Green 600 | `#16a34a` |
| **Background** | Neutral 950 | `#0a0a0a` |
| **Surface** | Neutral 900 | `#171717` |
| **Border** | Neutral 800 | `#262626` |
| **Text Primary** | Neutral 100 | |
| **Text Secondary** | Neutral 400 | |
| **Error** | Red 400 | |
| **Success** | Green 500 | |

### Estilo

- **Dark mode**: Por padrão
- **Font-size**: sm (pequeno)
- **Cards**: Compactos
- **UI**: Limpa, leve, suave
- **Icons**: Lucide React
- **Componentes**: Shadcn UI com Radix primitives

---

## Comandos CLI

| Comando | Descrição |
|---------|-----------|
| `npx mockly start` | Inicia servidor + front web + abre browser |
| `npx mockly start --no-open` | Inicia sem abrir browser |
| `npx mockly start -p 4000` | Porta customizada do servidor |
| `npx mockly start -w 3000` | Porta customizada do web |
| `npx mockly server` | Inicia apenas o servidor |
| `npx mockly server -p 4000` | Porta customizada |
| `npx mockly web` | Inicia apenas o front web |
| `npx mockly web -p 3000` | Porta customizada |
| `npm run storybook` | Inicia Storybook (desenvolvimento) |
| `npm run build-storybook` | Build Storybook estático |

---

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | `3001` | Porta do servidor |
| `VITE_WEB_PORT` | `5173` | Porta do front web |
| `VITE_API_URL` | `http://localhost:3001` | URL da API |
| `MOCKLY_DATA_DIR` | `~/.mockly/` | Diretório de dados |

---

## Funcionalidades Implementadas

### Servidor (packages/server)

- [x] Endpoints GET, POST, PUT, DELETE
- [x] Respostas JSON customizadas
- [x] Delay por endpoint (simular latência)
- [x] Templates Faker (dados randomizados)
- [x] Logs de requisições
- [x] API REST para gerenciamento
- [x] Auto-inicialização quando executado
- [x] **Persistência de dados em JSON** (~/.mockly/data.json)
- [x] **Dados de exemplo** (seed) na primeira execução
- [x] **Schemas API** - Criar/editar schemas (tabelas)
- [x] **Schema Generation** - Gerar dados fake a partir de schema
- [x] **Stored Data** - Armazenar dados enviados via POST/PUT
- [x] **Auto-criação de endpoints** - POST/PUT para endpoint inexistente cria automaticamente
- [x] **Auth JWT** - Autenticação com tokens JWT
- [x] **Auth Basic** - Autenticação Basic
- [x] **Auth API Key** - Autenticação por API Key
- [x] **Auth Bearer** - Autenticação Bearer Token
- [x] **Rotas de auth automáticas** - /api/auth/login, /api/auth/register, /api/auth/me
- [x] **Usuários** - Criar/deletar usuários para autenticação
- [x] **Reset** - Limpar todos os dados

### Front Web (packages/web)

#### Páginas
- [x] **Home** - Lista de endpoints com testes
- [x] **Schemas** - Gerenciamento de schemas (tabelas)
- [x] **Schema Editor** - Editor visual de schemas com drag-and-drop
- [x] **Settings** - Configurações de autenticação
- [x] **HTTP Client** - Cliente HTTP para testar endpoints (como Postman/Insomnia)

#### Componentes
- [x] EndpointCard - Card de endpoint com ações
- [x] EndpointForm - Modal para criar/editar endpoints
- [x] ResponseViewer - Visualizador de resposta
- [x] LogsViewer - Visualizador de logs
- [x] SchemaSelector - Seletor de schema/tabela
- [x] RelationshipEditor - Editor de relacionamentos
- [x] TableNode - Nó de tabela para drag-and-drop
- [x] FieldEditor - Editor de campos
- [x] HttpClient - Cliente HTTP completo

#### Funcionalidades UI
- [x] Lista de endpoints
- [x] Criar endpoint (modal)
- [x] Editar endpoint
- [x] Deletar endpoint (com confirmação AlertDialog)
- [x] Testar endpoint
- [x] Visualizar resposta
- [x] Visualizador de logs
- [x] Templates Faker dropdown
- [x] Toast notifications
- [x] Status de conexão do servidor
- [x] **Storybook** para componentes UI
- [x] **Request Body** - Definir estrutura do body (schema, keys, example)
- [x] **Custom Keys com tipo** - Formato key:type (ex: name:string, email:email)
- [x] **Autenticação no HTTP Client** - Suporte a Bearer, Basic, API Key
- [x] **Seletor de endpoints** - Selecionar endpoint da lista no HTTP Client

### CLI (packages/cli)

- [x] Comando `start` - inicia tudo
- [x] Comando `server` - apenas servidor
- [x] Comando `web` - apenas front web
- [x] Abertura automática do browser
- [x] Configuração de portas

### Hooks (packages/hooks)

- [x] `useMockEndpoints` - CRUD de endpoints
- [x] `useMockEndpoint` - Endpoint específico por ID
- [x] `useMockLogs` - Gestão de logs
- [x] `useMockServer` - Estado e conexão do servidor
- [x] `MockarioProvider` - Provider TanStack Query
- [x] Tipos TypeScript completos

---

## Estrutura de Diretórios

```
/mockly
├── packages/
│   ├── server/
│   │   ├── src/
│   │   │   ├── index.ts           # Entry point + auto-start
│   │   │   ├── server.ts          # Servidor Express
│   │   │   ├── routes/
│   │   │   │   ├── mockRoutes.ts  # Rotas API de endpoints
│   │   │   │   └── auth.ts        # Rotas de autenticação
│   │   │   ├── models/
│   │   │   │   ├── Endpoint.ts    # Modelo de endpoint
│   │   │   │   ├── Schema.ts      # Modelo de schema
│   │   │   │   └── Auth.ts        # Modelo de autenticação
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts        # Middleware de autenticação
│   │   │   ├── utils/
│   │   │   │   ├── faker.ts       # Utilitário Faker
│   │   │   │   ├── logger.ts      # Logger
│   │   │   │   └── storage.ts     # Persistência JSON
│   │   │   └── types/
│   │   │       └── index.ts       # TypeScript types
│   │   ├── tests/                 # Testes Jest
│   │   ├── package.json           # bin: mockly-server
│   │   └── tsconfig.json
│   │
│   ├── web/
│   │   ├── .storybook/           # Configuração Storybook
│   │   ├── src/
│   │   │   ├── components/       # Componentes React
│   │   │   │   ├── ui/          # shadcn components + stories
│   │   │   │   │   ├── alert-dialog.tsx
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── dialog.tsx
│   │   │   │   │   └── toaster.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── EndpointCard.tsx
│   │   │   │   ├── EndpointForm.tsx
│   │   │   │   ├── HttpClient.tsx
│   │   │   │   ├── ResponseViewer.tsx
│   │   │   │   ├── LogsViewer.tsx
│   │   │   │   ├── SchemaSelector.tsx
│   │   │   │   ├── TableNode.tsx
│   │   │   │   ├── RelationLines.tsx
│   │   │   │   ├── RelationshipEditor.tsx
│   │   │   │   └── FieldEditor.tsx
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Schemas.tsx
│   │   │   │   ├── SchemaEditor.tsx
│   │   │   │   ├── Settings.tsx
│   │   │   │   └── HttpClientPage.tsx
│   │   │   ├── services/
│   │   │   │   └── api.ts       # API client
│   │   │   ├── lib/
│   │   │   │   ├── utils.ts
│   │   │   │   ├── toast.ts
│   │   │   │   └── faker.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── cli/
│       ├── src/
│       │   ├── index.ts          # Entry + Commander
│       │   └── commands/
│       │       ├── start.ts
│       │       ├── server.ts
│       │       └── web.ts
│       ├── package.json          # bin: mockly
│       └── tsconfig.json
│   │
│   └── hooks/                    # React hooks
│       ├── src/
│       │   ├── index.ts           # Exports
│       │   ├── api.ts            # API client
│       │   ├── types.ts          # TypeScript types
│       │   ├── MockarioProvider.tsx # TanStack Query provider
│       │   ├── useMockEndpoints.ts
│       │   ├── useMockLogs.ts
│       │   └── useMockServer.ts
│       ├── package.json
│       └── tsup.config.ts
│
├── package.json                  # Root com workspaces
├── README.md
├── context.md
└── LICENSE
```

---

## Próximos Passos (Em Progresso)

- [ ] Publicar todos os pacotes no npm

---

## Publicação NPM

### Configuração Inicial

1. **Criar organização no npm** (se necessário)
   - Aceder a https://www.npmjs.com/settings/
   - Criar organização gratuita com nome: `mockario`

2. **Criar Automation Access Token**
   - https://www.npmjs.com/settings/TOKENS
   - Selecionar "Automation" 
   - Copiar o token

3. **Adicionar secret no GitHub**
   - Repositório GitHub -> Settings -> Secrets and variables -> Actions
   - New repository secret
   - Nome: `NPM_TOKEN`
   - Valor: colar o token npm

4. **Configurar Trusted Publishing**
   - https://www.npmjs.com/settings/TOKENS -> Trusted Publishing
   - Clicar "Add a new publisher"
   - Selecionar repositório: `Miguel-Leite/mockario`
   - Branch: `main`
   - Não é necessário IP específico

### Publicar Pacotes

O projeto usa GitHub Actions (`.github/workflows/publish.yml`).

**Método 1: Criar Release**
1. Criar tag no GitHub: `v1.0.0`
2. O workflow publica automaticamente todos os pacotes

**Método 2: Executar Workflow Manualmente**
1. GitHub -> Actions -> Publish to npm
2. Clicar "Run workflow"

### Situação Atual (22/02/2026)

**Decisão:** Unificar todos os módulos num único pacote npm para simplificar a publicação.

**Alterações:**
- React hooks movidos de `packages/hooks/` para `packages/server/src/hooks/`
- CLI integrado no pacote `@mockario/mockario` (packages/server/src/cli.ts)
- Tudo agora faz parte do pacote `@mockario/mockario`
- Workflow atualizado para publicar apenas `@mockario/mockario` (pacote único)
- Corrigido caminho da Web UI em produção (`../../web/dist` → `../web/dist`)
- Versão atual: `1.2.2`
- **Publicado no npm:** ✅ `@mockario/mockario@1.2.2`

**Problemas Encontrados e Resoluções:**

1. **Unpublish e 24h cooldown:** O pacote original `mockario` foi unpublished e não podia ser republicado com a mesma versão. Solução: Usar scope `@mockario/mockario`.

2. **2FA Obrigatório:** O npm agora exige Bypass 2FA para publicar. Solução: Criar token com "Bypass two-factor authentication" habilitado.

3. **Bin Inválido:** O npm mostra aviso `"bin[mockario]" script name dist/cli.js was invalid and removed`. O comando `mockario` não funciona globalmente. Solução: Usar `npx @mockario/mockario start`.

4. **Web UI não carregava em produção:** O caminho `../../web/dist` estava errado no pacote publicado. Corrigido para `../web/dist`.

**Pacotes Publicados:**
| Pacote | Versão | Estado |
|--------|--------|--------|
| `@mockario/mockario` | 1.2.2 | ✅ Publicado |

**Como Usar:**
```bash
# Com npx (recomendado)
npx @mockario/mockario start

# Ou instalar e usar
npm install @mockario/mockario
npx mockario start
```

**Notas de Publicação:**
- Usar tokens npm com Bypass 2FA habilitado
- O bin não funciona em instalação global (problema conhecido)
- Trusted Publisher não foi configurado (requer security key física)

### Pacotes do Projeto

| Pacote | Descrição | Nome npm |
|--------|-----------|----------|
| `packages/server` | Core server + Web UI + React Hooks + CLI | `@mockario/mockario` |
| `packages/hooks` | **Removido** - integrado no server | - |
| `packages/cli` | **Removido** - integrado no server | - |

---

## Documentação (packages/site)

### Estrutura Proposta

```
packages/site/app/docs/
├── layout.tsx              # Layout com sidebar
├── page.tsx                # Redirect para getting-started
├── getting-started/
│   └── page.tsx           # Introdução
├── installation/
│   └── page.tsx           # Instalação
├── quick-start/
│   └── page.tsx           # Guia rápido
├── features/
│   ├── endpoints/
│   │   └── page.tsx
│   ├── schemas/
│   │   └── page.tsx
│   └── authentication/
│       └── page.tsx
├── http-client/
│   └── page.tsx
└── api-reference/
    └── page.tsx
```

### Layout (style Tailwind Docs)

| Elemento | Descrição |
|----------|-----------|
| **Sidebar fixa** | Esquerda, ~260px largura |
| **Conteúdo principal** | Direita, max-width ~800px |
| **On this page** | Aside com anchor links (desktop) |
| **Responsivo** | Sidebar colapsável em mobile |
| **Código** | Syntax highlighting + copy button |

### Design

- **Cores**: Background neutro (neutral-950 dark / white light)
- **Tipografia**: Inter ou system-ui
- **Sidebar**: Fundo sutil, hover states, secções colapsáveis
- **Navegação**: Breadcrumbs + "On this page"

### Fases de Implementação

#### Fase 1: Estrutura Base ✅
- [x] Layout principal com sidebar
- [x] Componente DocsSidebar
- [x] Componente DocsContent
- [x] Responsive sidebar (mobile drawer)
- [x] Header para docs
- [x] Páginas de conteúdo (placeholder)

#### Fase 2: Componentes UI
- [ ] CodeBlock com syntax highlighting
- [ ] Callout (note/warning/tip)
- [ ] Breadcrumbs
- [ ] Table of Contents (On this page)

#### Fase 3: Páginas de Conteúdo
- [ ] Getting Started
- [ ] Installation
- [ ] Quick Start
- [ ] Features > Endpoints
- [ ] Features > Schemas
- [ ] Features > Authentication
- [ ] HTTP Client
- [ ] API Reference

---

*Este arquivo será atualizado a cada fase implementada.*
