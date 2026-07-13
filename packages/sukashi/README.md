# 透かし sukashi

> Patrones decorativos por capas (*sukashi-e* / moiré) para shibui-ui.
> Compón capas con texturas tradicionales —seigaiha, asanoha, sashiko, mon— que al superponerse revelan un motivo emergente.

**Estado:** **F0 → F8 ✅** — camino crítico (F0→F6) + opcionales F4½ (uzumaki) y F7 (kumo) + extensión F8 (warifu) completados. Ver fase actual en [`docs/STATUS.md`](docs/STATUS.md) y el plan de obra en [`docs/phases/`](docs/phases/).

## Scripts

```bash
pnpm --filter @shibui-ui/sukashi type-check
pnpm --filter @shibui-ui/sukashi test
```

## Estructura

```
src/
├─ core/      motor de composición de capas
├─ motif/     rasteriza fuente → bitmap
├─ pattern/   covers generativos (seigaiha, sashiko, mon, moiré)
├─ render/    export SVG/Canvas/PNG
├─ web/       <shibui-sukashi> custom element
└─ index.ts   API pública
```
