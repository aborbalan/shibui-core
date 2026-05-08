# @shibui/ui 🎌

Librería de componentes UI agnóstica construida con **Web Components** y **Lit**.  
Inspirada en el concepto japonés *shibui* (渋い) — belleza simple, sutil y duradera.

## 🎯 Visión

Arquitectura Senior ejecutada en etapas Junior-friendly.

## 🏗️ Pilares Técnicos

1. **TypeScript Estricto** — `exactOptionalPropertyTypes`, tipado explícito en todos los métodos.
2. **CSS Nativo Moderno** — CSS custom properties con `@layer` sin dependencias pesadas.
3. **Arquitectura Modular** — Tree-shaking real mediante `preserveModules`.
4. **Agnóstica** — Sin dependencias de framework. Funciona en React, Angular, Svelte y Vanilla JS.
5. **Accesibilidad (a11y)** — WAI-ARIA desde el inicio.

## ✨ Características

- **Ligera** — Solo ~5-6 KB (Lit como peer dependency).
- **Modular** — Importa solo lo que uses.
- **Tokens** — Sistema de design tokens `--lib-*` con paleta OKLCH y efectos glass/spotlight.

## 📦 Instalación

`lit` es una **peer dependency** obligatoria.

```bash
# npm
npm install @shibui/ui lit

# yarn
yarn add @shibui/ui lit

# pnpm
pnpm add @shibui/ui lit
```

## 🎨 Configuración de estilos

Importa los tokens globales en tu punto de entrada:

```ts
import '@shibui/ui/styles';
// o solo los tokens CSS
import '@shibui/ui/tokens';
```

## 🚀 Uso básico

```ts
// Web Components estándar
import '@shibui/ui';

// Wrappers por framework
import { LibButton } from '@shibui/ui/react';
import { LibButton } from '@shibui/ui/angular';
// Svelte — los tipos se cargan automáticamente desde @shibui/ui/svelte
```

```html
<lib-button variant="primary">Hola Shibui</lib-button>
```

## 📤 Exports disponibles

| Import | Descripción |
|---|---|
| `@shibui/ui` | Web Components estándar |
| `@shibui/ui/react` | Wrappers tipados para React |
| `@shibui/ui/angular` | Wrappers para Angular |
| `@shibui/ui/svelte` | Definiciones de tipos para Svelte |
| `@shibui/ui/tokens` | Solo tokens CSS (`--lib-*`) |
| `@shibui/ui/styles` | Estilos globales completos |

## 📖 Documentación

Storybook desplegado en Firebase Hosting — disponible en cada PR vía CI/CD.


# Shibui UI — Components Registry
> Referencia de agente · `@shibui/ui` · Auto-uso en proyectos consumidores

Versión del registro: `1.0.0` — Sincronizado con `packages/shibui-ui/src/index.ts`

## Cómo usar este fichero

Este fichero está pensado para que agentes Claude que trabajen en **proyectos que consumen** `@shibui/ui` (app-react, app-angular, app-svelte, proyectos externos) puedan conocer de un vistazo todos los componentes disponibles, su nombre de importación, tag HTML y variantes principales.

### Notación de importación

```ts
// Web Component estándar (Lit, Angular, Svelte, Vanilla)
import '@shibui/ui';
// → usa el tag HTML: <lib-button variant="primary">

// React wrapper (PascalCase)
import { LibButton } from '@shibui/ui/react';
// → usa JSX: <LibButton variant="primary" />

// Solo tokens CSS
import '@shibui/ui/tokens';
```

### Binding de props en React

```tsx
// Props primitivas → attribute binding normal
<LibButton variant="primary" size="md" disabled />

// Props de array/objeto → property binding con punto en Lit nativo
// En React wrapper esto es automático:
<LibSidebar links={LINKS} />

// Eventos → prefijo onUiLib + PascalCase del nombre del evento
// ui-lib-click → onUiLibClick
// ui-lib-tab-change → onUiLibTabChange
<LibButton onUiLibClick={(e: CustomEvent) => console.log(e.detail)} />
```

---

## Tokens de diseño (CSS custom properties)

> Importar con `@shibui/ui/tokens` o `import '@shibui/ui/tokens'`

### Colores primitivos
| Token | Valor | Uso |
|---|---|---|
| `--color-washi-50` | `#FAF7F4` | Fondo base claro |
| `--color-washi-900` | `#221C16` | Fondo inverse / texto |
| `--color-washi-950` | `#120E0A` | Fondo oscuro total |
| `--color-kaki-400` | `#D97234` | Acento cálido claro |
| `--color-kaki-500` | `#B85A1E` | Acento principal |
| `--color-celadon-400` | `#4E9482` | Acento jade / info |
| `--color-celadon-500` | `#357164` | Acento jade oscuro |

### Tokens semánticos
| Token | Light | Dark |
|---|---|---|
| `--bg-base` | washi-50 | washi-950 |
| `--bg-surface` | washi-100 | washi-900 |
| `--bg-elevated` | #fff | washi-800 |
| `--text-primary` | washi-900 | washi-50 |
| `--text-secondary` | washi-600 | washi-400 |
| `--text-muted` | washi-400 | washi-600 |
| `--text-accent` | kaki-500 | kaki-300 |
| `--border-subtle` | washi-200 | washi-800 |
| `--border-default` | washi-300 | washi-700 |

### Tipografía
| Token | Valor |
|---|---|
| `--lib-font-display` | `"Cormorant Garamond", serif` |
| `--lib-font-body` | `"Shippori Mincho", serif` |
| `--lib-font-mono` | `"DM Mono", monospace` |

### Espaciado (base 4px)
| Token | Valor |
|---|---|
| `--lib-space-xs` | `0.25rem` (4px) |
| `--lib-space-sm` | `0.5rem` (8px) |
| `--lib-space-md` | `1rem` (16px) ★ estándar |
| `--lib-space-lg` | `1.5rem` (24px) |
| `--lib-space-xl` | `2rem` (32px) |

### Escalas tipográficas
`--text-xs` (11px) · `--text-sm` (13px) · `--text-base` (15px) · `--text-md` (17px) · `--text-lg` (20px) · `--text-xl` (24px) · `--text-2xl` (32px) · `--text-3xl` (44px) · `--text-4xl` (60px) · `--text-5xl` (80px)

---

## Átomos

Elementos indivisibles, sin estado interno. Reciben datos vía props y emiten eventos custom.

### `lib-accordion-item` · `LibAccordionItem`
Ítem individual colapsable.
```tsx
<LibAccordionItem label="Pregunta aquí">
  <p>Contenido del panel</p>
</LibAccordionItem>
```
**Props:** `label: string`

---

### `lib-aspect-ratio` · `LibAspectRatio`
Contenedor que mantiene relación de aspecto fija.
```tsx
<LibAspectRatio ratio="16/9">
  <img src="..." />
</LibAspectRatio>
```
**Props:** `ratio: string` (ej: `"16/9"`, `"1/1"`, `"4/3"`)

---

### `lib-avatar` · `LibAvatar`
Imagen de perfil con fallback a iniciales.
```tsx
<LibAvatar name="Alejandro Borbalán" src="/profile.webp" size="md" shape="circle" />
```
**Props:** `name?: string` · `src?: string` · `size?: 'sm'|'md'|'lg'|'xl'` · `shape?: 'circle'|'square'|'squircle'`

---

### `lib-background` · `LibBackground`
Contenedor con variantes de fondo visual.
```tsx
<LibBackground variant="midnight">
  {/* contenido */}
</LibBackground>
```
**Props:** `variant: 'midnight'|'ash-grid'|'paper'|'dark'|...`

---

### `lib-badge` · `LibBadge`
Indicador visual pequeño para estado, notificaciones o etiquetas.
```tsx
<LibBadge variant="accent" dot>12</LibBadge>
<LibBadge variant="success" pill>Activo</LibBadge>
```
**Props:** `variant: 'default'|'accent'|'celadon'|'dark'|'error'|'success'|'warning'` · `dot?: boolean` · `pill?: boolean`

---

### `lib-bento-item` · `LibBentoItem`
Celda para composiciones bento grid.
**Props:** `span?: number` · `variant?: string`

---

### `lib-burger-button` · `LibBurger`
Botón hamburguesa con variantes de animación.
```tsx
<LibBurger variant="kintsugi" />
```
**Props:** `variant: 'ink'|'kanji'|'washi'|'framed'|'kintsugi'|'glitch'` · `open?: boolean`
**Eventos:** `onUiLibBurgerToggle`

---

### `lib-button` · `LibButton`
Elemento interactivo base.
```tsx
<LibButton variant="primary" size="md" disabled={false}>
  Texto del botón
</LibButton>
```
**Props:** `variant: 'default'|'primary'|'secondary'|'ghost'|'accent'|'danger'` · `size: 'sm'|'md'|'lg'|'xl'` · `disabled?: boolean` · `loading?: boolean`
**Slots:** `prefix` · `suffix`
**Eventos:** `onUiLibClick`

---

### `lib-card` · `LibCard`
Contenedor para agrupar contenido relacionado.
```tsx
<LibCard variant="kintsugi" kanji="渋">
  <span slot="tag">01</span>
  <h3 slot="title">Título</h3>
  <p>Descripción del contenido</p>
  <span slot="footer">Categoría</span>
</LibCard>
```
**Props:** `variant: 'default'|'inverse'|'accent'|'featured'|'kintsugi'|'glitch'|'celadon'|'washi'` · `kanji?: string` · `clickable?: boolean`
**Slots:** `tag` · `title` · `footer` · `default`
**Eventos:** `onUiLibCardClick` (cuando `clickable`)

---

### `lib-card-grid` · `LibComponentGrid`
Grid de cards auto-responsivo.
```tsx
<LibComponentGrid style={{ '--cg-cols': 'repeat(3, 1fr)' }}>
  <LibCard>...</LibCard>
</LibComponentGrid>
```
**CSS vars:** `--cg-cols` · `--cg-gap`

---

### `lib-checkbox` · `LibCheckbox`
Control de selección binaria.
```tsx
<LibCheckbox
  variant="kaki"
  label="Acepto los términos"
  sublabel="Texto secundario"
  checked={value}
  onChange={(e: CustomEvent) => setValue(e.detail.checked)}
/>
```
**Props:** `variant: 'default'|'kaki'|'error'` · `label?: string` · `sublabel?: string` · `checked?: boolean` · `disabled?: boolean` · `indeterminate?: boolean`
**Eventos:** `onUiLibCheckboxChange` → `detail: { checked: boolean }`

---

### `lib-close-button` · `LibCloseButton`
Botón de cierre semántico.
```tsx
<LibCloseButton libClose={(e: CustomEvent) => handleClose()} />
```
**Eventos:** `onLibClose`

---

### `lib-code-block` · `LibCodeBlock`
Bloque de código con clipboard y variante ghost.
```tsx
<LibCodeBlock language="typescript" variant="default">
  {`const x = 'shibui';`}
</LibCodeBlock>
```
**Props:** `language?: string` · `variant?: 'default'|'ghost'`

---

### `lib-color-scale` · `LibColorScale`
Muestra interactiva de escala de color con hover-expand.
**Props:** `colors: Array<{token: string, value: string, step: string}>`

---

### `lib-content-pillar` · `LibContentPillar`
Bloque de contenido editorial con kanji decorativo.
**Slots:** `eyebrow` · `title` · `body`

---

### `lib-copy-button` · `LibCopyButton`
Botón para copiar al portapapeles.
```tsx
<LibCopyButton value="texto a copiar" />
```
**Props:** `value: string` · `label?: string`
**Eventos:** `onUiLibCopy`

---

### `lib-counter` · `LibCounter`
Contador animado con efecto digit-flip.
```tsx
<LibCounter value={66} suffix="+" prefix="" tone="on-dark" play-on-visible />
```
**Props:** `value: number` · `suffix?: string` · `prefix?: string` · `thousands?: string` · `size?: 'sm'|'md'|'lg'` · `tone?: 'default'|'on-dark'` · `play-on-visible?: boolean`

---

### `lib-display-heading` · `LibDisplayHeading`
Heading editorial con Cormorant Garamond.
**Props:** `level?: 1|2|3|4` · `size?: string` · `accent?: string`

---

### `lib-divider` · `LibDivider`
Separador visual entre secciones.
```tsx
<LibDivider orientation="horizontal" style-variant="hairline">
  texto opcional
</LibDivider>
```
**Props:** `orientation?: 'horizontal'|'vertical'` · `style-variant?: 'default'|'hairline'|'strong'`

---

### `lib-eyebrow` · `LibEyebrow`
Etiqueta eyebrow con tracking wide para secciones.
```tsx
<LibEyebrow color="kaki" size="sm">Design Tokens · v1.0</LibEyebrow>
```
**Props:** `color?: 'default'|'kaki'|'dark'|'celadon'` · `size?: 'sm'|'md'`

---

### `lib-glass-card` · `LibGlassCard`
Card con efecto glassmorphism (Efecto Agua).
```tsx
<LibGlassCard variant="water">Contenido</LibGlassCard>
```
**Props:** `variant?: 'paper'|'water'|'kaki'` · `intensity?: 'low'|'md'|'high'`

---

### `lib-icon` · `LibIcon`
Símbolo visual — wrapper de Phosphor Icons.
```tsx
<LibIcon name="heart" size="md" variant="primary" />
```
**Props:** `name: string` · `size?: 'sm'|'md'|'lg'|'xl'|number` · `variant?: 'default'|'primary'|'success'|'danger'|'warning'`

Iconos disponibles (nombres clave): `arrow-down/up/left/right` · `home` · `copy` · `save` · `edit` · `download` · `upload` · `share` · `link` · `bell` · `mail` · `phone` · `lock` · `unlock` · `shield` · `key` · `github` · `linkedin` · `twitter` · `trash` · `book` · `flask` · `chart-line` · `chart-pie` · `business` · `location` · `compass` · `globe` · `time` · `timer` · `health` · `sun` · `moon` · `coffee` · `gift` · `trophy` · `award` · `idea` · `more` · `menu` · `x` · `x-circle` · `play` · `pause` · `camera` · `image` · `folder` · `file`

---

### `lib-kbd` · `LibKbd`
Representación de tecla de teclado.
```tsx
<LibKbd>⌘K</LibKbd>
```

---

### `lib-label` · `LibLabel`
Etiqueta de texto para inputs.
```tsx
<LibLabel required>Email</LibLabel>
```
**Props:** `required?: boolean` · `for?: string`

---

### `lib-liquid-button` · `LibLiquidButton`
Botón con efecto líquido interactivo.
**Props:** `variant?: string` · `label?: string`

---

### `lib-magnetic` · `LibMagnetic`
Efecto magnético de atracción al cursor sobre su contenido.
```tsx
<LibMagnetic strength={0.3}>
  <LibButton>Hover me</LibButton>
</LibMagnetic>
```
**Props:** `strength?: number`

---

### `lib-progress` · `LibProgress`
Barra de progreso lineal.
```tsx
<LibProgress value={75} max={100} variant="kaki" />
```
**Props:** `value: number` · `max?: number` · `variant?: 'default'|'kaki'|'celadon'`

---

### `lib-progress-circle` · `LibProgressCircle`
Indicador de progreso circular.
**Props:** `value: number` · `max?: number` · `size?: 'sm'|'md'|'lg'`

---

### `lib-quote` · `LibQuote`
Blockquote editorial.
**Slots:** `default` · `cite`

---

### `lib-radio` · `LibRadio`
Control de selección única para grupos.
```tsx
<LibRadio name="group" value="a" checked={selected === 'a'} label="Opción A"
  onChange={(e: CustomEvent) => setSelected(e.detail.value)} />
```
**Props:** `name: string` · `value: string` · `checked?: boolean` · `disabled?: boolean` · `label?: string`
**Eventos:** `onUiLibRadioChange` → `detail: { value: string }`

---

### `lib-rating` · `LibRating`
Control de valoración por estrellas.
**Props:** `value?: number` · `max?: number` · `readonly?: boolean`
**Eventos:** `onUiLibRatingChange`

---

### `lib-reading-progress` · `LibReadingProgress`
Indicador de progreso de lectura.
**Props:** `variant?: 'bar'|'ring'|'dots'|'vertical'` · `target?: string`

---

### `lib-ripple` · `LibRipple`
Efecto ripple sobre elementos interactivos.
```tsx
<LibRipple color="oklch(45% 0.05 45 / 0.3)" />
```
**Props:** `color?: string`

---

### `lib-select-option` · `LibSelectOption`
Opción individual dentro de un select.
```tsx
<LibSelectOption value="es" selected>España</LibSelectOption>
<LibSelectOption value="fr" disabled>Francia</LibSelectOption>
```
**Props:** `value: string` · `selected?: boolean` · `disabled?: boolean`

---

### `lib-skeleton` · `LibSkeleton`
Placeholder de carga.
```tsx
<LibSkeleton variant="text" width="60%" />
<LibSkeleton variant="avatar" size="md" />
```
**Props:** `variant?: 'text'|'title'|'avatar'|'image'|'button'` · `width?: string` · `height?: string` · `size?: string` · `dark?: boolean`

---

### `lib-spacer` · `LibSpacer`
Espaciador utilitario para layouts.
**Props:** `size?: 'xs'|'sm'|'md'|'lg'|'xl'` · `axis?: 'x'|'y'`

---

### `lib-spinner` · `LibSpinner`
Indicador de carga.
```tsx
<LibSpinner size="md" variant="kaki" />
```
**Props:** `size?: 'sm'|'md'|'lg'` · `variant?: 'default'|'kaki'|'celadon'`

---

### `lib-spotlight-card` · `LibSpotlightCard`
Card con efecto spotlight reactivo al cursor (Kintsugi Digital).
**Props:** `variant?: 'kaki'|'water'|'white'`

---

### `lib-status-dot` · `LibStatusDot`
Pequeño indicador de color para estados.
```tsx
<LibStatusDot status="success" />
```
**Props:** `status: 'success'|'error'|'warning'|'info'|'default'` · `pulse?: boolean`

---

### `lib-step` · `LibStep`
Paso individual dentro de un stepper.
**Props:** `label: string` · `state?: 'pending'|'active'|'complete'|'error'`

---

### `lib-switch` · `LibSwitch`
Toggle control on/off.
```tsx
<LibSwitch checked={value} label="Activar notificaciones"
  onChange={(e: CustomEvent) => setValue(e.detail.checked)} />
```
**Props:** `checked?: boolean` · `disabled?: boolean` · `label?: string`
**Eventos:** `onUiLibSwitchChange` → `detail: { checked: boolean }`

---

### `lib-text-glitch` · `LibTextGlitch`
Efecto de glitch tipográfico animado.
```tsx
<LibTextGlitch text="shibui" />
```
**Props:** `text: string` · `intensity?: 'low'|'md'|'high'`

---

### `lib-text-list` · `LibTextList`
Lista estilizada de elementos de texto.
**Props:** `items: string[]` · `variant?: string`

---

### `lib-tooltip` · `LibTooltip`
Información contextual al hover.
```tsx
<LibTooltip content="Texto del tooltip" placement="top">
  <LibButton>Hover</LibButton>
</LibTooltip>
```
**Props:** `content: string` · `placement?: 'top'|'bottom'|'left'|'right'`

---

### `lib-visually-hidden` · `LibVisuallyHidden`
Elemento accesible oculto visualmente.
```tsx
<LibVisuallyHidden>Texto para lectores de pantalla</LibVisuallyHidden>
```

---

## Moléculas

Grupos funcionales de átomos con estado interno simple.

### `lib-alert` · `LibAlert`
Alerta para mensajes informativos, de aviso, error o éxito.
```tsx
<LibAlert variant="success" title="Guardado" dismissible>
  Los cambios se han guardado correctamente.
</LibAlert>
```
**Props:** `variant: 'default'|'info'|'success'|'warning'|'error'` · `title?: string` · `dismissible?: boolean`
**Eventos:** `onUiLibAlertDismiss`

---

### `lib-breadcrumb` · `LibBreadcrumb`
Navegación de migas de pan.
```tsx
<LibBreadcrumb items={[
  { label: 'Inicio', href: '/' },
  { label: 'Componentes', href: '/componentes' },
  { label: 'Button' }
]} />
```
**Props:** `items: Array<{ label: string, href?: string }>` · `separator?: string`

---

### `lib-button-group` · `LibButtonGroup`
Colección de botones relacionados agrupados.
```tsx
<LibButtonGroup dark>
  <LibButton variant="primary">CTA</LibButton>
  <LibButton variant="ghost">Secundario</LibButton>
</LibButtonGroup>
```
**Props:** `dark?: boolean` · `orientation?: 'horizontal'|'vertical'`

---

### `lib-checkbox-card` · `LibCheckboxCard`
Checkbox con tarjeta image picker.
**Props:** `checked?: boolean` · `label?: string` · `value?: string`
**Eventos:** `onUiLibCheckboxCardChange`

---

### `lib-chip` · `LibChip`
Etiqueta interactiva compacta para filtros.
```tsx
<LibChip removable onUiLibChipRemove={(e) => handleRemove(e.detail.value)}>
  React
</LibChip>
```
**Props:** `removable?: boolean` · `selected?: boolean` · `disabled?: boolean`
**Eventos:** `onUiLibChipRemove` · `onUiLibChipClick`

---

### `lib-color-picker` · `LibColorPicker`
Selector de color.
**Props:** `value?: string` · `format?: 'hex'|'oklch'|'rgb'`
**Eventos:** `onUiLibColorChange`

---

### `lib-dropdown` · `LibDropdown`
Menú desplegable con opciones.
```tsx
<LibDropdown trigger="click" placement="bottom-start">
  <LibButton slot="trigger">Opciones</LibButton>
  <LibSelectOption value="1">Editar</LibSelectOption>
  <LibSelectOption value="2">Eliminar</LibSelectOption>
</LibDropdown>
```
**Props:** `trigger?: 'click'|'hover'` · `placement?: string`
**Eventos:** `onUiLibDropdownSelect`

---

### `lib-empty-state` · `LibEmptyState`
Estado vacío con mensaje e ilustración.
```tsx
<LibEmptyState
  title="Sin resultados"
  description="Prueba con otros términos de búsqueda."
  icon="search"
/>
```
**Props:** `title: string` · `description?: string` · `icon?: string`
**Slots:** `action`

---

### `lib-file-uploader` · `LibFileUploader`
Control para subir ficheros.
**Props:** `accept?: string` · `multiple?: boolean` · `max-size?: number`
**Eventos:** `onUiLibFilesChange`

---

### `lib-header` · `LibHeader`
Header de navegación con múltiples variantes.
```tsx
<LibHeader
  variant="kintsugi"
  logo-mark="渋"
  brand-name="shibui"
  links={NAV_LINKS}
  actions={ACTIONS}
  onUiLibHeaderLink={(e: CustomEvent) => navigate(e.detail.id)}
/>
```
**Props:** `variant: 'classic'|'dark'|'centered'|'transparent'|'kintsugi'|'glitch'|'mega'|'minimal'|'shrink'|'app-bar'` · `logo-mark?: string` · `brand-name?: string` · `brand-tagline?: string` · `logo-href?: string` · `version?: string` · `links?: NavLink[]` · `actions?: HeaderAction[]` · `show-search?: boolean` · `search-placeholder?: string`
**Eventos:** `onUiLibHeaderLink` → `detail: { id: string }` · `onUiLibHeaderAction`

---

### `lib-input` · `LibInput`
Campo de texto con slots prefix/suffix y validación.
```tsx
<LibInput
  label="Buscar"
  placeholder="Escribe..."
  required
  error-message="Campo requerido"
>
  <lib-icon slot="prefix" name="compass" size="sm" />
</LibInput>
```
**Props:** `label?: string` · `placeholder?: string` · `type?: string` · `required?: boolean` · `disabled?: boolean` · `error?: boolean` · `error-message?: string` · `value?: string`
**Slots:** `prefix` · `suffix`
**Eventos:** `onUiLibInputChange` · `onUiLibInputInput`

---

### `lib-modal` · `LibModal`
Ventana overlay sobre la interfaz principal.
```tsx
<LibModal
  open
  heading="Título del modal"
  variant="default"
  _animate="scale"
  onUiLibModalClose={() => setOpen(false)}
>
  <p>Contenido del modal</p>
  <div slot="footer">
    <LibButton variant="ghost" onUiLibClick={onClose}>Cancelar</LibButton>
    <LibButton variant="primary" onUiLibClick={onConfirm}>Confirmar</LibButton>
  </div>
</LibModal>
```
**Props:** `open?: boolean` · `heading?: string` · `variant?: 'default'|'compact'` · `_animate?: 'scale'|'slide'|'fade'`
**Slots:** `default` · `footer`
**Eventos:** `onUiLibModalClose`

---

### `lib-multiselect` *(disponible como lib-select con multiple)*

---

### `lib-pagination` · `LibPagination`
Control de paginación.
```tsx
<LibPagination
  current={page}
  total={10}
  onUiLibPageChange={(e: CustomEvent) => setPage(e.detail.page)}
/>
```
**Props:** `current: number` · `total: number` · `siblings?: number`
**Eventos:** `onUiLibPageChange` → `detail: { page: number }`

---

### `lib-range-slider` · `LibRangeSlider`
Control deslizante para rango numérico.
**Props:** `min?: number` · `max?: number` · `value?: number` · `step?: number`
**Eventos:** `onUiLibRangeChange`

---

### `lib-segmented-control` · `LibSegmentedControl`
Selector de opciones mutuamente excluyentes.
```tsx
<LibSegmentedControl
  options={['Día', 'Semana', 'Mes']}
  value={selected}
  onUiLibSegmentChange={(e: CustomEvent) => setSelected(e.detail.value)}
/>
```
**Props:** `options: string[]` · `value?: string`
**Eventos:** `onUiLibSegmentChange`

---

### `lib-select` · `LibSelect`
Dropdown para selección única.
```tsx
<LibSelect label="País" placeholder="Elige uno...">
  <lib-select-option value="es">España</lib-select-option>
  <lib-select-option value="fr">Francia</lib-select-option>
</LibSelect>
```
**Props:** `label?: string` · `placeholder?: string` · `disabled?: boolean`
**Slots:** `lib-select-option`
**Eventos:** `onUiLibSelectChange` → `detail: { value: string }`

---

### `lib-tabs` · `LibTabs`
Navegación por pestañas.
```tsx
<LibTabs
  items={[
    { id: 'tab1', label: 'General' },
    { id: 'tab2', label: 'Avanzado' },
  ]}
  active="tab1"
  variant="underline"
  onUiLibTabChange={(e: CustomEvent) => setActive(e.detail.id)}
/>
```
**Props:** `items: TabItem[]` · `active?: string` · `variant?: 'underline'|'pill'|'card'|'outline'|'vertical'`
**Eventos:** `onUiLibTabChange` → `detail: { id: string, prev: string }`

---

### `lib-tree-select` · `LibTreeSelect`
Selector con estructura de árbol jerárquico.
**Props:** `items: TreeNode[]` · `value?: string`
**Eventos:** `onUiLibTreeSelect`

---

## Organismos

Secciones complejas y autónomas con lógica interna.

### `lib-accordion` · `LibAccordion`
Contenido expandible por secciones.
```tsx
<LibAccordion variant="default">
  <lib-accordion-item label="Sección 1">Contenido 1</lib-accordion-item>
  <lib-accordion-item label="Sección 2">Contenido 2</lib-accordion-item>
</LibAccordion>
```
**Props:** `variant?: 'default'|'flush'|'separated'` · `allow-multiple?: boolean`

---

### `lib-bento-grid` · `LibBentoGrid`
Layout bento grid para composiciones complejas.
```tsx
<LibBentoGrid columns={3}>
  <lib-bento-item span={2}>...</lib-bento-item>
  <lib-bento-item>...</lib-bento-item>
</LibBentoGrid>
```
**Props:** `columns?: number` · `gap?: string`

---

### `lib-carousel` · `LibCarousel`
Visualización de contenido en formato carrusel.
**Props:** `autoplay?: boolean` · `interval?: number` · `loop?: boolean`
**Eventos:** `onUiLibCarouselChange`

---

### `lib-cursor-follower` · `LibCursorFollower`
Cursor personalizado que sigue al puntero.
**Props:** `variant?: string` · `color?: string`

---

### `lib-data-table` · `LibDataTable`
Tabla de datos con funcionalidades avanzadas.
```tsx
<LibDataTable
  columns={[
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'status', label: 'Estado' },
  ]}
  rows={DATA}
/>
```
**Props:** `columns: TableColumn[]` · `rows: Record<string, unknown>[]` · `loading?: boolean` · `sortable?: boolean`
**Eventos:** `onUiLibTableSort` · `onUiLibTableRowClick`

---

### `lib-dialog` · `LibDialog`
Ventana modal que requiere interacción explícita.
**Props:** `open?: boolean` · `heading?: string`
**Eventos:** `onUiLibDialogClose`

---

### `lib-drawer` · `LibDrawer`
Panel lateral deslizante.
```tsx
<LibDrawer open={isOpen} placement="right" onUiLibDrawerClose={() => setOpen(false)}>
  <p>Contenido del drawer</p>
</LibDrawer>
```
**Props:** `open?: boolean` · `placement?: 'left'|'right'|'top'|'bottom'` · `size?: 'sm'|'md'|'lg'|'full'`
**Eventos:** `onUiLibDrawerClose`

---

### `lib-footer` · `LibFooter`
Footer con variantes editoriales.
```tsx
<LibFooter
  variant="dark"
  brand-name="shibui"
  brand-kanji="渋い"
  columns={FOOTER_COLUMNS}
  navLinks={NAV_LINKS}
/>
```
**Props:** `variant: 'social'|'accordion'|'kintsugi'|'glitch'|'dark'` · `brand-name?: string` · `brand-kanji?: string` · `brand-sub?: string` · `location?: string` · `version?: string` · `github-href?: string` · `linkedin-href?: string` · `email?: string` · `columns?: FooterColumn[]` · `navLinks?: FooterLink[]` · `legalLinks?: FooterLink[]`

---

### `lib-horizontal-scroll-section` · `LibHorizontalScrollSection`
Sección con scroll horizontal controlado.
**Props:** `speed?: number`

---

### `lib-parallax` · `LibParallaxContainer`
Contenedor con efecto parallax.
**Props:** `speed?: number` · `direction?: 'vertical'|'horizontal'`

---

### `lib-parallax-text-stack` · `LibParallaxTextStack`
Stack de texto con efecto parallax escalonado.
**Props:** `lines: string[]` · `speed?: number`

---

### `lib-sidebar` · `LibSidebar`
Panel de navegación lateral colapsable.
```tsx
<LibSidebar
  variant="kintsugi"
  brand-name="shibui"
  logo-mark="渋"
  user-name="Alejandro"
  user-role="Senior FE"
  links={SIDEBAR_LINKS}
  active-id="dashboard"
  colapsed="true"
  show-search="true"
  onUiLibSidebarLink={(e: CustomEvent<{ id: string }>) => navigate(e.detail.id)}
/>
```
**Props:** `variant: 'dark'|'light'|'kintsugi'|'glitch'` · `brand-name?: string` · `logo-mark?: string` · `user-name?: string` · `user-role?: string` · `role?: string` · `links: SidebarLink[]` · `active-id?: string` · `colapsed?: string` · `show-search?: string`
**Eventos:** `onUiLibSidebarLink` → `detail: { id: string }`

---

### `lib-stagger-container` · `LibStaggerContainer`
Contenedor de animaciones stagger escalonadas.
**Props:** `delay?: number` · `stagger?: number`

---

### `lib-stepper` · `LibStepper`
Flujo de pasos secuenciales.
```tsx
<LibStepper
  steps={[
    { label: 'Datos básicos', state: 'complete' },
    { label: 'Configuración', state: 'active' },
    { label: 'Confirmación', state: 'pending' },
  ]}
  current={1}
/>
```
**Props:** `steps: StepItem[]` · `current?: number` · `orientation?: 'horizontal'|'vertical'`
**Eventos:** `onUiLibStepperChange`

---

### `lib-timeline` · `LibTimeline`
Visualización cronológica de eventos.
```tsx
<LibTimeline>
  <lib-timeline-item date="2024" title="Inicio del proyecto">
    Descripción del evento.
  </lib-timeline-item>
</LibTimeline>
```
**Props:** `orientation?: 'vertical'|'horizontal'`

---

### `lib-toast-manager` · `LibToastManager`
Gestor de notificaciones toast.
```tsx
// Instanciar una vez en el root
<LibToastManager position="bottom-right" />

// Emitir desde cualquier punto
document.dispatchEvent(new CustomEvent('lib-toast', {
  detail: { message: 'Guardado', variant: 'success' },
  bubbles: true
}));
```
**Props:** `position?: 'top-right'|'top-left'|'bottom-right'|'bottom-left'|'top-center'|'bottom-center'` · `duration?: number`

---

## Interfaces y tipos exportados

```ts
import type {
  SidebarLink,      // { id, label, icon, group?, badge?, disabled? }
  SidebarVariant,   // 'dark' | 'light' | 'kintsugi' | 'glitch'
  SidebarSocial,    // { href, icon, label }
  FooterVariant,    // 'social' | 'accordion' | 'kintsugi' | 'glitch'
  FooterLink,       // { label, href }
  FooterColumn,     // { heading, links: FooterLink[] }
  FooterSocial,     // { label, href, icon }
  LibSize,          // 'sm' | 'md' | 'lg' | 'xl'
  LibVariant,       // 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'accent'
  LibSemanticColor, // 'primary' | 'danger' | 'text' | 'inherit'
  UiClickEventDetail, // { originalEvent: Event, timestamp: number }
} from '@shibui/ui';
```

---

## Patrones frecuentes

### Array props en React wrapper
```tsx
// CORRECTO — property binding automático en el wrapper
<LibSidebar links={LINKS} />

// En Lit nativo (sin wrapper) usar punto explícito
// <lib-sidebar .links=${LINKS}></lib-sidebar>
```

### Eventos custom
```tsx
// Todos los eventos siguen el patrón:
// nombre-del-evento → onNombreDelEvento (camelCase con prefijo on)
// ui-lib-click      → onUiLibClick
// ui-lib-tab-change → onUiLibTabChange

<LibTabs onUiLibTabChange={(e: CustomEvent<{ id: string }>) => {
  console.log(e.detail.id);
}} />
```

### Dark mode
```tsx
// Añadir data-theme="dark" al elemento raíz
document.documentElement.dataset.theme = 'dark';

// Los tokens semánticos se actualizan automáticamente:
// --bg-base, --text-primary, --border-subtle, etc.
```

### Tokens CSS en componentes React
```tsx
// Los tokens NO están en :root por defecto en algunos entornos.
// Importar explícitamente:
import '@shibui/ui/tokens';

// O referenciar con fallback:
style={{ color: 'var(--text-accent, #B85A1E)' }}
```

---

## Notas para agentes Claude

1. **Siempre usar PascalCase** en ficheros `.tsx` (`LibButton`, no `lib-button`).
2. **Siempre importar desde `@shibui/ui/react`** en React — nunca el tag HTML directo.
3. **Eventos** siempre con tipo `CustomEvent` explícito — nunca `any`.
4. **Array props** se pasan directamente sin `.prop=` — el wrapper lo gestiona.
5. **Los tokens `--lib-*`** deben estar disponibles. Si no hay estilos, verificar que se importa `@shibui/ui/tokens`.
6. **`lib-text-glitch`** tiene un typo en el barrel (`text-glich`). Si hay error de importación, importar directamente desde la ruta del componente.
7. **No existe `lib-multiselect` como componente independiente** — usar `lib-select` con la prop `multiple`.
8. **`lib-modal`** necesita `open` booleano explícito para mostrarse. No tiene estado interno de visibilidad.
9. **`lib-toast-manager`** debe instanciarse una vez en el árbol. Los toasts se disparan vía `CustomEvent` global.
10. **El evento de cierre** de modal, drawer y dialog es siempre `onUiLib[Componente]Close`.

## 📄 Licencia

MIT
