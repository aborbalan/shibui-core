# api-contract — Contrato OpenAPI generado

> **⚠️ Estado: WIP — no importar desde las apps todavía.**
>
> Los exports para `react`, `svelte` y `angular` están declarados en `package.json` pero el pipeline de generación aún no produce los hooks completos. Solo `./models` y `./zod` tienen contenido estable. No integrar en apps hasta que el estado WIP se resuelva.

Package que contiene los modelos TypeScript, esquemas Zod y hooks de TanStack Query generados automáticamente a partir del OpenAPI spec de `shibui-api`.

---

## Qué hay dentro

```
packages/api-contract/
  openapi.yaml          → Spec OpenAPI fuente (copia del generado por shibui-api)
  kubb.config.js        → Configuración del generador Kubb
  src/gen/
    models/             → Interfaces TypeScript (Category, Component, User…)
    schemas/            → JSON Schemas (generados por Kubb, no usar directamente)
    zod/                → Validators Zod (categorySchema, componentSchema…)
    react/              → Hooks TanStack Query para React (WIP)
    svelte/             → Hooks TanStack Query para Svelte (WIP)
    angular/            → Wrappers para Angular (WIP)
```

**Todo el contenido de `src/gen/` es código generado. No editar manualmente.** Cualquier cambio manual se sobreescribirá en la próxima regeneración.

---

## Cómo regenerar

Cuando la API cambia, actualizar el spec y regenerar:

```bash
# 1. Copiar el spec actualizado de shibui-api
#    (el spec en vivo está en http://localhost:3000/api/docs o en docs-dist/openapi.json)
cp apps/shibui-api/docs-dist/openapi.json packages/api-contract/openapi.yaml
# (o exportar directamente en YAML si el script lo permite)

# 2. Regenerar desde la carpeta del package
pnpm --filter api-contract exec kubb generate

# Alternativa (desde packages/api-contract):
pnpm dlx @kubb/cli generate
```

Kubb limpia `src/gen/` antes de generar (`output.clean: true`), así que el directorio siempre refleja la última versión del spec.

---

## Generador (Kubb)

La configuración en `kubb.config.js` genera cuatro outputs desde `openapi.yaml`:

| Output | Contenido |
|---|---|
| `src/gen/models/` | Interfaces TypeScript para todos los modelos |
| `src/gen/zod/` | Schemas Zod con validación runtime |
| `src/gen/react/` | Hooks `useQuery`/`useMutation` de TanStack Query para React |
| `src/gen/svelte/` | Ídem para Svelte (usa `framework: 'svelte'`) |
| `src/gen/angular/` | Exports comunes que Angular puede envolver en Signals |

Las dependencias de Kubb están en `optionalDependencies` para no penalizar las apps consumidoras cuando el package llegue a ser estable.

---

## Exports declarados (aún no funcionales en apps)

```json
{
  "./models":  "./src/gen/models/index.ts",
  "./react":   "./src/gen/react/index.ts",
  "./svelte":  "./src/gen/svelte/index.ts",
  "./angular": "./src/gen/angular/index.ts"
}
```

Cuando el package sea consumible, las apps importarán así:

```typescript
import type { Component, Category } from 'api-contract/models';
import { useGetComponents } from 'api-contract/react';
```

Hasta entonces, las apps gestionan sus propios DTOs localmente (p.ej. `apps/app-react/src/data/api/domain/`).
