# src — Frontend React

Todo el código del frontend (la parte que se ve y se ejecuta en la ventana). El backend Rust está en [`../core/`](../core/README.md) y [`../src-tauri/`](../src-tauri/README.md).

> ⚠️ **App de uso personal.** Esta aplicación es una herramienta privada de un solo usuario (el autor). No está pensada para distribución ni para entornos multiusuario: por eso el login es una contraseña local, no hay roles, ni backend remoto, ni telemetría.

---

## Mapa rápido (por dónde empezar a leer)

```
src/
├── main.tsx            ← arranque: monta <App> en el DOM e importa @shibui/ui
├── App.tsx             ← raíz: Router + AuthProvider + LibCanvas (tema) + WindowInitializer
├── App.css             ← reset global + estilos de react-grid-layout
│
├── shell/              ← enrutado y layouts  → README propio
├── pages/              ← una carpeta por pantalla  → README propio
├── gadgets/            ← widgets del dashboard  → README propio
├── core/               ← auth, hooks de contexto y gestión de ventanas  → README propio
├── hooks/              ← hooks compartidos (layout del grid)  → README propio
└── assets/             ← imágenes/estáticos importados desde el código
```

Cada subcarpeta importante tiene su propio `README.md` con el detalle. Este fichero es solo el índice.

---

## El flujo de arranque, en orden

1. **`main.tsx`** monta React e importa `@shibui/ui` (registra todos los web components `<lib-*>`).
2. **`App.tsx`** envuelve la app con:
   - `MemoryRouter` (el enrutado vive en memoria, no en la URL — es una app de escritorio).
   - `AuthProvider` (estado de sesión).
   - `LibCanvas katachi="terminal"` (aplica el tema visual oscuro de Shibui).
   - `WindowInitializer` (lleva cada ventana a su sección según su label de Tauri).
3. **`shell/AppShell.tsx`** decide qué página mostrar según la ruta.
4. Sin sesión → `AuthGuard` redirige a `/login`.

---

## Cómo habla el frontend con el sistema

El frontend no accede al SO directamente; pide datos al backend Rust con `invoke()`:

```typescript
import { invoke } from '@tauri-apps/api/core';
const info = await invoke<SystemInfo>('get_system_info');
```

La lista completa de comandos disponibles está en [`../src-tauri/README.md`](../src-tauri/README.md).

---

## Multi-ventana (macro entorno)

La app puede abrir **dos ventanas** (pensado para repartir el trabajo entre monitores). La 2ª ventana **solo se abre tras el login** y muestra el `workspace`. La lógica de creación está en [`core/windows.ts`](core/) y el enrutado por ventana en `App.tsx` (`WindowInitializer`).
