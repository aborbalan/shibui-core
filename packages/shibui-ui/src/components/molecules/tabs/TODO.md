# TODO — lib-tabs

## Revisar efecto seam en kintsugi

**Síntoma**: la seam dorada animada en `.tb-list::before` queda visualmente rara
en ciertas configuraciones de tabs.

**Causa probable**: `.tb-list` tiene `overflow: hidden` añadido para el seam,
lo que puede estar recortando elementos hijos (ink bar, tabs que sobresalen,
dropdowns de overflow). En la variante `underline` el ink bar vive en el mismo
`.tb-list` — la animación puede interferir con el z-index del tab activo.

**Cosas a revisar en Storybook (KatachiKintsugi):**
- Variant `underline` — ¿se ve el ink bar correctamente bajo la seam?
- Variant `pill` — ¿el overflow:hidden corta la pill activa?
- Variant `card` / `outline` — ¿la seam queda fuera de lugar visualmente?
- ¿El `z-index: 2` de la seam solapa texto de los tabs?

**Posibles soluciones:**
- Mover el seam a `:host::before` en vez de `.tb-list::before`, evitando
  el `overflow: hidden` en el propio list.
- Reducir la altura de la seam a 1px en tabs (más sutil que en cards).
- Limitar el seam solo a la variante `default` / `card` donde tiene más sentido,
  y omitirlo en `underline` donde el ink bar ya cumple el rol kintsugi.
- Reconsiderar si la decoración correcta para tabs es el seam o directamente
  potenciar el ink bar (que ya tiene gradiente + glow en kintsugi).
