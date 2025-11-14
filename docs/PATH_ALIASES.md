# Path Aliases - Guía de Uso

Este proyecto está configurado con alias de rutas para simplificar los imports.

## Alias Disponibles

| Alias | Ruta | Ejemplo de Uso |
|-------|------|----------------|
| `@` | `src/` | `import { supabase } from '@/lib/supabase'` |
| `@components` | `src/components/` | `import { Button } from '@components/ui/Button'` |
| `@pages` | `src/pages/` | `import { Dashboard } from '@pages/Dashboard'` |
| `@hooks` | `src/hooks/` | `import { useAuth } from '@hooks/useAuth'` |
| `@lib` | `src/lib/` | `import { supabase } from '@lib/supabase'` |
| `@types` | `src/types/` | `import type { Manuscript } from '@types'` |
| `@routes` | `src/routes/` | `import { AppRoutes } from '@routes'` |

## Ejemplos de Migración

### Antes (rutas relativas)

```typescript
// Desde src/components/manuscripts/ManuscriptCard.tsx
import type { Manuscript } from "../../types"
import { formatDate } from "../utils/formatters"
import { useManuscripts } from "../../hooks/useManuscripts"
```

### Después (con alias)

```typescript
// Desde src/components/manuscripts/ManuscriptCard.tsx
import type { Manuscript } from "@types"
import { formatDate } from "@components/manuscripts/utils/formatters"
import { useManuscripts } from "@hooks/useManuscripts"
```

## Ventajas

1. **Más legible**: No necesitas contar `../` para navegar
2. **Más mantenible**: Si mueves archivos, los imports siguen funcionando
3. **Autocompletado**: Tu IDE reconocerá los alias automáticamente
4. **Consistente**: Todos los desarrolladores usan las mismas rutas

## Notas

- Los alias funcionan tanto en TypeScript como en tiempo de ejecución (Vite)
- El autocompletado del IDE debería funcionar automáticamente
- Si no funciona el autocompletado, reinicia el servidor de TypeScript en tu IDE
