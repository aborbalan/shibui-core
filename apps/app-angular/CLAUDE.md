# app-angular — App de testing Angular para Shibui UI

App Angular en fase inicial. Actualmente solo las rutas públicas están activas; las rutas privadas y el store están planificados pero sin implementar.

---

## Stack

- **Angular 21** — standalone components, sin NgModules
- **Angular Signals** — `signal()`, `input()`, `output()` para estado y comunicación entre componentes
- **Angular Router** — lazy loading de páginas y rutas hijas
- **Vitest** — test runner (en lugar de Karma)
- **CUSTOM_ELEMENTS_SCHEMA** — habilitado en el componente raíz para soportar `lib-*`

---

## Estructura

```
src/
  app/
    app.ts                  → Componente raíz (CUSTOM_ELEMENTS_SCHEMA aquí)
    app.config.ts           → ApplicationConfig — provideRouter
    app.html / app.scss
  routes/
    app.routes.ts           → Rutas raíz — MainLayout + Public/Private branches
    public/
      public.routes.ts      → Rutas públicas (hero, login)
    private/
      private.routes.ts     → Rutas privadas — WIP, loadComponents comentados
  pages/                    → Smart components (orquestadores) — uno por ruta
    public/
      hero/
      auth/login/
    private/                → WIP
  components/               → Dumb components — solo reciben input(), emiten output()
    hero/
    content-section/
  shared/
    components/             → Header, Footer
    services/               → route-tracker.service.ts
  core/
    services/               → Singletons globales (BackgroundService…)
    guards/                 → Protección de rutas
    interceptors/           → HTTP interceptors
    models/                 → Interfaces y tipos globales
    constants/
  templates/
    layouts/
      main-layout/          → Layout raíz (contiene router-outlet)
      public-layout.ts      → Wrapper para rutas públicas
      private-layout.ts     → Wrapper para rutas privadas
  store/                    → Estado global (NgRx planificado) — WIP, vacío
  typings.d.ts              → Tipos para imports ?raw, ?inline y *.svg
  styles.scss               → Estilos globales
  main.ts                   → Bootstrap + import @shibui/ui
```

---

## Convenciones Angular

**Componentes:**
- Todos son **standalone** — no usar NgModules
- Dumb components en `components/` — solo `input()` / `output()`, sin servicios inyectados
- Smart components en `pages/` — orquestan servicios y pasan datos a los dumb via inputs

**Estado:**
- Usar **Signals** (`signal`, `computed`, `effect`) — no RxJS para estado local
- RxJS solo para streams de HTTP o eventos del router
- El store NgRx en `store/` es arquitectura planificada — no implementar hasta que haya estado complejo real

**Routing:**
- Siempre lazy: `loadComponent` para páginas, `loadChildren` para grupos de rutas
- No usar strings de ruta sueltos en componentes — centralizarlos en `routes/`

---

## Integración con Shibui UI

```typescript
// main.ts — registra todos los custom elements
import '@shibui/ui';
```

```typescript
// app.ts — CUSTOM_ELEMENTS_SCHEMA habilita lib-* en templates Angular
@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```

```typescript
// typings.d.ts — soporta imports de Shibui UI con sufijos Vite
declare module '*?raw' { const content: string; export default content; }
declare module '*?inline' { const content: string; export default content; }
declare module '*.svg' { const content: any; export default content; }
```

`CUSTOM_ELEMENTS_SCHEMA` solo está declarado en el componente raíz. Si se necesita en un componente standalone hijo, hay que añadirlo en su propio decorador.

---

## Estado actual de las rutas

| Ruta | Estado |
|---|---|
| `/` | Activa — Hero page |
| `/login` | Activa |
| `/dashboard` | WIP — loadComponent comentado |
| `/dashboard/profile` | WIP — loadComponent comentado |

---

## Scripts

```bash
pnpm start:angular          # Dev server (desde raíz del monorepo)

# Desde apps/app-angular:
ng serve                    # Dev server
ng build                    # Build de producción
ng test                     # Tests con Vitest
```

---

## Variables de entorno

Sin variables de entorno configuradas de momento. Usar `environment.ts` de Angular cuando sea necesario.
