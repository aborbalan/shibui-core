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
| **variant → variant+tone+surface+display** | 🟢 | feature/props-cohesion-variant | canon `LibVariant`=solid·outlined·ghost·subtle + `VARIANT_EXTRA` (card→featured · modal→editorial · close-button→filled-round). Reclasif.: badge→tone · tabs/breadcrumb/segmented→display · gadget-frame→theme. Canon: select·pagination·dropdown·liquid-button·copy-button (`filled`→`solid`, `outline`→`outlined`) · kbd/code-block `default`→`solid`. Splits: card (variant+surface+tone) · close-button (variant+tone+surface) · dialog (tone+surface) · modal (variant+tone) · dropdown/liquid-button (+tone) |
| **button cluster** | 🟢 | feature/props-cohesion-variant | button + button-split: `variant`(solid/outlined/ghost) + `tone`(default/accent/error). primary→solid · secondary→outlined · danger→tone=error · accent→tone=accent. Sweep kaki del solid scopeado a tone default. 114 usos internos migrados (stories/templates) |
| **Phase 2: apps + wrappers** | 🟢 | feature/props-cohesion-apps | wrappers regenerados · react/angular/svelte/tauri/api migrados al canon (button primary→solid·danger→tone=error · badge variant→tone · burger-button→lib-burger+theme · liquid→lib-button-liquid+variant/tone · card variant→surface/tone · header/footer/sidebar variant→theme · status-dot variant→status · divider variant→style-variant · avatar color→tint · alert variant→type · background variant→theme · CardsShowcase kintsugi/glitch→data-katachi). consumer-tests fixtures+specs migrados (btn-danger→btn-error, tone="error"). Mapas dinámicos (badge tone) en about/componentes |
| **Phase 4: tests + cleanup** | ⏳ | — | tests Nivel 2/3 · arreglar test:unit pre-existente (generate-react, icon-registry) · ⚠️ wrappers de charts rotos pre-existentes (LibBubbleChart… no exportados en índice) · `--strict` extractor · borrar huérfanos `SidebarVariant`/`FooterVariant` en src/types |

## KNOWN_PENDING actual (allowlist del test:cohesion)
🎉 **VACÍO — y las 12 reglas (C1–C12) ACTIVAS.** Cero `it.todo`. El test cubre:
size · tone · surface · tint · **variant** (canon + `VARIANT_EXTRA`) · **danger
prohibido** · **estéticas solo en theme/katachi** · **modos render fuera de
variant** · sin unknown · sin empty · default∈options · sin flag-o-valor.
**Phase 1 (componentes) COMPLETA.**

## PRs
- #484 ✅ merged · #485 ✅ merged · #486 ✅ merged · #487 ✅ merged
- #488 🟢 open (display + fix fantasmas)
- `feature/props-cohesion-surface` → PR #489 🟢 (bloque surface completo)
- `feature/props-cohesion-tone` → PR #490 🟢 (tone sueltos + accordion) — apilada sobre surface
- `feature/props-cohesion-color-types` → PR #492 🟢 (color→tone + tipos) — apilada sobre tone
- `feature/props-cohesion-variant` → PR #494 🟢 (variant completo + button cluster + reglas C4–C12 activas) — apilada sobre color-types
- `feature/props-cohesion-apps` 🟢 (Phase 2: apps + wrappers + consumer-tests) — apilada sobre variant. **Cierra la migración de extremo a extremo.**

## Notas / aprendizajes
- Renames `variant`→`theme`/`display`/`tone`: actualizar TAMBIÉN el JSDoc `@prop`/`@attr`, o CEM crea
  miembros **fantasma** en el manifest (pasó con burger/sidebar/text-glitch → develop quedó rojo, fix en #488).
- NADA de katachi/tokens se toca: solo nombres de prop + sus selectores `:host([x=…])`. Valores intactos.
- Múltiples PRs abiertos tocan `components.generated.ts` → conflicto al mergear; mergear en orden y regenerar.
