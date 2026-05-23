# shell — Enrutado y layouts

Contiene la configuración de rutas de la aplicación y los componentes de layout estructural.

---

## AppShell (`AppShell.tsx`)

Define todas las rutas con React Router. Las páginas pesadas se cargan de forma lazy:

```
/            → HubPage          (standalone, sin sidebar)
/login       → LoginPage        (sin layout)
/files       → FilesPage        (con DashboardLayout)
/dashboard   → DashboardPage    (con DashboardLayout)
/code        → SectionPlaceholder
/security    → SectionPlaceholder
/settings    → SectionPlaceholder
*            → redirect a /
```

**Patrón clave**: el Hub (`/`) vive fuera del `DashboardLayout` — es una pantalla standalone sin sidebar. El resto de secciones usan un route sin `path` que envuelve con `DashboardLayout`.

Todas las rutas excepto `/login` están protegidas por `<AuthGuard>`.

---

## DashboardLayout (`layouts/DashboardLayout.tsx`)

Layout con sidebar izquierdo fijo + área de contenido principal.

```
┌──────────┬────────────────────────────┐
│ Sidebar  │  <Outlet />                │
│(colapsed)│  (página activa)           │
└──────────┴────────────────────────────┘
```

Usa el componente `<LibSidebar>` de Shibui UI con `variant="terminal"` y en modo colapsado por defecto.

### Links del sidebar (`SIDEBAR_LINKS`)

| id | Label | Grupo |
|----|-------|-------|
| `` (vacío) | Hub | Workspace |
| `code` | Code | Workspace |
| `files` | Files | Workspace |
| `security` | Security | Workspace |
| `settings` | Settings | Workspace |
| `logout` | Salir | Sesión |

El `activeId` se deriva de `pathname.replace('/', '')`, de modo que `/files` → `files`.

El link `logout` no navega: llama a `logout()` de `useAuth` y redirige a `/login`.

### Añadir una nueva sección

1. Añadir una entrada a `SIDEBAR_LINKS` en `DashboardLayout.tsx`.
2. Añadir la ruta correspondiente en `AppShell.tsx` dentro del bloque `<Route element={<DashboardLayout />}>`.
3. Crear la página en `src/pages/<nombre>/`.
