# TODO — lib-data-table

## Hover de fila ilegible en kintsugi

**Síntoma**: al pasar el cursor sobre una fila en contexto `data-katachi="kintsugi"`,
el fondo pasa de oscuro (washi-950) a casi blanco, haciendo el texto completamente
ilegible.

**Causa**: el hover usa `background: var(--color-washi-50)` hardcodeado en múltiples
lugares del CSS:

```css
/* lib-data-table.css — líneas aprox. 221, 237, 247, 251 */
tbody tr:hover { background: var(--color-washi-50); }
```

`washi-50` es `#FAF7F4` — near-white. En kintsugi el fondo base es `washi-950`
(near-black), por lo que el contraste texto/fondo se invierte bruscamente.

**Fix correcto**: reemplazar `var(--color-washi-50)` por un token semántico de hover
que se adapte al katachi activo:

```css
/* Opción A — usar bg-surface (adapta a light/dark vía katachi) */
tbody tr:hover { background: var(--bg-surface); }

/* Opción B — usar lib-comp-bg-hover si se quiere más control */
tbody tr:hover { background: var(--lib-comp-bg-hover, var(--bg-surface)); }
```

En katachis dark (kintsugi, celadon, wabi, terminal), `--bg-surface` es oscuro (p. ej. kintsugi
`oklch(11.39% 0.009 84.7deg)`, legible).
En light katachis (shizen, sabi), `--bg-surface` da el hover claro correcto.

**Afecta a**:
- Todas las variants de tabla (lines, zebra, card)
- Filas selected, error, warning, success en hover también usan colores hardcoded
  — revisar si aplica el mismo problema en esos estados.
