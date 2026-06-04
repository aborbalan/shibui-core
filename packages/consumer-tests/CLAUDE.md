# Consumer Contract Tests (`@shibui/consumer-tests`)

> Tests de contrato de integración — verifican que `@shibui-ui/ui` funciona
> correctamente cuando es consumido desde React 19, Svelte 5 y Angular 21.

---

## Qué prueban

No prueban el comportamiento interno de los componentes (eso es responsabilidad
de los Story Tests en `packages/shibui-ui`). Prueban el **contrato visible desde
fuera**: que los Web Components se registran, reciben propiedades, emiten eventos,
proyectan slots y propagan tokens CSS al ser usados desde un framework real.

Cinco ejes por cada framework:

| Eje | Qué se verifica |
|---|---|
| **Registro** | `customElements.get('lib-button')` !== undefined tras el import |
| **Props** | Atributos booleanos y string enums llegan al elemento Lit |
| **Eventos** | Custom events (`ui-lib-modal-close`) alcanzan listeners del framework |
| **Slots** | `assignedNodes()` en Shadow DOM contiene el contenido proyectado |
| **Katachi** | `--katachi-id` se hereda vía CSS custom properties a través del Shadow DOM |

---

## Estructura

```
consumer-tests/
  fixtures/
    react/        → App React 19 mínima (Vite, esbuild JSX, puerto 5174)
    svelte/       → App Svelte 5 mínima (Vite build+preview, puerto 5175)
  tests/
    react.spec.ts    → 11 tests
    svelte.spec.ts   → 11 tests
    angular.spec.ts  → 13 tests  ← fixture en packages/consumer-tests-angular/
  shared/
    contract.ts   → URLs base de fixtures + helpers
  playwright.config.ts
```

El fixture Angular vive en un workspace separado (`packages/consumer-tests-angular/`)
porque Angular CLI no puede estar dentro de un paquete que no controla.

---

## Fixtures: decisiones técnicas importantes

### React (dev server)
- **Sin `@vitejs/plugin-react`** — el plugin genera wrappers HMR que interfieren
  con el sistema de módulos de Vite al cargar `@shibui-ui/ui` (preserveModules).
  Se usa el transform JSX nativo de esbuild, equivalente sin overhead de HMR.
- **`optimizeDeps.exclude: ['@shibui-ui/ui']`** — evita que esbuild pre-bundle un
  paquete con preserveModules y muchos chunks pequeños.
- **`transformIndexHtml`** — inyecta `dist/tokens.css` como `<style>` inline en
  `head-prepend`. Un `import '@shibui-ui/ui/tokens'` en main.tsx no es suficiente:
  Vite lo extrae como `<link>` cuya aplicación al CSSOM puede llegar tarde.

### Svelte (build + preview)
- **`vite build && vite preview`** en lugar de dev server — `@sveltejs/vite-plugin-svelte`
  v6 usa el Environment API de Vite 6 y deshabilita el optimizador legacy. Sin
  pre-bundling, los 200+ archivos de `@shibui-ui/ui` + `lit` generan 500+ peticiones
  HTTP → timeout de 30s en Playwright. Con `vite build`, Rollup bundlea todo en un
  único chunk JS.
- **`transformIndexHtml`** — misma razón que React: tokens CSS inline en el HTML
  generado para garantizar disponibilidad síncrona en el CSSOM.

### Angular (ng serve)
- Levantado desde `packages/consumer-tests-angular/` vía
  `pnpm --filter @shibui/consumer-tests-angular run serve`.
- `CUSTOM_ELEMENTS_SCHEMA` habilitado en el módulo para evitar errores de template.
- Timeout de 120s — Angular CLI tarda ~15-20s en compilar en frío.
- **Zoneless (sin zone.js)** — el fixture no incluye zone.js (ni en deps ni en
  polyfills) y todo su estado es `signal()`; arranca con
  `provideZonelessChangeDetection()` explícito. El change detection lo disparan
  signals + event bindings, sin monkey-patching. Esto **verifica que la librería
  funciona en Angular zoneless** — `@shibui-ui/ui` son web components (Lit),
  agnósticos a la estrategia de CD.
- **Carrera del listener (flaky resuelto)** — el listener de `ui-lib-modal-close`
  se monta en `ngAfterViewInit`. El `beforeEach` espera la señal explícita
  `window.__modalListenerReady__` (que el fixture expone al montarlo) en vez de
  asumir que ya está; sin eso, pulsar Escape antes de tiempo causaba timeout
  intermitente de 30s. El evento del modal es síncrono — el fallo era la carrera,
  no lentitud.

---

## Cuándo se ejecutan en CI

Los consumer tests son los más lentos del pipeline (~2min). Para no penalizar
cada commit de desarrollo, se ejecutan solo cuando se cumplen **dos condiciones**:

### 1. Qué cambió (`ui_behavior`)

Solo corren si hay cambios en ficheros que afectan el contrato observable:

| Ruta | Por qué importa |
|---|---|
| `packages/shibui-ui/src/**/*.ts` | Cambia el comportamiento del componente |
| `packages/shibui-ui/src/styles/shared/tokens/_katachi.css` | Afecta el eje katachi |
| `packages/shibui-ui/src/styles/shared/tokens/_semantic.css` | Afecta el eje katachi |
| `packages/consumer-tests/**` | Cambian los propios tests o fixtures |
| `packages/consumer-tests-angular/**` | Ídem para el fixture Angular |

**CSS scoped a Shadow DOM (`src/components/**/*.css`) queda excluido** — los
consumer tests no prueban estilos internos de componentes.

### 2. En qué contexto

| Contexto | ¿Corren? |
|---|---|
| Push a `feature/**` o `fix/**` | ❌ No |
| Push a `develop` o `main` | ✅ Sí |
| Pull Request hacia `develop` o `main` | ✅ Sí |
| `workflow_dispatch` (trigger manual) | ✅ Sí |

Ambas condiciones deben cumplirse simultáneamente.

---

## Ejecución local

```bash
# Prerequisito: build de la librería
pnpm build:shibui

# Suite completa
pnpm --filter @shibui/consumer-tests test

# Por framework
pnpm --filter @shibui/consumer-tests test:react
pnpm --filter @shibui/consumer-tests test:svelte
pnpm --filter @shibui/consumer-tests test:angular

# Con UI de Playwright
pnpm --filter @shibui/consumer-tests test:ui
```

---

## Añadir tests nuevos

Los tests prueban el **contrato de integración** — no reemplazar los Story Tests.
Antes de añadir un test aquí, asegurarse de que:

1. El comportamiento NO está ya cubierto por los Story Tests en `shibui-ui`.
2. El comportamiento depende de la interacción framework ↔ Web Component
   (cómo pasa props, cómo escucha eventos, cómo proyecta slots).
3. El test existe para los tres frameworks (React, Svelte, Angular) o hay una
   razón documentada para que solo aplique a uno.

Si se añade un nuevo componente core a los fixtures, actualizar también:
- `fixtures/react/src/App.tsx`
- `fixtures/svelte/src/App.svelte`
- `packages/consumer-tests-angular/src/app/app.component.html`
