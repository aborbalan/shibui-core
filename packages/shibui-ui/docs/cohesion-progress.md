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
| **accordion** (split display+tone) | 🟢 | feature/props-cohesion-tone | flush/separated→display, accent→tone |
| **surface resto** | 🟢 | feature/props-cohesion-surface | switch·counter·range-slider·eyebrow (on-dark→dark) · quote·display-heading (neutral→default) · content-pillar (ya canónico) · breadcrumb (surface→variant) · skeleton (split surface/tone) · tooltip·kbd·segmented-control (split variant/surface/tone) · timeline (tooltip-variant→tooltip-surface/tone). `LibSurface`=default·light·dark·inverse |
| **tone sueltos** | 🟢 | feature/props-cohesion-tone | spinner: ink→default·cool→info · reading-progress: filled→default(ink)·info/accent canónicos·**gold→theme=kintsugi** |
| **color/accent → tone** | 🟢 | feature/props-cohesion-color-types | parallax-text-stack·checkbox-card·tabs (rename color→tone) · rating (gold→default·neutral→muted) · breadcrumb (accent→tone, bold→strong) |
| **normalizaciones de tipo** | 🟢 | feature/props-cohesion-color-types | ariaLabel `string\|null`→`string` (button·close-button·progress) · button.customPadding · editor-toolbar.filename · **tabs.scroll(unknown)→scrollable** (attr alineado a la prop) |
| **flag-o-valor `string\|boolean`** | ✅ n/a | — | 0 en el manifest — eje ya limpio |
| **variant → variant+tone+surface+display** | ⏳ | — | 16 comp · canon `LibVariant`=solid·outlined·ghost·subtle + extensiones (`VARIANT_EXTRA`: card→featured, modal→editorial, close-button→filled-round). badge→tone · tabs/breadcrumb/segmented→display · gadget-frame→theme. `filled`→`solid` |
| **button cluster** | ⏳ | — | button + button-split · split variant+tone · danger→error · ⚠️ alto impacto |
| **Phase 2: apps + wrappers** | ⏳ | — | react/angular/svelte/cv usan atributos viejos · regenerar wrappers ⚠️ |
| **Phase 4: tests + cleanup** | ⏳ | — | tests Nivel 2/3 · arreglar test:unit pre-existente (generate-react, icon-registry) · `--strict` extractor · borrar huérfanos `SidebarVariant`/`FooterVariant` en src/types |

## KNOWN_PENDING actual (allowlist del test:cohesion)
🎉 **VACÍO.** Todos los ejes activos (size · tone · surface · tint · sin-unknown ·
sin-empty) están migrados. Las reglas `it.todo` (C4 variant · C5 danger · C10 theme ·
C11 display · C12 flag-o-valor) se activarán al cerrar la tanda variant + button cluster.

## PRs
- #484 ✅ merged · #485 ✅ merged · #486 ✅ merged · #487 ✅ merged
- #488 🟢 open (display + fix fantasmas)
- `feature/props-cohesion-surface` → PR #489 🟢 (bloque surface completo)
- `feature/props-cohesion-tone` → PR #490 🟢 (tone sueltos + accordion) — apilada sobre surface
- `feature/props-cohesion-color-types` 🟢 (color→tone + normalizaciones de tipo) — apilada sobre tone

## Notas / aprendizajes
- Renames `variant`→`theme`/`display`/`tone`: actualizar TAMBIÉN el JSDoc `@prop`/`@attr`, o CEM crea
  miembros **fantasma** en el manifest (pasó con burger/sidebar/text-glitch → develop quedó rojo, fix en #488).
- NADA de katachi/tokens se toca: solo nombres de prop + sus selectores `:host([x=…])`. Valores intactos.
- Múltiples PRs abiertos tocan `components.generated.ts` → conflicto al mergear; mergear en orden y regenerar.
