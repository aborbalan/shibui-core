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

## Próximo incremento (F2 · incremento 2)

- **Runner consumible:** leer el `custom-elements.json` real de shibui-ui (producido por `cem analyze`) y
  emitir el `SmokeReport` por consola/fichero. Requiere `@types/node` + un runner de TS (p.ej. `tsx`).
- **Correr sobre los 99 componentes reales** de shibui-ui → es el cierre real de F2 (valida la tesis a escala).
  Este paso lo ejecuta el usuario desde el repo principal.
