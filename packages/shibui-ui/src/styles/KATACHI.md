# Katachi · 形 · Sistema de contextos estéticos

> **Estado**: Fases 1+2 mergeadas a `main`. Fase 3 (`<lib-canvas>` wrapper) en review (#303).
> Cobertura B1–B6 completada: 39 componentes con bloque KATACHI documentado.
> Última actualización: 2026-05-15

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

## Estado actual — Fases 1 + 2 mergeadas, Fase 3 en review

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

## Estado de la transición — cobertura actual

Tras Fases 1+2 y rollout B1–B6, la cobertura completa por categoría:

| Categoría | Componentes con bloque KATACHI | Tipo |
|-----------|-------------------------------|------|
| Cards & superficie | `lib-card` · `lib-bento-item` · `lib-glass-card` · `lib-spotlight-card` | Semantic |
| Interactivos | `lib-button` · `lib-badge` · `lib-checkbox` · `lib-radio` · `lib-switch` · `lib-segmented-control` | Mixto |
| Estructurales | `lib-header` · `lib-sidebar` · `lib-footer` · `lib-drawer` | Mixto |
| Navegación | `lib-breadcrumb` · `lib-tabs` · `lib-pagination` · `lib-chip` · `lib-dropdown` | Mixto |
| Forms | `lib-input` · `lib-select` · `lib-alert` · `lib-button-group` | Mixto |
| Overlays | `lib-modal` · `lib-dialog` · `lib-empty-state` · `lib-tooltip` | Marker |
| Display | `lib-divider` · `lib-display-heading` · `lib-quote` · `lib-eyebrow` · `lib-kbd` · `lib-status-dot` · `lib-progress` | Mixto |
| Botones secundarios | `lib-close-button` · `lib-copy-button` · `lib-burger-button` · `lib-rating` | Marker |
| Layout/data | `lib-data-table` · `lib-timeline` · `lib-code-block` · `lib-step` | Marker |
| **Total** | **39 componentes** | **18 semantic + 21 marker** |

- **Semantic** = el bloque sustituye colores hardcoded por tokens (`--bg-inverse`, etc.); el componente cambia de aspecto bajo katachi.
- **Marker** = el componente ya consumía tokens semánticos en su default; el bloque solo documenta y sirve como anchor de búsqueda.

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

**Adopción ejecutada** (PRs mergeados a `main` el 2026-05-15):
1. `lib-card` — #289
2. `lib-button` + `lib-badge` — #290
3. `lib-header` + `lib-sidebar` — #291
4. `lib-alert` + `lib-input` + `lib-select` — #292
5. Rollout B1–B6 (29 componentes restantes) — #296 → #301

### ✅ Fase 3 — `<lib-canvas>` wrapper (en review #303)

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

## Referencias

- Plan completo de implementación: `~/.claude/plans/pure-watching-biscuit.md`
- Documento maestro visual: `~/.claude/plans/shibui-katachi-master.html`
- Matriz componentes × efectos × superficies: `effects-x-surfaces.md`
- Guía de migración para apps consumidoras: `docs/styles/katachi-migration.md`
- Showcase visual en Storybook: `Foundations/Katachi (形)`
- Plugin de build: `packages/shibui-ui/.config/vite.config.ts` (función `emit-tokens-css`)
- Definición de tokens: `packages/shibui-ui/src/styles/shared/tokens/_katachi.css`
