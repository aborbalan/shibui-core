# sukashi — handoff (continuación)

> Estado al cierre de la sesión del 2026-06-28. Rama de trabajo: `claude/sukashi-status-phase-a9sq0m`.
> Fuente de verdad del estado de fases: [`STATUS.md`](STATUS.md). Este fichero es el punto de
> arranque para la siguiente sesión.

---

## 1. Estado actual

- **Camino crítico F0 → F6 completo.** 78 tests verdes, `type-check` limpio.
- **PR [#590](https://github.com/aborbalan/shibui-core/pull/590) MERGEADO a `develop`** (F5 + F6 + fix de fuga). No reabrir ni abrir uno nuevo para el mismo cambio.
- API pública nueva:
  - F5 → `kasaneMultiWeave` (`core/multiweave.ts`)
  - F6 → `kasaneMultiCoverWeave` (`core/multicover.ts`) + `renderContrastReport` (`render/report.ts`)

## 2. Decisiones pendientes (necesitan input del usuario)

| # | Decisión | Contexto |
|---|---|---|
| **A** | **Framing del paquete.** No se ejecutó la "auditoría de no-filtración de la naturaleza real" pedida en su día. Funcionalmente sukashi es reparto visual de secretos / esteganografía bajo una capa decorativa. Si es arte/marca temática → nada que hacer. Si el objetivo era ocultar deliberadamente una capacidad encubierta ante quien audite el repo → esa parte queda fuera (no se ayuda a disfrazar la función real del software). **Resolver intención antes de tocar docs con ese fin.** |
| **B** | **¿Eliminar `sharedPivot`?** Quedó como opción opt-in etiquetada con su fuga conocida (`motivo_i XOR motivo_j`). Si se prefiere un esquema solo-seguro, quitarlo de F5 y F6 (trivial; cambia la API). |
| **C** | ~~Merge del PR #590~~ → **HECHO** (mergeado a `develop`). |

## 3. Fases opcionales restantes (fuera del camino crítico, enchufables)

Ambas se conectan a *seams* ya preparados en F1; el núcleo no se acopla a ellas.

### F4½ — Deformación uzumaki (渦) · `src/warp/`
- **Qué:** campo de deflexión en remolino parametrizado por Ω que (1) genera covers en espiral
  (hermana de seigaiha/moiré) y (2) **deforma** cada capa, reversible des-deformando con −Ω.
- **Enchufa en:** el hook de transform de F1.
- **Hecho cuando:** `warp(layer, Ω)` y su inverso son fieles dentro de tolerancia; integrado como
  transform opcional en el render.
- **Gotcha:** el warp opera sobre la capa 2× (resolución de bloque). Debe respetar la malla de
  bloques 2×2 (o aplicarse/revertirse simétrico en ambas capas del par) para no romper el reveal
  estructural.

### F7 — Semilla del cielo (kumo 雲) · `src/entropy/`
- **Qué:** `SeedSource` alternativo que toma una foto del cielo, la condensa y la **mezcla** con
  `systemSeed` (nunca lo reemplaza), con *health-test* (imagen congelada) y *fallback* a la semilla
  del sistema.
- **Enchufa en:** el seam `SeedSource` de F1 (`core/seed.ts`, default `systemSeed`).
- **Hecho cuando:** `skySeed` produce semilla mezclada y cae a `systemSeed` si la cámara falla; el
  `weave` funciona idéntico con cualquiera de las dos.
- **Gotcha:** "mezcla, nunca reemplaza" es requisito de seguridad — mézclalo por XOR/hash, no por
  sustitución; si la entropía del cielo es pobre no debe degradar por debajo de `systemSeed`.

## 4. Mapa de la API / ficheros clave

```
core/multiweave.ts     kasaneMultiWeave  → { pivots[], petals[], pivot, sharedPivot }
core/multicover.ts     kasaneMultiCoverWeave → + metric{contrast[],pivotFidelity[],petalFidelity[]}, fellBack
core/cover.ts          kasaneCoverWeave (F4, base de F6 en modo independiente)
core/weave.ts          kasaneWeave, writeBlock/readBlock (helpers reutilizados)
render/report.ts       renderContrastReport (HTML autónomo, escapa input externo)
scripts/gen-contrast-report.ts   → docs/contrast-report.html  (pnpm --filter @shibui-ui/sukashi report)
core/seed.ts           seam SeedSource  ← engancha F7
(F1 transform hook)    ← engancha F4½
```

### Nota de seguridad (ya implementada)
Por defecto cada secreto usa un **pivote independiente** (sin fuga cruzada). `sharedPivot: true`
reutiliza un pivote común y filtra `motivo_i XOR motivo_j` — opción explícita y etiquetada, no el
default. No reintroducir el pivote compartido como comportamiento por defecto.

## 5. Cómo verificar

```bash
pnpm --filter @shibui-ui/sukashi type-check
pnpm --filter @shibui-ui/sukashi test          # 78 tests
pnpm --filter @shibui-ui/sukashi report        # regenera docs/contrast-report.html
pnpm --filter @shibui-ui/sukashi dev           # demo (sukashi.web.app)
```

## 6. GitFlow (no negociable)

- Destino de integración = **`develop`**, nunca `main`. Merge a develop siempre `--no-ff`.
- `main` solo desde `develop` vía PR.
- No borrar `feature/**` automáticamente sin confirmación del usuario.
- Para una fase opcional nueva: abrir `feature/sukashi-f4-5-uzumaki` o `feature/sukashi-f7-kumo`
  desde `develop` actualizado.
