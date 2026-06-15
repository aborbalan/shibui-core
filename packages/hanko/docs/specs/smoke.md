# Spec · Smoke / primer sello (F2)

> **Estado:** v0 (incremento 1) — implementado en `src/checks/floor.ts` + `src/smoke/smoke.ts`.
> **Fase:** F2. Depende de [`ingest.md`](ingest.md) (F1) y [`data-model.md`](data-model.md) (F0).
> **★ Valida la tesis del producto.**

---

## Propósito

Primer flujo **end-to-end**: `manifest → ingestión → Floor → sello`. Demuestra que el modelo funciona a
escala real (10 → 99 componentes de shibui-ui) y emite el **primer sello**, aunque sea mínimo.

## Superficie pública

```ts
floorCheck(component): FloorResult              // src/checks/floor.ts
isValidCustomElementName(name): boolean         // idem
smoke(manifest): SmokeReport                    // src/smoke/smoke.ts
```

## El check Floor (suelo del ADR-001)

A nivel F2 es **estático**: el componente declara un `tagName` que es un **custom element válido**.

- Empieza por minúscula, contiene al menos un guion, sin mayúsculas (PCEN simplificado).
- No es un nombre reservado (`font-face`, `annotation-xml`, …).
- La verificación de "registrable de verdad en el runtime" se difiere a **F3** (necesita navegador).

`floorCheck` devuelve `{ tagName, pass, violations[] }`. Calibrado al productor más pobre: un vanilla con
manifest parco pasa el Floor con solo tener un tagName válido (*ausencia ≠ incumplimiento*).

## El sello (`smoke`)

`smoke(manifest)` = `ingestCem` + `floorCheck` + **cobertura**, agregado en un `SmokeReport`:

```ts
SmokeReport { total; passed; failed; seals: SmokeSeal[] }
SmokeSeal   { tagName; pass; level: 'floor'; violations[]; source; coverage }
Coverage    { properties; events; slots; cssParts; cssProps }   // booleans
```

### Cobertura desde el minuto uno
`coverage` reporta **qué facetas DECLARA** cada manifest (presencia, no contenido). Da valor informativo
inmediato: permite ver de un vistazo qué componentes de shibui tienen manifest rico vs pobre, antes incluso
de tener verificación profunda (F3+).

## Criterios de aceptación (F2 · incremento 1)

1. `floorCheck` pasa con tagName válido y falla (con violación) si falta o es inválido.
2. `smoke` emite un sello por componente y agrega `passed`/`failed`.
3. El sello lleva `source` (procedencia) y `coverage` (presencia por faceta).
4. Tests verdes en `src/checks/floor.test.ts` y `src/smoke/smoke.test.ts`.

## Incremento 2 — runner + integración CI (hecho, pendiente de validar)

- **Runner consumible:** `src/smoke/run.ts` lee el `custom-elements.json` (por defecto el de shibui-ui),
  corre `smoke()` e imprime el `SmokeReport`. Sale con código ≠ 0 si algún componente no pasa el Floor
  (gate-ready). Script: `pnpm --filter @shibui-ui/hanko smoke`. Deps: `@types/node` + `tsx`.
- **Integración en la pipe:** job `hanko-seal` en `.github/workflows/ci-lib.yml` (needs `build-ui`): descarga el
  artefacto `ui-dist` (con el CEM) y corre el smoke. **`continue-on-error: true`** (report-only) hasta validar;
  quitarlo lo convierte en gate duro. El filtro `ui` del orchestrator ya incluye `packages/hanko/**`.

### Comunicación hanko ↔ shibui-ui
Solo vía el **artefacto** `custom-elements.json` (que produce el build de shibui-ui). hanko **no importa** shibui
ni depende de él en npm. Detalle visual en [`../reference/runner-y-comunicacion.html`](../reference/runner-y-comunicacion.html).

### ⚠️ Prerrequisito para CI
El `pnpm-lock.yaml` committeado **no incluye `@shibui-ui/hanko`**. CI usa `--frozen-lockfile`, así que hay que
**regenerar y commitear el lockfile** (`pnpm install` desde el repo principal) antes de que el job —o cualquier
run de ci-lib— pase el paso de instalación.
