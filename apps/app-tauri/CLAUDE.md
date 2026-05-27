# app-tauri — App de escritorio Tauri 2 + React 19

App de escritorio nativa (Windows/macOS/Linux) construida con Tauri 2 y React 19. Actúa como panel personal de sistema: monitor de métricas hardware, explorador de ficheros y área de trabajo con gadgets redimensionables.

> Requiere **Rust toolchain estable** (`rustup install stable`) además de Node + pnpm.

---

## Stack

- **Tauri 2** — shell nativa, IPC entre frontend y backend Rust
- **React 19** + **TypeScript estricto**
- **React Router DOM v7** — routing declarativo en `AppShell`
- **react-grid-layout** — grid de gadgets redimensionables y arrastrables
- **Vite** — bundler y dev server del frontend
- **crate `core/`** — lógica Rust independiente de Tauri (métricas de sistema, fs)
- **sysinfo v0.33** — métricas hardware en Rust

---

## Estructura frontend (`src/`)

```
src/
  App.tsx / App.css
  main.tsx                      → Bootstrap React + import @shibui/ui
  custom-elements.d.ts          → Tipos JSX para lib-* (igual que app-react)
  shell/
    AppShell.tsx                → Router principal (lazy pages)
    layouts/
      DashboardLayout.tsx       → Sidebar + Outlet (react-grid-layout)
    README.md                   → Documentación del shell y DashboardLayout
  pages/
    dashboard/                  → Grid de gadgets (DashboardPage)
    hub/                        → Pantalla de bienvenida standalone
    files/                      → Explorador de ficheros a pantalla completa
    login/                      → Login (sessionStorage, password 'shibui-dev')
    section-placeholder/        → Placeholder para secciones futuras
  gadgets/
    GadgetFrame.tsx             → Wrapper visual común (header draggable, contenido scrollable)
    NotesGadget/
    SystemMonitorGadget/
    CpuGadget/
    RamGadget/
    DiskGadget/
    NetworkGadget/
    FileExplorerGadget/
      index.tsx
      FileBrowser.tsx           → Reutilizable en gadget (compact) y FilesPage (default)
    README.md                   → Arquitectura de gadgets, useGadgetLayout, cómo añadir uno
  hooks/
    useGadgetLayout.ts          → Estado del grid, persistido en localStorage
  core/
    auth/
      AuthContext.ts
      AuthProvider.tsx          → sessionStorage, 'shibui-dev'
      AuthGuard.tsx             → Redirige a /login si no autenticado
    hooks/
      useAuth.ts
    README.md                   → Documentación del sistema de auth
```

### Estructura Rust (`src-tauri/` + `core/`)

```
src-tauri/
  src/
    lib.rs                      → Registra y despacha comandos Tauri
    main.rs                     → Entry point
  tauri.conf.json               → Nombre app, bundle ID, configuración de ventana
  capabilities/                 → Permisos Tauri v2
  README.md                     → Comandos Tauri, structs de datos, cómo añadir comando nuevo

core/                           → Crate Rust independiente (app-tauri-core)
  src/
    lib.rs
    system.rs                   → Métricas CPU/RAM/disco/red con sysinfo
    fs.rs                       → list_dir, home_dir
```

> Para documentación detallada de cada área: ver los `README.md` internos en `src/gadgets/`, `src/shell/`, `src/core/` y `src-tauri/`.

---

## Routing

Todas las rutas son lazy-loaded. Todas protegidas por `<AuthGuard>` excepto `/login`.

| Ruta | Componente | Layout |
|---|---|---|
| `/login` | `LoginPage` | sin layout |
| `/` | `HubPage` | sin sidebar (standalone) |
| `/dashboard` | `DashboardPage` | `DashboardLayout` (sidebar) |
| `/files` | `FilesPage` | `DashboardLayout` (sidebar) |
| `/code` | `SectionPlaceholder` | `DashboardLayout` (sidebar) |
| `/security` | `SectionPlaceholder` | `DashboardLayout` (sidebar) |
| `/settings` | `SectionPlaceholder` | `DashboardLayout` (sidebar) |
| `*` | redirect a `/` | — |

**Patrón clave**: `/` (Hub) vive fuera del `DashboardLayout`. Es una pantalla standalone sin sidebar. Las demás secciones comparten un `<Route>` sin `path` que envuelve con `DashboardLayout`.

---

## Auth

Idéntico al patrón de React/Svelte/Angular:
- Contraseña: `'shibui-dev'` hardcoded
- Estado en `sessionStorage` (clave `admin_auth`)
- `AuthProvider` en `App.tsx`, `useAuth()` como hook de consumo

---

## Gadgets

Los gadgets de sistema (CPU, RAM, disco, red, sysmon) realizan polling cada ~1s mediante `setInterval` + `invoke()` de Tauri.

| ID layout | Gadget | Comando Tauri |
|---|---|---|
| `notes` | `NotesGadget` | — (localStorage) |
| `sysmon` | `SystemMonitorGadget` | `get_system_info` |
| `cpu` | `CpuGadget` | `get_cpu_detail` |
| `ram` | `RamGadget` | `get_memory_detail` |
| `disk` | `DiskGadget` | `get_disk_detail` |
| `network` | `NetworkGadget` | `get_network_detail` |
| `fileexp` | `FileExplorerGadget` | `list_dir` + `get_home_dir` |

Ver `src/gadgets/README.md` para la guía de cómo añadir un gadget nuevo.

---

## IPC Tauri

```typescript
import { invoke } from '@tauri-apps/api/core';

// Llamada tipada al backend Rust
const info = await invoke<SystemInfo>('get_system_info');
```

Ver `src-tauri/README.md` para la tabla completa de comandos y sus structs de retorno.

---

## Scripts

```bash
pnpm start:tauri           # Dev (Vite + ventana nativa) — desde raíz del monorepo

# Desde apps/app-tauri:
pnpm dev                   # Frontend Vite solamente (sin ventana nativa)
pnpm tauri dev             # ← ESTE es el dev real (alias de `tauri dev` via CLI Tauri)
pnpm build                 # tsc + vite build (frontend)
pnpm tauri build           # Build completo: frontend + bundle nativo

# Rust (desde apps/app-tauri/ o apps/app-tauri/core/)
cargo test                 # Unit tests de la crate core
cargo fmt                  # Formateo Rust
cargo clippy               # Linter Rust
```

El CI (`ci-tauri.yml`) corre `cargo fmt --check`, `cargo clippy` y `cargo test` sobre la crate `core/`.

---

## Integración con Shibui UI

```typescript
// main.tsx — registra todos los custom elements globalmente
import '@shibui/ui';
```

```typescript
// custom-elements.d.ts — tipado JSX para lib-* (igual que app-react)
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: `lib-${string}`]: React.HTMLAttributes<HTMLElement> & {
        [propName: string]: unknown;
      };
    }
  }
}
```

El sidebar usa `<lib-sidebar variant="terminal">` de Shibui UI directamente en `DashboardLayout.tsx`.
