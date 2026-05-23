# Backlog de Componentes — Shibui UI

Componentes detectados como candidatos durante el desarrollo de apps consumidoras.
No están implementados. Cuando se aborden, seguir la estructura de 5 ficheros definida en `CLAUDE.md`.

---

## Candidatos

### `lib-gadget-frame` · Organismo

**Detectado en:** `apps/app-tauri` — `src/gadgets/GadgetFrame.tsx`

Contenedor de gadget para dashboards drag & drop. Envuelve `lib-glass-card` añadiendo:

- Barra de título con icono (`lib-icon`), nombre del gadget y controles (minimizar, cerrar)
- Handle de arrastre en la barra de título (compatible con `react-grid-layout` o similar)
- Slot para el contenido del gadget
- Estado minimizado (solo muestra la barra, oculta el slot)

**Props candidatas:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `title` | `string` | Nombre del gadget |
| `icon` | `string` | Nombre del icono Phosphor |
| `minimizable` | `boolean` | Muestra botón minimizar |
| `closable` | `boolean` | Muestra botón cerrar |
| `minimized` | `boolean` (reflect) | Estado minimizado |
| `variant` | `'glass' \| 'card'` | Contenedor base |

**Eventos candidatos:** `ui-lib-gadget-close`, `ui-lib-gadget-minimize`

---

### `lib-metric-bar` · Molécula

**Detectado en:** `apps/app-tauri` — `src/gadgets/SystemMonitorGadget/index.tsx`

Barra de progreso con etiqueta de nombre y valor integrados, diseñada para mostrar métricas
de sistema (CPU, RAM, disco) o cualquier KPI con porcentaje.

Actualmente construida con `lib-progress` + markup propio.

**Props candidatas:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `label` | `string` | Nombre de la métrica ("CPU", "RAM") |
| `value` | `number` | Valor actual (0–`max`) |
| `max` | `number` | Valor máximo (default 100) |
| `unit` | `string` | Unidad a mostrar ("%" , "GB", "MB/s") |
| `tone` | `ProgressTone` | Hereda de `lib-progress` |
| `size` | `ProgressSize` | Hereda de `lib-progress` |
| `show-value` | `boolean` | Muestra "45 / 100 GB" junto a la barra |

**Diferencia con `lib-progress`:** la etiqueta y el valor forman parte del componente,
sin necesidad de markup externo. Pensado para listas verticales de métricas.

---

### `lib-editor` · Organismo

**Detectado en:** `apps/app-tauri` — pendiente de implementar como `src/gadgets/TextEditorGadget/`

Editor de texto plano para ficheros. Diseñado para integrarse con el sistema de ficheros nativo vía Tauri, pero utilizable de forma standalone con contenido en memoria.

**Props candidatas:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `value` | `string` | Contenido del editor |
| `language` | `string \| null` | Extensión del fichero activo (para hint visual, sin syntax highlighting) |
| `readonly` | `boolean` | Modo lectura |
| `filename` | `string \| null` | Nombre del fichero mostrado en la toolbar |
| `dirty` | `boolean` (reflect) | Indica cambios sin guardar (muestra indicador visual) |
| `line-numbers` | `boolean` | Muestra números de línea |
| `wrap` | `boolean` | Activa word wrap |

**Eventos candidatos:** `ui-lib-editor-change` (con `detail: { value: string }`), `ui-lib-editor-save`

---

### `lib-editor-toolbar` · Molécula

**Detectado en:** `apps/app-tauri` — pendiente de implementar como `src/gadgets/TextEditorGadget/EditorToolbar.tsx`

Barra de acciones para `lib-editor`. Gestiona el ciclo de vida del fichero: nuevo, abrir, guardar.

**Props candidatas:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `filename` | `string \| null` | Nombre del fichero activo |
| `dirty` | `boolean` | Muestra indicador de cambios sin guardar |
| `saving` | `boolean` | Estado de guardado en curso |
| `show-open` | `boolean` | Muestra botón "Abrir" (requiere diálogo nativo en Tauri) |

**Eventos candidatos:** `ui-lib-editor-toolbar-new`, `ui-lib-editor-toolbar-open`, `ui-lib-editor-toolbar-save`

---

### `lib-tab-bar` · Molécula

**Detectado en:** `apps/app-tauri` — pendiente de implementar como `src/gadgets/TextEditorGadget/TabBar.tsx`

Barra de pestañas genérica orientada a múltiples ficheros abiertos. Diferenciada de `lib-tabs` en que las pestañas son closables individualmente y admiten estado dirty por pestaña.

**Props candidatas:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `tabs` | `EditorTab[]` | Array de `{ id, label, dirty }` |
| `active` | `string` | ID de la pestaña activa |
| `closable` | `boolean` | Muestra botón de cierre en cada pestaña |

**Eventos candidatos:** `ui-lib-tab-bar-select` (`detail: { id }`), `ui-lib-tab-bar-close` (`detail: { id }`)

**Diferencia con `lib-tabs`:** `lib-tabs` gestiona paneles de contenido inline; `lib-tab-bar` es solo la barra de navegación, agnóstica del contenido. Pensada para editores, terminales y vistas multi-documento.
