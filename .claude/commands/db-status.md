---
description: Verificar estado atual das migrações e schema do banco
---

## Migrações Existentes

!`ls -la scripts/*.sql 2>/dev/null`

## Última Migração

!`cat scripts/$(ls scripts/*.sql | sort | tail -1) 2>/dev/null`

Liste todas as migrações em ordem e identifique:
1. Qual é a próxima numeração disponível
2. Se há migrações pendentes de execução
3. Resumo do schema atual baseado nas migrações
