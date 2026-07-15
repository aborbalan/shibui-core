# Contexto: Organización de Historias en Storybook

## Instrucción General

Cuando generes o modifiques archivos de historias (`.stories.ts`), el campo `title`
**debe seguir la taxonomía de plataforma** del design system. El patrón es:

```
<Plataforma>/<Categoría>/<Componente>
```

> Fuente de verdad: sección "Storybook · Taxonomía macro" del `CLAUDE.md` de shibui-ui.
> Este documento la resume; ante divergencia, manda `CLAUDE.md`.

Hay **tres nodos raíz** (plataformas):

- `Universal/` — componentes compartidos por web y escritorio
- `Web/` — comportamiento exclusivo de browser (motion, scroll, cursor…)
- `Desktop/` — exclusivos de la app Tauri

No uses categorías sin plataforma (`Forms/Button` es incorrecto; lo correcto es
`Universal/Forms/Button`).

---

## Categorías por plataforma

### `Universal/`

| Categoría | Ejemplos |
|---|---|
| `Foundations/` | Color Palette, Typography, Spacing, Katachi · System |
| `Actions/` | Button, Button Liquid, Burger, Close Button, Copy Button, Magnetic, Chip |
| `Content/` | Card, Avatar, Badge, Icon, Code Block, Quote, Text List, Timeline… |
| `Forms/` | Input, Select, Checkbox, Radio, Switch, Rating, Color Picker, File Uploader… |
| `Feedback/` | Spinner, Skeleton, Toast Manager, Progress, Status Dot, Alert, Empty State… |
| `Navigation/` | Sidebar, Tabs, Breadcrumb, Dropdown, Stepper, Pagination… |
| `Layout/` | Accordion, Bento Grid, Aspect Ratio, Header, Footer… |
| `Data/` | Counter, Data Table |
| `Charts/` | Bar Chart, Scatter Chart, Scatter Chart 3D |
| `Overlay/` | Dialog, Drawer, Modal, Tooltip |
| `Utilities/` | Background, Canvas, Visually Hidden |

### `Web/`

| Categoría | Componentes |
|---|---|
| `Motion/` | Carousel, Cursor Follower, Horizontal Scroll Section, Parallax Container, Parallax Text Stack, Ripple, Stagger |

### `Desktop/`

| Categoría | Componentes |
|---|---|
| `Layout/` | Gadget Frame |
| `Editor/` | Editor Toolbar, Text Editor |
| `Data/` | Metric Bar |

---

## Reglas de Aplicación

- **Siempre** asigna plataforma + categoría antes de generar el archivo de historia.
- Si el componente no aparece arriba, elige la plataforma y categoría más apropiadas por su
  función y documenta la decisión en un comentario.
- No crees subcategorías adicionales sin aprobación explícita.

---

## Ejemplo Completo de Historia

```ts
// lib-button.stories.ts
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Universal/Actions/Button',  // ✅ <Plataforma>/<Categoría>/<Componente>
  component: 'lib-button',
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  args: { label: 'Click me' },
};
```
