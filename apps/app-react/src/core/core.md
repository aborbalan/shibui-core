# Core Module 🧠

El directorio `/core` contiene la columna vertebral de la aplicación. Aquí reside la lógica pura, configuraciones globales y herramientas esenciales que permiten que la aplicación funcione, independientemente de la interfaz visual.

## 📌 Principios de la Capa Core
1. **Independencia de Dominio:** No contiene lógica de negocio específica (ej. no sabe qué es un "Carrito" o un "Usuario").
2. **Bajo Acoplamiento:** Debe ser agnóstico a los componentes de UI. En la medida de lo posible, evita importar JSX/TSX.
3. **Single Source of Truth:** Centraliza configuraciones para evitar la duplicación de lógica técnica.

---

## 📂 Estructura de Directorios

### 1. `/api`
Configuración de clientes HTTP (Axios, Fetch).
- **Interceptores:** Manejo de tokens JWT, refresco de sesión y gestión global de errores (401, 403, 500).
- **Configuración:** Base URL y timeouts.

### 2. `/config`
Variables de entorno y configuración de librerías externas.
- Validación de `process.env`.
- Configuración de Firebase, Sentry, i18n, etc.

### 3. `/constants`
Valores inmutables utilizados en todo el proyecto.
- `routes.ts`: Diccionario de rutas de la aplicación.
- `api-endpoints.ts`: Endpoints de los microservicios.
- `storage-keys.ts`: Nombres de las llaves en LocalStorage.

### 4. `/guards`
Lógica de protección de rutas (Middleware).
- Verificación de autenticación.
- Control de acceso por roles (RBAC).

### 5. `/types`
Definiciones de TypeScript globales.
- Interfaces de respuestas de API comunes.
- Modelos de datos base (Entities).
- Tipos de utilidad generales.

### 6. `/utils`
Funciones puras de ayuda que no dependen de React.
- Formateadores de moneda y fechas.
- Validadores de esquemas.
- Manipulación de arrays/objetos complejos.

---

## 🛠️ Ejemplo de Uso de Alias

Para mantener las importaciones limpias, utiliza el alias `@core`:

```typescript
import { apiClient } from '@core/api';
import { ROUTES } from '@core/constants/routes';
import { UserRole } from '@core/types/auth';