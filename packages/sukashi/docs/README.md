# 透かし sukashi — documentación

> Patrones decorativos por capas (*sukashi-e* / moiré) para shibui-ui.
> Genera capas con texturas tradicionales que, al superponerse, revelan un motivo emergente.

**Estado:** F0 (andamiaje) hecha. Fase actual en [`STATUS.md`](STATUS.md).

> 🔄 **¿Retomando en una sesión nueva?** Empieza por
> [`docs/phases/README.md`](phases/README.md): tiene el estado actual, el orden de fases y el próximo paso accionable.

---

## Índice

| Documento | Contenido |
|---|---|
| [`docs/phases/`](phases/) | Fases de desarrollo F0–F6 (plan de obra) |

Diseño aprobado (visión y arquitectura): `docs/plans/2026-06-15-sukashi-design.md` (raíz del repo).

## Estructura propuesta

```
packages/sukashi/
├─ package.json
├─ README.md
├─ src/
│  ├─ core/      motor de composición de capas
│  ├─ motif/     rasteriza fuente → bitmap
│  ├─ pattern/   covers generativos (seigaiha, sashiko, mon, moiré)
│  ├─ render/    export SVG/Canvas/PNG
│  ├─ web/       <shibui-sukashi> custom element
│  └─ index.ts   API pública
├─ stories/      Storybook
└─ docs/         ← esta carpeta
   └─ phases/    fases de desarrollo
```
