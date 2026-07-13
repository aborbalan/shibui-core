# Core Module 🧠

El directorio `/core` contiene la columna vertebral de la aplicación. Aquí reside la lógica pura, configuraciones globales y herramientas esenciales que permiten que la aplicación funcione, independientemente de la interfaz visual.

## 📌 Principios de la Capa Core
1. **Independencia de Dominio:** No contiene lógica de negocio específica (ej. no sabe qué es un "Carrito" o un "Usuario").
2. **Bajo Acoplamiento:** Debe ser agnóstico a los componentes de UI. En la medida de lo posible, evita importar JSX/TSX.
3. **Single Source of Truth:** Centraliza configuraciones para evitar la duplicación de lógica técnica.

---

## 📂 Estructura de Directorios (real)

> La capa de datos (cliente HTTP, dominios, query keys) **no vive en `/core`** sino en
> `src/data/` (ver `CLAUDE.md` de app-react). `/core` solo contiene infraestructura de
> app. No existe alias `@core`: se importa por ruta relativa.

### 1. `/auth`
Contexto e infraestructura de autenticación.
- `AuthContext`, `AuthProvider`, `AuthGuard`.

### 2. `/hooks`
Hooks transversales que no pertenecen a un dominio.
- `useAuth`, `useAdminShortcut`.

### 3. `/data/constants`
Valores estáticos y datos JSON.
- `colors.ts` y otros datos estáticos.

---

## 🛠️ Ejemplo de Uso de Alias

Para mantener las importaciones limpias, utiliza el alias `@core`:

```typescript
import { apiClient } from '@core/api';
import { ROUTES } from '@core/constants/routes';
import { UserRole } from '@core/types/auth';