# API PIB Roraima

Backend REST do app mobile e do painel web. Hospedado no Next.js (App Router) na Vercel.

| Item | Valor |
|------|-------|
| **Base URL (produção)** | `https://v0-primeira-igreja-batista.vercel.app` |
| **Base URL (app mobile)** | `EXPO_PUBLIC_API_URL` no `.env` do app |
| **Banco de dados** | Neon PostgreSQL (`DATABASE_URL`) |
| **Formato** | JSON (`Content-Type: application/json`) |
| **Rotas** | 51 arquivos em `app/api/` |

---

## Índice

1. [Autenticação](#autenticação)
2. [Papéis (roles)](#papéis-roles)
3. [Formato de erros](#formato-de-erros)
4. [Auth](#1-auth)
5. [Usuários](#2-usuários)
6. [Escalas](#3-escalas)
7. [Eventos](#4-eventos)
8. [Ministérios](#5-ministérios)
9. [Feed](#6-feed)
10. [Notificações e Push](#7-notificações-e-push)
11. [Visitantes e Mensagens](#8-visitantes-e-mensagens)
12. [Dons Espirituais](#9-dons-espirituais)
13. [Repertório](#10-repertório)
14. [Upload e Mídia](#11-upload-e-mídia)
15. [Config e Utilitários](#12-config-e-utilitários)
16. [Variáveis de ambiente](#variáveis-de-ambiente)
17. [Notas para o app mobile](#notas-para-o-app-mobile)

---

## Autenticação

A API aceita **dois modos** de sessão (implementados em `lib/mobile-auth.ts`):

### 1. App mobile — Bearer JWT

```
Authorization: Bearer <token>
```

O token é obtido em `POST /api/auth/mobile` e expira em **30 dias** (HS256, secret `AUTH_MOBILE_SECRET`).

Payload do JWT:

```json
{
  "userId": "uuid",
  "role": "admin | supervisor | lider | membro | visitor",
  "ministerioIds": ["uuid", "..."]
}
```

### 2. Site web — NextAuth (cookie)

Sessão via cookie do NextAuth (`/api/auth/[...nextauth]`). Várias rotas aceitam ambos os modos via `getSession()`.

### Legenda de permissões

| Símbolo | Significado |
|---------|-------------|
| 🌐 | Público (sem auth) |
| 🔒 | Autenticado (Bearer ou cookie) |
| 👑 | Admin |
| 🎖️ | Admin, líder ou supervisor do ministério |
| 📋 | Admin ou líder/supervisor (qualquer ministério) |

---

## Papéis (roles)

| Role | Descrição |
|------|-----------|
| `admin` | Acesso total |
| `supervisor` | Supervisão de ministérios |
| `lider` | Líder de ministério(s) |
| `membro` | Membro regular |
| `visitor` | Visitante (acesso limitado no app) |

---

## Formato de erros

Respostas de erro seguem:

```json
{ "error": "Mensagem descritiva" }
```

Alguns endpoints retornam campos extras (`message`, `detail`, `conflitos`). Códigos comuns:

| Status | Situação |
|--------|----------|
| `400` | Parâmetros inválidos |
| `401` | Não autenticado / token inválido |
| `403` | Sem permissão / conta bloqueada |
| `404` | Recurso não encontrado |
| `409` | Conflito (escala, indisponibilidade) |
| `500` | Erro interno |

---

## 1. Auth

### `POST /api/auth/mobile` 🌐

Troca credencial OAuth/Firebase por JWT do app.

**Body — Google:**
```json
{ "provider": "google", "idToken": "<google-id-token>" }
```

**Body — Apple:**
```json
{
  "provider": "apple",
  "identityToken": "<apple-identity-token>",
  "email": "opcional@email.com",
  "fullName": { "givenName": "João", "familyName": "Silva" }
}
```

**Body — Firebase (e-mail/senha):**
```json
{ "provider": "firebase", "idToken": "<firebase-id-token>" }
```

**Resposta `200`:**
```json
{
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "name": "Nome",
    "email": "email@exemplo.com",
    "image": "https://...",
    "role": "membro",
    "ministerioIds": ["uuid"]
  }
}
```

**Erros:** `401` (token inválido), `403` (conta bloqueada), `404` (usuário não encontrado).

> Primeiro usuário do sistema vira `admin`. Demais novos logins viram `visitor`. Contas são vinculadas/mergeadas por e-mail (`lib/mobile-auth-user.ts`).

---

### `GET|POST /api/auth/[...nextauth]` 🌐

Rotas internas do NextAuth (login web com Google). Não usadas diretamente pelo app mobile.

---

### `POST /api/auth/set-mode` 🌐

Define cookie de modo de visualização no site. Uso interno do frontend web.

---

## 2. Usuários

### `GET /api/users/me` 🔒

Perfil do usuário autenticado.

**Resposta:** `{ id, nome, email, foto_url, bio, nascimento, data_batismo, telefone, permite_escala_multipla }`

---

### `PUT /api/users/me` 🔒

Atualiza perfil próprio.

**Body (todos opcionais):**
```json
{
  "nome": "string",
  "bio": "string",
  "nascimento": "YYYY-MM-DD",
  "data_batismo": "YYYY-MM-DD",
  "foto_url": "https://...",
  "permite_escala_multipla": true
}
```

---

### `GET /api/users/me/pendencias` 🔒

Visitantes do usuário com mensagens WhatsApp pendentes.

**Resposta:** array de `{ id, nome, celular, data_cadastro, sexo, enviadas, total_categorias, pendentes }`

---

### `GET /api/users/me/indisponibilidades` 🔒

Lista indisponibilidades futuras do usuário.

---

### `POST /api/users/me/indisponibilidades` 🔒

**Body:** `{ "data_inicio": "YYYY-MM-DD", "data_fim": "YYYY-MM-DD", "motivo": "opcional" }`

---

### `DELETE /api/users/me/indisponibilidades` 🔒

**Body:** `{ "id": "uuid" }`

---

### `GET /api/users/me/ministerios` 🔒 (cookie NextAuth)

IDs dos ministérios do usuário. **Nota:** usa `auth()` — no mobile, preferir dados do JWT (`ministerioIds`).

---

### `POST /api/users/me/ministerios` 🔒 (cookie NextAuth)

Solicita entrada em ministério (status `pendente: true`).

**Body:** `{ "ministerio_id": "uuid" }`

---

### `GET /api/users` 👑

Lista todos os usuários com ministérios (admin).

---

### `PUT /api/users` 👑

Atualiza usuário (admin).

**Body:** `{ "id", "role", "ativo", "permite_escala_multipla", "telefone", "nome" }`

---

### `DELETE /api/users` 👑

**Body:** `{ "id": "uuid" }` — não pode deletar a si mesmo.

---

### `GET /api/users/:id/profile` 🌐

Perfil público de um membro ativo.

**Resposta:** dados do usuário + `ministerios[]`, `dons`, `proximas_escalas[]` (até 3).

---

### `POST /api/users/ministerios` 🎖️

Gerencia membros de um ministério (líder/admin).

**Body — adicionar:**
```json
{ "user_id": "uuid", "ministerio_id": "uuid" }
```

**Body — definir líder:**
```json
{ "user_id": "uuid", "ministerio_id": "uuid", "is_lider": true }
```

**Body — aceitar pendente:**
```json
{ "user_id": "uuid", "ministerio_id": "uuid", "pendente": false }
```

---

### `DELETE /api/users/ministerios` 🎖️

**Body:** `{ "user_id": "uuid", "ministerio_id": "uuid" }`

---

## 3. Escalas

### `GET /api/escalas` 🌐

| Query | Retorno |
|-------|---------|
| `?evento_id=uuid` | Escalas de um evento (com nome do membro e ministério) |
| `?ministerio_id=uuid` | Escalas futuras do ministério |
| `?ministerio_id=uuid&future=false` | Última escala passada de cada membro |
| *(sem query)* | Todas as escalas, ordenadas por data |

---

### `POST /api/escalas` 🎖️

Cria escala. Valida indisponibilidade e conflito de data.

**Body:**
```json
{
  "evento_id": "uuid",
  "ministerio_id": "uuid",
  "user_id": "uuid",
  "funcao": "opcional"
}
```

**Resposta `201`:** escala criada + `warning` opcional (escala múltipla).

**Erros `409`:** `"Usuário indisponível"` ou `"Conflito de escala"` (com array `conflitos`).

Envia notificação in-app + push ao membro escalado.

---

### `PUT /api/escalas/:id` 🔒

Atualiza escala. O próprio membro pode alterar `status`; líder/admin pode alterar `status` e `funcao`.

**Body:** `{ "status": "confirmado|pendente|...", "funcao": "string" }`

---

### `DELETE /api/escalas/:id` 🎖️

Remove escala do ministério.

---

### `GET /api/escalas/minhas` 🔒

Eventos futuros com flag `is_escalado` para o usuário autenticado (tela Serviço do app).

**Resposta:** array com `id, titulo, data, horario, is_escalado, escala_id, minha_funcao, meu_status, ministerio, icone, cor, total_escalados` (limite 20).

---

### `POST /api/escalas/notify` 📋

Envia push de lembrete aos escalados de um evento/ministério.

**Body:** `{ "evento_id": "uuid", "ministerio_id": "uuid" }`

**Query alternativa (app):** `?ministerio_id=uuid` com `evento_id` no body.

**Resposta:** `{ "sent": 3, "total": 5 }`

---

### `GET /api/escalas/trocas` 🔒

Trocas de escala pendentes onde o usuário é solicitante ou destinatário.

---

### `POST /api/escalas/trocas` 🔒

Solicita troca entre duas escalas do **mesmo ministério** (eventos futuros).

**Body:**
```json
{
  "escala_solicitante_id": "uuid",
  "escala_destinatario_id": "uuid"
}
```

---

### `PUT /api/escalas/trocas/:id` 🔒

Destinatário aceita ou recusa troca.

**Body:** `{ "status": "aceita" | "recusada" }`

Ao aceitar, faz swap de `user_id` nas duas escalas.

---

## 4. Eventos

### `GET /api/eventos` 🌐

Lista todos os eventos (`ORDER BY data DESC`).

---

### `POST /api/eventos` 👑

Cria evento. Se `modelo_id` informado, copia posições do modelo.

**Body:**
```json
{
  "titulo": "Culto Dominical",
  "data": "2026-07-06",
  "horario": "19:00",
  "descricao": "opcional",
  "tipo": "Culto",
  "modelo_id": "uuid-opcional",
  "observacoes": "opcional",
  "repertorio_ministerio_id": "uuid-opcional",
  "repertorio_funcao": "opcional"
}
```

---

### `PUT /api/eventos/:id` 👑

Atualiza evento (campos parciais aceitos).

---

### `DELETE /api/eventos/:id` 👑

Remove evento.

---

### `GET /api/eventos/modelos` 🌐

Lista modelos de evento com posições.

---

### `POST /api/eventos/modelos` 🌐

Cria modelo.

**Body:** `{ "nome", "tipo", "horario", "descricao", "posicoes": [{ "ministerio_id", "funcao", "quantidade" }] }`

---

### `PUT /api/eventos/modelos/:id` 🌐

Atualiza modelo.

---

### `DELETE /api/eventos/modelos/:id` 🌐

Remove modelo.

---

### `GET /api/eventos/:id/posicoes` 🌐

Posições (vagas por ministério/função) de um evento.

---

### `POST /api/eventos/:id/posicoes` 🌐

Adiciona posição ao evento.

**Body:** `{ "ministerio_id", "funcao", "quantidade" }`

---

### `DELETE /api/eventos/:id/posicoes` 🌐

**Body:** `{ "posicao_id": "uuid" }`

---

## 5. Ministérios

### `GET /api/ministerios` 🌐

Lista ministérios com `total_membros`.

---

### `POST /api/ministerios` 🌐

Cria ministério.

**Body:** `{ "nome", "descricao", "cor", "icone", "ordem" }`

---

### `GET /api/ministerios/:id` 🌐

Detalhe do ministério com lista de `membros[]`.

---

### `PUT /api/ministerios/:id` 🎖️

Atualiza ministério (líder do ministério ou admin).

**Body:** `{ "nome", "descricao", "cor", "icone", "ativo", "ordem", "form_obrigatorio" }`

---

### `DELETE /api/ministerios/:id` 👑

Remove ministério.

---

### `GET /api/ministerios/:id/funcoes` 🌐

Lista funções do ministério (ex.: "Teclado", "Vocal").

---

### `POST /api/ministerios/:id/funcoes` 🎖️

**Body:** `{ "nome": "Vocal" }`

---

### `DELETE /api/ministerios/:id/funcoes` 🎖️

**Body:** `{ "funcao_id": "uuid" }`

---

## 6. Feed

### `GET /api/feed` 🌐 / 🔒

Lista posts paginados. Com auth, inclui flag `liked` por post.

**Query:** `?page=1` (20 por página)

**Resposta:**
```json
{
  "posts": [...],
  "total": 42,
  "page": 1,
  "pages": 3
}
```

---

### `POST /api/feed` 🔒 📋

Cria post (admin, líder ou supervisor).

**Body:**
```json
{
  "conteudo": "texto",
  "imagem_url": "https://...",
  "link": "https://...",
  "ministerio_ids": ["uuid"],
  "user_ids": ["uuid"]
}
```

---

### `PUT /api/feed/:id` 🔒

Edita post (autor ou admin).

**Body:** `{ "conteudo", "imagem_url", "fixado" }`

---

### `DELETE /api/feed/:id` 🔒

Remove post (autor ou admin).

---

### `POST /api/feed/:id/like` 🔒

Curte post.

---

### `DELETE /api/feed/:id/like` 🔒

Remove curtida.

---

### `GET /api/feed/:id/comments` 🌐

Lista comentários do post.

---

### `POST /api/feed/:id/comments` 🔒

**Body:** `{ "conteudo": "texto" }`

---

### `DELETE /api/feed/:id/comments` 🔒

**Body:** `{ "comment_id": "uuid" }` — autor do comentário ou admin.

---

## 7. Notificações e Push

### `GET /api/notifications` 🔒

Lista notificações do usuário (últimas 50) + contagem `unread`.

**Query:** `?count=true` → retorna só `{ "count": 3 }` (badge do app).

---

### `PUT /api/notifications` 🔒

Marca como lida.

**Body:** `{ "id": "uuid" }` ou `{ "all": true }`

---

### `PUT /api/notifications/read-all` 🔒

Marca todas como lidas (atalho).

---

### `POST /api/push/expo` 🔒

Registra token Expo Push do app mobile.

**Body:** `{ "token": "ExponentPushToken[...]" }`

---

### `POST /api/push/subscribe` 🔒 (cookie web)

Registra subscription Web Push (site PWA).

---

### `DELETE /api/push/subscribe` 🔒 (cookie web)

Remove subscription Web Push.

---

## 8. Visitantes e Mensagens

### `GET /api/visitantes` 🌐

Lista visitantes com `responsavel_nome`.

---

### `POST /api/visitantes` 🌐

Cadastra visitante.

**Body:**
```json
{
  "nome": "obrigatório",
  "celular": "obrigatório",
  "sexo": "M|F",
  "cidade": "string",
  "cidade_outra": "string",
  "bairro": "string",
  "faixa_etaria": "string",
  "civil_status": "string",
  "membro_igreja": false,
  "quer_visita": false,
  "sem_whatsapp": false,
  "responsavel_id": "uuid"
}
```

---

### `GET /api/visitantes/:id` 🌐

Detalhe de um visitante.

---

### `PUT /api/visitantes/:id` 🌐

Atualiza visitante (mesmos campos do POST + `user_id` para vincular responsável).

---

### `DELETE /api/visitantes/:id` 🌐

Remove visitante.

---

### `GET /api/visitantes/mensagens-status` 🌐

Status agregado de mensagens por visitante (uso admin).

---

### `GET /api/responsaveis` 🌐

Lista membros do ministério Integração (responsáveis por visitantes).

---

### `POST /api/responsaveis` 🌐

**Body:** `{ "nome": "string" }` — tabela legada `responsaveis`.

---

### `DELETE /api/responsaveis/:id` 🌐

Remove responsável legado.

---

### Mensagens WhatsApp (categorias e modelos)

#### `GET /api/mensagens/categorias` 🌐

Categorias com modelos aninhados.

#### `POST /api/mensagens/categorias` 🌐

**Body:** `{ "nome", "dia", "descricao", "ordem" }`

#### `PUT /api/mensagens/categorias/:id` 🌐

**Body:** `{ "nome", "descricao", "ordem", "ativa" }` (parcial)

#### `DELETE /api/mensagens/categorias/:id` 🌐

Remove categoria, modelos e registros de envio.

#### `POST /api/mensagens/modelos` 🌐

**Body:** `{ "categoria_id", "titulo", "corpo" }`

#### `PUT /api/mensagens/modelos/:id` 🌐

**Body:** `{ "titulo", "corpo", "ordem" }`

#### `DELETE /api/mensagens/modelos/:id` 🌐

#### `GET /api/mensagens/enviadas?visitante_id=uuid` 🌐

Histórico de categorias enviadas a um visitante.

#### `POST /api/mensagens/enviadas` 🌐

Registra envio (upsert por visitante + categoria).

**Body:** `{ "visitante_id", "categoria_id" }`

#### `DELETE /api/mensagens/enviadas?visitante_id=uuid&categoria_id=uuid` 🌐

---

### `POST /api/visitor/restricted-action` 🔒

Visitante tentou ação bloqueada — notifica todos os admins.

**Body:** `{ "action": "descrição da ação" }`

---

## 9. Dons Espirituais

### `GET /api/dons-espirituais` 🔒

Resultado do teste do usuário autenticado.

**Resposta:** `{ "results": [...] | null }`

---

### `POST /api/dons-espirituais` 🔒

Submete teste (76 respostas).

**Body:** `{ "answers": [1, 2, 3, ...] }` — array com exatamente 76 itens.

---

### `GET /api/dons-espirituais/admin` 👑

Lista resultados de todos os usuários (painel admin).

---

## 10. Repertório

### `GET /api/repertorio?evento_id=uuid` 🌐

Itens do repertório do evento + flag `canEdit` (se autenticado via cookie).

---

### `POST /api/repertorio` 🔒 (cookie)

Substitui repertório inteiro do evento.

**Body:**
```json
{
  "evento_id": "uuid",
  "items": [
    { "nome": "Amazing Grace", "tonalidade": "G", "link": "https://...", "observacoes": "" }
  ]
}
```

Permissão: admin ou membro do ministério/função configurados no evento.

---

### `DELETE /api/repertorio` 🔒 (cookie)

**Body:** `{ "evento_id": "uuid" }`

---

## 11. Upload e Mídia

### `POST /api/upload` 🔒

Upload de imagem para o feed (Vercel Blob).

**Content-Type:** `multipart/form-data`

**Campo:** `file` (máx. 5 MB)

**Resposta:** `{ "url": "https://..." }`

---

### `GET /api/youtube` 🌐

Últimos 6 vídeos do canal da igreja (RSS, cache 1h).

**Resposta:** `[{ "id", "title", "published", "thumbnail", "url" }]`

---

## 12. Config e Utilitários

### `GET /api/config` 🌐

Configurações chave-valor da igreja (`app_config`).

---

### `PUT /api/config` 👑 (cookie)

**Body:** `{ "chave": "string", "valor": "string" }`

---

### `GET /api/form-ministerios` 🔒 (cookie)

Respostas do formulário de interesse em ministérios.

---

### `POST /api/form-ministerios` 🔒 (cookie)

**Body:** `{ "ministerios": ["uuid", "..."] }`

---

### `GET /api/form-ministerios/admin` 👑

Lista todas as respostas (admin).

---

## Variáveis de ambiente

### Servidor (Vercel)

| Variável | Uso |
|----------|-----|
| `DATABASE_URL` | Conexão Neon PostgreSQL |
| `AUTH_MOBILE_SECRET` | Assinatura JWT do app (recomendado dedicado) |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | NextAuth + fallback JWT |
| `AUTH_GOOGLE_ID` | Google OAuth (web + validação mobile) |
| `APPLE_CLIENT_ID` | Apple Sign In (`com.zenvixlabs.pibrr`) |
| `FIREBASE_PROJECT_ID` | Verificação token Firebase |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Service account Firebase Admin |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (upload) |

### App mobile

| Variável | Uso |
|----------|-----|
| `EXPO_PUBLIC_API_URL` | Base URL desta API |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_*` | OAuth Google nativo |
| `EXPO_PUBLIC_FIREBASE_*` | Firebase Auth (e-mail/senha) |
| `EXPO_PUBLIC_APPLE_BUNDLE_ID` | Apple Sign In |

---

## Notas para o app mobile

### Fluxo recomendado

```
1. Login (Google / Apple / Firebase)
   → POST /api/auth/mobile
2. Salvar token em SecureStore
3. Todas as requisições com Authorization: Bearer <token>
4. Registrar push: POST /api/push/expo
```

### Endpoints mais usados pelo app

| Tela | Endpoints |
|------|-----------|
| Login | `POST /api/auth/mobile` |
| Serviço | `GET /api/escalas/minhas`, `GET /api/escalas?evento_id=` |
| Feed | `GET /api/feed`, likes, comments |
| Perfil | `GET/PUT /api/users/me`, indisponibilidades |
| Admin | `GET /api/users`, escalas, eventos, ministérios |
| Mensagens | `GET /api/users/me/pendencias`, mensagens/* |
| Notificações | `GET /api/notifications?count=true` |

### Rotas sem auth (cuidado)

Várias rotas de leitura e escrita são **públicas** hoje (escalas GET, visitantes, mensagens, ministérios). Isso simplifica o site, mas em um servidor dedicado futuro pode ser desejável restringir mutações.

### Rotas só com cookie NextAuth

Estas **não funcionam** com Bearer JWT puro:

- `GET/POST /api/users/me/ministerios`
- `GET/POST /api/form-ministerios`
- `GET/POST/DELETE /api/repertorio` (parcial — GET funciona sem auth)
- `PUT /api/config`

O app mobile contorna isso usando endpoints alternativos ou dados do JWT. Ao extrair para servidor dedicado, unificar auth em Bearer resolveria isso.

### Migrações SQL

Scripts em `scripts/` — principais para auth mobile:

- `016-apple-id-visitor.sql` — coluna `apple_id`
- `017-firebase-uid.sql` — coluna `firebase_uid`

---

## Diagrama de arquitetura

```
┌──────────────┐   Bearer JWT    ┌─────────────────────────┐
│   pib-app    │ ──────────────► │  Next.js API (Vercel)     │
│   Expo/RN    │   /api/*        │  app/api/**               │
└──────────────┘                 └───────────┬───────────────┘
                                           │
┌──────────────┐   Cookie        │         │ DATABASE_URL
│   Site web   │ ──────────────► │         ▼
│   Next.js    │                 │  ┌──────────────┐
└──────────────┘                 │  │ Neon Postgres │
                                 │  └──────────────┘
                                 │
                                 ├── Vercel Blob (upload)
                                 ├── Expo Push API
                                 ├── Firebase Admin (auth)
                                 └── Google/Apple token verify
```

---

*Documentação gerada a partir do código em `app/api/`. Última revisão: junho/2026.*
