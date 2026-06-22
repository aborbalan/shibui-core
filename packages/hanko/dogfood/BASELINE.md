# Baselines del gate de regresión (F6)

El gate de hanko **no exige que todos sellen** (eso acoplaría hanko al estado del CEM de su consumer #1,
shibui, castigando su drift). Compara el Trust Report contra estos **baselines commiteados** y falla solo ante
una **regresión**: un componente sellado que pierde el sello. Ver [`../docs/decisions/adr-003-gate-regresion.md`](../docs/decisions/adr-003-gate-regresion.md).

| Fichero | Cobertura | Suelo | Lo usa |
|---|---|---|---|
| `baseline.floor.json` | Floor (node) | 102/102 | `pnpm gate:floor` — **PR** (rápido, sin navegador) |
| `baseline.json` | 4 capas (navegador) | 48/102 | `pnpm gate` — **main** (tras `observe` + `report`) |

Los 54 sin sello del baseline de 4 capas son **drift del CEM de shibui** (property kebab-fantasma, slot `—` de
JSDoc, attribute camelCase) — deuda de la generación del manifest de shibui, **no regresiones**. Quedan
congelados en el baseline a propósito; se limpian en el carril de shibui, no aquí.

## Refrescar el baseline

Cuando sellos nuevos se estabilicen (o shibui limpie su drift), sube el suelo:

```bash
pnpm --filter @shibui-ui/hanko report        # regenera hanko-report/trust-report.json (4 capas)
pnpm --filter @shibui-ui/hanko baseline:write # → dogfood/baseline.json
```

**Delta de plataforma:** estos baselines se sembraron en local (Windows + chromium). axe/Playwright pueden
diferir levemente en el ubuntu de CI. Si la primera corrida real del gate de 4 capas en `main` marca una
regresión espuria, refresca el baseline desde el artefacto `hanko-trust-report` que sube el job
`deploy-hanko-report` (descárgalo, copia su `trust-report.json` y corre `baseline:write`). El gate per-tag solo
falla si un tag **sellado** se cae, así que el riesgo está acotado a sellos en el borde.

## Cobertura y exit codes (no confundir con regresión)

El gate compara **misma cobertura con misma cobertura**: `gate.ts` deriva la cobertura del propio report y, si no
casa con la del baseline, sale con **exit 2** (error de config), no exit 1 (regresión). Dos consecuencias:

- **Sonda inestable en `main`:** si `observe` (chromium) falla, `report` degrada a Floor → el report queda con
  cobertura `floor` y `gate` (baseline de 4 capas) sale **exit 2**. Es honesto (sin sonda no se pueden verificar
  las 4 capas), no una regresión. El report Floor ya se publicó y el artefacto subió; re-lanza el job.
- **`baseline:write` toma la cobertura del report presente:** corre `report` con las observaciones (4 capas)
  **antes** de `baseline:write`, o el baseline saldrá etiquetado `floor`. El guard de cobertura lo atrapa después
  (exit 2, nunca un falso verde), pero tendrías que regenerarlo bien.
