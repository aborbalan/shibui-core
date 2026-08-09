# app-opencells — Contexto operativo para Claude

> Este fichero se auto-carga cuando se trabaja en `apps/app-opencells/`. Es la
> **puerta de entrada** para cualquier sesión nueva. Léelo entero antes de actuar.

## Qué es esto

Un **proyecto guiado para aprender Open Cells** (framework SPA de BBVA: `startApp` +
routing + page controllers + **channels** pub/sub RxJS), construido como producto real:
un **cockpit** que agrega la salud del monorepo shibui leyendo el `trust-report.json` de
**hanko** (`https://hanko-report.web.app/trust-report.json`). Es consumidor **nativo** de
`@shibui-ui/ui` (Lit, sin wrapper).

## Modo de trabajo — NO romperlo

- **Claude = tutor por hitos.** En cada hito: explico el concepto → propongo el ejercicio
  con criterios de aceptación → **el usuario escribe el código** → reviso y corrijo.
- **Claude NO escribe el código Open Cells de la app.** El usuario escribe `startApp`,
  rutas, page controllers, channels y los widgets con `@shibui-ui/ui`. Claude solo hace
  **plomería** (workspace, build, CI, deploy, fixtures, tipos/tooling) y **review**.
- **Learning in public:** cada hito cierra con un **post de LinkedIn** que redacta el
  **usuario** (Claude lo revisa) en `docs/linkedin/hito-N.md`.

## Al empezar una sesión — leer en este orden

1. **`docs/HANDOFF.md`** — estado vivo: qué está hecho, decisiones, y el **siguiente
   ejercicio** ya detallado. Es la fuente de verdad de "dónde estamos".
2. **`docs/CURRICULUM.md`** — el plan completo de los 6 hitos y el protocolo de continuidad.
3. Memoria del proyecto: `project_opencells.md`.

## Reglas duras

- **No adelantes el código del usuario.** Si el siguiente paso es escribir Open Cells,
  explica y espera; no lo implementes tú.
- **Cierre de hito = 3 pasos:** revisar código → revisar post → reescribir `HANDOFF.md`
  (con el siguiente ejercicio) y actualizar la memoria. No empieces un hito sin cerrar el
  handoff del anterior.
- **GitFlow absoluto:** ramas desde `develop`, merge `--no-ff`, `main` solo vía PR.
- **Entorno Windows:** `pnpm install` / `pnpm start:opencells` desde el **repo principal**
  (en worktree cuelga). Antes de arrancar: `pnpm build:shibui`.

## Gotcha conocido

`@open-cells/core` publica su API de runtime **sin tipos** (`startApp`, `publish`, … no
tienen `.d.ts`). Workaround: `src/open-cells.d.ts` (ambient `declare module`). Ver
`docs/CURRICULUM.md` §Gotchas. (Issue upstream: pendiente de abrir.)
