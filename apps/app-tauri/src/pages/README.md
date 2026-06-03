# pages — Pantallas de la aplicación

Cada subcarpeta es una **pantalla** (una ruta) de la app. Las rutas se conectan en [`../shell/AppShell.tsx`](../shell/README.md); aquí vive el contenido de cada una.

> Una "page" es simplemente el componente React que se muestra en una ruta concreta. No tienen lógica de enrutado dentro: solo pintan su pantalla.

---

## Mapa de páginas

| Carpeta | Ruta | Qué es |
|---------|------|--------|
| `login/` | `/login` | Pantalla de acceso. Pide la contraseña local y, al acertar, abre la 2ª ventana y entra. |
| `main/` | `/` | **Shell de pestañas** de la ventana principal (SIN sidebar). 1ª pestaña Hub + áreas como pestañas. Ver `main/` abajo. |
| `workspace/` | `/workspace` | Ventana del macro entorno: barra de tabs (Files / Git). Es la pantalla que abre la **2ª ventana**. |
| `dashboard/` | — (área) | Grid de **gadgets** arrastrables (CPU, RAM, notas…). Ya no es ruta: se abre como pestaña desde el Hub. Ver [`../gadgets/README.md`](../gadgets/README.md). |
| `files/` | — (área) | Explorador de ficheros a pantalla completa. Área, no ruta. |
| `section-placeholder/` | — (área) | Stub reutilizable para áreas aún sin construir (Code, Security, Settings). |

> **Ya no hay sidebar.** `DashboardLayout` y la antigua `hub/` se eliminaron. Las
> secciones dejaron de ser rutas (`/files`, `/code`…) y ahora se abren como
> pestañas dentro de `main/`.

---

## Detalle de las menos obvias

### `login/`
- Contraseña local hardcoded (`shibui-dev`). Es protección de acceso ligera, **no** seguridad real (ver nota en [`../core/README.md`](../core/README.md)).
- Al hacer login con éxito: si es la ventana principal, lanza la 2ª ventana (`openSecondaryWindow()` de `../core/windows.ts`) y luego navega a la sección pedida.

### `workspace/`
- `index.tsx` → barra de tabs superior que conmuta entre el explorador de ficheros y el visualizador de git. Los dos paneles se mantienen montados (uno oculto) para no perder estado al cambiar de tab.
- **Conectado al servicio de proyecto** (`useProject`, ver [`../core/README.md`](../core/README.md)): ambos paneles apuntan a `project.path`. El explorador muestra un botón "abrir proyecto" que fija la carpeta navegada como proyecto activo, y los tabs llevan un chip con el nombre + rama git del proyecto abierto.
- `GitGraphPanel.tsx` → visor de git a pantalla completa; recibe `repoPath` del proyecto (cae al HOME si no hay proyecto). Usa `get_git_log` y el web component `<lib-git-graph>`.
- Es la pantalla inicial de la ventana `secondary` (ver [`../core/windows.ts`](../core/) y el `WindowInitializer` de `../App.tsx`).

### `section-placeholder/`
- Un solo componente parametrizado por `section` e `icon`. Tres rutas distintas (`/code`, `/security`, `/settings`) lo reutilizan. Sustitúyelo por una página real cuando se construya esa sección.

---

## Crear una página nueva

1. Crea `pages/mi-pagina/index.tsx` exportando el componente.
2. Regístrala como ruta en [`../shell/AppShell.tsx`](../shell/AppShell.tsx) (lazy import).
3. Si debe salir en el menú lateral, añade una entrada a `SIDEBAR_LINKS` en `../shell/layouts/DashboardLayout.tsx`.
