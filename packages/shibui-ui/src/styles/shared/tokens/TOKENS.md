# Design Tokens — `@shibui/ui`

Referencia completa de todos los tokens del sistema de diseño.  
Todos están definidos como CSS custom properties en `:root` (no `:host, :root`) y se importan automáticamente cuando se usa `tokens.css?inline`.

---

## Arquitectura

Los tokens se organizan en tres capas jerárquicas:

```
Primitivos  →  Compuestos  →  Semánticos
(paleta cruda)  (referencias)  (uso concreto en UI)
```

Los **componentes siempre consumen tokens semánticos**. Los primitivos solo existen para construir la capa semántica; no deben usarse directamente en CSS de componentes.

---

## Ficheros

| Fichero | Contenido |
|---|---|
| [`_palette.css`](./_palette.css) | Paletas de color crudas (washi, ink, kaki, celadón) |
| [`_typography.css`](./_typography.css) | Escala de tamaños, pesos, familias, interlineado, tracking |
| [`_spacing.css`](./_spacing.css) | Espaciado, z-index, radios de borde |
| [`_motion.css`](./_motion.css) | Duraciones, curvas de Bézier, transiciones compuestas |
| [`_state.css`](./_state.css) | Colores de estado (error, warning, success, info, disabled) |
| [`_semantic.css`](./_semantic.css) | Tokens de superficie (bg, text, border, shadows) + dark mode |
| [`_effects.css`](./_effects.css) | Glass system, Spotlight system, Kintsugi, textura metal, **effect-activation tokens** |
| [`_katachi.css`](../tokens/_katachi.css) | 6 identidades selladas — overrides semánticos + activación de efectos por contexto |

---

## Paleta — `_palette.css`

Colores primitivos en espacio de color **OKLCH** para uniformidad perceptual. No usar directamente en componentes; referenciar los tokens semánticos.

### Washi — tonos neutros de papel

Escala de 11 pasos inspirada en el papel washi japonés. Es la familia principal para fondos, textos y bordes.

| Token | Valor hex | Uso habitual |
|---|---|---|
| `--color-washi-50` | `#FAF7F4` | Fondo base de la app |
| `--color-washi-100` | `#F2EDE6` | Superficies (cards, panels) |
| `--color-washi-200` | `#E5DDD3` | Bordes sutiles |
| `--color-washi-300` | `#D3C8BC` | Bordes por defecto |
| `--color-washi-400` | `#B8A99A` | Texto deshabilitado / muted |
| `--color-washi-500` | `#9A8878` | Bordes fuertes |
| `--color-washi-600` | `#7A6A5C` | Texto secundario |
| `--color-washi-700` | `#5C4E42` | — |
| `--color-washi-800` | `#3D332A` | Fondo elevado en dark mode |
| `--color-washi-900` | `#221C16` | Texto primario / fondo dark |
| `--color-washi-950` | `#120E0A` | Fondo base en dark mode |

### Ink — sombra de tinta sumi

Color único (`#1A140E`) a distintas opacidades. Se usa exclusivamente para sombras y overlays en light mode, preservando el tono cálido de la tinta.

| Token | Opacidad | Uso habitual |
|---|---|---|
| `--color-ink-0` | 0% | Transparente (base para transiciones) |
| `--color-ink-10` | 6% | Sombras ligeras (`shadow-sm`, `shadow-md`) |
| `--color-ink-20` | 12% | Sombra profunda (`shadow-xl`) |
| `--color-ink-40` | 25% | — |
| `--color-ink-60` | 50% | Overlay de modal / `--bg-overlay` |
| `--color-ink-80` | 75% | — |
| `--color-ink-100` | 100% | Color de tinta sólida / `--lib-shibui-ink` |

### Kaki — acento caqui/persimón

Familia de acentos cálidos. Tono 500 es el acento principal de la librería.

| Token | Valor hex | Uso habitual |
|---|---|---|
| `--color-kaki-50` | `#FDF3EC` | — |
| `--color-kaki-100` | `#FAE2CC` | — |
| `--color-kaki-200` | `#F4C099` | — |
| `--color-kaki-300` | `#EB9660` | Acento en dark mode (`--text-accent`) |
| `--color-kaki-400` | `#D97234` | Decoraciones, highlights |
| `--color-kaki-500` | `#B85A1E` | **Acento principal** (`--lib-shibui-kaki`) |
| `--color-kaki-600` | `#8C4115` | — |
| `--color-kaki-700` | `#602C0E` | Kaki más oscuro |

### Celadón — acento jade

Familia de acentos frescos. Tono 500 es el color primario interactivo de la librería.

| Token | Valor hex | Uso habitual |
|---|---|---|
| `--color-celadon-50` | `#EFF5F3` | — |
| `--color-celadon-100` | `#D3E8E1` | — |
| `--color-celadon-200` | `#A8D0C4` | `--color-info-border` |
| `--color-celadon-300` | `#79B5A3` | Links en dark mode |
| `--color-celadon-400` | `#4E9482` | Focus ring (`--border-focus`), link hover |
| `--color-celadon-500` | `#357164` | **Color primario** (`--lib-shibui-water`) |
| `--color-celadon-600` | `#245249` | — |

### Base

| Token | Valor | Uso habitual |
|---|---|---|
| `--color-white` | `#FFFFFF` | Fondo elevado en light mode |

---

## Tipografía — `_typography.css`

### Escala de tamaños

Sistema de 10 pasos. El paso base es `--text-base` (15px). Los tamaños por encima de `--text-xl` son para headings y display.

| Token | Valor | px equiv. | Uso habitual |
|---|---|---|---|
| `--text-xs` | `0.6875rem` | 11px | Etiquetas, captions, badges |
| `--text-sm` | `0.8125rem` | 13px | Texto de apoyo, metadata |
| `--text-base` | `0.9375rem` | 15px | Cuerpo de texto principal |
| `--text-md` | `1.0625rem` | 17px | Cuerpo ligeramente mayor |
| `--text-lg` | `1.25rem` | 20px | Subtítulos, intro párrafos |
| `--text-xl` | `1.5rem` | 24px | Headings de sección |
| `--text-2xl` | `2rem` | 32px | Headings de página |
| `--text-3xl` | `2.75rem` | 44px | Headings grandes |
| `--text-4xl` | `3.75rem` | 60px | Display / hero |
| `--text-5xl` | `5rem` | 80px | Display máximo |

### Pesos

| Token | Valor | Uso habitual |
|---|---|---|
| `--weight-light` | `300` | Cuerpo ligero, citas |
| `--weight-regular` | `400` | Cuerpo de texto por defecto |
| `--weight-medium` | `500` | Labels, nav items |
| `--weight-semibold` | `600` | Headings, emphasis |
| `--weight-bold` | `700` | Headings fuertes, CTAs |

### Familias tipográficas

| Token | Familia | Uso habitual |
|---|---|---|
| `--lib-font-display` | Cormorant Garamond, serif | Headings editoriales, hero, títulos destacados |
| `--lib-font-body` | Shippori Mincho, serif | Cuerpo de texto, párrafos |
| `--lib-font-mono` | DM Mono, monospace | Código, IDs, datos técnicos |
| `--lib-font-family-base` | alias de `--lib-font-body` | Valor por defecto para `font-family` en componentes |

### Interlineado (line-height)

| Token | Valor | Uso habitual |
|---|---|---|
| `--leading-tight` | `1.2` | Headings grandes, display |
| `--leading-snug` | `1.4` | Headings medianos |
| `--leading-normal` | `1.6` | Cuerpo de texto por defecto |
| `--leading-relaxed` | `1.8` | Texto de lectura extendida |
| `--leading-loose` | `2.2` | Texto muy espaciado, poético |

### Tracking (letter-spacing)

| Token | Valor | Uso habitual |
|---|---|---|
| `--tracking-tight` | `-0.02em` | Headings display grandes |
| `--tracking-normal` | `0em` | Cuerpo de texto |
| `--tracking-wide` | `0.08em` | Labels, tags |
| `--tracking-wider` | `0.15em` | Labels elegantes en mayúsculas |
| `--tracking-widest` | `0.25em` | Títulos en versales, decorativos |

### Tokens lib de tipografía

Valores preconfigurados para el estilo editorial Shibui.

| Token | Valor | Uso habitual |
|---|---|---|
| `--lib-tracking-elegant` | `0.15em` | Espaciado de letras estándar para labels en mayúsculas |
| `--lib-font-size-base` | `14px` | Tamaño base de algunos componentes |
| `--lib-text-transform` | `uppercase` | Transformación por defecto de labels elegantes |
| `--lib-border-width` | `1.5px` | Ancho de borde estándar de la librería |

---

## Espaciado — `_spacing.css`

### Escala de espaciado

Sistema basado en una unidad de 4px (`0.25rem`). Todos los valores son múltiplos exactos para mantener un grid armónico.

| Token | Valor | px equiv. | Uso habitual |
|---|---|---|---|
| `--lib-spacing-unit` | `0.25rem` | 4px | Unidad base. No usar directamente |
| `--lib-space-xs` | `0.25rem` | 4px | Gap mínimo, padding icono |
| `--lib-space-sm` | `0.5rem` | 8px | Padding compacto, gap entre elementos |
| `--lib-space-md` | `1rem` | 16px | Padding estándar de componentes |
| `--lib-space-lg` | `1.5rem` | 24px | Espaciado entre grupos |
| `--lib-space-xl` | `2rem` | 32px | Separación de secciones |
| `--lib-space-2xl` | `3rem` | 48px | Layouts de página, secciones grandes |
| `--lib-space-3xl` | `4rem` | 64px | Espaciado de hero, separación máxima |

### Z-index

Escala de capas de apilamiento. Usar siempre estos tokens para evitar conflictos.

| Token | Valor | Uso habitual |
|---|---|---|
| `--z-base` | `0` | Elementos en flujo normal |
| `--z-raised` | `10` | Dropdowns, menús flotantes |
| `--z-overlay` | `100` | Fondos de overlay (drawer backdrop) |
| `--z-modal` | `200` | Modales, dialogs |
| `--z-toast` | `300` | Notificaciones toast |
| `--z-tooltip` | `400` | Tooltips (siempre encima de todo) |

### Radios de borde — escala estándar

| Token | Valor | Uso habitual |
|---|---|---|
| `--radius-none` | `0` | Sin redondeo |
| `--radius-sm` | `2px` | Redondeo mínimo |
| `--radius-md` | `4px` | Componentes interactivos (botones, inputs) |
| `--radius-lg` | `8px` | Cards, paneles |
| `--radius-xl` | `16px` | Elementos grandes (modales, banners) |
| `--radius-full` | `9999px` | Pills, badges circulares |

### Radios de borde — escala brutalista

Variantes de radio mínimo para el estilo editorial de Shibui. El máximo permitido es 2px.

| Token | Valor | Uso habitual |
|---|---|---|
| `--lib-radius-xs` | `0px` | Sin redondeo absoluto |
| `--lib-radius-sm` | `0px` | Sin redondeo absoluto |
| `--lib-radius-md` | `1px` | Casi recto, apenas perceptible |
| `--lib-radius-lg` | `2px` | Redondeo máximo en estilo brutalista |

---

## Motion — `_motion.css`

### Duraciones

| Token | Valor | Uso habitual |
|---|---|---|
| `--duration-fast` | `100ms` | Micro-interacciones (hover, focus) |
| `--duration-base` | `200ms` | Transiciones estándar |
| `--duration-slow` | `350ms` | Entradas y salidas de elementos |
| `--duration-slower` | `600ms` | Animaciones elaboradas, reveals |

### Curvas de Bézier

| Token | Curva | Uso habitual |
|---|---|---|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transición estándar (Material ease) |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elementos que salen de pantalla |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elementos que entran en pantalla |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Feedback táctil, confirmaciones |

### Transiciones compuestas

Shorthands listos para usar en `transition-duration` + `transition-timing-function`. Equivalen a combinar duración y easing manualmente.

| Token | Equivale a | Uso habitual |
|---|---|---|
| `--transition-fast` | `100ms ease-default` | Cambios de estado rápidos (color, opacidad) |
| `--transition-base` | `200ms ease-default` | Transición estándar de componentes |
| `--transition-slow` | `350ms ease-default` | Entradas/salidas con más presencia |

Ejemplo de uso:
```css
transition: background var(--transition-base), border-color var(--transition-fast);
```

---

## Estados — `_state.css`

### Colores base de estado

| Token | Hex | Significado |
|---|---|---|
| `--color-error` | `#8C2A1A` | Error, peligro, acción destructiva |
| `--color-warning` | `#8C6A1A` | Advertencia, atención requerida |
| `--color-success` | `#2A5C3A` | Éxito, confirmación, completado |
| `--color-info` | `#4E9482` | Información neutral (mismo valor que celadón-400) |

### Fondos y bordes sutiles

Pares de fondo + borde para usar en badges, alerts y banners de estado. Los fondos son casi blancos para no interferir con el contenido.

| Token | Hex | Uso |
|---|---|---|
| `--color-error-subtle` | `#FFF0EE` | Fondo de badge/alert error |
| `--color-error-border` | `#F5C4BC` | Borde de badge/alert error |
| `--color-warning-subtle` | `#FDF8EE` | Fondo de badge/alert warning |
| `--color-warning-border` | `#F5E0A0` | Borde de badge/alert warning |
| `--color-success-subtle` | `#EFF5F1` | Fondo de badge/alert success |
| `--color-success-border` | `#BDD8C5` | Borde de badge/alert success |
| `--color-info-subtle` | `#EFF5F3` | Fondo de badge/alert info |
| `--color-info-border` | `#A8D0C4` | Borde de badge/alert info |

### Textos de estado

Para el color del texto dentro de elementos de estado (el icono, la etiqueta de un alert, etc.).

| Token | Resuelve a | Uso |
|---|---|---|
| `--text-error` | `--color-error` | Texto de error |
| `--text-warning` | `--color-warning` | Texto de advertencia |
| `--text-success` | `--color-success` | Texto de éxito |
| `--text-info` | `--color-info` | Texto informativo |

### Estado deshabilitado

Tokens unificados para cualquier elemento interactivo en estado `disabled`.

| Token | Resuelve a | Uso |
|---|---|---|
| `--color-disabled-bg` | `--color-washi-100` | Fondo del elemento deshabilitado |
| `--color-disabled-text` | `--color-washi-400` | Texto del elemento deshabilitado |
| `--color-disabled-border` | `--color-washi-200` | Borde del elemento deshabilitado |

---

## Semánticos — `_semantic.css`

### Identidad Shibui

Los cuatro arquetipos del sistema de diseño. Son la capa de nombres filosóficos que mapean la paleta al lenguaje Shibui.

| Token | Resuelve a | Significado |
|---|---|---|
| `--lib-shibui-water` | `--color-celadon-500` | Agua — el color primario, fresco y sereno |
| `--lib-shibui-kaki` | `--color-kaki-500` | Caqui — el acento cálido, orgánico |
| `--lib-shibui-paper` | `--color-washi-100` | Papel — el fondo base, neutro cálido |
| `--lib-shibui-ink` | `--color-ink-100` | Tinta — el texto, sólido y preciso |

### Mapeado semántico base

Alias de uso general para theming de componentes.

| Token | Resuelve a | Uso |
|---|---|---|
| `--lib-color-primary` | `--lib-shibui-water` | Color interactivo principal |
| `--lib-color-bg` | `--lib-shibui-paper` | Fondo general |
| `--lib-color-text` | `--lib-shibui-ink` | Texto general |

### Fondos semánticos

| Token | Light mode | Dark mode | Uso |
|---|---|---|---|
| `--bg-base` | washi-50 `#FAF7F4` | washi-950 `#120E0A` | Fondo raíz de la app |
| `--bg-surface` | washi-100 `#F2EDE6` | washi-900 `#221C16` | Cards, paneles, sidebars |
| `--bg-elevated` | white `#FFFFFF` | washi-800 `#3D332A` | Elementos por encima de la superficie |
| `--bg-inverse` | washi-900 `#221C16` | washi-50 `#FAF7F4` | Fondos con contraste invertido (tooltips dark) |
| `--bg-overlay` | ink-60 (50% opac.) | negro 70% opac. | Fondo de modales, drawers, lightboxes |

### Textos semánticos

| Token | Light mode | Dark mode | Uso |
|---|---|---|---|
| `--text-primary` | washi-900 `#221C16` | washi-50 `#FAF7F4` | Texto principal, headings |
| `--text-secondary` | washi-600 `#7A6A5C` | washi-400 `#B8A99A` | Texto de apoyo, subtítulos |
| `--text-muted` | washi-400 `#B8A99A` | washi-600 `#7A6A5C` | Placeholders, metadata, hints |
| `--text-inverse` | washi-50 `#FAF7F4` | washi-900 `#221C16` | Texto sobre fondos oscuros (botón primary) |
| `--text-accent` | kaki-500 `#B85A1E` | kaki-300 `#EB9660` | Énfasis especial, highlights editoriales |
| `--text-link` | celadón-500 `#357164` | celadón-300 `#79B5A3` | Color de enlaces |
| `--text-link-hover` | celadón-400 `#4E9482` | celadón-200 `#A8D0C4` | Color de enlaces en hover |

### Bordes semánticos

| Token | Light mode | Dark mode | Uso |
|---|---|---|---|
| `--border-subtle` | washi-200 `#E5DDD3` | washi-800 `#3D332A` | Separadores apenas visibles, divisores |
| `--border-default` | washi-300 `#D3C8BC` | washi-700 `#5C4E42` | Bordes de inputs, cards |
| `--border-strong` | washi-500 `#9A8878` | washi-500 `#9A8878` | Bordes con énfasis, activos |
| `--border-focus` | celadón-400 `#4E9482` | celadón-400 `#4E9482` | Focus ring de accesibilidad |

### Sombras

Las sombras usan tinta sumi semitransparente en light mode. En dark mode usan negro puro con mayor opacidad.

| Token | Uso |
|---|---|
| `--shadow-sm` | Elevación mínima: chips, tags |
| `--shadow-md` | Elevación media: cards, inputs con foco |
| `--shadow-lg` | Elevación alta: dropdowns, popovers |
| `--shadow-xl` | Elevación máxima: modales, paneles flotantes |
| `--lib-shadow-brutal` | Sombra sólida offset (4px 4px, estilo brutalista) |
| `--lib-shadow-glass` | Sombra suave para elementos glass |

---

## Efectos — `_effects.css`

### Glass System (Efecto Enso)

Sistema completo para crear superficies de cristal esmerilado (glassmorphism). Requiere `overflow: hidden` en el contenedor y `backdrop-filter` en el elemento.

#### Primitivos de configuración

Controlan el comportamiento global del sistema. Se pueden sobreescribir localmente para personalizar intensidad.

| Token | Valor | Qué controla |
|---|---|---|
| `--lib-glass-blur-amount` | `12px` | Cantidad de desenfoque del backdrop-filter |
| `--lib-glass-saturate-amount` | `120%` | Saturación del backdrop-filter |
| `--lib-glass-bg-opacity` | `0.15` | Opacidad del fondo del cristal |
| `--lib-glass-border-opacity` | `0.20` | Opacidad del borde blanco |
| `--lib-glass-shadow-opacity` | `0.37` | Opacidad de la sombra de profundidad |
| `--lib-glass-shine-start` | `0.35` | Opacidad inicial del gradiente de luz |
| `--lib-glass-shine-end` | `0.05` | Opacidad final del gradiente de luz |

#### Niveles de intensidad

Para sobreescribir el blur y la opacidad de forma predefinida según el efecto deseado.

| Token | Valor | Uso |
|---|---|---|
| `--lib-glass-blur-low` | `4px` | Glass sutil, casi imperceptible |
| `--lib-glass-blur-md` | `12px` | Glass estándar (valor por defecto) |
| `--lib-glass-blur-high` | `25px` | Glass profundo, muy difuminado |
| `--lib-glass-opacity-low` | `0.10` | Fondo muy transparente |
| `--lib-glass-opacity-md` | `0.15` | Fondo estándar |
| `--lib-glass-opacity-high` | `0.25` | Fondo más opaco |

#### Tokens compuestos

Listos para asignar directamente a propiedades CSS.

| Token | Propiedad CSS destino | Descripción |
|---|---|---|
| `--lib-glass-bg` | `background` | Fondo neutro del cristal (tono papel) |
| `--lib-glass-bg-water` | `background` | Variante azul-jade (botón primary glass) |
| `--lib-glass-bg-kaki` | `background` | Variante cálida/caqui (botón accent glass) |
| `--lib-glass-filter` | `backdrop-filter` | Desenfoque + saturación combinados |
| `--lib-glass-border` | `border` | Borde blanco semitransparente |
| `--lib-glass-shadow` | `box-shadow` | Sombra de profundidad del cristal |
| `--lib-glass-shadow-hover` | `box-shadow` | Sombra más pronunciada para hover |
| `--lib-glass-shine` | `background` (en `::before`) | Gradiente diagonal que simula reflexión de luz |
| `--lib-glass-text` | `color` | Color de texto sobre glass (siempre paper) |
| `--lib-glass-text-shadow` | `text-shadow` | Sombra de texto para mejorar legibilidad |

Patrón de uso en un componente glass:
```css
:host {
  background: var(--lib-glass-bg);
  backdrop-filter: var(--lib-glass-filter);
  border: var(--lib-glass-border);
  box-shadow: var(--lib-glass-shadow);
  overflow: hidden; /* obligatorio */
}

:host::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--lib-glass-shine);
  pointer-events: none;
  z-index: 0;
}
```

---

### Spotlight System (Kintsugi Digital)

Sistema de iluminación reactiva al cursor. Las coordenadas `--lib-spotlight-x` y `--lib-spotlight-y` se actualizan desde JavaScript en el evento `mousemove`.

#### Primitivos

| Token | Valor por defecto | Descripción |
|---|---|---|
| `--lib-spotlight-x` | `50%` | Posición horizontal del foco (actualizada por JS) |
| `--lib-spotlight-y` | `50%` | Posición vertical del foco (actualizada por JS) |
| `--lib-spotlight-opacity` | `0.12` | Intensidad máxima del gradiente |
| `--lib-spotlight-feather` | `60%` | Radio de difuminado del foco |
| `--lib-spotlight-transition` | `background 0.15s ease-out` | Suavizado del movimiento |

#### Gradientes compuestos

Listos para asignar a `background` o a un pseudo-elemento `::after`.

| Token | Variante | Uso |
|---|---|---|
| `--lib-spotlight-gradient` | Kaki (cálido) | Superficies con acento orgánico |
| `--lib-spotlight-gradient-water` | Celadón (fresco) | Superficies primarias |
| `--lib-spotlight-gradient-white` | Blanco neutro | Superficies oscuras o dark mode |

Patrón de uso desde TypeScript:
```typescript
private _onMouseMove(e: MouseEvent): void {
  const rect = this.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  this.style.setProperty('--lib-spotlight-x', `${x}%`);
  this.style.setProperty('--lib-spotlight-y', `${y}%`);
}
```

---

### Texturas y efectos decorativos

#### Textura metal/seda

SVG de ruido fractal incrustado como data URI. Se superpone sobre el spotlight para añadir textura orgánica.

| Token | Descripción |
|---|---|
| `--lib-metal-texture` | Data URI de un SVG con filtro `feTurbulence` (ruido fractal) |
| `--lib-metal-texture-opacity` | `0.03` — Opacidad de la textura (muy sutil por defecto) |

#### Borde kintsugi

Gradiente diagonal que simula el hilo de oro en las grietas de la técnica kintsugi japonesa. Se usa con `mask-composite` para crear bordes decorativos.

| Token | Descripción |
|---|---|
| `--lib-kintsugi-border` | Gradiente 135° con opacidad kaki en los extremos y transparente en el centro |

---

## Dark mode

Los tokens semánticos de `_semantic.css` se sobreescriben automáticamente cuando el host tiene el atributo `data-theme="dark"`.

```html
<lib-card data-theme="dark">...</lib-card>
```

Los tokens que cambian en dark mode son: `--bg-*`, `--text-*`, `--border-*` y `--shadow-*`. Los tokens primitivos de paleta y los tokens de efectos no cambian.

---

## Tokens de activación de efectos — `_effects.css`

Añadidos en mayo 2026 para el modelo de identidades selladas. Son los "interruptores"
que los bloques `[data-katachi="x"]` en `_katachi.css` usan para activar efectos
en los componentes sin necesidad de variantes con nombres de paleta.

**Regla crítica**: estos tokens (y todos los demás) están definidos en `:root { }` — nunca
en `:host, :root { }`. El selector `:host` en un `adoptedStyleSheet` de Shadow DOM fija
el valor directamente en el shadow host, bloqueando la herencia desde el ancestro
`[data-katachi]` en el light DOM.

### Tabla de effect-activation tokens

| Token | Default (`:root`) | Controla | Quién lo activa |
|---|---|---|---|
| `--lib-effect-seam-play` | `paused` | `animation-play-state` del seam `::before` | kintsugi |
| `--lib-effect-seam-opacity` | `0` | `opacity` del seam pseudo-element | kintsugi |
| `--lib-effect-glitch-play` | `paused` | `animation-play-state` del glitch-drift | terminal |
| `--lib-effect-scanlines` | `0` | Alpha del stripe color en repeating-gradient | terminal (0.10) |
| `--lib-effect-crt-vignette` | `0` | Opacidad del vignette inset | terminal (0.50) |
| `--lib-effect-brutal-shadow` | `none` | `box-shadow` del elemento raíz | sabi (brutal) · kintsugi (gold ring) |
| `--lib-effect-glass-blur` | `0px` | `--lib-glass-blur-amount` en contexto glass | — (ningún katachi actual) |
| `--lib-effect-topbar-opacity` | `0` | `opacity` de la barra top 3px `::before` | kintsugi · terminal |
| `--lib-effect-topbar-bg` | `transparent` | `background` de la barra top | terminal (phosphor sólido) |

**Patrón de uso en componentes:**

```css
/* Siempre declarado; visible solo con el katachi correcto */
.card::before {
  animation-play-state: var(--lib-effect-seam-play, paused);
  opacity: var(--lib-effect-topbar-opacity, 0);
}

.card::after {
  background: repeating-linear-gradient(
    0deg,
    transparent, transparent 3px,
    /* --lib-effect-scanlines como alpha del COLOR, no del elemento */
    oklch(100% 0 0deg / var(--lib-effect-scanlines, 0)) 3px,
    oklch(100% 0 0deg / var(--lib-effect-scanlines, 0)) 4px
  );
}

.card {
  box-shadow: var(--lib-effect-brutal-shadow, none);
}
```

---

## Tokens añadidos en el refactor (mayo 2026)

Tokens nuevos que no existían en el fichero original monolítico:

| Token | Fichero | Motivo de la adición |
|---|---|---|
| `--weight-bold` | `_typography.css` | La escala de pesos se cortaba en 600; faltaba el 700 |
| `--lib-space-2xl` | `_spacing.css` | Los layouts de página usaban `2.5rem` hardcodeado |
| `--lib-space-3xl` | `_spacing.css` | Espaciado de secciones hero sin token |
| `--transition-fast/base/slow` | `_motion.css` | Shorthands que evitan repetir duration + ease |
| `--color-warning-subtle/border` | `_state.css` | Paridad con error y success, que sí los tenían |
| `--color-info-subtle/border` | `_state.css` | Paridad con error y success |
| `--text-error/warning/success/info` | `_state.css` | No había tokens de texto para estados |
| `--color-disabled-bg/text/border` | `_state.css` | Ningún componente tenía donde apoyarse para disabled |
| `--bg-overlay` | `_semantic.css` | Modales usaban `--color-ink-60` directamente |
| `--border-focus` | `_semantic.css` | No existía token de focus ring para accesibilidad |
| `--text-link` / `--text-link-hover` | `_semantic.css` | Los links no tenían token semántico propio |
