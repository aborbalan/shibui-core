# Cockpit Open Cells — Currículo y modo de trabajo

Plan durable (en repo) del proyecto guiado de aprendizaje. Para el **estado vivo** y el
**siguiente ejercicio concreto**, ver siempre `HANDOFF.md`. Para el contexto operativo de
arranque, `../CLAUDE.md`.

## Modo de trabajo

- **Claude = tutor por hitos**: explica el concepto → propone ejercicio con criterios de
  aceptación → **el usuario escribe el código** → Claude revisa y corrige.
- **Claude hace la plomería** (workspace, vite, tsconfig, CI, Firebase, fixtures, tooling de
  tipos). **No escribe el código Open Cells de la app.**
- **Learning in public**: cada hito → el **usuario** redacta un post narrativo de LinkedIn
  (Claude revisa) en `linkedin/hito-N.md`.

## Currículo (6 hitos)

### H1 — Bootstrap: `startApp`, una ruta, un page controller
- **Concepto**: arranque de Open Cells (`startApp` + `mainNode`); ruta
  `{path,name,component,action}` con import dinámico; page controller (LitElement +
  `PageController`, hooks `onPageEnter`/`onPageLeave`).
- **Ejercicio**: `startApp({ routes, mainNode: 'app-content' })` en `main.ts`; ruta `/` →
  `home-page`; `src/pages/home/home-page.component.ts` con `<h1>` + `<lib-button>`.
  Separación de ficheros como la librería (`.component.ts`/`.html.ts`/`.css`/`.types.ts`).
- **Aceptación**: `pnpm start:opencells` muestra la home con el botón shibui; sin warning de
  doble Lit.

### H2 — Routing multipágina + ciclo de vida
- **Concepto**: rutas múltiples, navegación programática, `onPageEnter`/`onPageLeave`.
- **Ejercicio**: rutas `/hanko` y `/deploys` + nav (`lib-header`/`lib-sidebar`).
- **Aceptación**: cambiar de ruta no recarga; los hooks loguean entrada/salida.

### H3 — Channels (el corazón de Open Cells)
- **Concepto**: pub/sub con channels; publicar/suscribirse; `element-controller`.
- **Ejercicio**: channel `ch-trust-report`; un loader publica el **fixture**; la home se
  suscribe y muestra un KPI (`trusted/total`) con `lib-card` + `lib-badge`.
- **Aceptación**: el dato fluye loader→channel→página sin acoplarlos.

### H4 — Datos reales + visualización con `@shibui/ui`
- **Concepto**: datos async en templates Lit; derivar series; fixture (dev) vs URL live (prod).
- **Ejercicio**: el loader hace `fetch` del `trust-report.json` real; sellados por capa en
  `lib-bar-chart` + `lib-gauge` de % cobertura; loading/error con `lib-spinner`.
- **Aceptación**: parsea el report real (~102 comp.) sin error CORS; charts coherentes.

### H5 — Página hanko (tabla + drill-down) y deploys
- **Concepto**: componer datos en `lib-data-table`; agrupar `findings[]` por prefijo de capa.
- **Ejercicio**: `/hanko` = tabla con 4 badges de capa + fila expandible de findings;
  `/deploys` = `lib-card` por target Firebase con link + ping.
- **Aceptación**: tabla completa; drill-down correcto por capa.

### H6 — Cierre: deploy real (GitFlow)
- **Ejercicio**: merge a `develop` (`--no-ff`), PR a `main`.
- **Aceptación**: sitio vivo en `shibui-showcase-opencells.web.app`.

*(Diferido/opcional): `/ci` con runs de GitHub Actions — según repo público/privado.)*

## Protocolo de continuidad (a prueba de pérdida de contexto)

Una sesión nueva retoma leyendo, EN ORDEN:
1. `../CLAUDE.md` (contexto operativo, se auto-carga).
2. `HANDOFF.md` (estado vivo + siguiente ejercicio detallado).
3. Memoria `project_opencells.md`.

**Cierre de cada hito = 3 pasos**: (1) revisar código, (2) revisar post LinkedIn,
(3) reescribir `HANDOFF.md` (con el siguiente ejercicio) + actualizar la memoria. Regla:
no empezar un hito sin cerrar el handoff del anterior.

## Gotchas

- **`@open-cells/core` sin tipos de runtime.** `startApp`/`publish`/`subscribe`/`navigate`
  no traen `.d.ts` (campo `types` con glob inválido). Workaround: `src/open-cells.d.ts`
  (ambient `declare module` con las firmas, tomadas de `types/bridge.ts`). Issue upstream:
  pendiente de abrir; al abrirlo, enlazarlo en un comentario del `.d.ts`.
- **Un solo Lit.** `@open-cells/core` no depende de Lit → la app trae Lit ^3 (peer de
  `@shibui/ui`). Verificar que no hay doble Lit tras instalar.
- **Imports sin extensión** (proyecto Vite + `moduleResolution: bundler`, como la librería):
  `import('../pages/home/home-page.component')`, no `.js` ni `.ts`.
- **Entorno Windows**: instalar/arrancar desde el **repo principal**; `pnpm build:shibui`
  antes de `pnpm start:opencells`.
