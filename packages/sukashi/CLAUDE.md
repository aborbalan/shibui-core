# sukashi (`@shibui-ui/sukashi`) — Patrones decorativos por capas

透かし — Librería de **patrones decorativos por capas** (*sukashi-e* / moiré) para shibui-ui.
Se componen capas con texturas tradicionales (seigaiha, asanoha, sashiko, mon) que, al
superponerse, revelan un **motivo emergente**.

> **Estado:** F0 → F8 ✅ — camino crítico F0→F6 + opcionales F4½ uzumaki y F7 kumo + extensión F8 warifu (motivo sellado por el manifiesto de hanko; núcleo + demo + e2e).
> **API pública aún en estabilización.** La fase vigente es la fuente de verdad y vive en
> [`docs/STATUS.md`](docs/STATUS.md) + el plan de obra en [`docs/phases/`](docs/phases/)
> — NO en este fichero. Aquí va lo estable.

---

## Estructura (`src/`)

```
src/
  core/      → motor de composición de capas
  motif/     → rasteriza fuente → bitmap (el motivo a embeber)
  pattern/   → covers generativos: seigaiha · asanoha · sashiko · mon · moiré
  render/    → export a SVG / Canvas / PNG
  web/       → custom element <shibui-sukashi>
  entropy/   → (opcional) semilla del cielo (kumo); adaptador de cámara fuera del barrel node
  warp/      → (opcional) deformación en remolino (uzumaki); cover espiral + giro reversible
  warifu/    → (extensión) tablilla partida: motivo que se compone solo si un manifiesto (hanko) cumple
  index.ts   → API pública (barrel)
```

Flujo conceptual: `motif` (motivo → bitmap) → `pattern` (capas decorativas) →
`core` (composición) → `render` (salida) / `web` (elemento consumible).

---

## Scripts

```bash
pnpm --filter @shibui-ui/sukashi type-check   # tsc --noEmit
pnpm --filter @shibui-ui/sukashi test         # vitest run
pnpm --filter @shibui-ui/sukashi test:watch   # vitest
```

---

## Instrucciones para Claude

- Paquete **temprano**: confirma la fase en `docs/STATUS.md` antes de asumir qué módulos
  existen o están estabilizados; varios son andamiaje.
- No dupliques el estado de fases aquí ni en commits — vive en `docs/`.
- El custom element sigue el prefijo `shibui-` (`<shibui-sukashi>`), no el `lib-*` de
  `@shibui-ui/ui`.
- Sigue GitFlow del monorepo (destino `develop`, nunca `main`).
