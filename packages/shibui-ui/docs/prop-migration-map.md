# Mapa de migración de props — cohesión del design system

> Keystone de la refactorización de cohesión. Conserva el **plan y las decisiones**
> (tablas históricas abajo); el estado vivo está en `cohesion-progress.md`.
> El manifest (`components.generated.ts`) es el byproduct verificable, no el objetivo.

## ✅ MIGRACIÓN COMPLETA (en `develop`, hasta #497)

Todas las tandas mergeadas. El contrato **C1–C12** está activo en `test:cohesion`
(CI) y `KNOWN_PENDING` está vacío. Las tablas de abajo son el registro del plan
ejecutado; algunos destinos tentativos cambiaron al ejecutar (ver notas).

**Desviaciones del plan original** (lo de abajo refleja el plan, no siempre el resultado):
- `LibSurface` final = `'default' | 'light' | 'dark' | 'inverse'` (no `…|on-dark`; `on-dark`→`dark`).
- `reading-progress.gold` → `theme="kintsugi"` (no `accent`); `filled` → `tone="default"`.
- `spinner.tone` ink/cool → `default`/`info` (LibTone), no theme.
- `card.featured` se quedó como **extensión de `variant`** (`VARIANT_EXTRA`), no `theme`.
- `gadget-frame` glass/card → `theme` (no `variant`).
- `tabs/breadcrumb/segmented-control` shape variants → `display` (no `variant`).
- `VARIANT_EXTRA` (lista cerrada): card→`featured`, modal→`editorial`, close-button→`filled-round`.

**Ítems que el plan listaba y NO eran deuda real** (verificado en fuente):
- **flag-o-valor** (`label/error/tooltip/active/spotlight/counter` como `string\|boolean`): **0 en el
  manifest y en fuente** — nunca existieron como tal. `spotlight-card.spotlight` es enum string.
- **`number\|string`**: sólo en campos internos no-prop (`TabItem.badge`, param de `renderValue`) — no
  son atributos del host, no aplican al contrato.
- **`status`** (step/timeline-item): se deja como **dominio propio** (vocabularios `pending/completed/
  done` con significado propio, distintos de `LibStatus`); nunca fue decisión RESUELTA de migrar.

**Opcional (no bloqueante, no es cohesión de vocabulario):** tests Nivel 2/3 visuales · `--strict` en el extractor.

## Tipos canónicos (fuente: `src/types/index.ts`)

- `LibSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'` · default `md`. Subconjunto contiguo permitido; nunca nombres nuevos.
- `LibOverlaySize = LibSize | 'full'` (dialog, drawer, modal).
- `LibAvatarSize = LibSize | '2xl'` · `LibDisplaySize = LibSize | '2xl'` (extensiones documentadas).
- `LibTone = LibSemanticTone | 'muted'` = `'default' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'muted'` · default `default`.
- `LibVariant = 'solid' | 'outlined' | 'ghost' | 'subtle'` · default `solid` (tratamiento visual).
  Extensiones documentadas vía `VARIANT_EXTRA` (lista cerrada): card→`featured`, modal→`editorial`,
  close-button→`filled-round`.
- `LibSurface = 'default' | 'light' | 'dark' | 'inverse'` (modificadores de superficie, NO tone).
- `theme` → eje estético signature por componente (`Lib<Comp>Theme`). **Fuera del mandato de cohesión.**

## Reglas globales de renombrado

| Valor antiguo | → | Destino |
|---|---|---|
| `danger` | → | `tone="error"` |
| `neutral` (como tono/semántico) | → | `tone="default"` |
| `filled` (tratamiento) | → | `variant="solid"` |
| `outline` | → | `variant="outlined"` |
| `on-dark`, `inverse`, `dark`, `light` (en tone/variant) | → | `surface` (LibSurface) si aplica; si es identidad estética → `theme` |
| `''` / `""` (size/color sin set) | → | prop opcional `?: Lib…` sin default ni reflect de `''` |

## Clasificación de ejes para valores de `variant`

- **Tratamiento** (→ `variant`): `solid/filled · outlined/outline · ghost · subtle · filled-round`(→ `solid`+shape)
- **Semántico** (→ `tone`): `accent · info · success · warning · error(←danger) · strong`(→`accent`)
- **Estético/marca** (→ `theme`): kintsugi, glitch, celadon, sabi, shizen, enso, sumi, kin, shizuku, classic, mega, minimal, brutal, kanji, framed, slice, scan, shift, decode, redact, noise, social, accordion…
- **Modo de render** (→ prop propia `display`/`mode`, NO `variant`): data-table lines/grid/striped/borderless · reading-progress bar/line/dots/ring · color-picker inline/trigger

---

## SIZE — mayormente ya canónico (migración = importar tipo compartido)

Subconjuntos contiguos de `LibSize` → **sin cambio de valores**, solo importar `LibSize` y borrar alias local:

`lib-breadcrumb, lib-burger, lib-button-liquid, lib-checkbox, lib-copy-button, lib-data-table,
lib-display-heading, lib-eyebrow, lib-pagination, lib-quote, lib-radio, lib-range-slider,
lib-segmented-control, lib-select, lib-spinner, lib-status-dot, lib-step, lib-stepper, lib-switch,
lib-text-list, lib-timeline, lib-tooltip` (sm,md,lg) ·
`lib-close-button, lib-metric-bar, lib-progress, lib-progress-circle, lib-rating, lib-spacer` (xs..xl) ·
`lib-button, lib-button-split, lib-counter` (sm..xl) · `lib-badge, lib-empty-state` (sm,md) ·
`lib-chip, lib-kbd` (xs..lg)

Casos con decisión:

| Componente | size actual | Destino | Acción |
|---|---|---|---|
| lib-dialog, lib-drawer | sm,md,lg,xl,full | `LibOverlaySize` | importar tipo |
| lib-modal | xs,sm,md,lg,xl,full | `LibOverlaySize` (+ permitir xs) | importar tipo |
| lib-avatar | xs..xl,2xl | `LibAvatarSize` | importar tipo |
| lib-parallax-text-stack | sm,md,lg,xl,2xl | `LibDisplaySize` (def `lg`) | importar tipo; def display ≠ md OK |
| lib-button-group | `LibSize \| ''` def `''` | `size?: LibSize` (sin '') | quitar sentinel '' |
| lib-tabs | `TabsSize \| ''` def `''` | `size?: LibSize` (sin '') | quitar sentinel '' |
| lib-icon | `string` def `md` | **excepción documentada** (acepta px) | sin cambio; JSDoc nota |

---

## TONE — consolidar a `LibTone`, sacar surface/decorativo

| Componente | tone actual | Destino canónico | Notas |
|---|---|---|---|
| lib-gauge, lib-sparkline | default,accent,info,success,warning,error | `LibTone` | exacto ✓ |
| lib-metric-bar, lib-progress | default,accent,info,error | `LibTone` (subset) | ✓ |
| lib-empty-state | neutral,accent,info,error | `LibTone` | `neutral`→`default` |
| lib-counter | default,accent,info,error,muted,on-dark | `tone: LibTone` + `surface` | `on-dark`→surface; `muted`→drop o tone-ext (revisar) |
| lib-range-slider | default,accent,info,error,neutral,inverse | `tone: LibTone` + `surface` | `neutral`→default; `inverse`→surface |
| lib-eyebrow | accent,neutral,inverse,muted | `tone: LibTone` + `surface` | neutral→default, inverse→surface, muted→revisar |
| lib-reading-progress | accent,info,filled,gold | `tone: LibTone` | `filled`→quitar (es treatment); `gold`→`accent` o theme |
| lib-spinner | ink,accent,cool | **decorativo** → revisar | ink/cool no semánticos; mantener como `Lib…` propio o `theme` |
| lib-avatar | neutral,warm,cool,inverse (prop `tone`) | **renombrar prop → `tint`** | tinte decorativo, NO tone semántico |

## VARIANT + THEME — el eje más invasivo

| Componente | variant actual | Destino | Notas |
|---|---|---|---|
| lib-button | primary,secondary,ghost,accent,danger | `variant`(solid/outlined/ghost) + `tone` | **redISEÑO**: primary→solid+accent, secondary→outlined, danger→tone error |
| lib-button-split | default,primary,…,danger,accent | = lib-button | hereda de button; usa `LibButtonVariant` |
| lib-button-liquid | filled,outlined,accent,info,ghost,danger | `variant` + `tone` | filled→solid; accent/info→tone; danger→error |
| lib-close-button | ghost,subtle,outlined,filled,filled-round,danger,on-dark | `variant` + `tone` + `surface` | filled→solid; danger→tone; on-dark→surface; filled-round→variant solid + shape |
| lib-copy-button | ghost,outlined,filled,subtle,on-dark | `variant` + `surface` | filled→solid; on-dark→surface |
| lib-select | default,filled,ghost | `variant` | default→solid?; filled→solid; mapear |
| lib-dropdown | default,ghost,filled,accent | `variant` + `tone` | accent→tone |
| lib-kbd | default,inverse,ghost,accent,subtle | `variant` + `tone` + `surface` | inverse→surface; accent→tone |
| lib-pagination | default,outline,ghost | `variant` | outline→outlined |
| lib-checkbox, lib-radio | default,accent,error | `tone` (no variant) | son tonos; renombrar prop variant→tone |
| lib-progress-circle | default,accent,info,error | `tone` (no variant) | renombrar variant→tone |
| lib-accordion | default,flush,separated,accent | `display`(flush/separated) + `tone`(accent) | flush/separated = modo |
| lib-data-table | lines,grid,striped,borderless | `display` (renombrar) | modo de render, no variant |
| lib-reading-progress | bar,line,dots,ring,vertical | `display` (renombrar) | modo de render |
| lib-color-picker | inline,trigger | `mode` (renombrar) | modo |
| lib-card | default,inverse,accent,featured | `variant`/`tone`/`surface` mixto | featured→theme?; revisar |
| lib-tabs | underline,pill,card,outline,vertical | `variant` (estético tabs) | mantener; + color/size '' fix |
| lib-segmented-control | outline,underline,pill,ghost,accent,info,dark-* | `variant` + `tone` + `surface` | dark-*→surface inverse; accent/info→tone |
| lib-burger | filled,kanji,neutral,framed,inverse,glitch | `theme` | estético |
| lib-footer | social,accordion,kintsugi,glitch | `theme` | estético |
| lib-header | classic,…,celadon,sabi,shizen | `theme` | estético |
| lib-sidebar | dark,light,kintsugi,glitch | `theme` | estético |
| lib-spinner | enso,sumi,kin,shizuku | `theme` | estético |
| lib-text-glitch | slice,scan,shift,decode,redact,noise | `theme` | estético |
| lib-drawer | default,dark,inverse,inverse-dark,glitch,glitch-dark | `theme` + `surface` | estético |
| lib-step, lib-stepper | default,minimal,inverse,brutal | `theme` | estético |
| lib-switch | default,inverse | `surface` | inverse→surface |
| lib-dialog, lib-modal | default,danger,warning/editorial | `tone`(+theme) | danger→error; editorial→theme |
| lib-tooltip | dark,light,accent,info,error | `tone` + `surface` | dark/light→surface; resto tone |
| lib-glass-card | neutral,cool,warm | `tint`/`theme` decorativo | como avatar |
| lib-gadget-frame | glass,card | `variant` | mantener (2 modos) |
| lib-cursor-follower | mode: filled,minimal,accent,ghost | `variant`+`tone` (prop ya `mode`) | revisar |
| lib-background | LibBackgroundVariant (washi…) | `theme` | estético |
| lib-icon | variant: string | excepción | freeform |

## Props color/accent/surface/status (consolidación adicional)

| Prop | Componentes | Destino |
|---|---|---|
| `color` | checkbox-card, chip, divider, parallax-text, rating, tabs | → `tone` (chip/divider) o `tint` (rating gold) según semántica |
| `accent` (string) | display-heading, quote | mantener (color libre) ; breadcrumb accent → `tone` |
| `surface` | breadcrumb(default/filled/pill), content-pillar(dark/light), display-heading/quote(dark/light/neutral), skeleton | unificar: dark/light/neutral → `LibSurface`; filled/pill (breadcrumb) → `variant` |
| `status` | status-dot(online/away/busy/offline), step(pending/active/completed/error), timeline-item(default/active/done/error/pending) | `LibStatus` donde encaje; status-dot es presencia (dominio propio) |

## Props "flag-o-valor" → separar (un prop por concepto)

| Prop | Componentes afectados | Acción |
|---|---|---|
| `label: string\|boolean` | (varios) | `label: string` + `showLabel: boolean` |
| `error: boolean\|string` | inputs | `error: boolean` + `errorMessage: string` |
| `tooltip: boolean\|string` | | `tooltip: string` + `showTooltip` si hace falta |
| `active: string\|boolean` | | separar por componente |
| `spotlight: boolean\|LibSpotlightVariant` | spotlight-card | `spotlight: boolean` + `spotlightVariant` |
| `counter: boolean\|OrderedCounter` | | separar |

## Normalizaciones de tipo

- Uniones `number|string` → orden canónico `string | number` (height, width, value, rowHeight).
- `ariaLabel: string|null` → `string` (default `''`).
- `lib-tabs.scroll: unknown` → tipar correctamente (bug del extractor + tipo real).

## Decisiones RESUELTAS (usuario, 2026-06-09)

1. **Estéticas → `theme`**: header/sidebar/footer/spinner/burger/text-glitch/background/drawer/step/
   stepper/card-featured mueven su vocabulario de marca de `variant` a un prop `theme` (`Lib<Comp>Theme`).
   `variant` queda SOLO para tratamiento (solid/outlined/ghost/subtle).
2. **button split `variant`+`tone`**: primary→`variant=solid`+`tone=accent`, secondary→`variant=outlined`,
   ghost→`variant=ghost`, danger→`tone=error`. Aplica a button, button-split, button-liquid. Migrar todos
   los call-sites en las 4 apps.
3. **Modos de render → `display`**: data-table (lines/grid/striped/borderless), reading-progress
   (bar/line/dots/ring/vertical), color-picker (inline/trigger), accordion (flush/separated) → prop `display`.
4. **Decorativo → `tint`**: avatar (neutral/warm/cool/inverse) y glass-card (neutral/cool/warm) renombran
   su prop a `tint` (`LibTint`). `tone` reservado a semántica.

### Pendiente menor durante ejecución
- **`muted`** (counter, eyebrow, parallax color): tratar como `surface`/de-énfasis; resolver caso a caso.
