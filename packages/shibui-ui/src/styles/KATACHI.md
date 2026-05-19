# Katachi · 形 · Sistema de contextos estéticos

> **Estado**: Sistema completado al 100%. Fases 1+2+3, rollouts B1–B6 y C1–C5 mergeadas a `main`.
> **Cobertura: 77/77 componentes con bloque KATACHI documentado** (23 semantic + 54 marker).
> Última actualización: 2026-05-16

---

## ¿Qué es Katachi?

**Katachi (形)** significa "forma, contorno, configuración". En Shibui UI es una capa de
estilos que agrupa **superficie + efectos + temperatura cromática** en una personalidad
visual nombrada, propagable a un árbol entero de componentes desde un único atributo
en cualquier ancestro HTML.

Resuelve el problema de hoy: para componer una sección coherente "kintsugi" había que
repetir `variant="kintsugi"` en cada componente individualmente, recordar qué efectos
entran en conflicto con esa estética, y ajustar la paleta manualmente. Con Katachi:

```html
<section data-katachi="kintsugi">
  <lib-header>…</lib-header>          <!-- hereda kintsugi -->
  <lib-card>…</lib-card>              <!-- hereda kintsugi -->
  <lib-glass-card>…</lib-glass-card>  <!-- glass se desactiva (conflicto) -->
  <lib-spotlight-card>…</lib-spotlight-card>  <!-- spotlight reforzado -->
</section>
```

---

## Los seis Katachi

| ID         | Kanji  | Concepto              | Surface base | Efecto principal     | Acento        |
|------------|--------|----------------------|--------------|---------------------|---------------|
| `wabi`     | 侘び    | Austero, brumoso     | dark         | glass (reforzado)   | celadon-400   |
| `kintsugi` | 金継ぎ  | Reparado con oro     | kintsugi     | kintsugi-border     | kaki-400      |
| `sabi`     | 寂び    | Envejecido, papel    | washi        | shadow-brutal       | kaki-600      |
| `terminal` | —      | CRT, digital duro    | glitch       | shadow-brutal       | celadon-400   |
| `shizen`   | 自然    | Natural, sin adorno  | light        | (ninguno · reset)   | kaki-500      |
| `celadon`  | 青磁    | Jade, frío sereno    | celadón      | spotlight-water     | celadon-400   |

Matriz completa de compatibilidad efectos × katachi en `effects-x-surfaces.md`.

---

## Estado actual — sistema completado al 100%

### Lo que está implementado

**Capa de tokens (`_katachi.css`):**
- 6 bloques `[data-katachi="x"], :host([data-katachi="x"])` definidos en
  `src/styles/shared/tokens/_katachi.css`
- Cada bloque:
  1. Establece bridge tokens (`--katachi-id`, `--katachi-family`, `--katachi-surface`,
     `--katachi-accent`, `--katachi-accent-muted`, `--katachi-fg`, `--katachi-fg-muted`,
     `--katachi-border`)
  2. Sobreescribe tokens semánticos relevantes (`--bg-*`, `--text-*`, `--border-*`)
  3. Ajusta primitivos de efecto (`--lib-glass-*`, `--lib-spotlight-*`,
     `--lib-kintsugi-border`, `--lib-shadow-brutal`)
  4. Silencia efectos incompatibles (e.g. en `kintsugi`, `--lib-glass-blur-amount: 0px`)

**Integración con build:**
- `_katachi.css` añadido al `@import` chain de `tokens.css`
- `_katachi.css` añadido al array de partials del plugin `emit-tokens-css` en
  `packages/shibui-ui/.config/vite.config.ts`
- `dist/tokens.css` inlinea los 6 contextos (≈673 líneas totales)

### Lo que **no** cambia para los consumidores actuales

**Feature flag implícito** — sin `data-katachi` en el HTML, este sistema es invisible:
- Cualquier `variant=""` existente sigue funcionando exactamente igual
- Los snapshots visuales de Storybook deben ser idénticos al pre-Fase-1
- Las apps `app-react`, `app-angular`, `app-svelte` no requieren ningún cambio para
  seguir funcionando

---

## Cómo opt-in hoy (Fase 1)

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
| `--bg-base`                    | `oklch(11.39% 0.009 84.7deg)` (washi-950) |
| `--lib-glass-blur-amount`      | `0px` (glass silenciado) |
| `--lib-spotlight-opacity`      | `0.18` (spotlight reforzado) |

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

### ✅ Fase 1 — Sistema de contextos (completada)

- `_katachi.css` con 6 contextos
- Integración con `emit-tokens-css`
- Documentación inicial (este archivo)

### ✅ Fase 2 — Awareness en componentes (completada)

Añadir al final de cada componente prioritario el bloque ambient:

```css
/* ─── KATACHI · ambient context ─────────────────────── */
:host(:not([variant])) .card {
  background: var(--bg-elevated);
  border-color: var(--border-subtle);
  color: var(--text-primary);
}
/* ─── /KATACHI ───────────────────────────────────────── */
```

**Especificidad**: `:host([variant="kintsugi"])` y `:host(:not([variant]))` son
mutuamente exclusivos por construcción. El `variant=""` explícito siempre gana.

**Adopción ejecutada** (PRs mergeados a `main`):
1. `lib-card` — #289 (2026-05-15)
2. `lib-button` + `lib-badge` — #290 (2026-05-15)
3. `lib-header` + `lib-sidebar` — #291 (2026-05-15)
4. `lib-alert` + `lib-input` + `lib-select` — #292 (2026-05-15)
5. Rollout B1–B6 (29 componentes) — #296 → #301 (2026-05-15)
6. Tanda C1–C5 (38 componentes restantes) — #309 → #313 (2026-05-16)

### ✅ Fase 3 — `<lib-canvas>` wrapper (mergeada en #303)

Componente que refleja `katachi="…"` como `data-katachi` en el host. Útil para
type-safety y futura propagación JS (eventos, `prefers-reduced-motion` por zona).

```typescript
@customElement('lib-canvas')
export class LibCanvas extends LitElement {
  @property({ type: String, reflect: true })
  katachi: KatachiId | '' = '';

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has('katachi')) {
      if (this.katachi) this.setAttribute('data-katachi', this.katachi);
      else              this.removeAttribute('data-katachi');
    }
  }
}
```

Uso desde apps consumidoras con tipado:

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

## Contrato variant × katachi — tokens `--lib-comp-*`

### El problema

Los componentes con `variant` explícito hardcodean valores primitivos (`var(--color-washi-*)`,
`rgb(...)`) que son inmunes a la herencia de tokens semánticos. Resultado: un
`<lib-button variant="kintsugi">` dentro de `data-katachi="celadon"` ignora el contexto
y queda visualmente incongruente.

### La solución: GUITV + tokens de contexto

Se definen 14 tokens `--lib-comp-*` **únicamente bajo `[data-katachi]`** en `_katachi.css`.
Los componentes los consumen como valor primario con el valor original como fallback:

```css
/* Patrón GUITV (Guaranteed Invalid at Computed Value Time) */
background: var(--lib-comp-bg, var(--color-washi-950));
color:      var(--lib-comp-fg, var(--text-primary));
```

| Escenario | Resultado |
|-----------|-----------|
| Sin katachi activo | `--lib-comp-*` no definido → GUITV → fallback exacto al original |
| Con katachi activo | `--lib-comp-*` definido por `_katachi.css` → katachi gana |

**La garantía**: sin `data-katachi` en el árbol, el comportamiento visual es
**bit-a-bit idéntico** al anterior. No hay riesgo de regresión.

### Los 14 tokens de contexto

Definidos en `_katachi.css` bajo `[data-katachi], :host([data-katachi])`:

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

### Componentes actualizados (22 ficheros CSS)

| Fichero | Tokens aplicados |
|---------|-----------------|
| `_katachi.css` | definición de los 14 tokens |
| `atoms/button` | primary, secondary, ghost, kintsugi, brutal |
| `atoms/card` | inverse, kintsugi, glitch, celadon, washi, brutal |
| `atoms/badge` | celadon |
| `atoms/switch` | kintsugi |
| `atoms/step` | active/completed status + kintsugi |
| `atoms/checkbox` | focus ring + checked |
| `atoms/radio` | focus ring + checked |
| `atoms/close-button` | focus ring + ghost/subtle hover + filled |
| `atoms/burger-button` | focus ring |
| `atoms/kbd` | box-shadow + pressed + dark |
| `atoms/tooltip` | dark bubble + arrows |
| `molecules/breadcrumb` | separator + pill current + ellipsis hover |
| `molecules/pagination` | active page button + outline active |
| `molecules/tabs` | tab states + glitch ink underline |
| `molecules/segmented-control` | outline thumb + active option |
| `molecules/dropdown` | filled trigger + active item + scrollbar |
| `molecules/header` | kintsugi/glitch bg + classic/minimal colors + outline action + breadcrumb/search |
| `organisms/sidebar` | kintsugi/glitch bg + mobile toggle |
| `organisms/drawer` | drag-hint + handle bar + scrollbar + dark/kintsugi-dark/glitch-dark bg + glitch seam |
| `organisms/footer` | `--ft-*` token definitions (base light + dark surface) + `.ft-brand` |

### Exclusiones deliberadas

Los pseudo-elementos con efectos visuales propios **no se modifican**:

- `::after` de kintsugi-seam animados (header, sidebar, drawer, footer)
- `::before` de glitch scanlines / RGB ghost layers
- `::before/::after` de logo-ring (conic-gradient animado)
- `lib-spinner` variant kintsugi — anillo OKLCH dorado, identidad estética fija

### Naming collision — `variant="kintsugi"` vs `data-katachi="kintsugi"`

Son mecanismos ortogonales. `variant="kintsugi"` en un componente aplica
la estética fija hardcoded del componente. `data-katachi="kintsugi"` en un
ancestro define el contexto ambient.

Cuando ambos coinciden (componente kintsugi dentro de sección kintsugi),
los `--lib-comp-*` ya son los tokens del katachi kintsugi → resultado visual
coherente. No hay colisión: el mecanismo los hace compatibles sin renombrar.

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

## Referencias

- Plan completo de implementación: `~/.claude/plans/pure-watching-biscuit.md`
- Documento maestro visual: `~/.claude/plans/shibui-katachi-master.html`
- Matriz componentes × efectos × superficies: `effects-x-surfaces.md`
- Guía de migración para apps consumidoras: `docs/styles/katachi-migration.md`
- Showcase visual en Storybook: `Foundations/Katachi (形)`
- Plugin de build: `packages/shibui-ui/.config/vite.config.ts` (función `emit-tokens-css`)
- Definición de tokens: `packages/shibui-ui/src/styles/shared/tokens/_katachi.css`
