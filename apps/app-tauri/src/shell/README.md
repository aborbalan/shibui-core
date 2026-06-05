# shell — Enrutado y barra de pestañas

Configuración de rutas de la aplicación y la barra de pestañas compartida. **Ya no hay sidebar** (`DashboardLayout` se eliminó): la ventana principal usa un modelo de pestañas.

---

## AppShell (`AppShell.tsx`)

Define las rutas con React Router. Solo hay tres, todas lazy excepto el login:

```
/login       → LoginPage     (sin layout)
/            → MainShell     (ventana principal: shell de pestañas, SIN sidebar)
/workspace   → WorkspacePage (2ª ventana: tabs Files/Git)
*            → redirect a /
```

Todas excepto `/login` están protegidas por `<AuthGuard>`.

> Las "secciones" (Files, Dashboard, Code…) ya **no son rutas**: se abren como
> pestañas dentro de `MainShell` (ver `src/pages/main/`). Por eso `/files`,
> `/code`, etc. desaparecieron del router.

---

## WorkspaceTabs (`WorkspaceTabs.tsx`)

Barra de pestañas superior reutilizable (estilo terminal/IDE, tokens de Shibui).
Controlada: el padre mantiene `activeId` y reacciona a `onChange` / `onClose`.

| Prop | Para qué |
|------|----------|
| `tabs` | Array de `{ id, label, icon }`. |
| `activeId` / `onChange` | Pestaña activa (controlada). |
| `closable` + `onClose` | Muestra el botón × por pestaña y habilita cerrar (también con click central). |
| `trailing` | Contenido a la derecha de la barra (p.ej. el botón "+" de nueva pestaña). |

La usan tanto `MainShell` (ventana principal) como `WorkspacePage` (2ª ventana).

---

## Modelo de pestañas

El shell de la ventana principal vive en [`../pages/main/`](../pages/main/) — ver
su lógica ahí. Resumen: la 1ª pestaña es un Hub (grid de áreas), las cards abren
áreas como pestañas nuevas, y "Añadir pestaña" abre otro Hub.
