# app-angular — App de testing Angular para Shibui UI

App Angular que actúa como consumidora real de `@shibui-ui/ui` y ofrece un panel admin con kitchen-sink para validar visualmente los 77 componentes bajo los 6 contextos Katachi.

---

## MCP — `angular-cli`

Angular 21 trae servidor MCP oficial dentro del CLI, declarado en el `.mcp.json` de la raíz.
Consultarlo **antes** de escribir signals, routing, control flow o formularios: la memoria del
modelo va por detrás de la versión que corre aquí.

- `search_documentation` / `get_best_practices` → API real de v21, no patrones de v16
- `list_projects` → lee `angular.json` (este workspace declara un único proyecto, `app-angular`)
- `onpush_zoneless_migration` → analiza y planifica la migración a OnPush; es la herramienta
  para la deuda de zoneless y para la migración pendiente a v22

Las tools que ejecutan cosas (`build`, `test`, `e2e`, `devserver.*`) van detrás del flag `-E`
y están desactivadas a propósito — los builds se lanzan con los scripts de pnpm.

`find_examples` (ejemplos de código) existe en el servidor pero **no se registra**: pide
Node >= 22.16 y el entorno va con 22.13. Para ejemplos, `search_documentation`.

---

## Stack

- **Angular 21** — standalone components, sin NgModules
- **Angular Signals** — `signal()`, `input()`, `output()` para estado y comunicación entre componentes
- **Angular Router** — lazy loading de páginas y rutas hijas, `CanActivateFn` para guards
- **Vitest** — test runner (en lugar de Karma)
- **CUSTOM_ELEMENTS_SCHEMA** — habilitado en componentes que renderizan `lib-*`

---

## Estructura

```
src/
  app/
    app.ts                  → Componente raíz (@HostListener para Ctrl+Shift+A → /admin/login)
    app.config.ts           → ApplicationConfig — provideRouter
    app.html / app.scss
  routes/
    app.routes.ts           → Rutas raíz — MainLayout + ramas public/admin
    public/
      public.routes.ts      → Rutas públicas (hero, login)
    private/
      private.routes.ts     → Rutas admin protegidas (login, kitchen-sink)
  pages/                    → Smart components (orquestadores) — uno por ruta
    public/
      hero/
      auth/login/
    private/
      auth/
        login.ts            → Login admin (password 'shibui-dev', sessionStorage)
      kitchen/
        kitchen.ts          → Container del kitchen-sink con signal<KatachiId | ''>
        catalog.ts          → Coverage por slug
        katachi-switcher.ts → Segmented control sticky con 7 botones (none + 6 katachi)
        status-badge.ts     → Chip 🟢 semantic · 🔵 marker · ⚪ effect
        sections/
          kitchen-item.ts   → Wrapper de cada componente
          atoms-sink.ts     → 43 átomos
          molecules-sink.ts → 18 moléculas
          organisms-sink.ts → 16 organismos
  components/               → Dumb components — solo reciben input(), emiten output()
    hero/
    content-section/
  shared/
    components/             → Header, Footer
    services/               → route-tracker.service.ts
  core/                     → Solo existen auth/ y services/ (el resto es planificado)
    auth/
      auth.service.ts       → Signal-based: isAuthenticated, login, logout (sessionStorage)
      auth.guard.ts         → CanActivateFn que redirige a /admin/login
    services/               → Singletons globales (BackgroundService…)
    # interceptors/ · models/ · constants/ → planificados, aún sin crear
  templates/
    layouts/
      main-layout/          → Layout raíz (contiene router-outlet)
      public-layout.ts      → Wrapper para rutas públicas
      private-layout.ts     → Wrapper para rutas admin
  store/                    → NgRx planificado — sin implementar (no añadir hasta que haya estado complejo real)
  typings.d.ts              → Tipos para imports ?raw, ?inline y *.svg
  styles.scss               → Estilos globales
  main.ts                   → Bootstrap + import @shibui-ui/ui
```

---

## Carga de tokens (CRÍTICO)

A diferencia de React/Svelte (Vite), Angular no auto-bundlea CSS desde `node_modules`. Hay que cargarlo explícitamente en `angular.json`:

```jsonc
// angular.json — project.build.options.styles
"styles": [
  "node_modules/@shibui-ui/ui/dist/tokens.css",
  "src/styles.scss"
]
```

Sin esta línea **el sistema Katachi no funciona** (los componentes no heredan custom properties semánticas).

---

## Routing

| Ruta | Acceso | Layout |
|---|---|---|
| `/` | Público | Hero |
| `/login` | Público | — |
| `/admin/login` | Público | — |
| `/admin/kitchen-sink` | Protegido (`authGuard`) | private-layout |

`Ctrl+Shift+A` desde cualquier página → navega a `/admin/login` (gestionado en `app.ts` vía `@HostListener('document:keydown')`).

---

## Auth

Patrón sessionStorage-based, mismo contrato que React/Svelte:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal(
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === 'true'
  );
  login(password: string): boolean { /* compara contra 'shibui-dev' */ }
  logout(): void { /* limpia signal + sessionStorage */ }
}

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  return router.parseUrl('/admin/login');
};
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
- Centralizar paths en `routes/`, no strings sueltos en componentes

---

## Integración con Shibui UI

```typescript
// main.ts — registra todos los custom elements
import '@shibui-ui/ui';
```

```typescript
// Cualquier componente que use lib-* necesita su propio CUSTOM_ELEMENTS_SCHEMA
@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```

```typescript
// typings.d.ts — soporta imports de Shibui UI con sufijos Vite
declare module '*?raw' { const content: string; export default content; }
declare module '*?inline' { const content: string; export default content; }
declare module '*.svg' { const content: any; export default content; }
```

---

## Kitchen Sink (`/admin/kitchen-sink`)

Página dev para inspeccionar las 77 piezas bajo los 6 contextos Katachi en vivo.

**Patrón switcher Angular:**

```typescript
@Component({
  selector: 'app-kitchen',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <app-katachi-switcher [(value)]="katachi" />
    <div [attr.data-katachi]="katachi() || null">
      <app-atoms-sink />
      <app-molecules-sink />
      <app-organisms-sink />
    </div>
  `
})
export class KitchenPage {
  katachi = signal<KatachiId | ''>('');
}
```

Cambiar el switcher actualiza el atributo `data-katachi` en el contenedor → todos los `lib-*` re-pintan en vivo. Verificación de que `CUSTOM_ELEMENTS_SCHEMA` + Shadow DOM no rompen la propagación de custom properties.

---

## Scripts

```bash
pnpm start:angular          # Dev server (desde raíz del monorepo)

# Desde apps/app-angular:
ng serve                    # Dev server
ng build                    # Build de producción (lazy chunks para login + kitchen)
ng test                     # Tests con Vitest
```

---

## Variables de entorno

Sin variables de entorno configuradas de momento. Usar `environment.ts` de Angular cuando sea necesario.
