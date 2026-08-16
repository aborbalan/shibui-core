# Shibui UI (`@shibui-ui/ui`) — Librería de componentes Lit

## Visión general

Shibui (渋い) es una librería de **Web Components agnóstica** construida con Lit y TypeScript estricto, publicada como paquete npm.

Estado actual: **99 componentes** (47 átomos + 20 moléculas + 32 organismos) con **sistema Katachi (形)** completo — 6 contextos estéticos (`wabi`, `kintsugi`, `sabi`, `terminal`, `shizen`, `celadon`) que reescriben tokens semánticos en cascada vía atributo `data-katachi`.

El design system se basa en **CSS custom properties (tokens)** organizados en capas: primitivos → compuestos → semánticos → Katachi (overrides contextuales). Incluye efectos visuales opcionales: glassmorphism ("Efecto Agua") y spotlight reactivo al cursor ("Kintsugi Digital").

---

## Stack técnico

- **Lit** — Web Components nativos, Shadow DOM
- **TypeScript estricto** — `exactOptionalPropertyTypes`, tipado explícito en todos los métodos
- **Vite** — bundler y dev server (HMR)
- **Storybook** — documentación y desarrollo aislado de componentes
- **CSS puro** — sin Tailwind, todo mediante CSS custom properties con `@layer tokens, reset, components`
- **Iconografía** — Phosphor Icons abstraídos en `lib-icon`
- **Testing** — Playwright (E2E + component testing + visual regression)

---

## Estructura interna

```
packages/shibui-ui/
  eslint.config.js        → Config plana de ESLint 9 (va en la raíz del paquete, no en .config/:
                            en config plana los `ignores` se resuelven contra la carpeta del fichero)
  .config/                → Configuración local del paquete
    .prettierrc.json
    .stylelintrc.json
    lighthouserc.cjs
  .storybook/             → Configuración visual de Storybook
  .lighthouseci/          → Configuración de Lighthouse CI
  models/                 → Tipos COMPARTIDOS entre componentes (ojo: en raíz del paquete, NO src/models)
    ui/                   → Tokens de interfaz (LibVariant, LibSize...)
    storybook/            → Interfaces auxiliares para stories
    (se importan con ruta relativa desde src, p.ej. `../../../../models/ui/...`)
  architecture/           → Modelos base de componentes (lib-list.model.ts)
  docs/                   → Documentación extendida (componentes, core, tokens, props)
  scripts/                → Scripts del paquete
  tests/                  → Suite Playwright (E2E + visual regression)
  _katachi-legacy/        → ⚠️ Código legacy NO referenciado por src — no usar como ejemplo
  src/
    components/
      atoms/              → 47 átomos (lib-button, lib-icon, lib-canvas, lib-label, lib-badge, lib-avatar…)
      molecules/          → 20 moléculas (lib-input, lib-select, lib-tabs, lib-modal, lib-alert…)
      organisms/          → 32 organismos (lib-accordion, lib-carousel, lib-data-table, lib-sidebar…)
    styles/
      shared/
        tokens.css        → Entry point legacy de tokens (--lib-*)
        glass.css         → Mixin glassmorphism
        tokens/
          _palette.css    → Paleta primitiva OKLCH
          _semantic.css   → Tokens semánticos por defecto (--bg-base, --text-primary…)
          _katachi.css    → 6 contextos: [data-katachi="wabi|kintsugi|sabi|terminal|shizen|celadon"]
          _spacing.css    → Escala 4pt
          _typography.css → Escala tipográfica + familias
          _motion.css     → Easings y durations
          _state.css      → Hover/focus/disabled
          _effects.css    → Glass + spotlight + Kintsugi border
          TOKENS.md       → Documentación de la jerarquía
        index.css         → Re-exportaciones de estilos compartidos
      KATACHI.md          → Filosofía + cuándo usar cada katachi
      Katachi.mdx         → Foundation story para Storybook
      effects-x-surfaces.md → Fuente de verdad: coverage por componente (semantic | marker | effect)
      index.css           → Entry point de estilos
  vite.config.ts          → Bundler
  tsconfig.json           → TypeScript del paquete
```

### Scripts (desde la raíz del monorepo)

```bash
pnpm storybook       # Arranca Storybook
pnpm build:shibui    # Build de @shibui-ui/ui
pnpm type-check      # tsc --noEmit
pnpm lint            # ESLint
```

---

## Estructura de cada componente

Cada componente vive en su carpeta `lib-[nombre]/` (salvo dos legacy, `lib-counter` y
`lib-alert`, la carpeta usa nombre desnudo: `button/`, `input/`…) con estos ficheros:

```
[nombre]/
  lib-[nombre].component.ts  → LitElement, @customElement, @property, render()  (SIEMPRE)
  lib-[nombre].html.ts       → Template function separada (TemplateResult)
  lib-[nombre].css           → Estilos scoped con @layer
  lib-[nombre].stories.ts    → Historia de Storybook
  lib-[nombre].types.ts      → Tipos LOCALES del componente (solo si los tiene; ~60% los tiene)
```

> NO hay `index.ts` por componente — el barrel es a nivel de capa
> (`src/components/{atoms,molecules,organisms}/index.ts`). Los tipos compartidos
> entre varios componentes van en `models/` (raíz del paquete), no en el `.types.ts` local.

Los tokens compartidos se importan como:
```typescript
import sharedTokens from '../../../styles/shared/tokens.css?inline';
```

Y se aplican en el componente con:
```typescript
static override styles = [
  css`${unsafeCSS(sharedTokens)}`,
  css`${unsafeCSS(componentCss)}`,
];
```

### Registro del componente (obligatorio)

Al crear un componente nuevo, añadirlo al barrel de su **capa** (no al `src/index.ts`,
que solo re-exporta las capas enteras):

```typescript
// src/components/[atoms|molecules|organisms]/index.ts
export * from './[nombre]/lib-[nombre].component';
```

---

## Convenciones de código

**Estructura:**
- Los templates van en ficheros `.html.ts` separados, nunca inline en el componente
- Los tipos COMPARTIDOS entre componentes se importan desde `models/` (raíz del paquete, vía ruta relativa `../../../../models/...`). Los tipos LOCALES de un componente van en su `lib-[nombre].types.ts`. Nunca se definen inline en el `.component.ts`

**TypeScript:**
- Retornos explícitos obligatorios en todos los métodos (`: TemplateResult`, `: void`)
- Uso de `override` en todos los métodos de Lit
- Nunca se usa `any` salvo en los casos documentados en `vite.config.ts`
- Importar modelos externos sobre tipado inline siempre

**CSS:**
- Se usa `@layer tokens, reset, components` dentro de los componentes Lit
- El orden de capas es crítico — los tokens deben declararse antes de usarse
- Los tokens `--lib-*` se usan para todos los valores visuales, nunca se hardcodean colores ni espaciados
- Los componentes con efectos glass requieren: `overflow: hidden` + `backdrop-filter` + `::before` con `--lib-glass-shine` + `z-index` en el contenido
- **CSS nesting nativo**: usar `&` para agrupar `:hover`, `::after`, `::before`, `@media`, `:active` dentro del bloque de variante `:host([attr]) .clase`. Los compound `:host([attrA][attrB])` se mantienen planos. Ver convenciones completas en [`docs/styles/css-nesting.md`](./docs/styles/css-nesting.md)
- **Efectos katachi**: siempre declarados en el componente pero silenciados por default. Los pseudo-elementos leen `--lib-effect-*` vía `var()` y se activan solo cuando el katachi ancestro los enciende (`animation-play-state: var(--lib-effect-seam-play, paused)`; `opacity: var(--lib-effect-seam-opacity, 0)`). Patrón de referencia: `lib-card.styles.css`, `lib-badge.css`, `lib-chip.css`
- **Tokens de token**: los ficheros `_*.css` usan únicamente `:root { }` — NUNCA `:host, :root { }`. El selector `:host` en un `adoptedStyleSheet` bloquea la herencia desde `[data-katachi]` al fijar valores directamente en el shadow host
- **SVG color vía `currentColor`**: los SVG inline usan `stroke="currentColor"` y `fill="currentColor"`, nunca colores hardcodeados. El CSS del host controla el `color` (con variantes de `tone` / `dark`) y el SVG hereda automáticamente en todos los katachis. Referencia: `lib-spinner.html.ts`
- **Gradientes dinámicos con opacidad contextual**: para gradientes que necesitan variar la opacidad sobre un color de contexto, declarar una custom property interna en `:host` (p.ej. `--_sp-color: var(--text-primary, fallback)`) y usarla con `color-mix()` en el gradiente: `color-mix(in oklch, var(--_sp-color), transparent 35%)`. Esto evita oklch hardcodeados que no se adaptan al katachi. Referencia: `.sp-sumi` en `lib-spinner.css`

**Eventos:**
- Siguen el patrón `ui-lib-[acción]` con `bubbles: true, composed: true`
- Los IDs de accesibilidad se generan con `generateUniqueId()` del core

**Composición:**
- Uso intensivo de `slots` (prefix, suffix) para componentes flexibles
- Las props booleanas usan `reflect: true`

**Configuraciones críticas:**
- `vite.config.ts`: Definir config en constante externa con tipo `UserConfig & { test?: any }` y aserción `as any` en `terserOptions.compress` para evitar colisiones de tipos
- `tsconfig.json`: Mantener `rootDir: "./"` para validar ficheros fuera de `src`

---

## Sistema de tokens

Dos familias de tokens, ambas en `tokens.css` dentro de `:host`:

**Tokens de guía de estilos (prefijo `--`):**
Paleta washi, kaki, celadón. Escala tipográfica, espaciado 4pt, sombras, radios, motion.

**Tokens de librería (prefijo `--lib-`):**
- Paleta zen OKLCH: `--lib-shibui-kaki`, `--lib-shibui-water`, `--lib-shibui-paper`, `--lib-shibui-ink`
- Espaciado: `--lib-space-xs/sm/md/lg/xl` (base 4px)
- Glass primitivos: `--lib-glass-blur-amount`, `--lib-glass-bg-opacity`, intensidades low/md/high
- Glass compuestos: `--lib-glass-bg`, `--lib-glass-filter`, `--lib-glass-shine`, `--lib-glass-border`
- Spotlight: `--lib-spotlight-x/y` (actualizados vía JS en mousemove), `--lib-spotlight-gradient` y variantes water/white
- Kintsugi border: `--lib-kintsugi-border` (gradiente diagonal, técnica mask-composite)

---

## Sistema Katachi (形) — identidades selladas

Seis identidades visuales selladas. Los efectos se activan **automáticamente** por contexto
(`data-katachi="x"` en cualquier ancestro) sin necesidad de props adicionales en los componentes.

| ID | Familia | Concepto | Efecto signature |
|---|---|---|---|
| `shizen` | light | Natural, base, zero-point | ninguno |
| `celadon` | dark | Jade hondo, cerámica oscura, alternativa cool oscura | glaze cerámico sutil |
| `sabi` | light | Papel envejecido, handcraft | brutal offset shadow |
| `kintsugi` | dark | Reparado con oro (único dark-first) | seam dorada animada + anillo |
| `wabi` | dark | Kuroi · oscuridad pura, el anti-kintsugi | ninguno (silencio) |
| `terminal` | dark | CRT retro, phosphor verde | scanlines + glitch-drift |

**Mecanismo**: los tokens `--lib-effect-*` en `_effects.css` tienen defaults apagados en `:root`.
Cada bloque `[data-katachi="x"]` en `_katachi.css` activa los que le corresponden.
Las CSS custom properties atraviesan Shadow DOM por herencia — solo funciona si los ficheros
de tokens NO usan `:host, :root { }` (solo `:root { }`).

**Wrapper DX**: `<lib-canvas katachi="kintsugi">…</lib-canvas>` aplica el atributo con tipado TS.

### Mapa de renombrado semántico (Phase 3 — completado)

Los valores de props que nombraban paletas han sido migrados a roles semánticos:

| Nombre de paleta (obsoleto) | Rol semántico (actual) | Aplica a |
|---|---|---|
| `kaki` | `accent` | `color`, `tone`, `variant` props |
| `celadon` | `info` | `color`, `tone`, `variant` props |
| `washi` | `neutral` | `color`, `surface` props |
| `ink` | `filled` | `mode` (cursor-follower, burger-button) |
| `dark` | `strong` | `variant` (badge, kbd) |

**Excepciones — NO renombrar:**

| Qué | Por qué |
|---|---|
| CSS custom properties `--color-kaki-*`, `--color-celadon-*`, `--color-washi-*` | Primitivos de paleta; solo los consume CSS, nunca son props de componente |
| Selectores de contexto `[data-katachi="celadon"]`, `[data-katachi="kintsugi"]`, … | Identificadores de identidad sellada, no valores de prop |
| `variant="celadon"` / `"sabi"` / `"shizen"` en `lib-header` / `lib-footer` | Art-direction — controlan la plantilla de layout, no el color |
| `texture="washi"` / `"celadon-wash"` / `"kintsugi"` en `lib-background` | Identificadores de recurso gráfico, no roles semánticos |

**Taxonomía de cobertura** (en `styles/effects-x-surfaces.md`):
- 🟢 **semantic** — consume tokens semánticos, cambia visualmente con cada katachi
- 🔵 **marker** — neutral estructural; hereda pero no necesita override explícito
- ⚪ **effect** — efectos puros (parallax, cursor-follower), agnósticos

---

## Integración por framework (contrato de consumo)

Para garantizar IntelliSense correcto en las apps consumidoras:

- **React** — Extensión del namespace `JSX` en `custom-elements.d.ts`. Es obligatorio importar `React` en el archivo para que el aumento de módulo sea efectivo.
- **Svelte** — `shibui-elements.d.ts` extendiendo `svelte/elements` para mapear atributos y eventos personalizados.
- **Angular** — Habilitación de `CUSTOM_ELEMENTS_SCHEMA` en el módulo. `typings.d.ts` para soportar imports con sufijos `?raw` (iconos), `?inline` (CSS) y `.svg`. **Agnóstico al change detection**: funciona igual con **zone.js o zoneless** (`provideZonelessChangeDetection()` + signals) — son web components (Lit), no dependen de la estrategia de CD de Angular. El consumer-test de Angular corre zoneless precisamente para verificarlo.

---

## Testing y calidad

- **Playwright** — E2E, component testing y **visual regression** (baselines snapshots por componente × katachi)
- **Lighthouse CI** — requiere build previo de Storybook (`storybook-static`). Config en `.config/lighthouserc.cjs`
- Ningún código entra en `main` sin pasar Lighthouse y linter en CI
- Cambios en `_katachi.css` o tokens semánticos detonan diffs visuales en CI — actualizar baselines deliberadamente

---

## Storybook

### Configuración base

- `.storybook/preview.ts` inyecta los tokens globales
- Mapeo de componentes mediante **Args** para pruebas de estado dinámicas (variant, size, disabled)
- Fondo de las stories configurado con gradiente oscuro para que los efectos glass sean visibles

---

### Taxonomía macro — tres nodos raíz

El sidebar de Storybook se organiza en tres nodos de primer nivel que reflejan en qué plataforma(s) aplica cada componente. El `title` de cada story file sigue el patrón `<Plataforma>/<Categoría>/<Componente>`.

#### `Universal/` — componentes compartidos por web y escritorio

| Categoría | Ejemplos |
|---|---|
| `Foundations/` | Color Palette, Typography, Spacing, Katachi · System |
| `Actions/` | Button, Button Liquid, Burger, Close Button, Copy Button, Magnetic, Chip |
| `Content/` | Card, Avatar, Badge, Icon, Code Block, Quote, Text List, Timeline… |
| `Forms/` | Input, Select, Checkbox, Radio, Switch, Rating, Color Picker, File Uploader… |
| `Feedback/` | Spinner, Skeleton, Toast Manager, Progress, Status Dot, Alert, Empty State… |
| `Navigation/` | Sidebar, Tabs, Breadcrumb, Dropdown, Stepper, Pagination… |
| `Layout/` | Accordion, Bento Grid, Aspect Ratio, Header, Footer… |
| `Data/` | Counter, Data Table |
| `Charts/` | Bar Chart, Scatter Chart, Scatter Chart 3D |
| `Overlay/` | Dialog, Drawer, Modal, Tooltip |
| `Utilities/` | Background, Canvas, Visually Hidden |

#### `Web/` — comportamiento exclusivo de browser

| Categoría | Componentes |
|---|---|
| `Motion/` | Carousel, Cursor Follower, Horizontal Scroll Section, Parallax Container, Parallax Text Stack, Ripple, Stagger |

Estos componentes dependen de APIs de browser (IntersectionObserver, scroll-linked animations, cursor tracking) que no tienen sentido en un gadget de escritorio nativo.

#### `Desktop/` — exclusivos de la app Tauri

| Categoría | Componentes |
|---|---|
| `Layout/` | Gadget Frame |
| `Editor/` | Editor Toolbar, Text Editor |
| `Data/` | Metric Bar |

---

### Estructura canónica de cada story file

Todos los archivos `lib-[nombre].stories.ts` siguen **obligatoriamente** este orden de cuatro secciones:

```
/* ── 1. Playground ──────────────────────────────────────── */
// Siempre primero. Todos los props controlables via args/controls.
// Defaults sensatos. Sin render() propio — usa el render del meta.
export const Playground: Story = { args: { … } };

/* ── 2. API stories ──────────────────────────────────────── */
// Una story por dimensión de la API del componente:
//   Variants   — grid de todas las variantes semánticas
//   Sizes      — si el componente tiene prop size
//   States     — disabled, error, loading, indeterminate…
//   Composition — uso de slots, composición con otros componentes
//   [Efecto]   — GlassEffect, SpotlightEffect, etc. si aplica
// Usar tokens para todos los valores en inline styles:
//   gap/padding → var(--lib-space-xs/sm/md/lg/xl)
//   colores     → var(--text-primary), var(--bg-elevated), etc.
export const Variants: Story = { render: () => html`…` };
export const Sizes:    Story = { render: () => html`…` };
// …

/* ── 3. Katachi · 形 ──────────────────────────────────────── */
// Las 6 stories estándar generadas con el helper.
// El renderContent DEBE mostrar el espectro completo del componente:
// todos los variants principales + tamaños + estados relevantes.
// No mostrar solo una instancia mínima — estas stories son el
// baseline de regresión visual para los 6 contextos estéticos.
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

const _katachi = createKatachiStories<MyArgs>(() => html`
  // ← contenido completo: todos los variants, no solo el default
`);
export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ── 4. Tests ────────────────────────────────────────────── */
// Nombre: 'Test · [qué se verifica]'
// Siempre con tags: ['test'] y play: async function.
export const TestAlgo: Story = {
  name: 'Test · descripción de lo que se verifica',
  tags: ['test'],
  play: async ({ canvasElement }): Promise<void> => { … },
};
```

#### Reglas de naming en stories

- El `export const` es la fuente de verdad del nombre visible — Storybook lo convierte automáticamente (`AllVariants` → "All Variants"). Añadir `name:` solo cuando el nombre legible DIFIERE del que generaría el export (e.g., `name: 'Glass — Efecto Agua'` en `export const GlassEffect`).
- No usar puntos finales en los nombres (`'All Variants.'` → `'All Variants'`).
- Los Tests usan siempre el prefijo `Test ·` en el `name:`.

#### Espaciado en inline styles de stories

Usar siempre tokens en lugar de valores px:

| Valor | Token |
|---|---|
| 4px | `var(--lib-space-xs)` |
| 8px | `var(--lib-space-sm)` |
| 16px | `var(--lib-space-md)` |
| 24px | `var(--lib-space-lg)` |
| 32px | `var(--lib-space-xl)` |

---

## Instrucciones para Claude

- Cuando se pida un componente nuevo, seguir siempre la estructura de 5 ficheros
- Pedir el fichero del componente antes de proponer cambios sobre uno existente
- Usar los tokens `--lib-*` para todos los valores visuales, nunca hardcodear colores ni espaciados
- Proponer siempre la Storybook story junto al componente siguiendo la estructura canónica de cuatro secciones (Playground → API → Katachi → Tests)
- Asignar el `title` correcto según la plataforma: `Universal/<Cat>/<Nombre>`, `Web/Motion/<Nombre>` o `Desktop/<Cat>/<Nombre>`
- El katachi `renderContent` debe mostrar el espectro completo del componente (todos los variants + tamaños + estados), no una instancia mínima
- Los efectos glass y spotlight son opcionales — no añadirlos salvo que se pida explícitamente
- Tipos compartidos desde `models/` (raíz del paquete); tipos locales en el `.types.ts` del componente; nunca inline en el `.component.ts`
- **Katachi-aware**: si un componente nuevo es `semantic`, consumir tokens semánticos (`--bg-elevated`, `--text-primary`…) en vez de la paleta primitiva. Los efectos de katachi se activan automáticamente via `--lib-effect-*` — no hace falta leer `--katachi-id`
- **Sin variantes palette-named**: los componentes no tienen `variant="kintsugi"`, `variant="glitch"`, `color="celadon"`, `color="kaki"`, etc. Solo roles semánticos (`default`, `inverse`, `accent`, `info`, `neutral`, `filled`, `strong`…). Mapa de equivalencias: `kaki`→`accent`, `celadon`→`info`, `washi`→`neutral`, `ink`→`filled`, `dark`→`strong`. Si te piden añadir una variante con nombre de paleta o katachi, proponer el equivalente semántico. **Excepciones intocables**: CSS custom properties `--color-kaki-*`/`--color-celadon-*`, selectores `[data-katachi="*"]`, variantes art-direction en header/footer (`celadon`/`sabi`/`shizen`), texturas de `lib-background`
- **Efectos katachi en componentes nuevos**: declarar los pseudo-elementos siempre, controlados por `--lib-effect-*` (ver patrón en `lib-card.css`, `lib-badge.css`, `lib-chip.css`). No activar efectos por ID de katachi. Para SVG internos usar `stroke="currentColor"` — nunca colores hardcodeados. Para gradientes con opacidad, usar `color-mix(in oklch, var(--_prop-interna), transparent N%)` en lugar de oklch con alpha hardcodeado
- **Selectors de token files**: solo `:root { }`, nunca `:host, :root { }` — rompe la herencia de custom properties a través de Shadow DOM
- Si añades un componente nuevo, actualizar también los `catalog.ts` de los kitchen-sinks (React/Angular/Svelte) con su slug + coverage, y `styles/effects-x-surfaces.md` con la coverage real
- Si hay duda sobre convenciones, preguntar antes de asumir
