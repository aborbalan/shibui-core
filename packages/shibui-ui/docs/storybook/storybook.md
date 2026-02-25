# Contexto: Organización de Historias en Storybook

## Instrucción General

Cuando generes o modifiques archivos de historias (`.stories.ts` / `.stories.js`), el campo `title` **debe seguir la jerarquía funcional** definida a continuación. No uses rutas arbitrarias ni nombres de carpetas del proyecto. Usa siempre la categoría correcta según el tipo de componente.

---

## Jerarquía de Categorías

### 1. `Forms`
Componentes que capturan o gestionan entrada de usuario.

**Componentes incluidos:** `Button`, `Checkbox`, `Input`, `Form Field`, `Copy Button`, `Close Button`

```ts
title: 'Forms/Button'
title: 'Forms/Checkbox'
title: 'Forms/Input'
title: 'Forms/FormField'
title: 'Forms/CopyButton'
title: 'Forms/CloseButton'
```

---

### 2. `Data Display`
Componentes para mostrar información o estados de carga.

**Componentes incluidos:** `Avatar`, `Badge`, `Status Dot`, `Skeleton`, `Spinner`, `TextList`, `List`

```ts
title: 'Data Display/Avatar'
title: 'Data Display/Badge'
title: 'Data Display/StatusDot'
title: 'Data Display/Skeleton'
title: 'Data Display/Spinner'
title: 'Data Display/TextList'
title: 'Data Display/List'
```

---

### 3. `Feedback & Overlays`
Componentes que interrumpen o informan al usuario sobre acciones.

**Componentes incluidos:** `Alert`, `Modal`

```ts
title: 'Feedback & Overlays/Alert'
title: 'Feedback & Overlays/Modal'
```

---

### 4. `Navigation`
Componentes para moverse a través de la interfaz.

**Componentes incluidos:** `Breadcrumb`, `Tabs`, `Button Group`

```ts
title: 'Navigation/Breadcrumb'
title: 'Navigation/Tabs'
title: 'Navigation/ButtonGroup'
```

---

### 5. `Layout & Surfaces`
Contenedores y elementos de estructura física de la interfaz.

**Componentes incluidos:** `Card`, `Glass Card`, `Kbd` (teclado)

```ts
title: 'Layout & Surfaces/Card'
title: 'Layout & Surfaces/GlassCard'
title: 'Layout & Surfaces/Kbd'
```

---

## Reglas de Aplicación

- **Siempre** asigna la categoría antes de generar el archivo de historia.
- Si el componente no aparece en la lista anterior, elige la categoría más apropiada por su función y documenta la decisión en un comentario.
- El nombre del componente en el `title` debe estar en **PascalCase** y sin espacios (e.g., `Form Field` → `FormField`).
- No crees subcategorías adicionales sin aprobación explícita.

---

## Ejemplo Completo de Historia

```ts
// Button.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Forms/Button',  // ✅ Categoría correcta
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'Click me',
  },
};
```