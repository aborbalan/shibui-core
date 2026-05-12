# data/

Capa de datos de la aplicación. Todo lo relacionado con fetching, caching y estado de servidor.

## Estructura

```
data/
└── api/
    ├── client.ts          ← HTTP client con JWT auto-inject
    ├── query-client.ts    ← configuración de React Query
    ├── query-keys.ts      ← fábrica centralizada de query keys
    └── domain/
        ├── about/
        │   ├── api/about.api.ts    ← DTOs + llamadas HTTP
        │   └── hooks/useAbout.ts   ← hooks de React Query
        ├── auth/
        └── tokens/
```

## Qué va aquí

- DTOs (interfaces TypeScript que modelan respuestas de la API).
- Funciones de API puras que llaman a `apiClient`.
- Hooks de React Query (`useQuery`, `useMutation`) que consumen esas funciones.
- Configuración del QueryClient y query keys.

## Qué NO va aquí

- Componentes de UI → van en `components/` o `features/`.
- Estado de UI (modales, tabs, animaciones) → `useState` local en el componente.
- Lógica de negocio de presentación → en el Container de `features/`.

## Patrón por dominio

Cada dominio (`about`, `auth`, `tokens`...) tiene:
- `api/{domain}.api.ts` — DTOs + llamadas HTTP puras
- `hooks/use{Domain}.ts` — hooks de React Query que exponen los datos

Los Containers en `features/` importan solo desde `hooks/`, nunca desde `api/` directamente.
