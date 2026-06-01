---
description: Verificar se o projeto está pronto para deploy
---

## Verificações Pré-Deploy

!`npm run build 2>&1 | tail -20`

!`npm run lint 2>&1 | tail -20`

Analise os resultados acima e reporte:
1. Erros de build (se houver)
2. Warnings de lint relevantes
3. Se está tudo OK para deploy na Vercel
