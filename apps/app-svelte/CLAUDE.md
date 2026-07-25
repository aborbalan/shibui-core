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
    lib-props.ts           → Action `libProps` para props complejas de lib-*
    Header.svelte          → Header sabi compartido (rutas públicas)
    Footer.svelte          → Footer sabi compacto, fijo abajo
    Counter.svelte         → (legacy, no usado en producción)
    api/
      client.ts            → `apiGet` (desempaqueta el ApiEnvelope)
      components.ts        → Catálogo, detalle y ejemplos
      tokens.ts            → Design tokens + `groupByCategory`
  routes/
    Hero.svelte            → Landing de 12 bloques (paridad con app-react)
    About.svelte
    Philosophy.svelte
    Componentes.svelte
    ComponenteDetail.svelte
    Tokens.svelte          → Layout sidebar + 9 secciones
    Login.svelte           → Login admin (password 'shibui-dev', sessionStorage)
    Kitchen.svelte         → Container del kitchen-sink con switcher Katachi
    componentes/
      ComponentCard.svelte     → lib-card + badge de estado + preview
      ComponentPreview.svelte  → Marco de 120px o placeholder
      AtomPreviews.svelte      → 41 previews (exporta ATOM_PREVIEW_TAGS)
      MoleculePreviews.svelte  → 22 previews
      OrganismPreviews.svelte  → 24 previews
      ComponentApi.svelte      → Tablas props/slots/events
      ComponentExamples.svelte → Segmented de framework + code blocks
    tokens/
      TokensSidebar.svelte     → Nav sticky con IntersectionObserver
      TokenSection.svelte · TokenRow.svelte · SubHeader.svelte · DataStatus.svelte
      ColorsSection.svelte · TypographySection.svelte · SpacingSection.svelte
      RadiusSection.svelte · ShadowsSection.svelte · AnimationSection.svelte
      ZIndexSection.svelte · GlassSection.svelte · SpotlightSection.svelte
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

## Katachi — la app es `sabi`

Cada showcase del ecosistema lleva su propio katachi: **react = celadon**,
**angular = shizen**, **svelte = sabi** (寂び — papel washi envejecido, tinta y
sombra brutal de 4px; sin glass y sin spotlight).

- El contexto se declara una sola vez: `<html data-katachi="sabi">` en `index.html`.
- Los estilos de la app **no** usan la paleta cruda (`--color-kaki-500`,
  `--color-washi-950`): usan los tokens semánticos (`--text-accent`,
  `--bg-surface`, `--border-subtle`…) para que el katachi los resuelva.
- La firma sabi se pide con `box-shadow: var(--lib-effect-brutal-shadow, none)`,
  que solo tiene valor bajo `sabi` y degrada a `none` en el resto.
- `lib-header` y `lib-footer` van con `theme="sabi"`; el fondo del layout es
  `<lib-background theme="horizon">` (el gradiente afín a sabi — los temas de
  `lib-background` no reaccionan solos al katachi).
- **Las «seis pieles» de la home son contextos `data-katachi`, no variantes de
  card.** `LibCardVariant` hoy solo admite `solid | featured`; envolver cada
  `lib-card` en un `<div data-katachi="…">` es la única forma real de mostrar
  las seis expresiones del sistema.

---

## Props complejas en custom elements

Los atributos HTML solo transportan strings y Svelte pinta atributo —no
propiedad— mientras el elemento no esté actualizado (`@shibui-ui/ui` se importa
de forma dinámica en `onMount`). Para arrays, objetos, números y booleanos en
`false` hay que usar la action `libProps`:

```svelte
<lib-data-table use:libProps={{ columns, data }}></lib-data-table>
<lib-bar-chart use:libProps={{ series, categories, showLegend: false }}></lib-bar-chart>
```

Las cadenas y los booleanos en `true` sí funcionan como atributo normal.

---

## Previews del catálogo

Cada card del catálogo monta una mini-preview en vivo del componente. El
registro son tres componentes con cadena `{#if}` que exportan su lista de tags
desde `<script module>`. **Solo se montan los tags registrados**: los
componentes data-driven de `@shibui-ui/ui` revientan si se montan sin datos
válidos, así que los que no tienen preview caen a un placeholder de la misma
altura.

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
| `/componentes/:slug` | Público | `ComponenteDetail` |
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
  await import('@shibui-ui/ui');
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

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | Base URL de la API (`https://shibui-core.onrender.com` en `.env.production`) |

El catálogo (`/componentes`) y los tokens (`/tokens`) se sirven desde esa API;
sin la variable, el dev server cae a `localhost:3000` y hace falta
`pnpm start:api`. Los tokens CSS sí se cargan automáticamente desde
`node_modules/@shibui-ui/ui/dist/` vía Vite (a diferencia de Angular, que
requiere configuración explícita en `angular.json`).
