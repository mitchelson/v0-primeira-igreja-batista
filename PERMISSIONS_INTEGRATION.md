# Sistema de Permissões - Integração

Este documento descreve a integração do novo sistema de permissões baseado em roles e contextos.

## 📁 Arquivos Adicionados

### Bibliotecas Core (`/lib`)

1. **`permissions.ts`**
   - Funções para verificar permissões e roles
   - Gerenciamento de contextos (ministérios, eventos, turmas EBD)
   - Funções principais: `hasPermission()`, `hasRole()`, `getAccountPermissions()`

2. **`auth-middleware.ts`**
   - Middleware de autenticação e autorização
   - Funções: `withAuth()`, `withPermission()`, `withRole()`
   - Uso em API routes do Next.js

3. **`account-service.ts`**
   - Camada de serviço com dual-write (compatibilidade)
   - Gerencia accounts, roles e contextos
   - Suporta migração gradual do sistema antigo

4. **`feature-flags.ts`**
   - Sistema de feature flags para controlar rollout
   - Flags principais:
     - `use_new_permissions_read`: Ler do novo sistema
     - `use_new_permissions`: Escrever apenas no novo sistema

### Endpoints API

5. **`/app/api/auth/permissions/route.ts`** (NOVO)
   - Endpoint: `GET /api/auth/permissions`
   - Retorna permissões e roles do usuário autenticado
   - Usado pelo app mobile para verificações client-side

## 🔄 Rotas Atualizadas (Exemplos)

### 1. `/app/api/ministerios/route.ts`

**Antes:**
```typescript
export async function POST(request: NextRequest) {
  const { nome, descricao, cor, icone, ordem } = await request.json()
  if (!nome) return NextResponse.json({ error: "nome obrigatório" }, { status: 400 })
  // ... criava ministério sem verificação de permissão
}
```

**Depois:**
```typescript
export async function POST(request: NextRequest) {
  // 1. Autentica usuário
  const token = authHeader.substring(7);
  const decoded = verify(token, secret) as any;
  const userId = decoded.userId || decoded.id;
  
  // 2. Verifica permissão
  const canCreate = await hasPermission(userId, 'ministerios:create');
  if (!canCreate) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // 3. Cria ministério
  // ...
}
```

### 2. `/app/api/escalas/route.ts`

A rota de escalas já usa `requireMinisterioAccess()` do arquivo `authorization.ts`.

**Próximo passo sugerido:** Atualizar `authorization.ts` para usar o novo sistema:

```typescript
// lib/authorization.ts (atualização sugerida)
import { hasPermission, hasRole } from '@/lib/permissions';

export async function requireMinisterioAccess(
  ministerioId: string,
  request: NextRequest
): Promise<AuthResult> {
  const session = await getSession(request);
  if (!session) {
    return { authorized: false, response: NextResponse.json({ error: "Não autenticado" }, { status: 401 }) };
  }

  // Verifica se é admin (acesso global)
  const isAdmin = await hasRole(session.userId, 'admin');
  if (isAdmin) {
    return { authorized: true, session: toSession(session) };
  }

  // Verifica permissão no contexto do ministério
  const contextResult = await sql`
    SELECT id FROM contexts 
    WHERE context_type = 'ministry' AND context_id = ${ministerioId}::uuid
  `;
  
  if (contextResult.length > 0) {
    const contextId = contextResult[0].id;
    const canManage = await hasPermission(session.userId, 'escalas:create', contextId);
    
    if (canManage) {
      return { authorized: true, session: toSession(session) };
    }
  }

  return { authorized: false, response: NextResponse.json({ error: "Sem permissão" }, { status: 403 }) };
}
```

## 🎯 Permissões Disponíveis

As permissões são organizadas por categoria:

### Ministérios
- `ministerios:create` - Criar ministérios
- `ministerios:update` - Atualizar ministérios
- `ministerios:delete` - Deletar ministérios
- `ministerios:read` - Ver todos os ministérios
- `ministerios:manage_members` - Gerenciar membros

### Escalas
- `escalas:create` - Criar escalas (globalmente)
- `escalas:update` - Atualizar escalas
- `escalas:delete` - Deletar escalas
- `escalas:read` - Ver todas as escalas
- `escalas:read_ministry` - Ver escalas de um ministério específico (com contexto)

### Eventos
- `eventos:create` - Criar eventos
- `eventos:update` - Atualizar eventos
- `eventos:delete` - Deletar eventos
- `eventos:read` - Ver eventos

### Membros
- `membros:create` - Adicionar membros
- `membros:update` - Atualizar informações de membros
- `membros:delete` - Remover membros
- `membros:read` - Ver lista de membros

### Feed
- `feed:create` - Criar posts no feed
- `feed:update` - Atualizar posts
- `feed:delete` - Deletar posts
- `feed:moderate` - Moderar feed

## 🔐 Roles Disponíveis

1. **admin** - Administrador (acesso total)
2. **supervisor** - Supervisor (gerencia múltiplos ministérios)
3. **lider** - Líder de ministério (gerencia seu ministério)
4. **membro** - Membro ativo da igreja
5. **congregado** - Congregado (frequenta mas não é membro)
6. **visitante** - Visitante (acesso limitado)
7. **professor_ebd** - Professor de EBD
8. **aluno_ebd** - Aluno de EBD

## 📋 Checklist de Migração

### Fase 1: Preparação (Concluída ✅)
- [x] Arquivos de biblioteca copiados
- [x] Endpoint `/api/auth/permissions` criado
- [x] Exemplo de rota atualizada (`/api/ministerios`)

### Fase 2: Banco de Dados (Pendente ⏳)
- [ ] Executar migrations no Neon Console
- [ ] Criar tabelas: accounts, roles, permissions, contexts
- [ ] Executar migration de dados (users → accounts)
- [ ] Criar contextos para ministérios existentes
- [ ] Atribuir roles aos usuários

### Fase 3: Atualizar Rotas (Pendente ⏳)
- [ ] Atualizar `lib/authorization.ts` para usar novo sistema
- [ ] Atualizar rotas de escalas
- [ ] Atualizar rotas de eventos
- [ ] Atualizar rotas de membros
- [ ] Atualizar rotas de feed

### Fase 4: Feature Flags (Pendente ⏳)
- [ ] Adicionar variáveis de ambiente no Vercel:
  - `FEATURE_FLAG_USE_NEW_PERMISSIONS_READ=false`
  - `FEATURE_FLAG_USE_NEW_PERMISSIONS=false`
- [ ] Testar dual-write
- [ ] Ativar flags gradualmente

### Fase 5: App Mobile (Pendente ⏳)
- [ ] Fazer deploy do backend
- [ ] Atualizar app mobile para usar `/api/auth/permissions`
- [ ] Testar fluxos completos
- [ ] Deploy do app

## 🚀 Deploy

```bash
# 1. Fazer commit das mudanças
git add .
git commit -m "feat: integrate permissions system"
git push origin feat/permissions-system-integration

# 2. Criar Pull Request no GitHub
# 3. Após review, fazer merge para main
# 4. Deploy automático via Vercel

# 5. Após deploy, adicionar variáveis de ambiente
vercel env add FEATURE_FLAG_USE_NEW_PERMISSIONS_READ
# Valor: false (inicialmente)

vercel env add FEATURE_FLAG_USE_NEW_PERMISSIONS
# Valor: false (inicialmente)
```

## 📚 Documentação de Referência

Para mais detalhes sobre a arquitetura e implementação completa:

- **MIGRATION_GUIDE.md** - Guia completo de migração (no repositório do app mobile)
- **IMPLEMENTATION_GUIDE.md** - Guia técnico detalhado
- **REFACTORING_PROPOSAL.md** - Proposta de arquitetura

## 🆘 Suporte

Em caso de problemas:

1. Verificar logs no Vercel: `vercel logs --prod --follow`
2. Testar endpoint de permissões: `GET /api/auth/permissions`
3. Verificar se as tabelas do banco de dados foram criadas
4. Consultar a documentação de referência

## ⚠️ Observações Importantes

1. **Não execute as migrations ainda!** As migrations devem ser executadas manualmente no Neon Console.
2. **Não ative as feature flags ainda!** Elas devem ser ativadas apenas após validar que tudo está funcionando.
3. **Não faça deploy para produção ainda!** Este branch deve ser testado em ambiente de desenvolvimento primeiro.
4. **Mantenha o sistema antigo funcionando!** O dual-write garante que o sistema antigo continue funcionando enquanto o novo é testado.

## 🎉 Próximos Passos

1. **Review do código** - Revisar as mudanças neste branch
2. **Executar migrations** - Criar tabelas e migrar dados no banco
3. **Testar localmente** - Validar que tudo funciona
4. **Deploy gradual** - Ativar feature flags progressivamente
5. **Monitorar** - Acompanhar logs e métricas após deploy
