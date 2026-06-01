---
paths:
  - "app/**/*.tsx"
  - "components/**/*.tsx"
---

# Regras de UI/Componentes

- Usar componentes de `@/components/ui/` (shadcn/ui)
- Ícones: lucide-react
- Toasts: `import { toast } from "sonner"`
- Formulários: react-hook-form + zod
- Data fetching client: SWR com `useSWR`
- Loading states: Skeleton ou Spinner
- Responsivo: mobile-first com classes Tailwind
- Dark mode: usar variáveis CSS do tema, não cores hardcoded
