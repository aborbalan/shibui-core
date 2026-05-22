# CSS Nesting nativo — convenciones shibui-ui

CSS nesting nativo (`&`) está soportado en todos los browsers objetivo del proyecto. No requiere preprocesador ni configuración de Vite: el browser lo resuelve en runtime igual que resuelve los tokens `--lib-*`.

Piloto validado en: `lib-button.css` (commit `refactor(lib-button): css nesting + fix spotlight`).

---

## Cuándo anidar

Anidar cuando el selector hijo depende del mismo `:host([attr])` o clase raíz que el padre. El criterio es eliminar repetición, no profundidad por profundidad.

| Patrón | ¿Anidar? |
|---|---|
| `:hover`, `::after`, `::before` dentro de variante | Sí |
| `@media (hover: hover)` dentro de variante | Sí |
| `:active` dentro de variante | Sí |
| `:host([glass][variant="x"])` — compound con varios attrs | No (ver restricción abajo) |
| `@layer reset { }` | No — dejar plano |
| `.spotlight-layer` (elemento hermano, no hijo de variante) | No |

---

## Patrones canónicos

### 1. Pseudo-clases y pseudo-elementos en clase base

```css
.btn {
  /* estilos base */

  & ::slotted(*) {
    position: relative;
    z-index: 2;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
}
```

### 2. Estados por variante

```css
:host([variant="secondary"]) .btn {
  background: transparent;
  color: var(--text-primary);
  border-color: var(--border-strong);

  &:hover {
    background: var(--lib-comp-bg-inverse, var(--bg-inverse));
    color: var(--lib-comp-fg-inverse, var(--text-inverse));
  }
}
```

### 3. `::after` + hover-sweep (animación primary)

```css
:host([variant="primary"]) .btn {
  background: var(--bg-inverse);
  color: var(--text-inverse);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color-kaki-400);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--duration-slow) var(--ease-out);
    z-index: 0;
  }

  &:hover {
    box-shadow: var(--shadow-md);

    &::after {
      transform: scaleX(1);
    }
  }
}
```

### 4. `@media` dentro de bloque de variante

```css
:host-context([data-katachi="sabi"]) .btn {
  border: 2px solid var(--border-strong);
  box-shadow: var(--lib-shadow-brutal);

  @media (hover: hover) {
    &:hover {
      transform: translate(4px, 4px);
      box-shadow: none;
    }
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
}
```

### 5. Multi-selector con `:is()` (spotlight sobre superficie clara)

Antes (plano):
```css
:host([variant="secondary"]) .spotlight-layer,
:host([variant="ghost"]) .spotlight-layer {
  background: var(--lib-spotlight-gradient);
}
```

Después (colapsado):
```css
:host(:is([variant="secondary"], [variant="ghost"])) .spotlight-layer {
  background: var(--lib-spotlight-gradient);
}
```

### 6. Modificador con `::before` y hover

```css
:host([glass]) .btn {
  backdrop-filter: var(--lib-glass-filter);
  background: var(--lib-glass-bg);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--lib-glass-shine);
    pointer-events: none;
    z-index: 0;
  }

  &:hover {
    box-shadow: var(--lib-glass-shadow-hover);
    transform: translateY(-1px);
  }
}
```

---

## Restricción crítica — compound `:host()`

**No anidar atributos dentro de `:host()`**. El nesting en `:host()` genera selectores que no son equivalentes:

```css
/* ✗ INCORRECTO — genera :host([glass])[variant="primary"] (inválido) */
:host([glass]) .btn {
  &[variant="primary"] { ... }
}

/* ✓ CORRECTO — selector plano explícito */
:host([glass][variant="primary"]) .btn {
  &::after { display: none; }
}
```

Los compound `:host([attrA][attrB])` siempre se mantienen planos. Los pseudo-elementos y estados dentro de ellos sí se pueden anidar (`&::after`, `&:hover`).

---

## Hoja de progreso — Atoms

| Archivo | Estado | Notas |
|---|---|---|
| `atoms/button/lib-button.css` | ✅ anidado | piloto — validado stylelint + build |
| `atoms/close-button/lib-close-button.css` | ✅ anidado | 7 variantes × hover + active |
| `atoms/copy-button/lib-copy-button.css` | ✅ anidado | 5 variantes + bloque [copied] |
| `atoms/status-dot/lib-status-dot.css` | ✅ anidado | 4 estados agrupados por status |
| `atoms/bento-item/lib-bento-item.css` | ✅ anidado | [interactive] + hover + active |
| `atoms/kbd/lib-kbd.css` | ✅ anidado | base + is-pressed/active por variante |
| `atoms/switch/lib-switch.css` | ✅ anidado | [checked] + kintsugi completo |
| `atoms/progress/lib-progress.css` | ✅ anidado | tones + square + indeterminate + sizes |
| `atoms/reading-progress/lib-reading-progress.css` | ✅ anidado | bar ::after + kintsugi ::before/::after |
| `atoms/accordion-item/lib-accordion-item.css` | ⬜ skipped | variantes independientes, sin estados repetidos |
| `atoms/aspect-ratio/lib-aspect-ratio.css` | ⬜ skipped | wrapper plano, sin variantes |
| `atoms/avatar/lib-avatar.css` | ⬜ skipped | clases independientes, sin pseudos repetidos |
| `atoms/background/lib-background.css` | ⬜ skipped | 55 variantes únicas, estructura divergente |
| `atoms/badge/lib-badge.css` | ⬜ skipped | variantes planas sin pseudos |
| `atoms/burger-button/lib-burger-button.css` | ⬜ skipped | transforms únicos por variante |
| `atoms/canvas/lib-canvas.css` | ⬜ skipped | display variants mutuamente exclusivos |
| `atoms/card/lib-card.css` | ⬜ skipped | variantes demasiado divergentes |
| `atoms/card/glass-card/lib-glass-card.css` | ⬜ skipped | compuestos independientes |
| `atoms/card/spotlight-card/lib-spotlight-card.css` | ⬜ skipped | color swaps independientes |
| `atoms/card/card-grid/lib-card-grid.css` | ⬜ skipped | layout-only, ::slotted independientes |
| `atoms/checkbox/lib-checkbox.css` | ⬜ skipped | variantes independientes |
| `atoms/code-block/lib-code-block.css` | ⬜ skipped | elementos únicos por variante |
| `atoms/color-scale/lib-color-scale.css` | ⬜ skipped | hover independientes |
| `atoms/content-pillar/content-pillar.css` | ⬜ skipped | tokens bridge, sin attrs repetidos |
| `atoms/display-heading/lib-display-heading.css` | ⬜ skipped | @supports conflicto |
| `atoms/divider/lib-divider.css` | ⬜ skipped | propiedades independientes por variante |
| `atoms/eyebrow/lib-eyebrow.css` | ⬜ skipped | color variants eficientes |
| `atoms/icon/lib-icon.css` | ⬜ skipped | clases planas, sin pseudos |
| `atoms/label/lib-label.css` | ⬜ skipped | estructura mínima |
| `atoms/lib-counter/lib-counter.css` | ⬜ skipped | selectores independientes |
| `atoms/liquid-button/lib-liquid-button.css` | ⬜ skipped | color-only variants |
| `atoms/magnetic/lib-magnetic.css` | ⬜ skipped | componente wrapper mínimo |
| `atoms/progress-circle/lib-progress-circle.css` | ⬜ skipped | arc colors independientes |
| `atoms/quote/lib-quote.css` | ⬜ skipped | surface variants independientes |
| `atoms/radio/lib-radio.css` | ⬜ skipped | selectores independientes |
| `atoms/rating/lib-rating.css` | ⬜ skipped | clip-path independiente |
| `atoms/reading-progress/lib-reading-progress.css` | ✅ anidado | ver arriba |
| `atoms/ripple/lib-ripple.css` | ⬜ skipped | un solo keyframe |
| `atoms/select-option/lib-select-option.css` | ⬜ skipped | estados independientes |
| `atoms/skeleton/lib-skeleton.css` | ⬜ skipped | animation variants simples |
| `atoms/spinner/lib-spinner.css` | ⬜ skipped | cada variante con animación única |
| `atoms/step/lib-step.css` | ⬜ skipped | status variants independientes |
| `atoms/text-glitch/lib-text-glitch.css` | ⬜ skipped | pseudo-elementos únicos por variante |
| `atoms/text-list/lib-text-list.css` | ⬜ skipped | estructura semántica compleja |
| `atoms/tooltip/lib-tooltip.css` | ⬜ skipped | position + variant + size independientes |
| `atoms/visually-hidden/lib-visually-hidden.css` | ⬜ skipped | regla única |

## Próximo: Molecules (18 archivos)

| Archivo | Estado |
|---|---|
| molecules/* | pendiente — auditoría previa |
| organisms/* | pendiente — auditoría previa |

---

## Verificación antes de cada merge

Desde `packages/shibui-ui/`:

```bash
pnpm --filter @shibui/ui stylelint   # linter CSS
pnpm build:shibui                    # build sin errores
pnpm --filter @shibui/ui type-check  # sin regresiones TS
```

Storybook visual es opcional pero recomendado para componentes con efectos (spotlight, glass, katachi).
