# shell/

App shell: routing de la aplicación y layouts de nivel superior.

## Estructura

```
shell/
├── AppShell.tsx        ← router raíz con React Router + Suspense + lazy loading
└── layouts/
    ├── PublicLayout.tsx  ← header + footer para páginas públicas
    ├── AdminLayout.tsx   ← sidebar + main para panel de administración
    └── MainLayout.tsx    ← layout base
```

## Qué va aquí

- La configuración de rutas (`AppShell.tsx`): qué componente renderiza cada path.
- Layouts que comparten header/sidebar/footer entre varias páginas.
- Wrappers que aplican `AuthGuard` a rutas protegidas.

## Qué NO va aquí

- Componentes de página → van en `pages/` (thin wrappers) o `features/` (lógica).
- Componentes de UI reutilizables (Header, Footer como piezas) → van en `components/`.
- Lógica de negocio ni fetching de datos.

## Fichero típico

```tsx
// shell/AppShell.tsx  ← define las rutas con lazy loading
const TokensPage = lazy(() => import('../pages/tokens'));

<Routes>
  <Route path="/tokens" element={<TokensPage />} />
</Routes>
```
