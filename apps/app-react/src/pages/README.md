# pages/

Thin wrappers de ruta. Cada sub-carpeta corresponde a una ruta de React Router.

## Qué va aquí

- Un `index.tsx` que re-exporta el Container de la feature correspondiente.
- Opcionalmente, sub-carpetas `templates/` con componentes presentacionales **exclusivos** de esa página que aún no justifican ser extraídos a `features/`.

## Qué NO va aquí

- Lógica de negocio ni fetching de datos.
- Componentes reutilizables → van en `components/` o `features/{feature}/components/`.
- Layouts de app (header, footer, sidebar) → van en `shell/layouts/`.

## Fichero típico

```tsx
// pages/tokens/index.tsx  ← thin wrapper
export { default as TokensPage, default } from '../../features/tokens/TokensContainer';
```

## Regla de promoción

Cuando una página crece y tiene ≥3 sub-componentes propios con lógica,
extrae todo a `features/{feature}/` y convierte `pages/{page}/index.tsx` en re-exportación.
