# Documentação do Sistema — Primeira Igreja Batista

## Visão Geral

Sistema web de gestão eclesiástica para a Primeira Igreja Batista. Aplicação PWA (Progressive Web App) que permite gerenciamento de membros, visitantes, eventos, escalas de ministérios, repertório musical, dons espirituais e comunicação interna.

**URL de Produção:** https://vercel.com/mitchelsons-projects/v0-primeira-igreja-batista  
**Repositório:** GitHub (sync automático com v0.dev)

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript + React 19 |
| Banco de Dados | PostgreSQL (NeonDB Serverless) |
| Autenticação | NextAuth v5 (Google OAuth) |
| UI | Tailwind CSS + Radix UI + shadcn/ui |
| PWA | next-pwa + Workbox |
| Notificações | Web Push (web-push) |
| Gráficos | Recharts |
| PDF | jsPDF + jspdf-autotable |
| Validação | Zod + react-hook-form |
| Data Fetching | SWR |
| Deploy | Vercel |

---

## Arquitetura do Projeto

```
├── app/
│   ├── api/                    # API Routes (REST)
│   │   ├── auth/               # NextAuth handlers
│   │   ├── users/              # CRUD usuários
│   │   ├── visitantes/         # CRUD visitantes
│   │   ├── eventos/            # CRUD eventos + modelos
│   │   ├── escalas/            # CRUD escalas + notificações
│   │   ├── ministerios/        # CRUD ministérios + funções
│   │   ├── mensagens/          # Sistema de mensagens
│   │   ├── repertorio/         # Repertório musical
│   │   ├── dons-espirituais/   # Formulário de dons
│   │   ├── form-ministerios/   # Formulário de ministérios
│   │   ├── config/             # Configurações da app
│   │   ├── push/               # Push notifications
│   │   └── responsaveis/       # Responsáveis (legado)
│   ├── admin/                  # Painel Administrativo
│   │   ├── membros/            # Gestão de membros
│   │   ├── visitantes/         # Gestão de visitantes
│   │   ├── eventos/            # Gestão de eventos
│   │   ├── escalas/            # Escalas de serviço
│   │   ├── ministerios/        # Gestão de ministérios
│   │   ├── mensagens/          # Mensagens/comunicação
│   │   ├── configuracoes/      # Config do sistema
│   │   ├── dons-espirituais/   # Admin dons espirituais
│   │   ├── form-ministerios/   # Admin formulários
│   │   └── responsaveis/       # Responsáveis (legado)
│   ├── minha-area/             # Área do membro logado
│   ├── form-ministerios/       # Formulário público de ministérios
│   ├── form-dons-espirituais/  # Formulário público de dons
│   ├── login/                  # Página de login
│   ├── cadastro/               # Página de cadastro
│   ├── eventos/                # Eventos públicos
│   ├── ministerios/            # Ministérios públicos
│   ├── sermoes/                # Sermões
│   ├── sobre/                  # Sobre a igreja
│   ├── contato/                # Contato
│   └── offline/                # Página offline (PWA)
├── components/
│   ├── ui/                     # shadcn/ui (50+ componentes)
│   ├── admin-sidebar.tsx       # Sidebar do admin
│   ├── header.tsx              # Header público
│   └── ...                     # Componentes de negócio
├── lib/
│   ├── auth.ts                 # Configuração NextAuth
│   ├── neon.ts                 # Conexão NeonDB
│   ├── push.ts                 # Web Push utils
│   ├── constants.ts            # Constantes
│   ├── utils.ts                # Utilitários gerais
│   ├── pdf-generator.ts        # Geração de PDFs
│   └── dons-espirituais.ts     # Lógica de dons espirituais
├── scripts/                    # Migrações SQL (001-014)
├── types/                      # TypeScript types
├── hooks/                      # Custom hooks
├── contexts/                   # React contexts
├── middleware.ts               # Proteção de rotas
└── worker/                     # Service Worker customizado
```

---

## Sistema de Autenticação

### Fluxo
1. Usuário clica em "Login com Google"
2. NextAuth redireciona para Google OAuth
3. Callback verifica se usuário existe no banco
4. Se novo: cria conta (primeiro usuário vira admin)
5. JWT gerado com `userId`, `role`, `ministerioIds`

### Roles e Permissões

| Role | Acesso |
|------|--------|
| `admin` | Acesso total ao sistema |
| `supervisor` | Painel admin (exceto membros e configurações) |
| `lider` | Painel admin limitado + ministérios que lidera |
| `membro` | Apenas `/minha-area` |

### Middleware (`middleware.ts`)
- Páginas públicas: `/`, `/cadastro`, `/eventos`, `/ministerios`, `/sobre`, `/contato`, `/sermoes`
- `/admin/**` → requer role admin/supervisor/lider
- `/minha-area/**` → requer autenticação

---

## Módulos do Sistema

### 1. Gestão de Membros (`/admin/membros`)
- Listagem com busca e filtros
- Edição de role e status (ativo/inativo)
- Vinculação com ministérios

### 2. Gestão de Visitantes (`/admin/visitantes`)
- Cadastro completo de visitantes
- Status de acompanhamento
- Envio de mensagens de boas-vindas
- Responsável pelo acompanhamento

### 3. Eventos (`/admin/eventos`)
- CRUD de eventos com data, horário, local
- Modelos de eventos reutilizáveis
- Posições/funções por evento
- Observações

### 4. Escalas (`/admin/escalas`)
- Escalar membros para funções em eventos
- Status: pendente, confirmado, recusado
- Notificações push para escalados
- Visualização por evento e por membro

### 5. Ministérios (`/admin/ministerios`)
- CRUD de ministérios (nome, ícone, cor)
- Funções dentro de cada ministério
- Membros vinculados
- Líderes por ministério

### 6. Mensagens (`/admin/mensagens`)
- Categorias de mensagens
- Modelos de mensagens
- Histórico de envios
- Templates para WhatsApp

### 7. Repertório Musical (`/admin/repertorio`)
- Cadastro de músicas
- Tom, BPM, links
- Organização por categoria

### 8. Dons Espirituais (`/admin/dons-espirituais`)
- Formulário de avaliação de dons
- Resultados por membro
- Análise estatística

### 9. Formulário de Ministérios (`/admin/form-ministerios`)
- Formulário público para interesse em ministérios
- Admin visualiza respostas

### 10. Área do Membro (`/minha-area`)
- Próximos eventos escalado
- Confirmar/recusar escalas
- Ministérios participantes
- Solicitar participação em ministérios
- Editar nome
- Push notifications

---

## Banco de Dados

### Tabelas Principais
- `users` — Usuários do sistema (google_id, email, nome, role, ativo)
- `visitantes` — Visitantes da igreja
- `ministerios` — Ministérios (nome, icone, cor)
- `ministerio_membros` — Relação N:N membros-ministérios
- `ministerio_funcoes` — Funções dentro de ministérios
- `eventos` — Eventos da igreja
- `evento_modelos` — Templates de eventos
- `evento_posicoes` — Posições/funções em eventos
- `escalas` — Escalas de membros em eventos
- `mensagens_categorias` — Categorias de mensagens
- `mensagens_modelos` — Templates de mensagens
- `mensagens_enviadas` — Histórico de envios
- `push_subscriptions` — Subscriptions para web push
- `repertorio` — Músicas do repertório
- `dons_espirituais_respostas` — Respostas do formulário de dons
- `app_config` — Configurações gerais

### Migrações
Localizadas em `scripts/` (001 a 014), executadas manualmente no NeonDB.

---

## PWA (Progressive Web App)

- Service Worker gerado por next-pwa
- Manifest em `public/manifest.json`
- Ícones: `apple-touch-icon.png`, logos PIB
- Página offline: `app/offline/page.tsx`
- Push Notifications via web-push
- Install prompt customizado

---

## Variáveis de Ambiente

```env
DATABASE_URL=              # Connection string NeonDB
AUTH_SECRET=               # Secret para NextAuth
AUTH_GOOGLE_ID=            # Google OAuth Client ID
AUTH_GOOGLE_SECRET=        # Google OAuth Client Secret
NEXT_PUBLIC_VAPID_KEY=     # VAPID public key (push)
VAPID_PRIVATE_KEY=         # VAPID private key (push)
```

---

## Deploy

- **Plataforma:** Vercel
- **Branch:** main
- **Build:** `next build`
- **Sync:** Automático via v0.dev → GitHub → Vercel

---

## Desenvolvimento Local

```bash
# 1. Clonar repositório
git clone <repo-url>

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher com credenciais

# 4. Rodar servidor de desenvolvimento
npm run dev

# 5. Acessar http://localhost:3000
```
