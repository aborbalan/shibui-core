# Cohesión de props — progreso

> Estado vivo de la migración de cohesión de props (`docs/props-contract.md` = contrato).
> Leyenda: ✅ hecho (merged) · 🟢 PR abierto · ⏳ pendiente.

_Última actualización: 2026-06-14_

## 🎉 MIGRACIÓN COMPLETA (en `develop`)
Toda la cadena está mergeada vía la PR consolidadora **#497** (que llevó a `develop`
las tandas que habían quedado apiladas: #490·#492·#494·#495·#496). El DS es 100%
cohesivo, el contrato **C1–C12** está activo en CI (`test:cohesion`), `test:unit`
corre en `ci-lib`, y `KNOWN_PENDING` está vacío. Sólo quedan extras opcionales
(tests Nivel 2/3 visuales · `--strict` en el extractor).

## Fundación y tooling
- ✅ Contrato de tipos `src/types/index.ts` (dedup `public.ts`) — #484
- ✅ Extractor `generate-components-api.ts` (alias recursivo, filtra `''`/`undefined`) — #484
- ✅ Docs: `props-contract.md`, `prop-migration-map.md`, `component-props-testing.md` — #484/#486
- ✅ Borrado `api-contract` (WIP) + filtro CI `base` en orchestrator — #485
- ✅ Test cohesión Nivel 1 (`test:cohesion`) + step en ci-lib — #486

## Ejes / bloques

| Bloque | Estado | PR | Notas |
|---|---|---|---|
| **size** (sentinels `''`) | ✅ | #484 | button-group, tabs |
| **tone/tint atoms** | ✅ | #484 | avatar·glass-card→tint · checkbox·radio·progress-circle·empty-state→tone |
| **tone + surface (inputs)** | ✅ | #484 | counter·range-slider·eyebrow · gauge·sparkline→LibSemanticTone |
| **color → tone** | ✅ | #484 | chip (strong doc.) · divider |
| **danger → error** | ✅ | #484 | close-button · button-liquid · dialog · modal |
| **estéticas → theme** | ✅ | #484/#487 | spinner·text-glitch (#484) · sidebar·footer·header·burger·drawer·step·stepper·background (#487) |
| **display** (modos render) | ✅ | #488 | data-table·reading-progress·color-picker · (+fix fantasmas variant burger/sidebar/text-glitch) |
| **surface resto** | ✅ | #489 | switch·counter·range-slider·eyebrow (on-dark→dark) · quote·display-heading (neutral→default) · content-pillar (ya canónico) · breadcrumb (surface→variant) · skeleton (split surface/tone) · tooltip·kbd·segmented-control (split variant/surface/tone) · timeline (tooltip-variant→tooltip-surface/tone). `LibSurface`=default·light·dark·inverse |
| **tone sueltos + accordion** | ✅ | #490 | spinner: ink→default·cool→info · reading-progress: filled→default·**gold→theme=kintsugi** · accordion: flush/separated→display, accent→tone |
| **color/accent → tone + tipos** | ✅ | #492 | parallax·checkbox-card·tabs (color→tone) · rating (gold→default·neutral→muted) · breadcrumb (accent→tone, bold→strong) · ariaLabel `string\|null`→`string` · `tabs.scroll(unknown)→scrollable` |
| **flag-o-valor `string\|boolean`** | ✅ n/a | — | 0 en el manifest — eje ya limpio |
| **variant + button cluster** | ✅ | #494 | canon `LibVariant`=solid·outlined·ghost·subtle + `VARIANT_EXTRA` (card→featured · modal→editorial · close-button→filled-round). Reclasif.: badge→tone · tabs/breadcrumb/segmented→display · gadget-frame→theme. `filled`→`solid` en select/pagination/dropdown/liquid/copy/kbd/code-block. Splits card/close-button/dialog/modal (+tone/+surface). button+button-split: `variant`+`tone` (primary→solid·danger→tone=error). Reglas **C4–C12 activadas** |
| **Phase 2: apps + wrappers** | ✅ | #495 | wrappers regenerados · react/angular/svelte/tauri/api + consumer-tests migrados al canon · estéticas kintsugi/glitch→data-katachi · mapas dinámicos badge tone |
| **Phase 4: cleanup** | ✅ | #496 | huérfanos `SidebarVariant`/`FooterVariant` borrados · `test:unit` pre-existente arreglado y cableado en ci-lib · charts "rotos" = falsa alarma (dist stale) |
| **Consolidación a develop** | ✅ | #497 | lleva a develop las tandas que quedaron apiladas tras #489 |
| **Phase 4: extras (opcional)** | ⏳ | — | tests Nivel 2/3 · `--strict` en extractor |

## KNOWN_PENDING actual (allowlist del test:cohesion)
🎉 **VACÍO — y las 12 reglas (C1–C12) ACTIVAS.** Cero `it.todo`. El test cubre:
size · tone · surface · tint · **variant** (canon + `VARIANT_EXTRA`) · **danger
prohibido** · **estéticas solo en theme/katachi** · **modos render fuera de
variant** · sin unknown · sin empty · default∈options · sin flag-o-valor.

## PRs (todas ✅ merged a `develop`)
- #484 · #485 · #486 · #487 · #488 (fundación + size/tone/tint/surface/danger/theme/display)
- #489 (surface) · #490 (tone+accordion) · #492 (color+tipos) · #494 (variant+button) ·
  #495 (apps+wrappers+consumer-tests) · #496 (cleanup) · **#497 (consolidación a develop)**

## Notas / aprendizajes
- Renames `variant`→`theme`/`display`/`tone`: actualizar TAMBIÉN el JSDoc `@prop`/`@attr`, o CEM crea
  miembros **fantasma** en el manifest (pasó con burger/sidebar/text-glitch → develop quedó rojo, fix en #488).
- NADA de katachi/tokens se toca: solo nombres de prop + sus selectores `:host([x=…])`. Valores intactos.
- Múltiples PRs abiertos tocan `components.generated.ts` → conflicto al mergear; mergear en orden y regenerar.
