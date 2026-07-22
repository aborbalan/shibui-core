# app-cv — Currículum vitae web (Angular + Shibui UI)

> ⚠️ WIP — scaffold inicial. La spec funcional/contenido del CV se definirá aparte.

App Angular que sirve el CV web de Alejandro Borbalán, desplegada en **shibui-cv.web.app**.
Consume `@shibui-ui/ui` como cualquier otra app del ecosistema.

---

## Principios

- **Estático y rápido**: nada de servicios, ni peticiones a backend. Todo el contenido es
  estático (datos en TS/constantes) para que cargue al instante.
- **Legibilidad ante todo**: el contenido del CV debe leerse con comodidad.
- **Vitrina de diseño**: foco principal en la capacidad de diseñar — estética cuidada,
  uso expresivo del sistema Katachi y los componentes Shibui. Es un escaparate.
- **Katachi inicial**: `shizen` (en `index.html` → `data-katachi`).
- No sobre-arquitecturar: sin guards, stores ni servicios salvo necesidad real.

---

## Stack

- **Angular 21** — standalone components, sin NgModules
- **Angular Signals** para estado y comunicación
- **Angular Router** — lazy loading de páginas
- **Vitest** — test runner
- **CUSTOM_ELEMENTS_SCHEMA** — habilitado en componentes que renderizan `lib-*`

Mismo set de convenciones que `apps/app-angular` (ver su CLAUDE.md para detalle de patrones).

---

## Carga de tokens (CRÍTICO)

Angular no auto-bundlea CSS desde `node_modules`. El token CSS se carga explícitamente
en `angular.json` → `project.build.options.styles`:

```jsonc
"styles": [
  "node_modules/@shibui-ui/ui/dist/tokens.css",
  "src/styles.scss"
]
```

Sin esta línea el sistema Katachi no funciona.

---

## Integración con Shibui UI

```typescript
// main.ts — registra todos los custom elements
import '@shibui-ui/ui';
```

Cualquier componente que use `lib-*` necesita `schemas: [CUSTOM_ELEMENTS_SCHEMA]`.

---

## Deploy

Firebase Hosting, target `cv` → site `shibui-cv` (proyecto `lib-ui-b67c5`).

```bash
ng build                                 # genera dist/app-cv/browser
pnpm --filter app-cv deploy              # firebase deploy --only hosting:cv
```

---

## Scripts

```bash
pnpm start:cv     # Dev server (desde raíz del monorepo)

# Desde apps/app-cv:
ng serve          # Dev server
ng build          # Build de producción
ng test           # Tests con Vitest
```

---

## Estructura actual

```
src/
  app/
    app.ts                → Componente raíz (router-outlet)
    app.config.ts         → ApplicationConfig — provideRouter + provideHttpClient
    app.html / app.scss
  routes/
    app.routes.ts         → Rutas raíz: '' (home lazy) y 'sandra' (portfolio lazy)
  data/
    cv.ts                 → Fuente única de verdad: tipos + datos ESTÁTICOS
                            (profile, experience, skills, education). ⚠️ varios
                            campos son placeholder (TODO) — rellenar antes de desplegar.
    katachi.ts            → Datos del switcher de katachi
    portfolio.ts          → Datos del portfolio de Sandra Ortega Arévalo
  state/
    katachi.store.ts      → Señal compartida del katachi activo (module-level, sin DI).
                            App = único escritor de DOM/localStorage; switcher y banda
                            son consumidores. Excepción justificada al «no stores».
  pages/
    home/home.ts          → Smart: inyecta cv.ts, reparte a las secciones por inputs y
                            elige el tema de lib-background según el katachi (KATACHI_BG)
    portfolio/portfolio.ts → Página independiente del portfolio (ruta 'sandra')
  components/             → Secciones dumb (solo input())
    hero/                 → Above the fold: titular en 2 niveles + nombre + tagline + 3 links
    projects/             → Cards de proyectos (lib-card, kanji watermark) — abre tras el hero
    katachi-band/         → Banda «Sistema de diseño»: los 6 katachi como swatches en vivo
    token-specimen/       → Escala tipográfica + paleta leídas del computed style real
    experience/           → lib-timeline (cronológico inverso) + stack en línea mono
    skills/               → Grid Core/Tooling/Familiar con lib-chip
    colophon/             → Banda final compacta: educación + idiomas + ubicación + firma
    section-heading/      → Cabecera reutilizable (lib-eyebrow + h2)
    gallery/ · katachi-switcher/ → Galería del portfolio de Sandra · selector de katachi
  typings.d.ts            → Tipos para imports ?raw, ?inline y *.svg
  styles.scss             → Base global (superficie/texto heredan tokens shizen)
  main.ts                 → Bootstrap + import @shibui-ui/ui
```

Tipografía Shibui (Cormorant Garamond / Shippori Mincho / DM Mono) cargada vía
Google Fonts en `index.html`.

## Datos / contenido

Todo el contenido vive en `src/data/cv.ts`. Para editar el CV se toca solo ese fichero
— las secciones son presentacionales. `skills` ya refleja el brief; `profile`,
`experience` y `education` llevan placeholders marcados con `// TODO`.
