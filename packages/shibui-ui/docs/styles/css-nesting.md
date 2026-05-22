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

## Hoja de progreso

| Archivo | Estado | Notas |
|---|---|---|
| `atoms/button/lib-button.css` | ✅ anidado | piloto — validado stylelint + build |
| `atoms/background/lib-background.css` | pendiente | ~950 líneas |
| `atoms/burger-button/lib-burger-button.css` | pendiente | ~672 líneas |
| `atoms/tooltip/lib-tooltip.css` | pendiente | |
| `atoms/step/lib-step.css` | pendiente | |
| resto de atoms (38) | pendiente | |
| molecules (18) | pendiente | |
| organisms (16) | pendiente | |

---

## Verificación antes de cada merge

Desde `packages/shibui-ui/`:

```bash
pnpm --filter @shibui/ui stylelint   # linter CSS
pnpm build:shibui                    # build sin errores
pnpm --filter @shibui/ui type-check  # sin regresiones TS
```

Storybook visual es opcional pero recomendado para componentes con efectos (spotlight, glass, katachi).
