# Shibui UI (`@shibui/ui`) — Librería de componentes Lit

## Visión general

Shibui (渋い) es una librería de **Web Components agnóstica** construida con Lit y TypeScript estricto, publicada como paquete npm.

Estado actual: **77 componentes** (43 átomos + 18 moléculas + 16 organismos) con **sistema Katachi (形)** completo — 6 contextos estéticos (`wabi`, `kintsugi`, `sabi`, `terminal`, `shizen`, `celadon`) que reescriben tokens semánticos en cascada vía atributo `data-katachi`.

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
  .config/                → Configuración local del paquete
    .eslintignore
    .eslintrc.json
    .prettierrc.json
    .stylelintrc.json
    commitlint.config.cjs
    lighthouserc.cjs
  .storybook/             → Configuración visual de Storybook
  .lighthouseci/          → Configuración de Lighthouse CI
  models/                 → Única fuente de verdad para tipos compartidos
    ui/                   → Tokens de interfaz (LibVariant, LibSize...)
    storybook/            → Interfaces auxiliares para stories
  src/
    components/
      atoms/              → 43 átomos (lib-button, lib-icon, lib-canvas, lib-label, lib-badge, lib-avatar…)
      molecules/          → 18 moléculas (lib-input, lib-select, lib-tabs, lib-modal, lib-alert…)
      organisms/          → 16 organismos (lib-accordion, lib-carousel, lib-data-table, lib-sidebar…)
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
pnpm build:shibui    # Build de @shibui/ui
pnpm type-check      # tsc --noEmit
pnpm lint            # ESLint
```

---

## Estructura de cada componente

Cada componente sigue **obligatoriamente** esta estructura de 5 ficheros:

```
lib-[nombre]/
  index.ts                   → Re-exportaciones (barrel export)
  lib-[nombre].component.ts  → LitElement, @customElement, @property, render()
  lib-[nombre].html.ts       → Template function separada (TemplateResult)
  lib-[nombre].css           → Estilos scoped con @layer
  lib-[nombre].stories.ts    → Historia de Storybook
```

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

Al crear un componente nuevo, añadirlo al barrel principal del paquete:

```typescript
// packages/shibui-ui/src/index.ts
export * from './components/[atoms|molecules|organisms]/lib-[nombre]/index';
```

---

## Convenciones de código

**Estructura:**
- Los templates van en ficheros `.html.ts` separados, nunca inline en el componente
- Los tipos e interfaces se importan siempre desde `src/models/`, nunca se definen inline

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

## Sistema Katachi (形)

Seis contextos estéticos que reescriben los tokens semánticos manteniendo los nombres. Se activan poniendo `data-katachi="<id>"` en cualquier ancestro:

| ID | Estética | Coverage |
|---|---|---|
| `wabi` | Imperfección serena — washi, ink, espacios amplios | tokens semánticos |
| `kintsugi` | Dark + acento dorado en grietas | tokens semánticos + efecto kintsugi-border |
| `sabi` | Patina envejecida, sombras brutales | tokens semánticos |
| `terminal` | Mono + glitch + verde fósforo | tokens semánticos + lib-text-glitch |
| `shizen` | Naturaleza — verdes botánicos, formas orgánicas | tokens semánticos |
| `celadon` | Cerámica coreana — celadón frío, vidrioso | tokens semánticos |

**Taxonomía de cobertura** (en `styles/effects-x-surfaces.md`):
- 🟢 **semantic** (~23 comp.) — consume tokens semánticos, cambia visualmente con cada katachi
- 🔵 **marker** (~50 comp.) — neutral estructural, no necesita override
- ⚪ **effect** (~4 comp.) — efectos puros (parallax, stagger, cursor-follower), agnósticos

**Wrapper DX**: `<lib-canvas katachi="kintsugi">…</lib-canvas>` aplica el atributo + un fondo de fondo apropiado. Útil en Storybook y previews.

Verificación visual de las 6 propagaciones: kitchen-sink en cada app consumidora (`/admin/kitchen-sink` en React/Angular/Svelte).

---

## Integración por framework (contrato de consumo)

Para garantizar IntelliSense correcto en las apps consumidoras:

- **React** — Extensión del namespace `JSX` en `custom-elements.d.ts`. Es obligatorio importar `React` en el archivo para que el aumento de módulo sea efectivo.
- **Svelte** — `shibui-elements.d.ts` extendiendo `svelte/elements` para mapear atributos y eventos personalizados.
- **Angular** — Habilitación de `CUSTOM_ELEMENTS_SCHEMA` en el módulo. `typings.d.ts` para soportar imports con sufijos `?raw` (iconos), `?inline` (CSS) y `.svg`.

---

## Testing y calidad

- **Playwright** — E2E, component testing y **visual regression** (baselines snapshots por componente × katachi)
- **Lighthouse CI** — requiere build previo de Storybook (`storybook-static`). Config en `.config/lighthouserc.cjs`
- Ningún código entra en `main` sin pasar Lighthouse y linter en CI
- Cambios en `_katachi.css` o tokens semánticos detonan diffs visuales en CI — actualizar baselines deliberadamente

---

## Storybook

- `.storybook/preview.ts` inyecta los tokens globales
- Mapeo de componentes mediante **Args** para pruebas de estado dinámicas (variant, size, disabled)
- Fondo de las stories configurado con gradiente oscuro para que los efectos glass sean visibles

---

## Instrucciones para Claude

- Cuando se pida un componente nuevo, seguir siempre la estructura de 5 ficheros
- Pedir el fichero del componente antes de proponer cambios sobre uno existente
- Usar los tokens `--lib-*` para todos los valores visuales, nunca hardcodear colores ni espaciados
- Proponer siempre la Storybook story junto al componente
- Los efectos glass y spotlight son opcionales — no añadirlos salvo que se pida explícitamente
- Los tipos siempre desde `src/models/`, nunca inline
- **Katachi-aware**: si un componente nuevo es `semantic` (depende del look), consume tokens semánticos (`--bg-elevated`, `--text-primary`, `--accent-primary`…) en vez de la paleta primitiva. Añadirlo a `styles/effects-x-surfaces.md` con su coverage
- Si añades un componente nuevo, actualizar también los `catalog.ts` de los kitchen-sinks (React/Angular/Svelte) con su slug + coverage
- Si hay duda sobre convenciones, preguntar antes de asumir
