# Katachi · 形 · Identidades estéticas selladas

> **Estado**: Fase 2 completada (lib-card, lib-glass-card, lib-badge, lib-eyebrow, lib-chip,
> lib-spinner, lib-sidebar, lib-header). Fase 3 (componentes restantes) en progreso.
> Última actualización: 2026-05-29

---

## ¿Qué es Katachi?

**Katachi (形)** significa "forma, contorno, configuración". En Shibui UI es una
**identidad visual sellada** — un mundo visual completo donde los efectos se activan
automáticamente por contexto, sin necesidad de props específicos en los componentes.

Antes del modelo sellado, para componer una sección "kintsugi" había que repetir
`variant="kintsugi"` en cada componente individualmente. Con katachi:

```html
<section data-katachi="kintsugi">
  <lib-header>…</lib-header>     <!-- seam dorada automática -->
  <lib-card>…</lib-card>         <!-- anillo dorado + barra animada automáticos -->
  <lib-glass-card>…</lib-glass-card>  <!-- glass se desactiva (conflicto) -->
</section>
```

**No hay prop `variant="kintsugi"` ni `variant="glitch"`.** El componente lee tokens
`--lib-effect-*` heredados del ancestro y activa sus efectos solo cuando el contexto
lo indica.

---

## Los seis Katachi

Tres light · tres dark. `shizen` es el default del sistema (sin `data-katachi` = shizen).

| ID         | Kanji  | Familia | Concepto                            | Efecto principal             | Acento         |
|------------|--------|---------|-------------------------------------|------------------------------|----------------|
| `shizen`   | 自然    | light   | Natural, base, zero-point           | ninguno (silencio)           | kaki-500       |
| `celadon`  | 青磁    | light   | Jade pálido, frío, alternativa cool | glaze cerámico sutil         | celadon-500    |
| `sabi`     | 寂び    | light   | Papel envejecido, handcraft         | shadow-brutal offset         | kaki-600       |
| `kintsugi` | 金継ぎ  | dark    | Reparado con oro (único dark-1st)   | seam dorada animada          | kaki-400       |
| `wabi`     | 侘び    | dark    | Kuroi · oscuridad pura, silencio    | ninguno (el anti-kintsugi)   | (gris cálido)  |
| `terminal` | —      | dark    | CRT retro, phosphor verde           | scanlines + glitch-drift     | celadon-300    |

**Notas importantes:**
- `celadon` es **light** (jade pálido, `oklch(97% 0.012 175deg)`). No es dark.
- `wabi` es **oscuridad pura sin efectos** — lo opuesto a kintsugi: no hay oro, no hay animaciones.
- Los efectos son **automáticos** — ningún componente necesita leer el ID del katachi.

Matriz completa de compatibilidad efectos × katachi en `effects-x-surfaces.md`.

---

## Arquitectura técnica — modelo sellado

### Mecanismo de activación de efectos

Los efectos no se activan con props en el componente. Se activan mediante
**tokens CSS custom heredados** desde el ancestro `[data-katachi]`.

Cadena de herencia completa:

```
_effects.css (:root)          → defaults globales apagados
_katachi.css ([data-katachi]) → activa los tokens del katachi
lib-card shadow DOM           → hereda los tokens del ancestro
.card::before / ::after       → animation-play-state / opacity via var()
```

**Por qué funciona a través de Shadow DOM**: las CSS custom properties son
heredadas por naturaleza. La clave es que los ficheros de tokens NO usan
`:host, :root { }` — solo `:root { }`. En un `adoptedStyleSheet` de Shadow DOM,
`:root` no coincide con ningún elemento (el shadow root no es estilizable), por
lo que los defaults se establecen únicamente en el documento global y la herencia
desde el ancestro `[data-katachi]` fluye libremente.

### Tokens de activación de efectos (`--lib-effect-*`)

Definidos en `_effects.css` con defaults apagados. Cada katachi activa los suyos:

| Token | Default (`:root`) | kintsugi | terminal | sabi | wabi/shizen/celadon |
|---|---|---|---|---|---|
| `--lib-effect-seam-play` | `paused` | `running` | `paused` | `paused` | `paused` |
| `--lib-effect-seam-opacity` | `0` | `1` | `0` | `0` | `0` |
| `--lib-effect-glitch-play` | `paused` | `paused` | `running` | `paused` | `paused` |
| `--lib-effect-scanlines` | `0` | `0` | `0.10` | `0` | `0` |
| `--lib-effect-crt-vignette` | `0` | `0` | `0.50` | `0` | `0` |
| `--lib-effect-brutal-shadow` | `none` | gold ring† | `none` | `4px 4px 0px 0px washi-900` | `none` |
| `--lib-effect-glass-blur` | `0px` | `0px` | `0px` | `0px` | `0px` |
| `--lib-effect-topbar-opacity` | `0` | `1` | `1` | `0` | `0` |
| `--lib-effect-topbar-bg` | `transparent` | gold gradient | phosphor sólido | `transparent` | `transparent` |

† En kintsugi: `0 0 0 1px oklch(61.85% 0.149 48.72deg / 0.22), 0 4px 20px oklch(0%/0.40)`

### Patrón CSS en componentes

Los efectos se declaran siempre en el componente pero permanecen invisible:

```css
/* En el componente: siempre presente, visible solo con el katachi correcto */
.card::before {
  content: ''; position: absolute; inset: 0 0 auto 0;
  height: 3px; pointer-events: none; z-index: 3;
  background: var(--lib-effect-topbar-bg, <gold-gradient-default>);
  background-size: 200% 100%;
  animation: kintsugi-seam 5s linear infinite;
  animation-play-state: var(--lib-effect-seam-play, paused);   /* ← hereda del katachi */
  opacity: var(--lib-effect-topbar-opacity, 0);                 /* ← hereda del katachi */
}

.card::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent, transparent 3px,
    oklch(100% 0 0deg / var(--lib-effect-scanlines, 0)) 3px,    /* ← hereda del katachi */
    oklch(100% 0 0deg / var(--lib-effect-scanlines, 0)) 4px
  );
}

.card {
  box-shadow: var(--lib-effect-brutal-shadow, none);             /* ← hereda del katachi */
}
```

### Variantes de componente — solo semánticas

Los componentes **no tienen variantes con nombres de paleta o katachi**. Solo roles estructurales:

| Componente | Variantes eliminadas | Variantes actuales |
|---|---|---|
| `lib-card` | `kintsugi`, `glitch`, `celadon`, `washi`, `brutal` | `default`, `inverse`, `accent`, `featured` |
| `lib-badge` | `celadon`, `dark` | `default`, `accent`, `info`, `strong`, `error`, `success`, `warning` |
| `lib-eyebrow` | `color="kaki/celadon/dark/white/muted"` | `tone="accent/neutral/inverse/muted"` |
| `lib-chip` | `kaki`, `celadon` | `default`, `accent`, `info`, `dark`, `error` |
| `lib-spinner` | — | `enso`, `sumi`, `kintsugi`†, `shizuku` |
| `lib-header` | `kintsugi`, `glitch` | `classic`, `dark`, `centered`, `transparent`, `mega`, `minimal`, `shrink`, `app-bar`, `celadon`, `sabi`, `shizen` |
| `lib-sidebar` | `kintsugi`, `glitch` | `light`, `dark` |

† `lib-spinner variant="kintsugi"` es la excepción — es un efecto estructural del spinner,
no una variante de paleta.

### Cómo opt-in

---

## Cómo opt-in

Aunque la awareness automática en componentes llega en Fase 2, ya puedes activar Katachi
de forma manual:

### Método 1 · Atributo en contenedor HTML

```html
<body data-katachi="kintsugi">
  <!-- Todo el árbol hereda el contexto. -->
  <!-- Los tokens semánticos quedan sobreescritos. -->
  <!-- Los componentes que ya consumen tokens semánticos
       (p.ej. lib-bento-item con --bg-elevated) se adaptan
       automáticamente. -->
</body>
```

### Método 2 · Atributo directo en custom element

```html
<lib-card data-katachi="kintsugi">…</lib-card>
```

El selector dual `[data-katachi="x"], :host([data-katachi="x"])` garantiza que ambos
patrones funcionan. Las custom properties atraviesan Shadow DOM por inheritance
natural.

### Inspección en DevTools

Con `data-katachi="kintsugi"` activo, los siguientes tokens computan a:

| Token                          | Valor esperado |
|--------------------------------|---------------|
| `--katachi-id`                 | `kintsugi` |
| `--katachi-family`             | `dark` |
| `--katachi-accent`             | `oklch(61.85% 0.149 48.72deg)` (kaki-400) |
| `--bg-base`                    | `var(--color-washi-950)` ≈ `#120E0A` |
| `--bg-elevated`                | `oklch(14% 0.01 60deg)` |
| `--border-subtle`              | `oklch(61.85% 0.149 48.72deg / 0.20)` (gold visible) |
| `--lib-effect-seam-play`       | `running` |
| `--lib-effect-topbar-opacity`  | `1` |
| `--lib-effect-brutal-shadow`   | gold ring + glow |
| `--lib-glass-blur-amount`      | `0px` (glass silenciado) |
| `--lib-spotlight-opacity`      | `0.18` (spotlight reforzado) |

Con `data-katachi="terminal"`:

| Token                          | Valor esperado |
|--------------------------------|---------------|
| `--bg-base`                    | `oklch(7% 0.008 150deg)` (near-black verde) |
| `--text-primary`               | `var(--color-celadon-300)` (phosphor verde) |
| `--lib-effect-scanlines`       | `0.10` (stripes blancas al 10%) |
| `--lib-effect-glitch-play`     | `running` |
| `--lib-effect-topbar-opacity`  | `1` |
| `--lib-effect-topbar-bg`       | `oklch(68% 0.14 155deg)` (phosphor sólido) |

Con `data-katachi="celadon"`:

| Token                          | Valor esperado |
|--------------------------------|---------------|
| `--bg-base`                    | `oklch(97% 0.012 175deg)` (jade pálido, light) |
| `--text-primary`               | `oklch(18% 0.025 175deg)` (jade-ink oscuro) |
| `--lib-effect-seam-play`       | `paused` |
| `--lib-effect-scanlines`       | `0` |

---

## Estado de la transición — cobertura completa

Tras Fases 1+2+3, rollouts B1–B6 y C1–C5, todos los componentes con CSS file
llevan el bloque KATACHI documentado:

| Categoría | Componentes con bloque KATACHI | Tipo |
|-----------|-------------------------------|------|
| Cards & superficie | `lib-card` · `lib-bento-item` · `lib-glass-card` · `lib-spotlight-card` · `lib-card-grid` · `lib-bento-grid` | Mixto |
| Interactivos | `lib-button` · `lib-badge` · `lib-checkbox` · `lib-radio` · `lib-switch` · `lib-segmented-control` · `lib-liquid-button` · `lib-checkbox-card` | Mixto |
| Estructurales | `lib-header` · `lib-sidebar` · `lib-footer` · `lib-drawer` · `lib-accordion` · `lib-accordion-item` | Mixto |
| Navegación | `lib-breadcrumb` · `lib-tabs` · `lib-pagination` · `lib-chip` · `lib-dropdown` · `lib-tree-select` | Mixto |
| Forms | `lib-input` · `lib-select` · `lib-alert` · `lib-button-group` · `lib-color-picker` · `lib-file-uploader` · `lib-range-slider` · `lib-label` · `lib-select-option` | Mixto |
| Overlays | `lib-modal` · `lib-dialog` · `lib-empty-state` · `lib-tooltip` · `lib-toast-manager` | Marker |
| Display | `lib-divider` · `lib-display-heading` · `lib-quote` · `lib-eyebrow` · `lib-kbd` · `lib-status-dot` · `lib-progress` · `lib-progress-circle` · `lib-reading-progress` · `lib-counter` · `lib-text-list` · `lib-text-glitch` · `lib-color-scale` | Mixto |
| Botones secundarios | `lib-close-button` · `lib-copy-button` · `lib-burger-button` · `lib-rating` | Marker |
| Layout/data | `lib-data-table` · `lib-timeline` · `lib-code-block` · `lib-step` · `lib-stepper` · `lib-carousel` | Marker |
| Loading primitives | `lib-spinner` · `lib-skeleton` | Marker |
| Avatar & icon | `lib-avatar` · `lib-icon` | Marker |
| DX wrapper | `lib-canvas` | (sistema) |
| Producer | `lib-background` (52 variants) | Marker |
| Utility & a11y | `lib-aspect-ratio` · `lib-visually-hidden` · `lib-ripple` · `lib-magnetic` · `lib-spacer` | Marker |
| Animators & viewport | `lib-cursor-follower` · `lib-parallax` · `lib-parallax-text-stack` · `lib-horizontal-scroll-section` · `lib-stagger` | Marker |
| **Total** | **77 componentes** | **23 semantic + 54 marker** |

- **Semantic** = el bloque sustituye colores hardcoded por tokens (`--bg-inverse`, etc.); el componente cambia de aspecto bajo katachi.
- **Marker** = el componente ya consumía tokens semánticos en su default, o tiene una paleta deliberada por variant que NO debe adaptarse al katachi; el bloque solo documenta y sirve como anchor de búsqueda.

---

## Roadmap

### ✅ Fase 0 — Identidades Katachi confirmadas

Los 6 katachis definitivos (shizen, celadon, sabi, kintsugi, wabi, terminal) y sus características:
- `celadon` redefinido de dark jade a **light pale jade**
- `wabi` redefinido de dark-glass a **kuroi · pure darkness (no effects)**
- `terminal` con CRT phosphor verde correcto
- Efectos signature documentados por katachi

### ✅ Fase 1 — CSS Foundation (non-breaking)

- `_katachi.css`: 6 bloques con `--lib-effect-*` activation tokens
- `_effects.css`: tokens de efecto con defaults apagados (`:root` only)
- Todos los ficheros de token cambiados de `:host, :root { }` a `:root { }` para
  permitir herencia correcta a través de Shadow DOM
- Integración con `tokens.css` y build pipeline

### ✅ Fase 2 — Primera oleada de componentes (BREAKING)

**Componentes migrados** (PR #420 — mergeado a `develop`):
- `lib-card`: 4 variantes semánticas + efectos katachi automáticos via `--lib-effect-*`
- `lib-glass-card`: context-driven (glass activo solo en katachis dark sin conflicto)
- `lib-badge`: `celadon` → `info`, `dark` → `strong`
- `lib-eyebrow`: `color` prop palette → `tone` prop semántico
- `lib-chip`: actualizado a tokens semánticos
- `lib-spinner`: variantes estructurales (excepto `kintsugi` que es estructural)
- `lib-header`: eliminadas variantes `kintsugi` y `glitch`
- `lib-sidebar`: eliminadas variantes `kintsugi` y `glitch`

**Snapshot de legado**: existió una copia de los 7 componentes pre-migración en
`_katachi-legacy/` como fallback ante regresiones visuales. Eliminada (ya consolidada
la migración); recuperable desde el historial de git si hiciera falta.

**Fixes de herencia Shadow DOM** (PR #423 — en `develop`):
- Corregido bug de doble opacidad en scanlines terminal
- Bordes kintsugi actualizados a `kaki-400` real (visible sobre negro)
- Anillo dorado permanente en kintsugi vía `--lib-effect-brutal-shadow`
- Barra de seam de 2px → 3px

### 🔲 Fase 3 — Segunda oleada de componentes

Pendiente:
- `lib-avatar` (`color` → `tone`)
- `lib-liquid-button`, `lib-burger-button`
- `lib-kbd`, `lib-tooltip`, `lib-tabs`, `lib-dropdown`
- `lib-dialog`, `lib-modal`, `lib-drawer`
- `lib-progress`, `lib-progress-circle`, `lib-checkbox`, `lib-radio`
- `lib-switch`, `lib-stepper`, `lib-step`
- `lib-divider`, `lib-rating`, `lib-checkbox-card`
- `lib-parallax-text`, `lib-spotlight-card`

### 🔲 Fase 4 — Documentación

Actualizar `CLAUDE.md`, este archivo, `TOKENS.md`, `effects-x-surfaces.md` y
`katachi-migration.md` con la arquitectura del modelo sellado.

### ✅ `<lib-canvas>` wrapper (existente)

Componente que refleja `katachi="…"` como `data-katachi` en el host:

```html
<lib-canvas katachi="kintsugi" display="block" pad="xl">
  <lib-card>…</lib-card>
</lib-canvas>
```

---

## Decisiones de diseño documentadas

### ¿Por qué `data-katachi=""` y no `katachi=""` (attribute)?

`data-*` no contamina el namespace de atributos HTML y se prefija de forma consistente
con `data-theme` (el preset semántico existente). El `<lib-canvas katachi="…">` de
Fase 3 expondrá `katachi=""` directo, reflejado internamente a `data-katachi`.

### ¿Por qué selector dual `[data-katachi="x"], :host([data-katachi="x"])`?

- `[data-katachi="x"]` — captura uso en cualquier elemento HTML del light DOM
  (`<section data-katachi="x">`)
- `:host([data-katachi="x"])` — captura uso directo en un custom element
  (`<lib-canvas data-katachi="x">`)

Las CSS custom properties atraviesan Shadow DOM por inheritance, así que basta con
que la regla esté en la cascada del light DOM para que los descendientes Shadow DOM
las hereden.

### ¿Por qué se silencian efectos en lugar de prohibirlos?

Setear `--lib-glass-blur-amount: 0px` en `[data-katachi="kintsugi"]` desactiva el
efecto sin romper componentes que lo consumen. Si un desarrollador insiste en usar
`<lib-glass-card>` dentro de una sección kintsugi, el componente sigue renderizando
correctamente pero sin el efecto incompatible.

### ¿Cómo evita Katachi conflictos con `[data-theme="dark"]`?

El patrón actual de dark mode usa `:host([data-theme="dark"])` (solo afecta a custom
element hosts). Katachi extiende este patrón añadiendo soporte light-DOM via
`[data-katachi]`. Ambos sistemas son independientes y pueden coexistir:
`<body data-theme="dark" data-katachi="shizen">` aplica los dos.

---

## Taxonomía de decoraciones · Kintsugi

Marco de referencia para decidir qué ornamento aplica a cada escala de componente.
Sirve de guía al implementar efectos en componentes nuevos o al refinar los existentes.

### Clases de componentes por escala y forma

| Clase | Ejemplos | Características |
|---|---|---|
| **Surface** | `lib-card`, `lib-glass-card`, `lib-modal`, `lib-dialog`, `lib-drawer`, `lib-sidebar` | Rectangular grande; área suficiente para efectos complejos |
| **Bar/strip** | `lib-header`, `lib-footer`, `lib-progress`, `lib-metric-bar` | Horizontal, ancho completo o casi; alto reducido |
| **Interactive medium** | `lib-button`, `lib-input`, `lib-select`, `lib-segmented-control`, `lib-tabs` | ~36–48px alto; claramente accionable |
| **Pill/tag** | `lib-badge`, `lib-chip` | ~20–28px alto; pill-shaped; denso en información |
| **Indicator** | `lib-status-dot`, `lib-avatar` (sm), `lib-progress-circle` | ≤24px; puntual; semántico |
| **Typography** | `lib-eyebrow`, `lib-display-heading`, `lib-kbd`, `lib-label` | Texto puro o casi puro; sin forma contenedora propia |
| **Structural** | `lib-divider`, `lib-background`, `lib-canvas` | Layout; sin contenido propio |

### Catálogo de decoraciones kintsugi

| Decoración | Mecanismo CSS | Escala mínima | Notas |
|---|---|---|---|
| **Seam top** | `::before` barra animada 2–3px full-width | Surface / Bar | Ilegible en pills (<28px alto) — no usar en Pill/tag ni Indicator |
| **Ring** | `box-shadow: 0 0 0 1px oklch(kaki-400 / 0.40)` | Cualquiera | Forma cerrada con `border-radius`; no strips sin borde. En **círculos perfectos grandes** (p.ej. `lib-progress-circle`) el box-shadow nítido aliasea — usar `<circle>` stroke SVG (`--lib-effect-ring-stroke`) + `drop-shadow` (`--lib-effect-ring-glow`) en su lugar |
| **Halo** | Ring + `0 0 Npx oklch(kaki-400 / 0.10)` blur | Pill/tag · Indicator · Interactive | Complementa o sustituye seam en formatos pequeños |
| **Vein** | `border-left` o `border-bottom` en gold | Surface · Interactive medium | Direccional; evoca fisura diagonal en cerámica real |
| **Warmth bg** | `background: color-mix(in oklch, var(--bg-elevated), var(--color-kaki-400) 4–6%)` | Cualquiera con fondo sólido | Sutil; no requiere pseudo-elemento |
| **Warmth text** | `color: color-mix(in oklch, var(--text-primary), var(--color-kaki-400) 15–20%)` | Typography · Pill/tag | Invisible a primera vista; crea coherencia contextual |
| **Shadow depth** | `box-shadow` oscuro + anillo kaki (`0 0 0 1px kaki/0.25, 0 4px 20px ink/0.40`) | Surface · Interactive medium | Ya implementado en `--shadow-md/lg/xl` de kintsugi |
| **Pulse** | Opacity animation en ring o halo | Indicator | Reservar para estado activo/vivo, no decorativo puro |
| **Corner accent** | `::after` trazo diagonal en esquina | Surface · Interactive medium | Literal con el concepto de fisura; evitar en pills |
| **Animated dash** | `::before` trazo corto (~35% ancho) desplazándose | Pill/tag · Bar | Alternativa al seam full-width cuando el espacio es reducido |

### Matriz de compatibilidad

| | Seam top | Ring | Halo | Vein | Warmth bg | Warmth text | Shadow depth | Pulse | Corner | Animated dash |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Surface** | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | — | ✅ | — |
| **Bar/strip** | ✅ | — | — | ✅ | ✅ | — | — | — | — | — |
| **Interactive medium** | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |
| **Pill/tag** | ❌ | ✅ | ✅ | — | ✅ | ✅ | — | — | — | ✅ |
| **Indicator** | ❌ | ✅ | ✅ | — | ✅ | — | — | ✅ | — | — |
| **Typography** | — | — | — | — | — | ✅ | — | — | — | — |
| **Structural** | — | — | — | ✅ | ✅ | — | — | — | — | — |

`✅` natural · `⚠️` posible pero vigilar legibilidad · `❌` inapropiado · `—` no aplica

---

## Contrato katachi × componente

### Tokens de contexto `--lib-comp-*`

Definidos en `_katachi.css` bajo `[data-katachi], :host([data-katachi])`.
Los componentes los consumen como alias de los tokens semánticos del contexto activo:

| Token | Valor | Uso típico |
|-------|-------|-----------|
| `--lib-comp-bg` | `var(--bg-elevated)` | Fondo principal del componente |
| `--lib-comp-bg-hover` | `var(--bg-surface)` | Fondo en hover |
| `--lib-comp-bg-active` | `var(--bg-base)` | Fondo en pressed/active |
| `--lib-comp-bg-inverse` | `var(--bg-inverse)` | Fondo "filled" (btn primary, etc.) |
| `--lib-comp-bg-subtle` | `var(--bg-surface)` | Overlay sutil (ghost hover) |
| `--lib-comp-fg` | `var(--text-primary)` | Texto principal |
| `--lib-comp-fg-sec` | `var(--text-secondary)` | Texto secundario |
| `--lib-comp-fg-muted` | `var(--text-muted)` | Texto atenuado |
| `--lib-comp-fg-inverse` | `var(--text-inverse)` | Texto sobre fondo inverse |
| `--lib-comp-fg-accent` | `var(--text-accent)` | Color de acento |
| `--lib-comp-border` | `var(--border-default)` | Borde estándar |
| `--lib-comp-border-subtle` | `var(--border-subtle)` | Borde sutil |
| `--lib-comp-border-strong` | `var(--border-strong)` | Borde fuerte |
| `--lib-comp-border-focus` | `var(--border-focus)` | Focus ring |
| `--lib-comp-kanji-color` | por katachi | Color del watermark kanji decorativo |

### Regla de naming para variantes de componente

**Si el nombre de la variante es un color de paleta o un katachi ID → eliminar y reemplazar
por un rol semántico.**

| Antes (palette-named) | Después (semantic role) |
|---|---|
| `variant="kintsugi"` | Efecto automático (no existe como prop) |
| `variant="glitch"` | Efecto automático (no existe como prop) |
| `variant="celadon"` | `variant="info"` |
| `variant="dark"` | `variant="strong"` o `variant="inverse"` |
| `color="kaki"` | `tone="accent"` |
| `color="dark"` | `tone="inverse"` |

### Verificación

```bash
# 1. Playwright visual regression — baselines sin katachi NO deben cambiar
pnpm exec playwright test --project=visual

# 2. Con katachi — actualizar baselines deliberadamente
pnpm exec playwright test --update-snapshots --project=katachi

# 3. Kitchen-sinks con data-katachi="terminal" y data-katachi="wabi"
# apps/app-react/src/pages/kitchen-sink (y Angular/Svelte equivalentes)

# 4. Type-check y lint
pnpm type-check && pnpm lint
```

---

## Patrones de decoración expresiva · Kintsugi

Más allá del seam top genérico (2px barra animada) y del ring (box-shadow dorado),
algunos componentes justifican un tratamiento kintsugi con mayor carácter.

### Patrón: vena de oro irregular (reading-progress)

**Componente de referencia**: `lib-reading-progress` → `variant="bar"` / `tone="gold"`

El gradiente flat de color sólido no evoca el kintsugi — el oro real en cerámica
es **irregular**, con variaciones de intensidad a lo largo de la vena. La técnica:

```css
/* Gradiente diagonal con transición desigual — evoca el hilo de oro real */
background: linear-gradient(
  90deg,
  var(--color-kaki-600)  0%,   /* oscuro en el arranque */
  var(--color-kaki-500) 30%,
  var(--color-kaki-300) 65%,   /* brightest — punto de fusión */
  var(--color-kaki-400) 100%
);

/* Shimmer: reflejo de luz recorriendo la vena en bucle lento */
&::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent                    0%,
    oklch(92% 0.04 60deg / 0.75)  45%,
    oklch(98% 0.01 60deg / 0.90)  50%,   /* destello central */
    oklch(92% 0.04 60deg / 0.75)  55%,
    transparent                   100%
  );
  animation: gold-shimmer 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Glow tip: halo en el extremo activo del arco/barra */
&[active]::after {
  width: 24px;
  height: 8px;
  background: oklch(65% 0.1 50deg / 0.65);
  filter: blur(5px);
}
```

**Cuándo usar este patrón** en lugar del seam genérico:
- El componente es una barra de progreso o indicador lineal/radial
- El "avance" del componente tiene sentido semántico como "vena que se extiende"
- Hay espacio suficiente para que el shimmer sea legible (≥ 3px de altura)

**Componentes candidatos** donde aplicar esta lógica en el futuro:
`lib-progress` (bar variant) · `lib-reading-progress` (ya implementado) ·
`lib-progress-circle` (versión radial del gradiente) · `lib-metric-bar` (barra interna)

---

## Referencias

- Plan completo de implementación: `~/.claude/plans/pure-watching-biscuit.md`
- Documento maestro visual: `~/.claude/plans/shibui-katachi-master.html`
- Matriz componentes × efectos × superficies: `effects-x-surfaces.md`
- Guía de migración para apps consumidoras: `docs/styles/katachi-migration.md`
- Showcase visual en Storybook: `Foundations/Katachi (形)`
- Plugin de build: `packages/shibui-ui/.config/vite.config.ts` (función `emit-tokens-css`)
- Definición de tokens: `packages/shibui-ui/src/styles/shared/tokens/_katachi.css`
