# core — Infraestructura transversal

Contiene el sistema de autenticación y los hooks de acceso al contexto global.

---

## Autenticación

### AuthContext (`auth/AuthContext.ts`)

Contexto React que expone:

```typescript
interface AuthContextValue {
  isAuthenticated: boolean;
  login(password: string): boolean;
  logout(): void;
}
```

### AuthProvider (`auth/AuthProvider.tsx`)

Gestiona el estado de autenticación. El estado inicial se lee de `sessionStorage` para sobrevivir recargas sin cerrar sesión.

- **Contraseña**: constante `ADMIN_PASSWORD = 'shibui-dev'` (hardcoded, solo para protección local).
- `login(password)` → compara con la constante, guarda `admin_auth = 'true'` en `sessionStorage` si coincide.
- `logout()` → elimina la clave de `sessionStorage`.

Se monta en `App.tsx`, envuelve a toda la aplicación.

### AuthGuard (`auth/AuthGuard.tsx`)

Guarda de ruta. Si `isAuthenticated` es `false`, redirige a `/login` pasando la ruta de origen en `state.from` (React Router). La página de login puede leer ese estado para redirigir al destino original tras el login.

```tsx
<AuthGuard>
  <PáginaProtegida />
</AuthGuard>
```

---

## Servicio de proyecto (`project/`)

Mantiene en memoria **qué proyecto está abierto** (su ruta, nombre y metadata) y
lo comparte entre las dos ventanas del macro entorno. Mismo patrón que auth:
Context + Provider + hook.

### ProjectContext (`project/ProjectContext.ts`)

```typescript
interface ProjectInfo {
  path: string;            // ruta raíz absoluta
  name: string;            // último segmento de la ruta
  kinds: string[];         // tipos detectados: ['node', 'rust', 'git', ...]
  git_branch: string | null;
  exists: boolean;
}

interface ProjectContextValue {
  project: ProjectInfo | null;
  loading: boolean;
  error: string | null;
  openProject(path: string): Promise<void>;
  closeProject(): void;
  refresh(): Promise<void>;  // recalcula metadata (p.ej. tras cambiar de rama)
}
```

### ProjectProvider (`project/ProjectProvider.tsx`)

- La metadata (tipo de proyecto, rama git) la calcula el **backend Rust** vía el
  comando `get_project_info` (ver [`../../src-tauri/README.md`](../../src-tauri/README.md)
  y `core/src/project.rs`). El frontend no inspecciona el sistema de ficheros.
- Estado persistido en `localStorage` bajo `shibui-open-project`. Se usa
  `localStorage` (no `sessionStorage`) por dos motivos:
  1. **Compartir** el proyecto abierto entre las dos ventanas (evento `storage`).
  2. **Recordar** el último proyecto al reabrir la app.
- Se monta en `App.tsx`, envolviendo toda la app (dentro de `AuthProvider`).

### useProject (`hooks/useProject.ts`)

```typescript
const { project, openProject, closeProject } = useProject();
await openProject('D:\\PROYECTOS\\mi-repo');
if (project) console.log(project.name, project.git_branch);
```

> A diferencia de la **sesión** (que se pide en cada arranque), el proyecto SÍ
> se recuerda entre reinicios — es estado de trabajo, no de seguridad.

---

## Hooks

### useAuth (`hooks/useAuth.ts`)

Atajo para acceder al `AuthContext`. Lanza error si se usa fuera de `AuthProvider`.

```typescript
const { isAuthenticated, login, logout } = useAuth();
```

### useProject (`hooks/useProject.ts`)

Atajo para acceder al `ProjectContext`. Lanza error si se usa fuera de
`ProjectProvider`. Ver sección "Servicio de proyecto" arriba.

---

## Nota de seguridad

Esta capa es **protección de acceso ligera** para una app de escritorio single-user. No implementa cifrado, tokens con expiración, ni comunicación con ningún servidor. Es suficiente para evitar acceso accidental; no es adecuada para escenarios multi-usuario o datos sensibles en red.

> ⚠️ **Esto es intencionado.** La app es de **uso personal** (un solo usuario, su propia máquina). La contraseña hardcoded y la ausencia de auth real no son un descuido pendiente de arreglar: son la decisión correcta para este contexto. No conviertas esto en un sistema de login "de verdad" salvo que el propósito de la app cambie.

> Ojo: la gestión de **ventanas** del macro entorno vive en `windows.ts` (no documentado aparte por ser un único fichero pequeño); `App.tsx` lo usa para enrutar cada ventana por su label de Tauri.
