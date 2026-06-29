# app-opencells — Cockpit del ecosistema

App de **aprendizaje de [Open Cells](https://www.opencells.dev)** (framework SPA de BBVA:
`startApp` + routing + page controllers + **channels** pub/sub) construida como un producto
real: un **cockpit** que agrega la salud del monorepo shibui a partir del Trust Report de
**hanko**.

Es un consumidor **nativo** de `@shibui/ui`: usa los web components (`<lib-button>`, …)
directamente, sin wrapper, porque Open Cells y la librería son ambos Lit.

## Cómo se trabaja aquí

Proyecto guiado por hitos (ver el `HANDOFF.md` para el estado vivo y el siguiente ejercicio).
La **plomería** (workspace, build, deploy, fixtures) está hecha; el **código Open Cells**
(rutas, páginas, channels) se escribe hito a hito.

```bash
# desde la raíz del monorepo (repo principal en Windows)
pnpm install
pnpm build:shibui      # @shibui/ui necesita su dist para los tipos
pnpm start:opencells   # dev server (Vite)
```

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | Monta `<app-index id="app-content">` (nodo del router) |
| `src/main.ts` | Plomería: registra `@shibui/ui` + tokens. **El Hito 1 empieza aquí.** |
| `src/router/routes.ts` | Mapa de rutas de Open Cells |
| `src/pages/` | Páginas (page controllers LitElement) |
| `src/data/` | Tipos + fixture del Trust Report |
| `docs/HANDOFF.md` | Estado vivo del proyecto (se actualiza cada hito) |
| `docs/linkedin/` | Posts de la serie "aprendiendo Open Cells" |

## Datos

- **Dev**: fixture local `src/data/trust-report.fixture.json`.
- **Prod**: `https://hanko-report.web.app/trust-report.json` (Trust Report real).
