# features/

Feature modules auto-contenidos. Cada sub-carpeta es una feature de la aplicación.

## Qué va aquí

- Un **Container** smart (ej. `TokensContainer.tsx`) que orquesta datos y layout de la feature.
- Una subcarpeta `components/` con los componentes **dumb** propios de esa feature.

## Qué NO va aquí

- Componentes reutilizables en varias features → van en `components/`.
- Lógica de fetching o hooks de datos → van en `data/api/domain/`.
- Wrappers de ruta → van en `pages/`.

## Estructura esperada

```
features/
└── tokens/
    ├── TokensContainer.tsx   ← smart: consume hooks, orquesta layout
    └── components/           ← dumb: reciben props, sin fetching
        ├── ColorsSection.tsx
        └── ...
```

## Cuándo crear una nueva feature

Cuando una página tiene **sub-componentes propios** que no se usan en ningún otro sitio.
Si los componentes son compartidos entre ≥2 páginas, van a `components/` directamente.
