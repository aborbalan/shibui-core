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
