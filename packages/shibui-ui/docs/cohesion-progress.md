# Cohesión de props — progreso

> Estado vivo de la migración de cohesión de props (`docs/props-contract.md` = contrato).
> Actualizar al cerrar cada tanda. Leyenda: ✅ hecho (merged) · 🟢 PR abierto · ⏳ pendiente.

_Última actualización: 2026-06-12_

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
| **display** (modos render) | 🟢 | #488 | data-table·reading-progress·color-picker · (+fix fantasmas variant burger/sidebar/text-glitch) |
| **accordion** (split display+tone) | ⏳ | — | flush/separated→display, accent→tone |
| **surface resto** | 🟢 | feature/props-cohesion-surface | switch·counter·range-slider·eyebrow (on-dark→dark) · quote·display-heading (neutral→default) · content-pillar (ya canónico) · breadcrumb (surface→variant) · skeleton (split surface/tone) · tooltip·kbd·segmented-control (split variant/surface/tone) · timeline (tooltip-variant→tooltip-surface/tone). `LibSurface`=default·light·dark·inverse |
| **tone sueltos** | ⏳ | — | spinner(ink/cool→¿tint?) · reading-progress(filled/gold) |
| **flag-o-valor + tipos** | ⏳ | — | label/error/tooltip/active/spotlight/counter · uniones `string\|number` · ariaLabel · tabs.scroll(unknown) |
| **button cluster** | ⏳ | — | button + button-split + button-group · split variant+tone · ⚠️ alto impacto |
| **Phase 2: apps + wrappers** | ⏳ | — | react/angular/svelte/cv usan atributos viejos · regenerar wrappers ⚠️ |
| **Phase 4: tests + cleanup** | ⏳ | — | tests Nivel 2/3 · arreglar test:unit pre-existente (generate-react, icon-registry) · `--strict` extractor · borrar huérfanos `SidebarVariant`/`FooterVariant` en src/types |

## KNOWN_PENDING actual (allowlist del test:cohesion)
Vaciar conforme se migren. Hoy:
- `lib-spinner.tone`, `lib-reading-progress.tone` (tone sueltos)
- `lib-tabs.scroll` (unknown — scrollable reflejada como attr `scroll`)

## PRs
- #484 ✅ merged · #485 ✅ merged · #486 ✅ merged · #487 ✅ merged
- #488 🟢 open (display + fix fantasmas)
- `feature/props-cohesion-surface` 🟢 (bloque surface completo)

## Notas / aprendizajes
- Renames `variant`→`theme`/`display`/`tone`: actualizar TAMBIÉN el JSDoc `@prop`/`@attr`, o CEM crea
  miembros **fantasma** en el manifest (pasó con burger/sidebar/text-glitch → develop quedó rojo, fix en #488).
- NADA de katachi/tokens se toca: solo nombres de prop + sus selectores `:host([x=…])`. Valores intactos.
- Múltiples PRs abiertos tocan `components.generated.ts` → conflicto al mergear; mergear en orden y regenerar.
