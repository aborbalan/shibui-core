# Cockpit Open Cells — HANDOFF

> Estado vivo del proyecto. Una sesión nueva retoma leyendo, en orden:
> **(1)** el plan `~/.claude/plans/melodic-mapping-knuth.md` → **(2)** este fichero →
> **(3)** la memoria `project_opencells.md`. No hace falta el historial del chat.

Último hito cerrado: **Parte A (plomería)** · Fecha: 2026-06-28
Rama: `feature/app-opencells` (desde `develop`) · Estado dev: pendiente de 1er `pnpm install`

---

## Hecho hasta aquí
- Workspace `apps/app-opencells/` creado: `package.json` (deps `@open-cells/core@^1.1.2`,
  `@open-cells/page-controller@^1.0.4`, `@open-cells/element-controller@^1.0.4`, `lit@^3`,
  `@shibui-ui/ui: workspace:*`), `vite.config.ts`, `tsconfig.json` (decoradores Lit),
  `index.html` (`<app-index id="app-content">`), `src/styles.css`, `src/vite-env.d.ts`.
- `src/main.ts` = STUB con la plomería de shibui ya hecha + TODOs del Hito 1.
- `src/router/routes.ts` = STUB con array `routes` vacío + guía.
- Datos: `src/data/trust-report.ts` (tipos) + `src/data/trust-report.fixture.json` (6 comp.).
- Cableado monorepo: scripts raíz `start:opencells`/`build:opencells`; `firebase.json`
  (target `opencells` + CORS en `hanko-report`); `.firebaserc` (`opencells`); CI
  `orchestrator.yml` + `ci-apps.yml` (filtro/output/job `build-opencells` + deploy).

## Decisiones tomadas
- Tema visual: `data-katachi="terminal"` (estética sala de control). Cambiable en `index.html`.
- Boot Open Cells: `startApp({ routes, mainNode: 'app-content' })`; páginas con lazy import.
- El usuario escribe el código Open Cells; Claude solo la plomería y la tutoría/review.
- Datos: fixture en dev, `hanko-report.web.app/trust-report.json` en prod (CORS ya abierto).

## Cómo arrancar esta sesión (entorno)
- **El usuario trabaja `feature/app-opencells` desde el REPO PRINCIPAL.** El worktree de Claude
  está **detached** (no retiene la rama) para no bloquear el checkout. Una sola rama de verdad;
  la continuidad va por plan + este HANDOFF + memoria, no por el worktree.
- `pnpm install` y `pnpm start:opencells` desde el **REPO PRINCIPAL** (en worktree Windows
  `pnpm install` cuelga). En worktree, node_modules vía junctions desde el repo principal.
- Antes de arrancar: `pnpm build:shibui` (los tipos de `@shibui/ui` salen de su `dist`).
- Datos dev: `src/data/trust-report.fixture.json`.

## SIGUIENTE: Hito 1 — Bootstrap (`startApp`, una ruta, un page controller)
**Concepto a explicar**: cómo arranca Open Cells (`startApp` + `mainNode`); qué es una ruta
(`{path,name,component,action}` con import dinámico); qué es un *page controller* (custom
element LitElement con `PageController` y hooks `onPageEnter`/`onPageLeave`).

**Ejercicio (lo escribe el usuario)**:
1. `src/main.ts`: importar `startApp` + `routes` y llamar
   `startApp({ routes, mainNode: 'app-content' })`.
2. `src/router/routes.ts`: ruta `/` → `home-page` con
   `action: async () => { await import('../pages/home/home-page.js'); }`.
3. `src/pages/home/home-page.ts`: `@customElement('home-page')` extendiendo `LitElement`,
   `pageController = new PageController(this)`, `render()` con `<h1>` + `<lib-button tone="accent">`.

**Criterios de aceptación**: `pnpm start:opencells` muestra la home con el botón shibui
estilado bajo `data-katachi="terminal"`; consola sin warning de doble registro de Lit.

**Post LinkedIn (lo redacta el usuario, Claude revisa)** → `docs/linkedin/hito-1.md`:
"Por qué arranco una serie aprendiendo Open Cells" + el `startApp` mínimo que ya consume un
web component de mi propia librería sin wrapper.

## Pendientes / deuda / dudas abiertas
- 1er `pnpm install` regenera el lockfile con los `@open-cells/*` (lo corre el usuario).
- Verificar tras instalar que hay **un solo Lit** en el árbol (no duplicado).

## Posts LinkedIn
- H1: pendiente → `docs/linkedin/hito-1.md`
