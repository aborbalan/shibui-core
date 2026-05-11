# app-react — Aplicación de testing y showcase de Shibui UI

App React que actúa como showcase público de la librería y panel de administración interno para gestionar el contenido.

---

## Stack

- **React 19** + **TypeScript estricto**
- **React Router DOM v7** — routing declarativo en `AppShell`
- **TanStack Query v5** — fetching, caché y sincronización de servidor
- **Vite** — bundler y dev server
- **Vitest** + **Testing Library** + **MSW** — tests unitarios e integración
- **happy-dom** — entorno de test (no jsdom)

---

## Estructura

```
src/
  shell/
    AppShell.tsx            → Router principal (lazy pages + layouts)
    layouts/
      PublicLayout.tsx      → Wrapper para rutas públicas
      AdminLayout.tsx       → Wrapper para rutas admin (con AuthGuard)
      MainLayout.tsx
  pages/                    → Una carpeta por ruta, con templates/ dentro
    hero/
    about/
    components/
    tokens/
    login/
    home/
  components/               → Componentes React compartidos (Header, Footer, Sidebar…)
  core/
    auth/                   → AuthContext, AuthProvider, AuthGuard
    hooks/                  → useAuth, useAdminShortcut
    data/constants/         → colors.ts y datos estáticos JSON
  data/
    api/
      client.ts             → Fetch wrapper con JWT y manejo de errores
      query-client.ts       → Instancia global de QueryClient
      query-keys.ts         → Todas las query keys centralizadas
      domain/               → Un módulo por dominio (api/ + hooks/)
        about/
        auth/
        categories/
        components/
        tokens/
  dev/
    KitchenSink/            → Área dev para probar componentes Lit (atoms, molecules, organisms)
  test/
    setup.ts                → Arranca/cierra servidor MSW global
    mocks/{domain}/         → Fixtures + handlers MSW por dominio
  custom-elements.d.ts      → Tipos JSX para elementos lib-* de Shibui UI
```

---

## Routing

Dos mundos separados en `AppShell.tsx`, todos los pages son lazy-loaded:

| Ruta | Acceso | Layout |
|---|---|---|
| `/`, `/home` | Público | `PublicLayout` |
| `/about` | Público | `PublicLayout` |
| `/componentes` | Público | `PublicLayout` |
| `/tokens` | Público | `PublicLayout` |
| `/admin/login` | Público | Sin layout |
| `/admin/kitchen-sink` | Protegido | `AdminLayout` + `AuthGuard` |

`Ctrl+Shift+A` → navega a `/admin/login` desde cualquier página (via `useAdminShortcut`).

---

## Capa de datos

### `apiClient` (`src/data/api/client.ts`)

Fetch wrapper tipado. Gestiona:
- JWT desde `sessionStorage` (clave: `admin_auth_token`)
- `Content-Type` y `Accept` automáticos
- Redirige a `/admin/login` y limpia el token en 401
- Lanza `ApiError(status, code, message)` en respuestas no-ok
- Rutas con `{ public: true }` omiten el header de autorización

```typescript
apiClient.get<T>(path, opts?)
apiClient.post<T>(path, body, opts?)
apiClient.put<T>(path, body, opts?)
apiClient.patch<T>(path, body, opts?)
apiClient.delete<T>(path, opts?)
```

### Dominios (`src/data/api/domain/{domain}/`)

Cada dominio tiene:
- `api/{domain}.api.ts` — DTOs + llamadas al `apiClient`
- `hooks/` — custom hooks con `useQuery` / `useMutation`

Dominios actuales: `about`, `auth`, `categories`, `components`, `tokens`

### Query keys (`src/data/api/query-keys.ts`)

Fuente única de verdad para todas las keys. Usar siempre estas constantes en `useQuery` e `invalidateQueries`:

```typescript
queryKeys.about.profile
queryKeys.about.experience
queryKeys.designSystem.components()
queryKeys.auth.me
// etc.
```

### `QueryClient` (`src/data/api/query-client.ts`)

- `staleTime`: 5 minutos
- No reintenta en errores 4xx (`ApiError.status < 500`)
- `refetchOnWindowFocus: false`

---

## Auth

- `AuthProvider` envuelve toda la app en `App.tsx`
- `AuthContext` expone `{ isAuthenticated, login, logout }`
- `AuthGuard` redirige a `/admin/login` si no hay sesión activa, guardando la ruta de origen en el state
- `useAuth()` es el hook de consumo — nunca acceder al contexto directamente

---

## Integración con Shibui UI

```typescript
// main.tsx — registra todos los custom elements globalmente
import '@shibui/ui';
```

```typescript
// custom-elements.d.ts — tipado JSX para lib-*
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: `lib-${string}`]: React.HTMLAttributes<HTMLElement> & {
        [propName: string]: unknown;
      };
    }
  }
}
```

Usar siempre esta declaración para nuevos elementos — no añadir tipos específicos inline.

---

## Testing

- **Vitest** con `happy-dom` como entorno (no jsdom)
- **MSW v2** para interceptar peticiones HTTP en tests
- Setup global en `src/test/setup.ts`: arranca/resetea/cierra el servidor MSW automáticamente
- Mocks organizados por dominio en `src/test/mocks/{domain}/`:
  - `{domain}.fixtures.ts` — datos de prueba
  - `{domain}.handlers.ts` — handlers MSW
  - `server.ts` — instancia del servidor

```bash
# Correr tests desde la raíz
pnpm --filter app-react test
```

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | Base URL de la API (ej. `https://shibui-core.onrender.com`) |

Definir en `.env.local` (no committear).

---

## KitchenSink (`src/dev/KitchenSink/`)

Área de desarrollo accesible en `/admin/kitchen-sink` (requiere login).  
Organizada en `AtomSink`, `MoleculesSink` y `OrganismsSink` para probar los componentes Lit de forma aislada en un contexto React real.
