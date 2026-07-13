# Plan de tests — Cohesión de propiedades de componentes

> Migración de cohesión **completa** (en `develop`). Objetivo de esta red: que falle si un
> componente o una futura PR reintroduce fragmentación. El manifest es el byproduct y aquí es
> también el **fixture de test**.
>
> Estado: **Nivel 1** ✅ (`test:cohesion`) · **Nivel 2** ✅ (`test:conformance`) · **Nivel 3** ⏳ (extras).

## Fuentes de verdad para los tests

1. **Contrato**: `packages/shibui-ui/src/types/index.ts` (`LibSize`, `LibTone`, `LibVariant`, `LibTint`,
   `LibSurface`, `LibOverlaySize`, `LibAvatarSize`, `LibDisplaySize`, `LibStatus`, `LibOrientation`, `LibShape`).
2. **Manifest generado**: `apps/shibui-api/src/domain/components/data/components.generated.ts`
   (derivado del CEM). Es JSON-serializable → fácil de iterar en un test.
3. **CEM crudo**: `packages/shibui-ui/dist/custom-elements.json` (alternativa de bajo nivel).

## Nivel 1 — Tests de contrato sobre el manifest (los más valiosos)

> ✅ **IMPLEMENTADO** en `scripts/__tests__/manifest-cohesion.test.ts`.
> Ejecutar: `pnpm --filter @shibui-ui/ui test:cohesion`. Corre en CI (`ci-lib.yml`, job Quality Gate).
> Aplica las reglas de abajo con un allowlist `KNOWN_PENDING` para los ejes aún en migración
> (variant/theme/display/button cluster); ese allowlist debe vaciarse conforme se completen.

Suite data-driven que carga el manifest y, por cada componente y prop, asevera reglas de cohesión.

Reglas a aseverar (cada una = un `test`/`it`):

| # | Regla | Aserción |
|---|---|---|
| C1 | `size` canónico | `options ⊆ ['xs','sm','md','lg','xl']` (+ `'full'` si overlay, `'2xl'` si avatar/display) |
| C2 | `tone` canónico | `options ⊆ ['default','accent','info','success','warning','error','muted']` |
| C2b | `surface` canónico | `options ⊆ ['default','light','dark','inverse']` (`on-dark` fue renombrado a `dark`) |
| C3 | `tint` canónico | `options ⊆ ['neutral','warm','cool','inverse']` |
| C4 | `variant` = tratamiento | `options ⊆ ['solid','outlined','ghost','subtle']` **salvo** componentes con variant propio documentado (allowlist) |
| C5 | sin `danger` | ningún `options` contiene `'danger'` (debe ser `'error'`) |
| C6 | sin `neutral` semántico | `tone`/`status` no contienen `'neutral'` (debe ser `'default'`) |
| C7 | sin sentinel vacío | ningún `options` contiene `''`/`""` |
| C8 | sin `unknown` | ningún prop conservado tiene `type === 'unknown'` |
| C9 | default válido | si hay `default` y `options`, `options.includes(stripQuotes(default))` |
| C10 | estéticas en `theme` | valores estéticos (kintsugi/glitch/celadon/sabi/shizen/enso/sumi/kin/…) solo bajo prop `theme`, nunca `variant` |
| C11 | modos en `display` | lines/grid/striped/borderless, bar/dots/ring, inline/trigger, flush/separated solo bajo `display` |
| C12 | sin flag-o-valor | ningún prop tiene `type` con unión `string | boolean` ni `boolean | string` |
| C13 | orden de uniones | uniones numéricas/string normalizadas a `string | number` |
| C14 | `ariaLabel` | tipo `string` (sin `| null`) |
| C15 | descripción | todo componente tiene `description` no vacía (overlay editorial) |

Patrón de implementación:

```ts
import { COMPONENTS_GENERATED } from '../../../apps/shibui-api/.../components.generated';
const LIB_SIZE = ['xs','sm','md','lg','xl'];
const OVERLAY = [...LIB_SIZE,'full'];
const LIB_TONE = ['default','accent','info','success','warning','error','muted'];
// allowlist de variants no-canónicos legítimos (p.ej. tabs).
// OJO: lib-gadget-frame NO va aquí — su eje estético es `theme` ('default'|'glass'), no `variant`.
const VARIANT_ALLOW = new Set(['lib-tabs', /* … */]);

describe('manifest cohesion', () => {
  for (const c of COMPONENTS_GENERATED) {
    for (const p of c.api.props) {
      if (p.name === 'size' && p.options) {
        it(`${c.slug}.size ⊆ LibSize`, () => {
          const allowed = isOverlay(c) ? OVERLAY : isAvatarLike(c) ? [...OVERLAY,'2xl'] : LIB_SIZE;
          expect(p.options.every(o => allowed.includes(o))).toBe(true);
        });
      }
      // … C2..C15
    }
  }
});
```

> Mantener `VARIANT_ALLOW` y demás allowlists **explícitas y comentadas**: cada excepción es una
> decisión de diseño consciente, no un escape. Que el allowlist crezca debe doler.

## Nivel 2 — Conformidad runtime de props de cohesión

> ✅ **IMPLEMENTADO** en `tests/conformance/props-conformance.test.ts` (vitest browser
> mode · Chromium). Ejecutar: `pnpm --filter @shibui-ui/ui test:conformance`.
> Corre en CI (`ci-lib.yml`, job `test-stories`, tras los Story Tests — reusa el mismo
> Playwright Chromium).

El Nivel 1 valida la **forma declarada** del API en el manifest, pero éste puede estar
impecable y el componente seguir roto: tras los renames (`variant`→`tone`/`tint`/`display`/
`theme`) puede quedar un selector `:host([variant=…])` **huérfano** o un `reflect` perdido —y
el manifest no lo ve—. El Nivel 2 cierra ese hueco con dos comprobaciones **estructurales**,
**data-driven desde el mismo manifest** (el manifest es también aquí el fixture), sobre los
**7 ejes canónicos** que la migración tocó: `size · tone · surface · theme · variant ·
display · tint` (filtrados por nombre de atributo; las props enum funcionales
—type/mode/icon/language…— quedan fuera a propósito). La corrección **visual** del render ya
la cubre el Nivel 3 (snapshots Storybook por katachi) — aquí **no** se duplica.

- **2a · reflejo** (runtime, browser) — instancia el componente, `el[prop] = opt` ⇒
  `el.getAttribute(attr) === opt`. Si el `reflect` se perdió, **todo** `:host([attr=…])` muere
  en silencio: es el guardián más barato.
- **2b · sin selectores huérfanos** (CSS ⇒ manifest) — lee el CSS que el componente realmente
  envía (`ctor.styles[].cssText`, ya con el `.css` inlineado) y verifica que ningún selector
  `:host([eje="valor"])` de un **eje vivo** use un valor **fuera** de sus opciones declaradas.
  Caza el `:host([variant="filled"])` que quedó tras un rename (`filled`→`solid`). Dirección
  **inversa** a propósito: la forward ("cada opción debe tener selector") da falsos positivos
  en componentes estilados por token o JS-driven (`lib-background`), porque no todo eje usa
  `:host([attr=v])`. Y un delta de computed-style no sirve aquí: en el entorno bare los tokens
  `:root` no resuelven y todo render colapsa a "sin estilar".

Allowlists estilo `KNOWN_PENDING` (`NO_REFLECT`, `ORPHAN_EXEMPT`): hoy **vacías**. Cada
excepción es una decisión consciente y documentada — que crezcan debe doler.

> **Primera corrida = valor inmediato:** 2b destapó 3 selectores huérfanos que la migración
> dejó (estados compuestos `[copied]`/`[open]` con el valor viejo): `lib-copy-button`
> (`[variant="filled"]`, `[variant="on-dark"]`) y `lib-select` (`[variant="filled"]`).
> Corregidos en este mismo PR.

```ts
// 2a — reflejo (runtime)
const el = document.createElement('lib-avatar');
document.body.appendChild(el);
(el as any).tint = 'warm';
await el.updateComplete;
expect(el.getAttribute('tint')).toBe('warm');

// 2b — sin huérfanos (CSS real ⇒ opciones del manifest)
const css = componentCss('lib-copy-button');           // ctor.styles[].cssText
// 'filled' ya no es opción de variant ⇒ no debe quedar selector que lo use
expect(css).not.toMatch(/\[variant\s*=\s*["']?filled["']?\]/);
```

## Nivel 3 — Consumer-contract + visual (ya existe infra)

- **Consumer-tests** (React×Svelte×Angular) en `packages/consumer-tests*`: añadir asserts de que los
  atributos renombrados (`tint`, `tone`, `theme`, `display`) se propagan desde los wrappers generados.
- **Storybook visual**: snapshots de las stories de cada componente migrado para detectar regresiones de
  CSS tras los renames de selector (`[variant=…]`→`[tone=…]`/`[tint=…]`).

## Integración CI

- ✅ Nivel 1 (`test:cohesion`) cableado en `ci-lib.yml`, job `quality`.
- ✅ Nivel 2 (`test:conformance`) cableado en `ci-lib.yml`, job `test-stories` (reusa el
  Playwright Chromium del story-testing).
- El **drift-guard** ya existente (`git diff --exit-code` sobre `components.generated.ts`) sigue siendo
  el guardián de que el manifest está regenerado; los tests de cohesión validan su *contenido*.
- ⏳ Endurecer el extractor con flag `--strict` (extra opcional): que `generate-components-api` **falle**
  si un prop resuelve a `unknown` o cuela `''` → primera línea de defensa antes incluso de los tests.

## Checklist de cierre

- [x] Suite Nivel 1 (C1–C12) verde sobre el manifest final, `KNOWN_PENDING` vacío.
- [x] Allowlists del Nivel 1 (VARIANT_EXTRA, overlays, avatar/display) revisadas y justificadas.
- [x] Nivel 2 (reflect + delta visual) sobre los 7 ejes de cohesión, allowlists vacías, en CI.
- [ ] Nivel 3: consumer-tests con asserts de propagación de `tint/tone/theme/display`.
- [ ] Nivel 3: snapshots visuales por componente migrado revisados.
- [ ] `--strict` activado en el extractor + en CI.
