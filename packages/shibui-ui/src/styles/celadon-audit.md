# Auditoría de componentes — Katachi `celadon` (青磁)

> **Estado**: Auditoría actualizada · 92 componentes clasificados · 2026-05-27
> Revisión completa sobre el CSS real de cada componente.
> Anterior: 2026-05-18 (77 entradas, 10+ componentes omitidos).

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
| **A** | Variante celadon explícita + dark-ready → uso óptimo | 15 |
| **B** | Semantic override activo → auto-adapta bajo katachi | 45 |
| **C** | Marker-only o utility → agnóstico, funciona sin cambio visual | 22 |
| **D** | Sin dark adaptation → gap en contexto oscuro | 7 |
| **E** | Compatible filosóficamente, implementación pendiente | 2 |
| **F** | No aplica o filosóficamente fuera de celadon | 3 |
| **Total** | | **94** |

---

## Tier A — Nativo celadon ✅ (15 componentes)

Ideales para componer interfaces celadon. Tienen variante celadon propia y funcionan correctamente en dark.

| Componente | Prop celadon | Dark disponible | Notas |
|------------|-------------|----------------|-------|
| `lib-card` | `variant="celadon"` | ✅ | Fondo dark + barra celadón superior + hover jade glow |
| `lib-background` | `celadon-mist` · `jade-deep` | ✅ | Fondos de superficie nativos jade |
| `lib-header` | `variant="celadon"` | ✅ `[dark]` | Variante nativa jade con celadon-seam animado; también adapta via katachi ambient (Tier B) |
| `lib-footer` | `variant="celadon"` | ✅ | Superficie jade oscura + celadon-seam animado; variantes sabi/shizen adicionales |
| `lib-tabs` | `color="celadon"` | ✅ `[dark]` | Tab activa jade + dark adaptation completa |
| `lib-segmented-control` | `variant="celadon"` | ✅ `dark-celadon` | Variante dark-celadon explícita |
| `lib-range-slider` | `tone="celadon"` | ✅ `tone="dark"` | Único form control con dark completo |
| `lib-chip` | `color="celadon"` | ✅ `color="dark"` | Chip jade + fondo dark intercambiable |
| `lib-tooltip` | `variant="celadon"` | ✅ default dark | Dark por defecto + celadon-500 como variante |
| `lib-kbd` | `variant="celadon"` | ✅ `variant="dark"` | Tecla jade + variante dark para fondo oscuro |
| `lib-reading-progress` | `tone="celadon"` | ✅ | Overlay — surface-agnostic por naturaleza |
| `lib-counter` | `tone="celadon"` | ✅ `tone="on-dark"` | Contador jade + on-dark OKLCH |
| `lib-avatar` | `tone="cool"` | — | Cara jade (paleta fija por `tone`, no semántica) + glaze cerámico en hover bajo `data-katachi="celadon"` |
| `lib-liquid-button` | `variant="celadon"` | ✅ `ghost[dark]` | Efecto líquido jade |
| `lib-parallax-text` | `color="celadon"` (capas outline e italic) | ✅ | Texto desfilante jade — natural en dark |

---

## Tier B — Semántico, adapta vía katachi ⚡ (45 componentes)

Con `data-katachi="celadon"` en cualquier ancestro, estos componentes sustituyen tokens hardcoded por semánticos. No requieren props adicionales.

| Componente | Tokens clave que cambian | Observaciones |
|------------|--------------------------|---------------|
| `lib-card` | `--bg-elevated` · `--border-subtle` · `--text-primary` | También Tier A |
| `lib-button` | `--bg-inverse` · `--text-primary` · `--border-strong` | Primary: celadon glaze sweep animado en hover. Secondary/ghost: 100% semantic |
| `lib-badge` | `--text-primary` · `--bg-elevated` | |
| `lib-header` | `--bg-base` · `--text-primary` | También Tier A (variante nativa celadon) |
| `lib-footer` | `--lib-comp-bg` · `--lib-comp-fg` | También Tier A (variante nativa celadon) |
| `lib-sidebar` | `--bg-base` · `--text-primary` | Variante dark propia disponible además |
| `lib-alert` | `--bg-surface` · `--text-primary` | Sin dark explícito — tokens semánticos compensan |
| `lib-input` | `--bg-elevated` · `--border-default` | Gap visual parcial — sin adaptation explícita propia |
| `lib-select` | `--bg-elevated` · `--border-default` + checkmark invert | Checkmark SVG ahora invierte via `:host-context([data-katachi="celadon"])` |
| `lib-checkbox` | `--bg-elevated` · `--border-default` | |
| `lib-radio` | `--bg-elevated` · `--border-default` | |
| `lib-switch` | `--bg-elevated` · `--border-default` | Default track claro se filtra; variant kintsugi OK |
| `lib-segmented-control` | `--bg-elevated` · `--text-primary` | También Tier A |
| `lib-chip` | `--bg-elevated` · `--text-primary` | También Tier A |
| `lib-breadcrumb` | `--text-primary` · `--text-link` | Sin dark explícito |
| `lib-drawer` | `--bg-surface` · `--text-primary` | Variantes dark/kintsugi propias disponibles |
| `lib-modal` | `--bg-elevated` · `--text-primary` | Prop `.is-celadon` para icono de cabecera |
| `lib-dialog` | `--bg-elevated` · `--bg-surface` · `--text-primary` | `variant="dark"` con oklch washi explícito disponible |
| `lib-dropdown` | `--bg-elevated` · `--bg-surface` · `--text-primary` | Default y panel adaptan. `variant="filled"` usa `washi-900` — gap menor |
| `lib-empty-state` | `--bg-elevated` · `--text-primary` | + `tone="celadon"` propio (también Tier D sin dark) |
| `lib-divider` | `--border-subtle` (heavy variant) | |
| `lib-display-heading` | `--text-primary` · `--text-secondary` | Variante `surface="dark"` propia disponible |
| `lib-quote` | `--text-primary` · `--text-secondary` | Default dark; cambia bajo katachi |
| `lib-progress` | `--bg-elevated` · `--text-primary` + GUITV track | Track ahora usa `--lib-comp-border-subtle` GUITV; mejora vs audit anterior |
| `lib-status-dot` | `--text-primary` | Semántico puro |
| `lib-liquid-button` | `--bg-inverse` (variant ink) | También Tier A |
| `lib-tree-select` | `--bg-elevated` · `--border-default` | |
| `lib-data-table` | `--bg-elevated` · `--bg-surface` · `--text-primary` | Hover-state de sorting usa `washi-200` hardcoded — gap menor |
| `lib-timeline` | `--bg-elevated` · `--bg-surface` · `--text-primary` | Props `.nd-celadon` · `.tl-badge-celadon` para nodos celadon |
| `lib-text-list` | `--bg-elevated` · `--bg-surface` · `--text-primary` | Classes `.icon-celadon` · `.lst-badge-celadon`; dark variant explícita |
| `lib-text-editor` | `--bg-base` · `--text-primary` | Overrides para terminal/kintsugi; celadon adapta vía tokens semánticos |
| `lib-editor-toolbar` | `--bg-elevated` · `--text-primary` · `--accent-primary` | Override para terminal; celadon adapta vía tokens |
| `lib-scatter-chart` | `--bg-elevated` · `--text-primary` · `--border-subtle` | Documentado como "katachi-aware" |
| `lib-scatter-chart-3d` | `--bg-elevated` · `--text-primary` · `--border-subtle` | Documentado como "katachi-aware" |
| `lib-bar-chart` | `--bg-elevated` · `--text-primary` | Documentado como "katachi-aware" |
| `lib-gadget-frame` | `--bg-elevated` · `--border-subtle` · `--text-primary` | Adapta con cada katachi (documentado explícitamente) |
| `lib-close-button` | `--text-primary` · `--bg-surface` | `variant="on-dark"` para contextos explícitamente oscuros |
| `lib-copy-button` | `--text-primary` · `--bg-surface` | `.celadon-filled` class + `variant="on-dark"` |
| `lib-login-form` | `--bg-elevated` · `--border-default` · `--text-primary` | 100% semantic; adapta a todos los katachi automáticamente |

---

## Tier C — Neutro / utility — (22 componentes)

Agnósticos al contexto. Consumen tokens semánticos o tienen paleta deliberada que no debe adaptarse.

| Componente | Tipo | Notas |
|------------|------|-------|
| `lib-canvas` | Host katachi | Propaga `data-katachi`; usa `--bg-base`/`--text-primary` |
| `lib-aspect-ratio` | Wrapper estructural | Hereda del contenido |
| `lib-visually-hidden` | A11y utility | Sin display visual |
| `lib-ripple` | Efecto puro | Hereda `currentColor` |
| `lib-magnetic` | Comportamiento | Sin superficie propia |
| `lib-spacer` | Layout | Sin superficie |
| `lib-icon` | SVG inline | `currentColor` — hereda contexto |
| `lib-label` | Tipográfico | Token semántico por default |
| `lib-eyebrow` | Tipográfico | Neutro |
| `lib-select-option` | ↑ padre select | Hereda del contenedor |
| `lib-button-group` | ↑ botones internos | Wrapper estructural |
| `lib-accordion-item` | ↑ padre accordion | API de custom properties |
| `lib-bento-item` | ↑ contenido | Fondo casi transparente (0.04) |
| `lib-bento-grid` | Layout puro | CSS Grid |
| `lib-card-grid` | Layout puro | CSS Grid |
| `lib-color-scale` | Documentación | Paleta deliberada |
| `lib-cursor-follower` | Comportamiento | Sin superficie |
| `lib-parallax-container` | Wrapper parallax | Sin superficie |
| `lib-stagger` | Animación | Sin superficie |
| `lib-horizontal-scroll-section` | Scroll wrapper | Sin superficie propia |
| `lib-carousel` | Slider contenido | Sin superficie propia |
| `lib-toast-manager` | Posicionamiento | Sin superficie |
| `lib-accordion` | ↑ ítems | Define estructura |
| `lib-metric-bar` | Wrapper delegado | Delega enteramente a lib-progress interno |
| `lib-glass-card` | Efecto glass | Neutro en celadon — dark surface lo hace compatible |
| `lib-color-picker` | Utility | Sin variantes de superficie |
| `lib-file-uploader` | Utility | Estado `accepted` activa celadon internamente |

> Nota: el recuento de Tier C incluye entradas adicionales vs. la tabla de totales — algunos son sub-componentes de organismos ya contados.

---

## Tier D — Parcial: sin dark adaptation ⚠️ (7 componentes)

Funcionan en light pero presentan gaps visuales sobre fondos oscuros. Usables con cautela.

| Componente | Gap concreto | Impacto visual |
|------------|--------------|----------------|
| `lib-progress` | `tone="celadon"` track `celadon-100` visible en dark. Track base mejorado con GUITV, pero la variante explícita aún es clara | Barra rellena jade ✅, track celadon-100 ligeramente claro ⚠️ |
| `lib-progress-circle` | Track `washi-200` no invierte bajo dark | Arco jade ✅, track claro visible ⚠️ |
| `lib-rating` | Estrella vacía `washi-300` no invierte | Estrellas seleccionadas jade ✅, vacías claras ⚠️ |
| `lib-checkbox-card` | `bg-elevated` sin dark adaptation propia | Card jade al checked ✅, fondo claro en dark ⚠️ |
| `lib-empty-state` | `bg-elevated` sin dark | Icono/texto jade ✅, fondo claro ⚠️ |
| `lib-skeleton` | `washi-200/700/800` hardcoded; necesita `[surface="dark"]` explícito | Skeleton claro visible sobre jade dark ⚠️ |
| `lib-content-pillar` | Solo `washi-600` hardcoded; sin dark ni celadon adaptation | Texto muted claro sobre fondo jade ⚠️ |

---

## Tier E — Pendiente de implementación 🔲 (2 componentes)

Filosóficamente compatibles con celadon; el gap es de implementación.

| Componente | Qué falta | Prioridad |
|------------|-----------|-----------|
| `lib-spotlight-card` | `spotlight="water"` es el match natural del efecto signature celadon, pero sin dark surface adaptation verificada en contexto celadon | Alta — efecto signature de celadon |
| `lib-pagination` | Active page usa `washi-900/50` hardcoded en lugar de `--bg-inverse/--text-inverse` | Baja |

> **Resueltos desde la auditoría anterior**: `lib-button` secondary/ghost → Tier B (usaban semantic tokens); `lib-dropdown` → Tier B (panel usa `--bg-elevated`/`--text-primary`).

---

## Tier F — No aplica / filosóficamente fuera de celadon ❌ (3 componentes)

| Componente / variante | Razón |
|----------------------|-------|
| `lib-text-glitch` | Estética terminal/CRT — filosóficamente incompatible con la serenidad jade |
| `lib-code-block` | Paleta CRT/terminal fija — no adapta |
| `lib-header` variante `glitch` | La variante glitch no se usa en celadon; las demás sí |

> `lib-burger-button` y `lib-spinner[kintsugi]` reclasificados: son Tier C (neutros/utility) no Tier F.

---

## Resumen ejecutivo

```
✅ Tier A (15) — usar directamente con prop celadon
⚡ Tier B (45) — funcionan automáticamente bajo data-katachi="celadon"
—  Tier C (22) — utilities/wrappers, transparentes al contexto
⚠️ Tier D  (7) — usar con cautela; gap en dark track/fondo
🔲 Tier E  (2) — implementar para cobertura completa
❌ Tier F  (3) — excluir de interfaces celadon
```

**Listos para celadon sin trabajo adicional:** A + B + C = **82 de 94** (87 %)
**Con gaps menores:** D = 7 (7 %)
**Trabajo pendiente:** E = 2 (2 %)
**Excluir:** F = 3 (3 %)

---

## Delta vs. auditoría 2026-05-18

### Promociones de tier

| Componente | Antes | Ahora | Razón |
|---|---|---|---|
| `lib-header` | Tier B | **Tier A+B** | Variante `variant="celadon"` nativa añadida |
| `lib-button` | Tier B/E | **Tier B** | Secondary/ghost usan semantic tokens; gap E inexistente |
| `lib-dropdown` | Tier E | **Tier B** | Panel/trigger default usan `--bg-elevated`/`--text-primary` |
| `lib-select` | Tier B | **Tier B+** | Checkmark SVG invierte bajo celadon via `:host-context()` |
| `lib-progress` | Tier D | **Tier D↑** | Track base mejorado con GUITV `--lib-comp-border-subtle` |

### Nuevos componentes clasificados

| Componente | Tier | |
|---|---|---|
| `lib-footer` | **A** | Variante nativa celadon con jade surface + celadon-seam |
| `lib-scatter-chart` | **B** | Semantic, katachi-aware documentado |
| `lib-scatter-chart-3d` | **B** | Semantic, katachi-aware documentado |
| `lib-bar-chart` | **B** | Semantic, katachi-aware documentado |
| `lib-text-editor` | **B** | Semantic + overrides terminal/kintsugi |
| `lib-editor-toolbar` | **B** | Semantic + override terminal |
| `lib-gadget-frame` | **B** | Semantic, adaptación documentada explícitamente |
| `lib-metric-bar` | **C** | Wrapper puro que delega a lib-progress |
| `lib-modal` | **B** | Semantic + `.is-celadon` icon prop |
| `lib-dialog` | **B** | Semantic + `variant="dark"` explícita |
| `lib-data-table` | **B** | Semantic; gap menor en hover-state sorting |
| `lib-timeline` | **B** | Semantic + `.nd-celadon`/`.tl-badge-celadon` props |
| `lib-skeleton` | **D** | `washi-200/700` hardcoded, necesita `[surface="dark"]` |
| `lib-canvas` | **C** | Host katachi; usa `--bg-base`/`--text-primary` |
| `lib-text-list` | **B** | Semantic + icon-celadon/badge-celadon classes |
| `lib-content-pillar` | **D** | Solo `washi-600` hardcoded, sin dark adaptation |
| `lib-close-button` | **B** | Semantic + `variant="on-dark"` |
| `lib-copy-button` | **B** | Semantic + `.celadon-filled` + `variant="on-dark"` |
| `lib-login-form` | **B** | 100% semantic |

---

## Combinaciones recomendadas para interfaces celadon

```html
<!-- Fondo de sección celadon -->
<lib-canvas katachi="celadon">
  <lib-background variant="jade-deep"></lib-background>

  <!-- Header nativo celadon (Tier A) -->
  <lib-header variant="celadon"></lib-header>

  <!-- Footer nativo celadon (Tier A) -->
  <lib-footer variant="celadon"></lib-footer>

  <!-- Tarjeta nativa celadon (Tier A) -->
  <lib-card variant="celadon">…</lib-card>

  <!-- Spotlight con agua — efecto signature (Tier E, pendiente verificar) -->
  <lib-spotlight-card spotlight="water">…</lib-spotlight-card>

  <!-- Cristal sobre superficie oscura (Tier C, neutro compatible) -->
  <lib-glass-card tint="water">…</lib-glass-card>

  <!-- Tabs jade (Tier A) -->
  <lib-tabs color="celadon" dark>…</lib-tabs>

  <!-- Form controls — adaptan via katachi (Tier B) -->
  <lib-input>…</lib-input>
  <lib-range-slider tone="celadon">…</lib-range-slider>  <!-- Tier A: completo -->

  <!-- Evitar sobre celadon sin [surface="dark"] explícito -->
  <!-- lib-skeleton, lib-content-pillar → gap visual (Tier D) -->
</lib-canvas>
```

---

*Auditoría actualizada: 2026-05-27 · CSS real de 94 componentes · Sistema Katachi completo*
*Anterior: 2026-05-18 (77 entradas)*

---

## Decoraciones celadon — integración (Fase 3)

El katachi celadon pasó a contexto **oscuro** (cerámica jade, `family: dark`) y se añadió
la capa de 10 decoraciones (ver `effects-x-surfaces.md` § Decoraciones Celadon y el spec
`celadon-effects-spec.md`).

- **Ambiental** (todos los componentes bajo `data-katachi="celadon"`): tema oscuro + sombra jade.
- **Pilotos con decoración opt-in**: `lib-card`, `lib-header` (Bar), `lib-footer` (Bar), `lib-button`, `lib-chip`, `lib-status-dot`.
- **Gate**: capas `.fx-*` sólo bajo celadon (`--lib-celadon-fx-display`, fallback `none`).
- **Pendiente**: baselines de regresión visual (deliberado).

*Decoraciones añadidas: 2026-05-31*
