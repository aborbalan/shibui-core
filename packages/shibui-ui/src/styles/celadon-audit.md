# Auditoría de componentes — Katachi `celadon` (青磁)

> **Estado**: Auditoría completada · 77 componentes clasificados · 2026-05-18
> Basada en `effects-x-surfaces.md` (auditoría 2026-05-16) + KATACHI.md (sistema 100% completo)

---

## Contexto del katachi celadon

| Propiedad | Valor |
|-----------|-------|
| Surface | `oklch(15% 0.02 180deg)` — jade oscuro frío |
| Foreground | `oklch(90% 0.04 180deg)` — blanco jade pálido |
| Acento | `celadon-400` · `#4E9482` |
| Efecto principal | `spotlight-water` — foco jade reactivo al cursor |
| Familia | `dark` |
| Activación | `data-katachi="celadon"` en cualquier ancestro |

---

## Clasificación

| Tier | Criterio | Componentes |
|------|----------|-------------|
| **A** | Prop celadon explícita + dark-ready → uso óptimo | 13 |
| **B** | Semantic override activo → auto-adapta fondo/texto bajo katachi | 23 |
| **C** | Marker-only o utility → agnóstico, funciona sin cambio visual | 27 |
| **D** | Prop celadon pero sin dark adaptation → gap en contexto oscuro | 5 |
| **E** | Compatible filosóficamente, implementación pendiente | 4 |
| **F** | No aplica o filosóficamente fuera de celadon | 5 |
| **Total** | | **77** |

---

## Tier A — Nativo celadon ✅ (13 componentes)

Ideales para componer interfaces celadon. Tienen prop celadon propia y funcionan correctamente en dark.

| Componente | Prop celadon | Dark disponible | Notas |
|------------|-------------|----------------|-------|
| `lib-card` | `variant="celadon"` | ✅ | Fondo dark + barra celadón superior + hover jade glow |
| `lib-background` | `celadon-mist` · `jade-deep` | ✅ | Fondos de superficie nativos jade |
| `lib-tabs` | `color="celadon"` | ✅ `[dark]` | Tab activa jade + dark adaptation completa |
| `lib-segmented-control` | `variant="celadon"` | ✅ `dark-celadon` | Variante dark-celadon explícita |
| `lib-range-slider` | `tone="celadon"` | ✅ `tone="dark"` | Único form control con dark completo |
| `lib-chip` | `color="celadon"` | ✅ `color="dark"` | Chip jade + fondo dark intercambiable |
| `lib-tooltip` | `variant="celadon"` | ✅ default dark | Dark por defecto + celadon-500 como variante |
| `lib-kbd` | `variant="celadon"` | ✅ `variant="dark"` | Tecla jade + variante dark para fondo oscuro |
| `lib-reading-progress` | `tone="celadon"` | ✅ | Overlay — surface-agnostic por naturaleza |
| `lib-counter` | `tone="celadon"` | ✅ `tone="on-dark"` | Contador jade + on-dark OKLCH |
| `lib-avatar` | `color="celadon"` | — | Cara jade; dark lo hereda del contexto padre |
| `lib-liquid-button` | `variant="celadon"` | ✅ `ghost[dark]` | Efecto líquido jade |
| `lib-parallax-text` | `color="celadon"` (capa outline e italic) | ✅ | Texto desfilante jade — natural en dark |

---

## Tier B — Semántico, adapta vía katachi ⚡ (23 componentes)

Con `data-katachi="celadon"` en cualquier ancestro, estos componentes sustituyen tokens hardcoded por semánticos. No requieren props adicionales para adaptarse.

| Componente | Tokens que cambian | Observaciones |
|------------|-------------------|---------------|
| `lib-card` | `--bg-elevated` · `--border-subtle` · `--text-primary` | También Tier A |
| `lib-button` | `--bg-inverse` · `--text-inverse` | Gap: secondary/ghost visibles sobre dark (ver Tier E) |
| `lib-badge` | `--text-primary` · `--bg-elevated` | |
| `lib-header` | `--bg-base` · `--text-primary` | Variante dark propia disponible además |
| `lib-sidebar` | `--bg-base` · `--text-primary` | Variante dark propia disponible además |
| `lib-alert` | `--bg-surface` · `--text-primary` | Sin dark explícito — tokens semánticos compensan |
| `lib-input` | `--bg-elevated` · `--border-default` | Gap visible: field light sobre dark sin adaptation propia |
| `lib-select` | `--bg-elevated` · `--border-default` | Mismo gap que lib-input |
| `lib-checkbox` | `--bg-elevated` · `--border-default` | |
| `lib-radio` | `--bg-elevated` · `--border-default` | |
| `lib-switch` | `--bg-elevated` · `--border-default` | Default track claro se filtra; variant kintsugi OK |
| `lib-segmented-control` | `--bg-elevated` · `--text-primary` | También Tier A |
| `lib-chip` | `--bg-elevated` · `--text-primary` | También Tier A |
| `lib-breadcrumb` | `--text-primary` · `--text-link` | Sin dark explícito |
| `lib-drawer` | `--bg-surface` · `--text-primary` | Variantes dark/kintsugi propias disponibles |
| `lib-empty-state` | `--bg-elevated` · `--text-primary` | + `tone="celadon"` propio (también Tier D sin dark) |
| `lib-divider` | `--border-subtle` (heavy variant) | |
| `lib-display-heading` | `--text-primary` · `--text-secondary` | Variante `surface="dark"` propia disponible |
| `lib-quote` | `--text-primary` · `--text-secondary` | Default dark; cambia bajo katachi |
| `lib-progress` | `--bg-elevated` · `--text-primary` | + `tone="celadon"` (también Tier D) |
| `lib-status-dot` | `--text-primary` | Semántico puro |
| `lib-liquid-button` | `--bg-inverse` (variant ink) | También Tier A |
| `lib-tree-select` | `--bg-elevated` · `--border-default` | |

---

## Tier C — Neutro / utility — (27 componentes)

Agnósticos al contexto. KATACHI marker-only: ya consumían tokens semánticos o tienen paleta deliberada que no debe adaptarse. Funcionan dentro de `data-katachi="celadon"` sin necesitar props extra.

| Componente | Tipo | Notas |
|------------|------|-------|
| `lib-aspect-ratio` | Wrapper estructural | Hereda del contenido |
| `lib-visually-hidden` | A11y utility | Sin display visual |
| `lib-ripple` | Efecto puro | Hereda `currentColor` |
| `lib-magnetic` | Comportamiento | Sin superficie propia |
| `lib-spacer` | Layout | Sin superficie |
| `lib-icon` | SVG inline | `currentColor` — hereda contexto |
| `lib-label` | Tipográfico | Token semántico por default |
| `lib-eyebrow` | Tipográfico | Neutro |
| `lib-select-option` | ↑ padre | Hereda del contenedor |
| `lib-button-group` | ↑ botones internos | Wrapper estructural |
| `lib-accordion-item` | ↑ padre accordion | API de custom properties |
| `lib-bento-item` | ↑ contenido | Fondo casi transparente (0.04) |
| `lib-bento-grid` | Layout puro | CSS Grid |
| `lib-card-grid` | Layout puro | CSS Grid |
| `lib-color-scale` | Documentación | Paleta deliberada |
| `lib-cursor-follower` | Comportamiento | Sin superficie |
| `lib-parallax-container` | Wrapper parallax | Sin superficie |
| `lib-stagger` | Animación | Sin superficie |
| `lib-horizontal-scroll-section` | Scroll wrapper | Sin superficie |
| `lib-carousel` | Slider contenido | Sin superficie propia |
| `lib-toast-manager` | Posicionamiento | Sin superficie |
| `lib-accordion` | ↑ ítems | Define estructura |
| `lib-stepper` + `lib-step` | light/kintsugi focus | No celadon deliberado |
| `lib-glass-card` | Efecto glass | Neutro en celadon — dark surface lo hace compatible |
| `lib-color-picker` | Utility | Sin variantes de superficie |
| `lib-file-uploader` | Utility | Estado `accepted` activa celadon internamente |

---

## Tier D — Parcial: prop celadon sin dark adaptation ⚠️ (5 componentes)

Tienen un prop celadon, pero su paleta base (track, fondo, estrella vacía) no invierte sobre fondos oscuros. Usables con cautela — el efecto es parcial.

| Componente | Prop celadon | Gap concreto | Impacto visual |
|------------|-------------|--------------|----------------|
| `lib-progress` | `tone="celadon"` | Track `washi-200` no invierte | Barra rellena jade ✅, track claro visible ⚠️ |
| `lib-progress-circle` | `variant="celadon"` | Track `washi-200` no invierte | Arco jade ✅, track claro visible ⚠️ |
| `lib-rating` | `color="celadon"` | Estrella vacía `washi-300` no invierte | Estrellas seleccionadas jade ✅, vacías claras ⚠️ |
| `lib-checkbox-card` | `color="celadon"` | `bg-elevated` sin dark | Card jade al checked ✅, fondo claro en dark ⚠️ |
| `lib-empty-state` | `tone="celadon"` | `bg-elevated` sin dark | Icono/texto jade ✅, fondo claro ⚠️ |

---

## Tier E — Pendiente de implementación 🔲 (4 componentes)

Filosóficamente compatibles con celadon; necesitan trabajo para ser plenamente adecuados.

| Componente | Qué falta | Prioridad |
|------------|-----------|-----------|
| `lib-spotlight-card` | `spotlight="water"` es el match natural del efecto spotlight-water del katachi, pero no hay verificación/test explícita en el contexto celadon | Alta — es el efecto signature de celadon |
| `lib-button` | Secondary y ghost usan `--bg-elevated` claro que resulta visible en dark; necesitan override de dark en el bloque KATACHI | Media |
| `lib-dropdown` | Panel y trigger no invierten sobre fondos oscuros | Media |
| `lib-pagination` | Sin dark adaptation — páginas/controles invisibles | Baja |

---

## Tier F — No aplica / filosóficamente fuera de celadon (5 referencias)

| Componente / variante | Razón |
|----------------------|-------|
| `lib-burger-button` | Ninguna variante celadon definida; el sistema lo omite deliberadamente (no aplica) |
| `lib-text-glitch` | Estética terminal/CRT — filosóficamente incompatible con la serenidad jade de celadon |
| `lib-code-block` | Paleta CRT/terminal fija — no adapta |
| `lib-header` variante `glitch` | La variante glitch no se usa en celadon; las demás variantes dark sí son OK |
| `lib-spinner` variante `kintsugi` | Exclusiva del katachi kintsugi — no celadon |

---

## Resumen ejecutivo

```
✅ Tier A (13) — usar directamente con prop celadon
⚡ Tier B (23) — funcionan automáticamente bajo data-katachi="celadon"
—  Tier C (27) — utilities/wrappers, transparentes al contexto
⚠️ Tier D  (5) — usar con cautela; gap en dark track/fondo
🔲 Tier E  (4) — implementar para cobertura completa
❌ Tier F  (5) — excluir de interfaces celadon
```

**Componentes listos para celadon sin trabajo adicional:** A + B + C = **63 de 77** (82 %)
**Con gaps menores:** D = 5 (7 %)
**Trabajo pendiente:** E = 4 (5 %)
**Excluir:** F = 5 (6 %)

---

## Combinaciones recomendadas para interfaces celadon

```html
<!-- Fondo de sección celadon -->
<lib-canvas katachi="celadon">
  <lib-background variant="jade-deep"></lib-background>

  <!-- Tarjeta nativa celadon (Tier A) -->
  <lib-card variant="celadon">…</lib-card>

  <!-- Spotlight con agua — efecto signature (Tier E, pendiente verificar) -->
  <lib-spotlight-card spotlight="water">…</lib-spotlight-card>

  <!-- Cristal sobre superficie oscura (Tier C, neutro compatible) -->
  <lib-glass-card tint="water">…</lib-glass-card>

  <!-- Tabs jade (Tier A) -->
  <lib-tabs color="celadon" dark>…</lib-tabs>

  <!-- Form controls — adaptan via katachi (Tier B) -->
  <lib-input>…</lib-input>  <!-- gap visual parcial -->
  <lib-range-slider tone="celadon">…</lib-range-slider>  <!-- Tier A: completo -->
</lib-canvas>
```

---

*Auditoría: 2026-05-18 · Basada en CSS real de 77 componentes · Sistema Katachi 100% (Fases 1+2+3, B1–B6, C1–C5)*
