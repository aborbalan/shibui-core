# core/

Infraestructura transversal de la aplicación. Código que no pertenece a ninguna feature concreta
pero que todas las features pueden necesitar.

## Estructura

```
core/
├── auth/
│   ├── AuthContext.ts    ← definición del contexto
│   ├── AuthProvider.tsx  ← proveedor (estado en sessionStorage)
│   └── AuthGuard.tsx     ← protección de rutas admin
├── hooks/
│   ├── useAuth.ts         ← acceso al AuthContext
│   └── useAdminShortcut.ts← atajo de teclado Ctrl+Shift+A
└── data/
    └── constants/
        └── colors.ts     ← constantes de paleta (dev/admin)
```

## Qué va aquí

- Contextos React globales (AuthContext, ThemeContext...) y sus Providers.
- Guards de ruta (AuthGuard).
- Hooks de UI transversales (atajos de teclado, tema, breakpoints...).
- Constantes de configuración no relacionadas con una feature concreta.

## Qué NO va aquí

- Hooks de fetching de datos → van en `data/api/domain/*/hooks/`.
- Lógica específica de una feature → va en `features/{feature}/`.
- Layouts de aplicación → van en `shell/layouts/`.

## Diferencia con `data/`

`core/` = infraestructura de **UI y sesión** (auth, shortcuts, theme).
`data/` = infraestructura de **datos y servidor** (HTTP, React Query, DTOs).
