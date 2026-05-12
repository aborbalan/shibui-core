# Compatibilidad Mobile — Componentes `@shibui/ui`

> Última revisión: 2026-05-12  
> Versión de referencia: rama `develop`

---

## Leyenda

| Icono | Estado | Descripción |
|-------|--------|-------------|
| ✅ | **Compatible** | Responsive nativo. Funciona correctamente en móvil sin ajustes adicionales. |
| ⚠️ | **Parcial** | Funciona en móvil pero con limitaciones conocidas o degradación de experiencia. |
| ❌ | **No compatible** | No diseñado para móvil. Desactivado o inutilizable en touch. |
| 🔧 | **Pendiente** | Sin media queries detectadas. Requiere revisión y potencial adaptación. |

---

## Breakpoints del sistema

| Breakpoint | Uso principal |
|------------|---------------|
| `480px` | Dispositivos muy pequeños (móviles compactos) |
| `640px` | Punto de corte mobile principal |
| `700px` | Específico de card-grid (columnas featured) |
| `768px` | Tablet / mobile landscape |

---

## Átomos

| Componente | Tag | Estado | Breakpoints | Observaciones |
|-----------|-----|--------|-------------|---------------|
| accordion-item | `lib-accordion-item` | ✅ | — | `prefers-reduced-motion` aplicado |
| aspect-ratio | `lib-aspect-ratio` | ✅ | — | Contenedor puro, se adapta al flujo |
| avatar | `lib-avatar` | ✅ | — | Estático, sin interacción compleja |
| background | `lib-background` | ✅ | — | Decorativo, no afecta al layout |
| badge | `lib-badge` | ✅ | — | Elemento inline, escala con el contenedor |
| bento-item | `lib-bento-item` | ✅ | — | `prefers-reduced-motion` aplicado |
| burger-button | `lib-burger-button` | ✅ | — | Diseñado específicamente para mobile nav |
| button | `lib-button` | ✅ | — | Hover guard `@media (hover: hover)`; estado activo en touch |
| card | `lib-card` | ✅ | 700px, 600px | Card-grid: featured cards de 2 → 1 columna; `@media (hover: hover)` en hover effects |
| checkbox | `lib-checkbox` | ✅ | — | Elemento de formulario estándar |
| close-button | `lib-close-button` | ✅ | — | `prefers-reduced-motion` aplicado |
| code-block | `lib-code-block` | ⚠️ | — | Líneas largas pueden desbordarse; necesita `overflow-x: auto` en el contenedor |
| color-scale | `lib-color-scale` | 🔧 | — | Sin media queries; herramienta visual de paleta |
| content-pillar | `lib-content-pillar` | ✅ | — | Layout estático, se adapta al flujo |
| copy-button | `lib-copy-button` | ✅ | — | `prefers-reduced-motion`; funcional en touch |
| counter | `lib-counter` | ✅ | — | Animación numérica, no requiere hover |
| display-heading | `lib-display-heading` | ✅ | — | Tipografía fluida, escala con viewport |
| divider | `lib-divider` | ✅ | — | Elemento decorativo neutro |
| eyebrow | `lib-eyebrow` | ✅ | — | Texto inline, sin interacción |
| icon | `lib-icon` | ✅ | — | SVG escalable, sin dependencia de puntero |
| kbd | `lib-kbd` | 🔧 | — | Representa atajos de teclado; semánticamente irrelevante en touch |
| label | `lib-label` | ✅ | — | Elemento de formulario estándar |
| liquid-button | `lib-liquid-button` | ⚠️ | — | El efecto líquido depende de hover/mouse; se degrada a botón estándar en touch |
| magnetic | `lib-magnetic` | ⚠️ | — | Atracción basada en posición del puntero; sin efecto en touch |
| progress | `lib-progress` | ✅ | — | Barra de progreso animada; sin `prefers-reduced-motion` implementado |
| progress-circle | `lib-progress-circle` | ✅ | — | SVG estático, sin interacción |
| quote | `lib-quote` | ✅ | — | Contenido estático |
| radio | `lib-radio` | ✅ | — | Elemento de formulario estándar |
| rating | `lib-rating` | ✅ | — | `prefers-reduced-motion`; interacción por click/tap |
| reading-progress | `lib-reading-progress` | 🔧 | — | Basado en scroll; funcional en mobile pero sin revisión específica |
| ripple | `lib-ripple` | 🔧 | — | Efecto de onda; verificar disparador en touch vs click |
| select-option | `lib-select-option` | ✅ | — | Subcomponente de `lib-select`, hereda su comportamiento |
| skeleton | `lib-skeleton` | ✅ | — | `prefers-reduced-motion` aplicado |
| spacer | `lib-spacer` | ✅ | — | Utilidad de layout, neutral |
| spinner | `lib-spinner` | ✅ | — | Animación de carga; sin `prefers-reduced-motion` implementado |
| status-dot | `lib-status-dot` | ✅ | — | `prefers-reduced-motion`; indicador visual estático |
| step | `lib-step` | 🔧 | — | Subcomponente de `lib-stepper`; sin media queries propias |
| switch | `lib-switch` | ✅ | — | `prefers-reduced-motion`; área de tap adecuada |
| text-glitch | `lib-text-glitch` | ⚠️ | — | Animación CSS intensa (23 directivas); puede impactar rendimiento en gama baja; sin `prefers-reduced-motion` implementado |
| text-list | `lib-text-list` | ✅ | — | Contenido estático, fluye con el layout |
| tooltip | `lib-tooltip` | ⚠️ | — | Activación por hover; en touch no hay evento equivalente nativo |
| visually-hidden | `lib-visually-hidden` | 🔧 | — | Utilidad de accesibilidad; no genera UI visible |

---

## Moléculas

| Componente | Tag | Estado | Breakpoints | Observaciones |
|-----------|-----|--------|-------------|---------------|
| alert | `lib-alert` | ✅ | — | Flex layout; sin breakpoint propio definido en CSS |
| breadcrumb | `lib-breadcrumb` | ✅ | — | Overflow horizontal implícito; considerar truncado en rutas largas |
| button-group | `lib-button-group` | ✅ | — | Flex wrap natural; usar `wrap` en grupos anchos |
| checkbox-card | `lib-checkbox-card` | ✅ | — | Área de tap suficiente |
| chip | `lib-chip` | ✅ | — | Inline, escala con contenedor |
| color-picker | `lib-color-picker` | 🔧 | — | Interacción compleja; sin media queries; requiere revisión de usabilidad táctil |
| dropdown | `lib-dropdown` | ✅ | — | Posicionamiento absoluto; verificar que el panel no quede fuera del viewport |
| empty-state | `lib-empty-state` | ✅ | 640px | Layout refluye en pantallas pequeñas |
| file-uploader | `lib-file-uploader` | ✅ | — | Compatible con input `type="file"` nativo en móvil |
| header | `lib-header` | ✅ | 640px | Implementación mobile completa: burger button + drawer lateral + backdrop |
| input | `lib-input` | ✅ | — | Formulario estándar; respetar `font-size: 16px` mínimo para evitar zoom en iOS |
| modal | `lib-modal` | ✅ | 768px | Ancho ajustado a `calc(100vw - spacing)` |
| pagination | `lib-pagination` | ✅ | — | Considerar reducir páginas visibles en viewports estrechos |
| range-slider | `lib-range-slider` | ✅ | — | Interacción por drag; funcional en touch |
| segmented-control | `lib-segmented-control` | ✅ | — | Flex layout; en grupos largos puede necesitar scroll horizontal |
| select | `lib-select` | ✅ | — | Delegado al `<select>` nativo en plataformas móviles por defecto |
| tabs | `lib-tabs` | ✅ | — | Scroll horizontal si el número de tabs supera el ancho |
| tree-select | `lib-tree-select` | ✅ | — | `prefers-reduced-motion`; interacción por tap funcional |

---

## Organismos

| Componente | Tag | Estado | Breakpoints | Observaciones |
|-----------|-----|--------|-------------|---------------|
| accordion | `lib-accordion` | ✅ | — | `prefers-reduced-motion`; interacción por tap |
| bento-grid | `lib-bento-grid` | ✅ | — | Grid CSS; los items colapsan según la configuración de columnas |
| carousel | `lib-carousel` | ✅ | 640px | Modo peek: 80% de ancho de slide en mobile; sin swipe nativo (ver nota) |
| cursor-follower | `lib-cursor-follower` | ❌ | 768px | **Desactivado explícitamente** en `@media (pointer: coarse), (width <= 768px)` |
| data-table | `lib-data-table` | ⚠️ | — | Sin scroll horizontal propio; envolver en `overflow-x: auto` en contextos mobile |
| dialog | `lib-dialog` | ✅ | 768px | Todos los tamaños constrained a `calc(100vw - spacing)` |
| drawer | `lib-drawer` | ✅ | — | `prefers-reduced-motion`; pensado para navegar desde borde |
| footer | `lib-footer` | ✅ | 768px, 480px | Grid: 4 col → 2 col → 1 col; variante accordion para mobile |
| horizontal-scroll-section | `lib-horizontal-scroll-section` | ⚠️ | — | Scroll horizontal CSS; sin inercia táctil nativa ni drag gesture |
| parallax-container | `lib-parallax-container` | ⚠️ | — | Efectos scroll-driven; pueden impactar rendimiento en dispositivos de gama baja |
| parallax-text | `lib-parallax-text` | ⚠️ | — | Ídem anterior; `prefers-reduced-motion` recomendado en contextos de bajo rendimiento |
| sidebar | `lib-sidebar` | ✅ | 768px | Implementación mobile completa: FAB toggle + overlay + `transform: translateX` |
| stagger | `lib-stagger` | ✅ | — | `prefers-reduced-motion`; animación de entrada al entrar en viewport |
| stepper | `lib-stepper` | ✅ | — | `prefers-reduced-motion`; layout vertical se adapta bien a mobile |
| timeline | `lib-timeline` | ✅ | — | `prefers-reduced-motion`; layout vertical naturally mobile-friendly |
| toast-manager | `lib-toast-manager` | ✅ | — | Posicionamiento fijo; verificar que no solape con barras del sistema en iOS/Android |

---

## Implementaciones mobile destacadas

### `lib-header` (640px)

Dispone de implementación mobile completa:

- **Burger button** (`.hdr-burger`): visible solo en `≤ 640px`, oculto en desktop.
- **Drawer lateral** (`.hdr-mobile-drawer`): slide desde la derecha con animación `hdr-drawer-in` (240ms).
- **Backdrop** (`.hdr-mobile-backdrop`): overlay semitransparente para cerrar el drawer al tocar fuera.
- La navegación desktop se oculta en mobile; el drawer replica la estructura completa de nav + CTAs.

### `lib-sidebar` (768px)

Dispone de implementación mobile completa:

- **FAB toggle** (`.sb-toggle`): botón flotante fijo (`bottom: 1rem; right: 1rem`), visible solo en `≤ 768px`.
- **Estado Lit** (`_mobileOpen: boolean`): controla la visibilidad mediante la clase `.is-open`.
- **Overlay** (`.sb-overlay`): scrim con `pointer-events: none` cuando está cerrado; cierra al tap.
- Animación: `transform: translateX(-100%)` → `translateX(0)` al abrir.

---

## Patrones mobile aplicados en la librería

### `@media (hover: hover)`

Aplicado en `lib-button` y `lib-card` para limitar los estilos hover a dispositivos con puntero real. En touch, los estados hover no quedan "pegados" tras el tap.

```css
@media (hover: hover) {
  .btn:hover { /* efecto hover */ }
}
```

### `@media (pointer: coarse)`

Usado en `lib-cursor-follower` para desactivar completamente el componente en pantallas táctiles:

```css
@media (pointer: coarse), (width <= 768px) {
  .cursor-dot,
  .cursor-ring { display: none; }
}
```

### `@media (prefers-reduced-motion: reduce)`

Aplicado en **~25 componentes**. Desactiva o simplifica animaciones para usuarios con preferencias de movimiento reducido (accesibilidad y rendimiento en mobile).

Componentes que lo implementan: accordion, bento-item, carousel, close-button, copy-button, counter, drawer, header, kbd, parallax, rating, reading-progress, sidebar, skeleton, stagger, status-dot, step, stepper, switch, timeline, toast-manager, tree-select, y otros.

---

## Notas por categoría

### Átomos
- Los átomos sin media queries propios (icon, divider, spacer, label…) son intrínsecamente mobile-safe por su naturaleza estática.
- Evitar `lib-tooltip` como único mecanismo de información en mobile: los tooltips hover no tienen equivalente táctil fiable.
- `lib-kbd` pierde relevancia semántica en touch; usarlo solo en contextos donde el usuario tenga teclado disponible.

### Moléculas
- `lib-input`: mantener `font-size: 16px` mínimo en mobile para prevenir el zoom automático en iOS Safari.
- `lib-dropdown`: validar que los paneles desplegables no queden parcialmente fuera del viewport en pantallas estrechas.
- `lib-breadcrumb`: en rutas largas considerar truncar nodos intermedios con `…` para evitar overflow.

### Organismos
- `lib-carousel`: no implementa swipe nativo. Para gestos táctiles completos, evaluar añadir una librería de gestos o implementar `touch-start`/`touch-end` a nivel de aplicación.
- `lib-data-table`: en mobile siempre envolver en `overflow-x: auto` para garantizar scroll horizontal del contenido tabular.
- `lib-parallax-container` / `lib-parallax-text`: testear en dispositivos reales de gama baja. Considerar desactivar estos componentes o reducir intensidad del efecto en mobile mediante detección de `pointer: coarse`.
- `lib-toast-manager`: en iOS el `safe-area-inset-bottom` puede interferir con el posicionamiento fijo; aplicar `padding-bottom: env(safe-area-inset-bottom)` si se coloca en la parte inferior.

---

## Componentes pendientes de revisión

Los siguientes componentes no tienen media queries detectadas y requieren una auditoría específica de usabilidad táctil:

| Componente | Riesgo | Acción sugerida |
|-----------|--------|-----------------|
| `lib-color-picker` | Alto | Revisar área de interacción del selector de color en touch |
| `lib-color-scale` | Bajo | Herramienta visual; verificar overflow en mobile |
| `lib-kbd` | Bajo | Determinar si debe ocultarse en contextos touch-only |
| `lib-reading-progress` | Bajo | Probar el tracking de scroll en mobile (momentum scroll) |
| `lib-ripple` | Medio | Verificar que el disparador funciona con `touchstart`/`pointerdown` |
| `lib-step` | Bajo | Subcomponente; el comportamiento mobile depende de `lib-stepper` |
| `lib-visually-hidden` | Ninguno | Utilidad de accesibilidad; sin renderizado visual |
