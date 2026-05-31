# TODO — lib-tree-select

## Hover de nodo/fila ilegible en kintsugi

**Síntoma**: al pasar el cursor sobre filas del árbol en contexto
`data-katachi="kintsugi"`, el fondo pasa de oscuro a un gris claro
que puede hacer el texto ilegible.

**Causa**: los hovers usan `var(--color-washi-100)` hardcodeado:

```css
/* lib-tree-select.css — líneas aprox. 213-214 y 294-296 */
.ts-node-row:hover      { background: var(--color-washi-100); }
.ts-toggle:hover        { background: var(--color-washi-100); }
```

`washi-100` es `#F2EDE6` — gris cálido claro. En kintsugi (fondo washi-950,
near-black) el contraste se invierte y el texto warm-white al 65% queda
ilegible sobre ese fondo claro.

**Fix correcto**: reemplazar con token semántico que adapte al katachi:

```css
.ts-node-row:hover { background: var(--bg-surface); }
.ts-toggle:hover   { background: var(--bg-surface); }
```

En kintsugi, `--bg-surface` = `oklch(11.39% 0.009 84.7deg)` (oscuro, legible).
En light katachis, `--bg-surface` reproduce el hover claro correcto.

**También revisar**:
- `.ts-btn:hover` usa `washi-900/washi-50` — en kintsugi esto puede quedar
  como blanco sobre negro (correcto), pero verificar que el texto sea legible.
- `.ts-node-row.is-selected:hover` (línea ~221) — verificar contraste.
- El panel del árbol (`.ts-panel`) usa `--bg-elevated` que sí adapta — OK.
