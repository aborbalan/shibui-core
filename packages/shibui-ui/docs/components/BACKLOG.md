# Backlog de Componentes — Shibui UI

Componentes detectados como candidatos durante el desarrollo de apps consumidoras.
No están implementados. Cuando se aborden, seguir la estructura de 5 ficheros definida en `CLAUDE.md`.

---

## Taxonomía de clasificación

Cada componente del backlog se describe con **tres ejes ortogonales**, alineados con el
sistema existente:

```
[nivel atómico]  ·  [contexto de plataforma]  ·  [dominio funcional]
    Organism            app/dashboard               lib-gadget-frame
    Molecule            app/monitor                 lib-metric-bar
    Molecule            app/chart                   (pendiente)
```

### Eje 1 — Nivel atómico (atomic design)

Ya existe en la librería. Define granularidad y composición:

| Nivel | Descripción |
|---|---|
| `Atom` | Unidad indivisible — button, icon, input, progress… |
| `Molecule` | Combinación funcional de átomos — metric-bar, input-group… |
| `Organism` | Sección compleja de UI — sidebar, data-table, gadget-frame… |

### Eje 2 — Contexto de plataforma

Indica dónde el componente está **diseñado u optimizado**. Sus defaults, densidad visual
y patrones de interacción están ajustados a ese entorno:

| Etiqueta | Descripción |
|---|---|
| `web` | Optimizado para layouts web: navegación, landing, contenido editorial, formularios |
| `app` | Optimizado para escritorio, dashboards, tauri, dispositivos embebidos |
| `universal` | Sin preferencia — válido en ambos entornos sin ajustes |

### Eje 3 — Dominio funcional (solo para `app`)

Describe **qué problema resuelve** en contexto `app`, ortogonal al nivel atómico
(una molécula y un organismo pueden compartir dominio):

| Dominio | Descripción | Implementación |
|---|---|---|
| `app/dashboard` | Shell de paneles — frames, contenedores de gadget, grids de dashboard | Web Components nativos |
| `app/monitor` | Datos ligeros — métricas, KPIs, gauges, sparklines CSS | Web Components nativos, sin canvas |
| `app/chart` | Gráficas interactivas — line, bar, pie, heatmap, series temporales | ⚠️ Requiere lib externa |
| `app/editor` | Edición de texto/código — editores, toolbars de fichero, barras de pestañas | Web Components nativos |

> **`app/chart` — estrategia pendiente.** Requiere librería de renderizado externa
> (Chart.js, ECharts, D3…). Decisión abierta: wrappers con tema shibui, sub-paquete
> `@shibui/ui-charts` con `peerDependencies`, o adaptadores por librería.
> **No implementar hasta cerrar la estrategia.**

---

**A futuro:** si el catálogo `app` crece lo suficiente, se puede separar en un sub-paquete
(`@shibui/ui-app`) sin romper la API compartida.

Cada candidato en este backlog está marcado con sus tres ejes.

---

### TODO — Visualización 3D de la taxonomía

> Crear un gráfico 3D interactivo (Three.js o similar, embebido como Storybook story o
> página de docs standalone) que muestre los **77+ componentes de la librería** situados
> en el espacio de los tres ejes:
>
> - **X** — Nivel atómico: `Atom` · `Molecule` · `Organism`
> - **Y** — Contexto de plataforma: `web` · `universal` · `app`
> - **Z** — Dominio funcional: `—` (universal/web) · `dashboard` · `monitor` · `chart` · `editor`
>
> Cada punto/nodo representa un componente. Al hover, muestra nombre + etiquetas.
> Útil para visualizar la distribución actual del catálogo y detectar huecos de cobertura
> (p.ej. "hay pocos organismos app/dashboard", "no hay nada en app/chart todavía").
>
> **Candidato natural:** implementar como un gadget dentro de Storybook Docs
> (`/docs/taxonomy`) o como una historia standalone en `'Foundation/Taxonomy'`.

---

## Candidatos

### `lib-gadget-frame` · Organism · `app/dashboard` ✅ implementado

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

### `lib-metric-bar` · Molecule · `app/monitor` ✅ implementado

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

### `lib-editor` · Organism · `app/editor`

**Detectado en:** `apps/app-tauri` — pendiente de implementar como `src/gadgets/TextEditorGadget/`

Editor de texto plano para ficheros. Diseñado para integrarse con el sistema de ficheros nativo vía Tauri, pero utilizable de forma standalone con contenido en memoria.

> **Multi-documento:** para barra de pestañas con cierre y estado dirty por fichero, usar
> `<lib-tabs closable>` con `TabItem.dirty`. No requiere componente adicional.

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

### `lib-editor-toolbar` · Molecule · `app/editor` ✅ implementado

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
