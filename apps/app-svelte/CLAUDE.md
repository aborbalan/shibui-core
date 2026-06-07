# app-svelte — App Svelte consumidora de Shibui UI

App Svelte 5 que actúa como consumidora real de `@shibui-ui/ui` y ofrece un kitchen-sink para validar los 77 componentes bajo los 6 contextos Katachi.

---

## Stack

- **Svelte 5** — runes (`$derived`, `$effect`), stores de Svelte para estado global
- **Vite** — bundler y dev server
- **Router hash-based propio** — `src/lib/router.ts`, sin SvelteKit ni ninguna librería de routing externa
- **svelte-check** — type-checking de templates Svelte

---

## Estructura

```
src/
  App.svelte               → Componente raíz: routing, guard, Ctrl+Shift+A
  main.ts                  → Bootstrap
  shibui-elements.d.ts     → Tipos para lib-* en templates Svelte
  lib/
    router.ts              → Store `route` + función `navigate()`
    auth.ts                → Store `isAuthenticated` + login/logout
    Header.svelte          → Header compartido (rutas públicas)
    Counter.svelte         → (legacy, no usado en producción)
  routes/
    Hero.svelte
    About.svelte
    Philosophy.svelte
    Componentes.svelte
    Tokens.svelte
    Login.svelte           → Login admin (password 'shibui-dev', sessionStorage)
    Kitchen.svelte         → Container del kitchen-sink con switcher Katachi
    kitchen/
      KatachiSwitcher.svelte
      KitchenItem.svelte
      StatusBadge.svelte
      catalog.ts           → Coverage por slug
      AtomsSink.svelte
      MoleculesSink.svelte
      OrganismsSink.svelte
```

---

## Router

Hash-based, sin dependencias. Estado en `src/lib/router.ts`:

```typescript
import { route, navigate } from './lib/router';

// Leer ruta actual (store Svelte)
let path = $derived($route);  // e.g. "/about", "/admin/kitchen-sink"

// Navegar
navigate('/about');
navigate('/admin/login');
```

- Escucha `hashchange` en `window`
- `navigate(path)` escribe `window.location.hash` con el prefijo `#` automático
- Las rutas NO tienen el `#` en el valor del store — el store ya lo normaliza

---

## Routing

| Ruta | Acceso | Componente |
|---|---|---|
| `/`, `/home` | Público | `Hero` |
| `/about` | Público | `About` |
| `/philosophy` | Público | `Philosophy` |
| `/componentes` | Público | `Componentes` |
| `/tokens` | Público | `Tokens` |
| `/admin/login` | Público | `Login` |
| `/admin/kitchen-sink` | Protegido | `Kitchen` |

El guard está inline en `App.svelte` vía `$effect`:

```svelte
$effect(() => {
  if (path === '/admin/kitchen-sink' && !authed) navigate('/admin/login');
  if (path === '/admin') navigate('/admin/kitchen-sink');
});
```

`Ctrl+Shift+A` → navega a `/admin/login` (via `<svelte:window onkeydown={...}>`).

---

## Auth

Patrón sessionStorage-based, idéntico al de React y Angular:

```typescript
// src/lib/auth.ts
export const isAuthenticated = writable<boolean>(initial);
export function login(password: string): boolean { /* compara con 'shibui-dev' */ }
export function logout(): void { /* limpia sessionStorage */ }
```

- **Contraseña:** `'shibui-dev'` (hardcoded, protección local)
- Estado inicial leído desde `sessionStorage` para sobrevivir recargas

---

## Integración con Shibui UI

```typescript
// App.svelte — import dinámico en onMount para evitar problemas con SSR/Vite
onMount(async () => {
  await import('@shibui/ui');
});
```

```typescript
// shibui-elements.d.ts — tipado para lib-* en templates Svelte
declare global {
  namespace svelteHTML {
    interface IntrinsicElements {
      [elemName: `lib-${string}`]: HTMLAttributes<HTMLElement> & {
        [propName: string]: any;
      };
    }
  }
}
```

Usar siempre la declaración comodín — no añadir tipos específicos por elemento.

---

## Kitchen Sink (`/admin/kitchen-sink`)

Página dev para inspeccionar las 77 piezas bajo los 6 contextos Katachi en vivo.

El switcher actualiza un store local → `Kitchen.svelte` pasa el valor como atributo `data-katachi` al contenedor → todos los `lib-*` re-pintan en vivo. Verificación de propagación de custom properties a través de Shadow DOM en Svelte.

---

## Scripts

```bash
pnpm start:svelte          # Dev server (desde raíz del monorepo)

# Desde apps/app-svelte:
pnpm dev                   # Dev server (Vite)
pnpm build                 # Build de producción
pnpm preview               # Preview del build
pnpm check                 # svelte-check (type-check de templates)
```

---

## Variables de entorno

Sin variables de entorno configuradas. Los tokens CSS se cargan automáticamente desde `node_modules/@shibui/ui/dist/` vía Vite (a diferencia de Angular, que requiere configuración explícita en `angular.json`).
