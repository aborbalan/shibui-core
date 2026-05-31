# TODO — lib-button

## Texto invisible en hover primary/secondary dentro de kintsugi

**Síntoma**: al hacer hover sobre un botón `variant="primary"` o `variant="secondary"`
dentro de `data-katachi="kintsugi"`, el texto desaparece (invisible).

**Causa**: el bloque kintsugi en `lib-button.css` (dentro de `@supports selector(:host-context(a))`)
define el hover así:

```css
:host-context([data-katachi="kintsugi"]) .btn {
  @media (hover: hover) {
    &:hover {
      background: var(--lib-comp-bg-hover, var(--color-washi-900));
      box-shadow: none;
    }
  }
}
```

El hover fuerza `background: washi-900` (near-black) para todos los variants,
pero NO actualiza el `color`. Resultado por variant:

| Variant | Color texto en hover | Bg en hover | Resultado |
|---|---|---|---|
| `primary` | `--text-inverse` = washi-900 (oscuro) | washi-900 (oscuro) | ❌ invisible |
| `secondary` | `--text-primary` = warm-white 65% | washi-900 (oscuro) | ⚠️ legible pero muy sutil |
| `ghost` | `--text-primary` = warm-white 65% | washi-900 (oscuro) | ⚠️ similar |

**Fix correcto**: el hover en kintsugi debería usar un fondo ligeramente más claro
que el base (`--bg-elevated` elevado) en lugar de `washi-900`, y asegurarse de que
el color del texto sea consistente. Opciones:

```css
/* Opción A — hover más sutil, fondo elevado */
&:hover {
  background: var(--bg-surface);  /* un paso más claro que --bg-elevated */
  color: var(--text-primary);
}

/* Opción B — hover con tinte dorado, más kintsugi */
&:hover {
  background: oklch(18% 0.015 55deg);  /* elevado con leve croma kaki */
  color: var(--text-primary);
}
```

Para `variant="primary"` específicamente, el hover debería distinguirse del fondo
normal del primary (washi-50 en kintsugi) sin invertir el contraste. Considerar
un tinte dorado ligeramente más oscuro que washi-50 pero que mantenga el texto
oscuro legible.

**Afecta también**: verificar los variants `danger`, `outline`, `accent` dentro
de kintsugi — pueden tener el mismo problema de contraste en hover.
