# main — Shell de pestañas de la ventana principal

La pantalla de la ruta `/` tras el login. **Sin sidebar**: un modelo de pestañas
estilo IDE/navegador. Sustituye a la antigua `hub/` + `DashboardLayout`.

---

## Piezas

```
main/
  index.tsx     → MainShell: estado de pestañas dinámicas + barra de tabs
  HubPanel.tsx  → contenido de una pestaña Hub: grid de cards (áreas + "Añadir pestaña")
  AreaView.tsx  → renderiza el contenido de un área dentro de su pestaña
  areas.ts      → catálogo de áreas (id, label, icono, descripción)
  main.css      → estilos del hub/grid (heredados de la antigua hub.css)
```

---

## Cómo funciona

- **MainShell** mantiene un array de pestañas. Cada una es un **Hub** o un **Área**.
- La 1ª pestaña es siempre un Hub.
- Click en una card de área → abre esa área como **pestaña nueva** (o enfoca la
  existente si ya estaba abierta — no se duplican áreas).
- La card **"Añadir pestaña"** (se distingue por su icono `+`) → abre **otro Hub**
  (y también el botón "+" de la barra de tabs).
- Las pestañas se pueden **cerrar** (× o click central), salvo si es la última.
- Los paneles se mantienen **montados** (oculto el inactivo) para no perder estado.

## Áreas (`areas.ts`)

`dashboard` · `files` · `code` · `security` · `settings`. Cada una mapea a un
componente en `AreaView.tsx` (las construidas reutilizan `DashboardPage` y
`FilesPage`; el resto caen al `SectionPlaceholder`).

> **Iconos**: usar solo nombres presentes en el registry de `@shibui/ui`
> (`folder`, `shield`, `chart-line`, `desktop`, `menu`, `home`, `plus`…).
> `code`/`folder-open`/`gear-six` NO existen en el registry y no renderizan.

## Añadir un área nueva

1. Añade una entrada a `AREAS` en `areas.ts` (con un icono que exista en el registry).
2. Añade su `case` en `renderArea()` de `AreaView.tsx` (componente real o placeholder).
