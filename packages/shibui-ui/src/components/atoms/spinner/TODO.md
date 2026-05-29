# TODO · lib-spinner

## Variantes no cambian visualmente en contextos katachi oscuros

**Síntoma:** En `[data-katachi="kintsugi"]`, `[data-katachi="wabi"]` y
`[data-katachi="terminal"]` los spinners `enso`, `sumi` y `shizuku`
son invisibles — solo `kin` (dorado) es visible. En la story
`AllVariants` dentro de esos contextos, las tres variantes parecen idénticas
(nada, nada, nada, dorado).

**Raíz:** Los colores están hardcodeados en `oklch(25% 0.02 45deg)`
(negro casi puro). Al no usar tokens semánticos, no se adaptan al
fondo oscuro del contexto katachi. El atributo `[dark]` existe
exactamente para esto pero hay que setearlo manualmente — los
contextos katachi no lo activan automáticamente.

El bloque `/* ─── KATACHI ─── */` al final del CSS reconoce la deuda:
> "Cada variant tiene su propia paleta hardcoded en OKLCH — son
> identidades visuales deliberadas que no deben adaptarse al katachi
> del ancestro."

Esa decisión era provisional. Ahora hay que revertirla.

---

## Fix propuesto

### `enso` — SVG stroke vía `currentColor`

El stroke se pasa hoy como atributo SVG (`stroke="${stroke.main}"`),
que no puede recibir `var()`. Solución:

1. En `lib-spinner.html.ts` → cambiar `stroke="${stroke.main}"` a
   `stroke="currentColor"` en ambos `<circle>` (blur y main).
2. En `lib-spinner.css` → añadir `color` en `:host` que sirva de
   base para `currentColor`:

```css
:host {
  color: var(--text-primary, oklch(25% 0.02 45deg));
}
```

3. Los selectores de `tone` y `dark` existentes deben sobreescribir
   `color` en lugar de usarse solo en la lógica TS (`ensoStroke()`).
   La función TS puede simplificarse o eliminarse.

```css
:host([tone="accent"])          { color: var(--text-accent, oklch(55% 0.08 45deg)); }
:host([tone="cool"])            { color: oklch(48% 0.06 180deg); }
:host([dark])                   { color: oklch(88% 0.01 60deg); }
:host([dark][tone="accent"])    { color: oklch(70% 0.14 60deg); }
```

### `sumi` — gradiente base con token semántico

Reemplazar el color hardcodeado en `.sp-sumi` (default ink):

```css
/* Antes */
oklch(25% 0.02 45deg / 0.65)

/* Después — token semántico con fallback */
color-mix(in oklch, var(--text-primary, oklch(25% 0.02 45deg)), transparent 35%)
```

O más simple: definir un custom property interno:

```css
:host {
  --_sp-color: var(--text-primary, oklch(25% 0.02 45deg));
}
```

Y usar `color-mix(in oklch, var(--_sp-color), transparent N%)` en
cada stop del `conic-gradient`. Opacidades equivalentes:

| Valor actual | `color-mix` equivalente |
|---|---|
| `/ 0`    | `transparent 100%` |
| `/ 0.08` | `transparent 92%`  |
| `/ 0.25` | `transparent 75%`  |
| `/ 0.65` | `transparent 35%`  |
| `/ 0.92` | `transparent 8%`   |
| `/ 1`    | `transparent 0%`   |

Los selectores `[dark]` y `[dark][tone="accent"]` existentes
pueden seguir sobreescribiendo `--_sp-color` o el `background`
completo.

### `shizuku` — background del span

Cambio mínimo en una línea:

```css
/* Antes */
.sp-shizuku span {
  background: oklch(25% 0.02 45deg);
}

/* Después */
.sp-shizuku span {
  background: var(--text-primary, oklch(25% 0.02 45deg));
}
```

El selector `[dark]` ya sobreescribe a `oklch(65% 0.12 60deg)` —
no necesita cambios.

### `kin` — no tocar

El anillo dorado es una identidad deliberada. Funciona en todos los
contextos porque el dorado es visible tanto en claro como en oscuro.

---

## Archivos a modificar

- `lib-spinner.html.ts` — eliminar/simplificar `ensoStroke()` y
  pasar `stroke="currentColor"` en el SVG
- `lib-spinner.css` — añadir `color` en `:host`, tokens de tone/dark
  vía CSS, `--_sp-color` para sumi, fix de shizuku span

## Scope

Fase 3 — no es blocking para otros componentes.
