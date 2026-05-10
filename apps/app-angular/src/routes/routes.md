# 📂 Directorio: /routes (Route Configuration)

Este directorio centraliza la definición de todas las rutas de la aplicación. Su objetivo es evitar el uso de cadenas de texto (strings) sueltas en los componentes y servicios, proporcionando una fuente única de navegación.

---

## 🛤️ Responsabilidades
La carpeta `/routes` actúa como el "GPS" de la aplicación:

- **Definición de Constantes:** Almacena los paths de las rutas como constantes exportables (ej. `export const ROUTE_LOGIN = 'login'`).
- **Configuración de Lazy Loading:** Centraliza la carga perezosa de los módulos o componentes de la carpeta `/pages`.
- **Estructura Jerárquica:** Define de forma clara la relación entre rutas padre y rutas hijas.
- **Tipado de Rutas:** Proporciona objetos de configuración que facilitan la generación de enlaces dinámicos.

## 🧱 Estructura Sugerida
Dependiendo de la complejidad, se puede organizar en un solo archivo o varios:

```text
/routes
├── app.routes.ts         # Definición principal (Root Routes)
├── auth.routes.ts        # Rutas específicas del dominio Auth
├── dashboard.routes.ts   # Rutas específicas del panel de control
└── routes.constants.ts   # Constantes con los nombres de los paths