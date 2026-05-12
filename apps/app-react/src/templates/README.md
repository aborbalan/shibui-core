# templates/

Componentes de layout estructural de página. Definen la forma visual de una sección completa,
sin conocer datos de negocio.

## Qué va aquí

- Componentes que arman la estructura visual de una sección hero/intro (ej. `HeroIntro.tsx`).
- Skeletons de página reutilizables que aceptan contenido por props/children.
- Componentes con animaciones de entrada propias de la presentación.

## Qué NO va aquí

- Componentes que hacen fetching o consumen hooks de datos → van en `features/`.
- Layouts de aplicación con header/sidebar/footer → van en `shell/layouts/`.
- Secciones específicas de una feature (ej. ColorsSection) → van en `features/{feature}/components/`.

## Fichero típico

```tsx
// templates/HeroIntro.tsx  ← layout de sección hero, props opcionales con defaults
interface HeroIntroProps {
  eyebrow?: string;
  titleLine1?: string;
  onPrimary?: () => void;
}
export const HeroIntro: React.FC<HeroIntroProps> = ({ ... }) => { ... };
```
