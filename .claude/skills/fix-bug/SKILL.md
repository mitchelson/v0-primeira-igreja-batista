---
name: fix-bug
description: Workflow para investigar e corrigir bugs no sistema
disable-model-invocation: true
---
# Corrigir Bug

Investigar e corrigir o bug: $ARGUMENTS

1. Entender o problema descrito
2. Identificar os arquivos relevantes (API route, page, component)
3. Verificar o fluxo de dados: page → API → banco
4. Implementar a correção
5. Verificar se não quebra outras funcionalidades
6. Rodar `npm run build` para garantir que compila
7. Testar manualmente se possível
