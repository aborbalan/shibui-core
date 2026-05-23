# lib-gadget-frame — Opciones de superficie pendientes de decisión

El componente actualmente tiene dos variantes: `card` (default, semántica) y `glass`
(glassmorphism via `--lib-glass-*` tokens). A continuación, opciones de superficie
adicionales que se pueden evaluar.

---

## Variante `glass` — estado actual

Ya implementada. Usa los tokens `--lib-glass-bg`, `--lib-glass-filter`,
`--lib-glass-shine`, `--lib-glass-border`, `--lib-glass-shadow`.

Requiere fondo oscuro visible en el padre para que el `backdrop-filter` sea efectivo.

**Consideración de diseño:** el glass es una decisión estética muy concreta — no activar
por defecto en dashboards sin fondo oscuro. La variante `card` es la más segura como default.

---

## Opciones a valorar

### `variant="kintsugi"`

Combinar la superficie dark del sistema kintsugi (`--bg-base` en contexto dark) con el
borde dorado característico (`--lib-kintsugi-border`).

```css
:host([variant="kintsugi"]) .gadget {
  background: var(--bg-elevated);
  border:     var(--lib-kintsugi-border);  /* gradiente diagonal dorado */
}

:host([variant="kintsugi"]) .gadget-header {
  border-bottom: 1px solid oklch(60% 0.12 45 / .3);  /* seam dorado sutil */
}
```

**Caso de uso:** dashboards con tema kintsugi activado en el ancestro
(`data-katachi="kintsugi"`). El frame llevaría el seam dorado en su borde.

---

### `variant="ghost"`

Frame sin fondo propio — hereda la superficie del contenedor padre.
Útil cuando el dashboard ya tiene un fondo especial (glass, imagen, gradiente).

```css
:host([variant="ghost"]) .gadget {
  background: transparent;
  border:     1px solid var(--border-subtle);
}
```

**Caso de uso:** el gadget-frame actúa solo como contenedor estructural (header +
drag handle + body) sin imponer ninguna superficie visual.

---

### `variant="terminal"`

Superficie oscura con borde verde fósforo, complementando el katachi `terminal`.

```css
:host([variant="terminal"]) .gadget {
  background: oklch(12% 0 0);
  border:     1px solid oklch(65% 0.18 145 / .4);  /* verde fósforo */
}
```

**Caso de uso:** dashboards de monitorización con tema `terminal`.

---

## Notas de implementación

- Todos los variantes nuevos deberían añadirse a `GadgetFrameVariant` en `lib-gadget-frame.types.ts`.
- Añadir cada uno al bloque KATACHI del CSS y a `effects-x-surfaces.md`.
- El `variant="glass"` ya cubre el caso de glassmorphism + katachi mediante los
  tokens `--lib-glass-*` que katachi reescribe.
