# 📂 Directorio: /pages (Smart Components)

Este directorio contiene los componentes de alto nivel de la aplicación, conocidos como **Smart Components** (Componentes Inteligentes) o **Orquestadores**. Cada carpeta dentro de `/pages` corresponde generalmente a una ruta navegable de la aplicación.

---

## 🧠 Responsabilidades
Los componentes de esta carpeta actúan como el "cerebro" de la vista:

- **Gestión de Datos:** Se comunican con los servicios (`Services`) para obtener o enviar información a las APIs.
- **Manejo del Estado:** Coordinan las **Signals** o estados complejos que afectan a toda la vista.
- **Orquestación:** Importan y organizan múltiples componentes de la carpeta `/components` (Dumb Components) para construir la interfaz.
- **Control de Navegación:** Gestionan la lógica de rutas, parámetros de URL (IDs, queries) y redirecciones mediante el `Router`.
- **Lógica de Negocio:** Aquí reside la toma de decisiones (qué pasa si falla una validación, qué ocurre al hacer clic en enviar, etc.).

## 🧱 Estructura Sugerida
Cada página suele estar encapsulada en su propia carpeta para mantener el orden:

```text
/pages
└── hero/
    ├── ui/                 # (Opcional) Componentes específicos que solo usa esta página
    ├── hero.component.ts   # El orquestador principal
    ├── hero.component.html # Estructura de alto nivel (layout de la página)
    └── hero.component.scss # Estilos de posicionamiento global de la página