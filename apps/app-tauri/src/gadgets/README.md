# gadgets — Widgets del dashboard

Widgets autodimensionables que se montan en el grid de `DashboardPage`. Cada gadget es una carpeta independiente con su lógica de datos propia.

---

## Arquitectura

```
gadgets/
├── GadgetFrame.tsx          ← wrapper visual común
├── NotesGadget/
├── SystemMonitorGadget/
├── CpuGadget/
├── RamGadget/
├── DiskGadget/
├── NetworkGadget/
└── FileExplorerGadget/
    ├── index.tsx            ← gadget wrapper
    └── FileBrowser.tsx      ← lógica de navegación (reutilizable)
```

---

## GadgetFrame (`GadgetFrame.tsx`)

Wrapper visual que todos los gadgets usan como raíz. Proporciona:

- **Header draggable** con icono y título (clase CSS `dragHandle` que `react-grid-layout` reconoce).
- **Borde y fondo** usando tokens semánticos (`--bg-elevated`, `--border-subtle`).
- **Área de contenido** scrollable que crece para ocupar el espacio restante.

```typescript
interface GadgetFrameProps {
  title: string;      // texto del header
  icon: string;       // nombre del icono Phosphor
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
```

---

## Gadgets disponibles

| ID en layout | Componente | Comando Tauri | Descripción |
|---|---|---|---|
| `notes` | `NotesGadget` | — | Bloc de notas, texto libre persistido en `localStorage` |
| `sysmon` | `SystemMonitorGadget` | `get_system_info` | Resumen global: CPU %, RAM y disco usados |
| `cpu` | `CpuGadget` | `get_cpu_detail` | Uso por núcleo + marca, frecuencia y recuento de cores |
| `ram` | `RamGadget` | `get_memory_detail` | Barras de RAM y SWAP usada/total |
| `disk` | `DiskGadget` | `get_disk_detail` | Espacio usado por partición |
| `network` | `NetworkGadget` | `get_network_detail` | Bytes RX/TX por interfaz de red |
| `fileexp` | `FileExplorerGadget` | `list_dir` + `get_home_dir` | Explorador de ficheros compacto |
| `agent-<id>` | `AgentGadget` | — (mock) | Tarjeta de "agente" actuando sobre una rama (estado + progreso). Datos en `pages/branches/agents.mock.ts`. Usado por el área Branches. |

Los gadgets de sistema polling llaman al comando Tauri cada segundo con `setInterval`.

---

## useGadgetLayout (`../hooks/useGadgetLayout.ts`)

Hook que gestiona el estado del grid. **Parametrizable** por `storageKey` y `defaultLayout` para reutilizarlo en varias áreas sin colisión. Sin argumentos usa los valores del Dashboard (`shibui-dashboard-layout`) — retrocompatible.

- **Dashboard**: `useGadgetLayout()` → clave `shibui-dashboard-layout`.
- **Branches**: `useGadgetLayout('shibui-branches-layout', DEFAULT_LAYOUT)` → clave propia.

**Migración automática**: si el layout guardado no contiene todos los IDs del `defaultLayout` (p.ej. tras añadir un gadget nuevo), el hook resetea al layout por defecto. Esto evita que gadgets nuevos queden huérfanos.

```typescript
const { layout, setLayout, resetLayout } = useGadgetLayout();                     // Dashboard
const { layout, setLayout, resetLayout } = useGadgetLayout('mi-clave', miLayout); // otra área
```

El botón "reset layout" de `DashboardPage` llama a `resetLayout()`.

---

## Añadir un gadget nuevo

1. **Crear la carpeta** `gadgets/MiGadget/index.tsx` con el componente envuelto en `<GadgetFrame>`.
2. **Registrar en el diccionario** de `pages/dashboard/index.tsx`:
   ```typescript
   const GADGETS: Record<string, JSX.Element> = {
     // ...gadgets existentes...
     migadget: <MiGadget />,
   };
   ```
3. **Añadir al layout por defecto** en `hooks/useGadgetLayout.ts`:
   ```typescript
   { i: 'migadget', x: 0, y: 20, w: 4, h: 5, minW: 2, minH: 3 },
   ```
   La migración automática detectará la ausencia del nuevo ID y reseteará el layout la próxima vez que el usuario abra el dashboard.

4. Si necesita datos del sistema, añadir el comando Tauri correspondiente (ver [`../../src-tauri/README.md`](../../src-tauri/README.md)).

---

## FileBrowser (`FileExplorerGadget/FileBrowser.tsx`)

Componente reutilizable extraído del gadget. Acepta la prop `rowSize: 'compact' | 'default'`.  
Se usa en dos contextos:
- **Gadget** (`FileExplorerGadget/index.tsx`) → `rowSize="compact"`
- **Página completa** (`pages/files/index.tsx`) → `rowSize="default"`
