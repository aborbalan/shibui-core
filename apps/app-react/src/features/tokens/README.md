# features/tokens/

Feature de Design Tokens. Muestra el catálogo completo de tokens del sistema de diseño.

## Qué va aquí

- `TokensContainer.tsx` — smart container: cuando conecte `useTokens()`, será el único punto donde se consumen los datos.
- `components/` — secciones presentacionales (ColorsSection, TypographySection, etc.). Reciben datos por props, no hacen fetching.

## Qué NO va aquí

- Los hooks de React Query → en `data/api/domain/tokens/hooks/`.
- Las DTOs y llamadas HTTP → en `data/api/domain/tokens/api/`.
- Componentes que se reutilicen fuera de esta feature → en `components/`.

## Fichero típico

```tsx
// components/ColorsSection.tsx  ← dumb
interface ColorsSectionProps {
  tokens?: DesignTokenDto[];
}
export const ColorsSection: React.FC<ColorsSectionProps> = ({ tokens }) => { ... };
```
