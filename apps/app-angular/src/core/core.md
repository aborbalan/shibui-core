# 📂 Directorio: /core (Infraestructura Global)

Este directorio contiene la columna vertebral de la aplicación. Aquí reside toda la lógica que debe ser **instancia única (Singleton)** y que proporciona servicios esenciales a todo el sistema.

---

## ⚙️ Responsabilidades
La carpeta `/core` gestiona los cimientos técnicos que permiten que la app funcione:

- **Servicios Globales (Singletons):** Servicios que mantienen el estado en toda la app (ej. `AuthService`, `UserService`, `BackgroundLogicService`).
- **Interceptores de HTTP:** Lógica centralizada para añadir tokens de seguridad (JWT), manejar errores de red o mostrar un spinner de carga global.
- **Guards:** Protectores de rutas que deciden si un usuario puede entrar en una página (ej. `auth.guard.ts`).
- **Modelos y Tipos Globales:** Definiciones de interfaces que se usan en múltiples módulos (ej. `User`, `ApiResponse`).
- **Configuración:** Constantes globales, configuraciones de entorno o tokens de inyección (Injection Tokens).

## 🧱 Estructura Sugerida
Objetivo a medio plazo. **Estado real hoy:** solo existen `auth/` (con `auth.service.ts`
y `auth.guard.ts`) y `services/`. Los guards viven dentro de `auth/`, no en una carpeta
`guards/` propia; `interceptors/`, `models/` y `constants/` aún no se han creado.

```text
/core
├── auth/           # AuthService + auth.guard.ts (existe)
├── services/       # Lógica de negocio persistente (Signals globales) (existe)
├── interceptors/   # Transformación de peticiones/respuestas HTTP (planificado)
├── models/         # Interfaces y tipos compartidos en toda la app (planificado)
└── constants/      # Valores estáticos y configuraciones (planificado)