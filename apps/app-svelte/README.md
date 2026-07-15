# app-svelte — App de testing Svelte para Shibui UI

App Svelte que consume `@shibui-ui/ui` y ofrece un panel admin con kitchen-sink para validar visualmente los 77 componentes bajo los 6 contextos Katachi en un entorno Svelte 5 + runes.

---

## Stack

- **Svelte 5** — runes (`$state`, `$derived`, `$effect`, `$props`, `$bindable`), Snippets para slots
- **TypeScript estricto**
- **Vite** — bundler y dev server
- **Router hash custom** — `src/lib/router.ts` (~30 LOC, sin dependencias externas)

No usa SvelteKit ni `svelte-spa-router`. El router custom hash-based sirve las rutas públicas (Hero/Home, About, Philosophy, Componentes, ComponenteDetail, Tokens) más el área admin (Login, Kitchen), y evita una dependencia más.

---

## Estructura

```
src/
  App.svelte                → Host del router + listener Ctrl+Shift+A → /#/admin/login
                              (registra @shibui-ui/ui con import dinámico en onMount)
  main.ts                   → Bootstrap: solo import '@shibui-ui/ui/tokens' (estático, evita FOUC)
  app.css                   → Estilos globales
  shibui-elements.d.ts      → Augment de svelte/elements para tipar lib-*
  lib/
    router.ts               → Mini hash-router: writable<string> + navigate()
    auth.ts                 → Store sessionStorage-based: isAuthenticated, login, logout
    Header.svelte           → Header compartido (rutas públicas)
    Counter.svelte          → Demo component (legacy)
  routes/
    Hero.svelte             → Home pública (/, /home)
    About.svelte            → /#/about
    Philosophy.svelte       → /#/philosophy
    Componentes.svelte      → /#/componentes
    ComponenteDetail.svelte → /#/componentes/:slug (detalle)
    Tokens.svelte           → /#/tokens
    Login.svelte            → /#/admin/login (password 'shibui-dev')
    Kitchen.svelte          → /#/admin/kitchen-sink (container del kitchen)
    kitchen/
      KatachiSwitcher.svelte → Segmented sticky con 7 opciones (none + 6 katachi)
      KitchenItem.svelte    → Wrapper de cada componente
      StatusBadge.svelte    → Chip 🟢 semantic · 🔵 marker · ⚪ effect
      AtomsSink.svelte      → 43 átomos
      MoleculesSink.svelte  → 18 moléculas
      OrganismsSink.svelte  → 16 organismos
      catalog.ts            → Coverage por slug (fuente: packages/shibui-ui/src/styles/effects-x-surfaces.md)
```

---

## Routing

Hash-based, gestionado en `App.svelte`:

| Ruta | Acceso |
|---|---|
| `/#/`, `/#/home` | Público — `Hero.svelte` |
| `/#/about` | Público — `About.svelte` |
| `/#/philosophy` | Público — `Philosophy.svelte` |
| `/#/componentes` | Público — `Componentes.svelte` |
| `/#/componentes/:slug` | Público — `ComponenteDetail.svelte` |
| `/#/tokens` | Público — `Tokens.svelte` |
| `/#/admin/login` | Público — `Login.svelte` |
| `/#/admin/kitchen-sink` | Protegido (gated por `isAuthenticated` store) — `Kitchen.svelte` |

`Ctrl+Shift+A` desde cualquier vista → navega a `/#/admin/login`.

**Router API** (`lib/router.ts`):

```typescript
import { route, navigate } from './lib/router';

// route es un Readable<string> con el path actual ('/admin/login', etc.)
// navigate(path) actualiza window.location.hash
```

---

## Auth

Store sessionStorage-based, mismo contrato que React/Angular:

```typescript
import { writable } from 'svelte/store';

const initial = sessionStorage.getItem('admin_auth') === 'true';
export const isAuthenticated = writable(initial);

export const login = (password: string): boolean => {
  if (password === 'shibui-dev') {
    sessionStorage.setItem('admin_auth', 'true');
    isAuthenticated.set(true);
    return true;
  }
  return false;
};

export const logout = (): void => { /* ... */ };
```

El guard se aplica inline en `App.svelte`:

```svelte
{#if path === '/admin/kitchen-sink' && $isAuthenticated}
  <Kitchen />
{:else if path === '/admin/kitchen-sink'}
  <!-- redirige a /#/admin/login -->
{/if}
```

---

## Integración con Shibui UI

```typescript
// main.ts — solo tokens de forma estática (evita FOUC)
import '@shibui-ui/ui/tokens';   // carga tokens.css estáticamente
```

```typescript
// App.svelte — registro de los custom elements con import dinámico en onMount
onMount(async () => {
  await import('@shibui-ui/ui'); // registra todos los lib-*
});
```

```typescript
// shibui-elements.d.ts — augment de svelte/elements
declare module 'svelte/elements' {
  export interface SvelteHTMLElements {
    [key: `lib-${string}`]: HTMLAttributes<HTMLElement> & {
      [propName: string]: unknown;
    };
  }
}
```

---

## Kitchen Sink (`/#/admin/kitchen-sink`)

Página dev para inspeccionar las 77 piezas bajo los 6 contextos Katachi en vivo.

**Patrón switcher Svelte 5 runes:**

```svelte
<script lang="ts">
  import type { KatachiId } from '@shibui-ui/ui';
  import KatachiSwitcher from './kitchen/KatachiSwitcher.svelte';

  let katachi = $state<KatachiId | ''>('');
</script>

<KatachiSwitcher bind:value={katachi} />
<div data-katachi={katachi || null}>
  <AtomsSink />
  <MoleculesSink />
  <OrganismsSink />
</div>
```

Cambiar el switcher actualiza `data-katachi` en el contenedor → todos los `lib-*` re-pintan en vivo. Verifica que la propagación Katachi funciona a través de Vite + Svelte sin tooling extra.

---

## Convenciones

- **Runes obligatorios** — nada de `let`/`export let` legacy. Usar `$state`, `$derived`, `$effect`, `$props`, `$bindable`
- **Slots vía Snippets** — `Snippet` de `svelte` (no `<slot>` legacy)
- **Stores tradicionales** para estado compartido entre rutas (`writable`, `readable`) — runes son sólo intra-componente
- **No SvelteKit** — esta app es deliberadamente SPA pura sin SSR

---

## Scripts

```bash
pnpm start:svelte           # Dev server (desde raíz del monorepo)

# Desde apps/app-svelte:
pnpm dev                    # Dev server
pnpm build                  # Build de producción
pnpm check                  # svelte-check (type-check + a11y)
```

---

## Variables de entorno

Sin variables de entorno configuradas de momento. Usar `.env.local` con prefijo `VITE_` cuando sea necesario.
