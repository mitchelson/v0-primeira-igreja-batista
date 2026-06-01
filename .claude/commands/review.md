---
description: Revisar diff da branch atual antes de merge
---

## Arquivos Alterados

!`git diff --name-only main..HEAD`

## Diff Completo

!`git diff main..HEAD`

Revise cada arquivo alterado para:
1. Falta de verificação de autenticação em API routes
2. SQL sem parameterização (risco de injection)
3. Dados sensíveis expostos na resposta
4. Tratamento de erros ausente
5. Componentes sem loading/error states
6. Problemas de acessibilidade

Dê feedback específico por arquivo. Separe bloqueadores de melhorias opcionais.
