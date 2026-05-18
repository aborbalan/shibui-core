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
