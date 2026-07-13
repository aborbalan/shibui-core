# 📂 Directorio: /components (Dumb Components)

Este directorio contiene las piezas fundamentales de la interfaz de usuario (UI), conocidos como **Dumb Components** (Componentes "Mudos") o **Presentational Components**. Son los ladrillos con los que se construyen todas las vistas de la aplicación.

---

## 🎨 Responsabilidades
Los componentes de esta carpeta se centran exclusivamente en la capa de presentación:

- **Renderizado Visual:** Su única misión es mostrar información de manera estética y coherente.
- **Aislamiento Total:** No conocen la existencia de APIs, servicios de base de datos ni lógica de negocio global.
- **Comunicación mediante Contratos:** 
  - Reciben datos a través de **`input()` (Signals)**.
  - Notifican acciones del usuario (clics, cambios) a través de **`output()` (Events)**.
- **Estilos Granulares:** Contienen el CSS/SCSS detallado del elemento (colores, bordes, animaciones, tipografías).
- **Consistencia:** Aseguran que un botón o una tarjeta se vean exactamente igual en toda la plataforma.

## 🧱 Estructura Sugerida
Para mantener la escalabilidad, cada componente vive en su propia carpeta:

> Convención real de nombres: **sin infijo `.component.`** (p. ej. `content-section.ts`,
> no `content-section.component.ts`).

```text
/components
└── content-section/
    ├── content-section.ts   # Lógica visual y definición de inputs/outputs
    ├── content-section.html  # Estructura HTML pura
    ├── content-section.scss  # Estilos específicos del componente
    └── content-section.spec.ts # Tests (Vitest)