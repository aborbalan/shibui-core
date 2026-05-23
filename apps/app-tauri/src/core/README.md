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

## Hooks

### useAuth (`hooks/useAuth.ts`)

Atajo para acceder al `AuthContext`. Lanza error si se usa fuera de `AuthProvider`.

```typescript
const { isAuthenticated, login, logout } = useAuth();
```

---

## Nota de seguridad

Esta capa es **protección de acceso ligera** para una app de escritorio single-user. No implementa cifrado, tokens con expiración, ni comunicación con ningún servidor. Es suficiente para evitar acceso accidental; no es adecuada para escenarios multi-usuario o datos sensibles en red.
