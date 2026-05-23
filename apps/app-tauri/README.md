# app-tauri — Dashboard de escritorio Shibui

Dashboard de escritorio para monitorización del sistema y gestión de ficheros, construido con Tauri 2 + React 19 y el sistema de diseño Shibui UI.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, TypeScript 5, Vite 7 |
| UI | Shibui UI (`@shibui-ui/ui`) — web components Lit |
| Estética | Katachi `terminal` (fondo oscuro, acento celadón) |
| Grid | `react-grid-layout` — gadgets arrastrables y redimensionables |
| Routing | React Router v7 con `MemoryRouter` |
| Desktop | Tauri 2 |
| Backend | Rust 2021, crate `sysinfo` v0.33 |

---

## Requisitos

- **Node ≥ 20** + **pnpm ≥ 9**
- **Rust toolchain** estable (`rustup install stable`)
- **Tauri CLI**: `cargo install tauri-cli` ó `pnpm add -D @tauri-apps/cli`

---

## Desarrollo

```bash
# Desde la raíz del monorepo:
pnpm --filter app-tauri tauri:dev   # arranca Vite + ventana Tauri nativa

# Solo frontend (sin ventana nativa):
pnpm --filter app-tauri dev

# Tests de la crate Rust:
cd apps/app-tauri && cargo test
```

---

## Arquitectura

```
apps/app-tauri/
├── src/                        # Frontend React
│   ├── main.tsx                # Punto de entrada, monta <App>
│   ├── App.tsx                 # Router + AuthProvider + LibCanvas (katachi)
│   ├── App.css                 # Reset global y estilos react-grid-layout
│   ├── core/                   # Infraestructura transversal
│   │   ├── auth/               # AuthProvider, AuthGuard, AuthContext
│   │   └── hooks/              # useAuth
│   ├── shell/                  # Enrutado y layouts
│   │   ├── AppShell.tsx        # Definición de rutas
│   │   └── layouts/
│   │       └── DashboardLayout.tsx  # Sidebar + <Outlet>
│   ├── pages/
│   │   ├── hub/                # Página de inicio con cards de navegación
│   │   ├── dashboard/          # Grid de gadgets
│   │   ├── files/              # Explorador de ficheros a pantalla completa
│   │   ├── login/              # Pantalla de login
│   │   └── section-placeholder/  # Stub para secciones en desarrollo
│   ├── gadgets/                # Widgets del dashboard
│   │   ├── GadgetFrame.tsx     # Wrapper común (header draggable)
│   │   ├── CpuGadget/
│   │   ├── RamGadget/
│   │   ├── DiskGadget/
│   │   ├── NetworkGadget/
│   │   ├── SystemMonitorGadget/
│   │   ├── NotesGadget/
│   │   └── FileExplorerGadget/
│   └── hooks/
│       └── useGadgetLayout.ts  # Estado y persistencia del grid
├── src-tauri/                  # Configuración Tauri
│   ├── src/lib.rs              # Registro de comandos Tauri
│   ├── capabilities/           # Permisos de la app
│   └── tauri.conf.json
└── core/                       # Crate Rust de lógica del sistema
    └── src/
        ├── system.rs           # CPU, RAM, disco, red (sysinfo)
        └── fs.rs               # Listado de directorios
```

---

## Flujo de datos

```
Frontend (React)
  └─ invoke('get_cpu_detail')
       └─ src-tauri/src/lib.rs  ← comando Tauri
            └─ app_tauri_core::system::get_cpu_detail()
                 └─ sysinfo::System  ← lectura del SO
```

Los comandos Tauri están documentados en [`src-tauri/README.md`](src-tauri/README.md).  
La arquitectura de gadgets está en [`src/gadgets/README.md`](src/gadgets/README.md).
