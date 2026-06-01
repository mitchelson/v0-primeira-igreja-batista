---
name: create-admin-page
description: Criar nova página no painel administrativo
---
# Criar Página Admin

Ao criar uma nova página em `app/admin/`:

1. Criar diretório e `page.tsx`
2. Usar `"use client"` para páginas interativas
3. Estrutura padrão:
```tsx
"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
```
4. Fetch dados via SWR ou useEffect + fetch para `/api/...`
5. Usar componentes shadcn/ui para UI (Dialog, Table, Badge, etc.)
6. Adicionar link na sidebar em `components/admin-sidebar.tsx`
7. Verificar se a rota precisa de proteção extra no `middleware.ts`
