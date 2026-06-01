# pages — Pantallas de la aplicación

Cada subcarpeta es una **pantalla** (una ruta) de la app. Las rutas se conectan en [`../shell/AppShell.tsx`](../shell/README.md); aquí vive el contenido de cada una.

> Una "page" es simplemente el componente React que se muestra en una ruta concreta. No tienen lógica de enrutado dentro: solo pintan su pantalla.

---

## Mapa de páginas

| Carpeta | Ruta | Layout | Qué es |
|---------|------|--------|--------|
| `login/` | `/login` | sin layout | Pantalla de acceso. Pide la contraseña local y, al acertar, abre la 2ª ventana y entra. |
| `hub/` | `/` | standalone (sin sidebar) | Pantalla de inicio con tarjetas de navegación. |
| `dashboard/` | `/dashboard` | con sidebar | Grid de **gadgets** arrastrables (CPU, RAM, notas…). Ver [`../gadgets/README.md`](../gadgets/README.md). |
| `files/` | `/files` | con sidebar | Explorador de ficheros a pantalla completa. |
| `workspace/` | `/workspace` | standalone (sin sidebar) | Ventana del macro entorno: barra de tabs (Files / Git). Es la pantalla que abre la **2ª ventana**. |
| `section-placeholder/` | `/code`, `/security`, `/settings` | con sidebar | Stub reutilizable para secciones aún sin construir. |

---

## Detalle de las menos obvias

### `login/`
- Contraseña local hardcoded (`shibui-dev`). Es protección de acceso ligera, **no** seguridad real (ver nota en [`../core/README.md`](../core/README.md)).
- Al hacer login con éxito: si es la ventana principal, lanza la 2ª ventana (`openSecondaryWindow()` de `../core/windows.ts`) y luego navega a la sección pedida.

### `workspace/`
- `index.tsx` → barra de tabs superior que conmuta entre el explorador de ficheros y el visualizador de git. Los dos paneles se mantienen montados (uno oculto) para no perder estado al cambiar de tab.
- `GitGraphPanel.tsx` → visor de git a pantalla completa; usa el comando `get_git_log` y el web component `<lib-git-graph>`.
- Es la pantalla inicial de la ventana `secondary` (ver [`../core/windows.ts`](../core/) y el `WindowInitializer` de `../App.tsx`).

### `section-placeholder/`
- Un solo componente parametrizado por `section` e `icon`. Tres rutas distintas (`/code`, `/security`, `/settings`) lo reutilizan. Sustitúyelo por una página real cuando se construya esa sección.

---

## Crear una página nueva

1. Crea `pages/mi-pagina/index.tsx` exportando el componente.
2. Regístrala como ruta en [`../shell/AppShell.tsx`](../shell/AppShell.tsx) (lazy import).
3. Si debe salir en el menú lateral, añade una entrada a `SIDEBAR_LINKS` en `../shell/layouts/DashboardLayout.tsx`.
