---
name: new-feature
description: Workflow completo para implementar nova funcionalidade
disable-model-invocation: true
---
# Implementar Nova Feature

Implementar: $ARGUMENTS

1. Analisar requisitos e definir escopo
2. Verificar se precisa de migração SQL → criar em `scripts/`
3. Criar API route em `app/api/` se necessário
4. Criar/atualizar página (admin ou minha-area)
5. Criar componentes reutilizáveis se necessário
6. Atualizar sidebar/navegação se for nova seção
7. Verificar middleware para proteção de rotas
8. Rodar `npm run build` para validar
9. Testar fluxo completo
