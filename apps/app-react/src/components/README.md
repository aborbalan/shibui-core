# components/

Componentes **dumb globales**: presentacionales, sin fetching, reutilizables en ≥2 features o páginas.

## Qué va aquí

- Componentes que solo reciben props y renderizan UI (Header, Footer, Sidebar, ColorSwatch...).
- Modales con estado local de UI (`useState` para open/close), pero sin React Query.
- Wrappers sobre Web Components de `@shibui-ui/ui`.

## Qué NO va aquí

- Componentes que llaman hooks de datos → van en `features/{feature}/components/` o en el Container.
- Componentes usados solo en UNA feature → van en `features/{feature}/components/`.
- Layouts de aplicación (header fijo + sidebar + footer) → van en `shell/layouts/`.
- Templates de página estructurales → van en `templates/`.

## Fichero típico

```tsx
// components/ColorSwatch.tsx  ← dumb global
interface ColorSwatchProps {
  color: string;
  label: string;
}
export const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, label }) => { ... };
```
