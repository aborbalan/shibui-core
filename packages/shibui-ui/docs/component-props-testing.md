# Plan de tests — Cohesión de propiedades de componentes

> Para ejecutar **cuando termine** la migración de cohesión (`feature/manifest-prop-cohesion`).
> Objetivo: convertir el contrato canónico en una **red automática** que falle si un componente
> (o una futura PR) reintroduce fragmentación. El manifest es el byproduct y aquí es también el
> **fixture de test**.

## Fuentes de verdad para los tests

1. **Contrato**: `packages/shibui-ui/src/types/index.ts` (`LibSize`, `LibTone`, `LibVariant`, `LibTint`,
   `LibSurface`, `LibOverlaySize`, `LibAvatarSize`, `LibDisplaySize`, `LibStatus`, `LibOrientation`, `LibShape`).
2. **Manifest generado**: `apps/shibui-api/src/domain/components/data/components.generated.ts`
   (derivado del CEM). Es JSON-serializable → fácil de iterar en un test.
3. **CEM crudo**: `packages/shibui-ui/dist/custom-elements.json` (alternativa de bajo nivel).

## Nivel 1 — Tests de contrato sobre el manifest (los más valiosos)

Suite data-driven que carga el manifest y, por cada componente y prop, asevera reglas de cohesión.
Ubicación sugerida: `packages/shibui-ui/scripts/__tests__/manifest-cohesion.test.ts` (vitest, ya hay
`tsx`/test infra en `scripts/mappers/generate-react.test.ts`).

Reglas a aseverar (cada una = un `test`/`it`):

| # | Regla | Aserción |
|---|---|---|
| C1 | `size` canónico | `options ⊆ ['xs','sm','md','lg','xl']` (+ `'full'` si overlay, `'2xl'` si avatar/display) |
| C2 | `tone` canónico | `options ⊆ ['default','accent','info','success','warning','error','muted']` |
| C2b | `surface` canónico | `options ⊆ ['default','inverse','on-dark']` |
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
const LIB_TONE = ['default','accent','info','success','warning','error'];
// allowlist de variants no-canónicos legítimos (tabs, gadget-frame…)
const VARIANT_ALLOW = new Set(['lib-tabs','lib-gadget-frame', /* … */]);

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

## Nivel 2 — Tests unitarios de reflejo de atributo (Lit)

Por componente migrado, verificar que la propiedad refleja el atributo correcto (clave tras los renames):

- `lib-avatar`: set `tint='warm'` → `getAttribute('tint') === 'warm'`, y `:host([tint="warm"])` aplica.
- `lib-checkbox`/`lib-radio`/`lib-progress-circle`: `tone` reflejado, atributo `tone` presente.
- Props opcionales sin default (`size?`): sin set → atributo ausente (no `size=""`).

Infra: `@open-wc/testing` o vitest + jsdom/`@web/test-runner`. Patrón:

```ts
const el = await fixture<LibAvatar>(html`<lib-avatar tint="warm"></lib-avatar>`);
expect(el.tint).toBe('warm');
expect(el.getAttribute('tint')).toBe('warm');
```

## Nivel 3 — Consumer-contract + visual (ya existe infra)

- **Consumer-tests** (React×Svelte×Angular) en `packages/consumer-tests*`: añadir asserts de que los
  atributos renombrados (`tint`, `tone`, `theme`, `display`) se propagan desde los wrappers generados.
- **Storybook visual**: snapshots de las stories de cada componente migrado para detectar regresiones de
  CSS tras los renames de selector (`[variant=…]`→`[tone=…]`/`[tint=…]`).

## Integración CI

- Añadir la suite Nivel 1 al pipeline `ci-lib.yml` (corre en cambios de `packages/shibui-ui/**`).
- El **drift-guard** ya existente (`git diff --exit-code` sobre `components.generated.ts`) sigue siendo
  el guardián de que el manifest está regenerado; los tests de cohesión validan su *contenido*.
- Endurecer el extractor con flag `--strict` (Phase 4): que `generate-components-api` **falle** si un prop
  resuelve a `unknown` o cuela `''` → primera línea de defensa antes incluso de los tests.

## Checklist de cierre (rellenar al terminar la migración)

- [ ] Suite Nivel 1 (C1–C15) verde sobre el manifest final.
- [ ] Allowlists (VARIANT_ALLOW, overlays, avatar/display) revisadas y justificadas.
- [ ] Tests Nivel 2 para todos los componentes con rename de prop (tint/tone/theme/display).
- [ ] Consumer-tests actualizados a los nuevos atributos.
- [ ] Snapshots visuales regenerados y revisados.
- [ ] `--strict` activado en el extractor + en CI.
