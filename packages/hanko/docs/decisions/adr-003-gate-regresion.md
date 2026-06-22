# hanko · ADR-003 — Gate de CI: regresión sobre baseline, desacoplado del consumer

> **Estado:** Aceptada · **Fecha:** 2026-06-22 · **Fase:** F6 (Trust Report + gates de CI)
> **Relacionado:** [`adr-001-baseline-minima-viable.md`](adr-001-baseline-minima-viable.md) · [`../specs/trust-report.md`](../specs/trust-report.md) · [`../../dogfood/BASELINE.md`](../../dogfood/BASELINE.md)

---

## Contexto

F6 cierra con la promoción del sello de **report-only** a **gate duro de CI**. La pregunta central: *¿qué hace
fallar el build?* El nudo:

- hanko se **valida contra** su consumer #1, shibui-ui (~102 componentes), pero **no debe depender del sellado de
  shibui para su propio desarrollo**. Un cambio en hanko no puede bloquearse porque shibui tenga deuda.
- El Trust Report a 4 capas sella **48/102**. Los **54 sin sello NO son bugs**: son **drift del CEM de shibui**
  (property kebab-fantasma, slot `—` de JSDoc, attribute camelCase) — deuda de la *generación del manifest* de
  shibui, que se arregla en el carril de shibui, no en hanko.
- Un gate de **conformance plena** («todos sellan») fallaría el build por ese drift preexistente: injusto,
  bloqueante, y **específico de shibui** (no serviría a otro proyecto que adoptara hanko).

## Decisión

El gate se parte en **dos carriles desacoplados**, ambos **genéricos** (sirven a cualquier proyecto que use hanko):

### Carril 1 — Correctitud de hanko (independiente del consumer)
El gate que protege el **desarrollo de hanko** es la **suite propia de hanko**: `type-check` + `vitest` (node +
navegador), sobre **fixtures sintéticos**. No mira el sellado de ningún consumer. Es lo que garantiza que el motor
es correcto con independencia de shibui. Job CI: `hanko-test` (duro, en cada PR que toque `packages/hanko/**`).

### Carril 2 — Regresión sobre baseline (la verificación del consumer)
El gate **nunca exige que todos sellen**. Compara el Trust Report actual contra un **baseline commiteado** y falla
**solo ante una regresión**: un componente sellado en el baseline que, **todavía presente**, pierde el sello.

- **Estricto per-tag:** una mejora en otro componente **no compensa** la caída de uno sellado.
- **Genérico:** cada proyecto commitea su propio baseline (`dogfood/baseline*.json`); el gate protege ese suelo.
  El drift preexistente queda **congelado** en el baseline → no es falta.
- **Componente nuevo sin sello** o **componente eliminado** → no son regresión (informativos).
- **Reparto** (coste vs cobertura):
  - **PR:** Floor-regresión (`gate:floor`, node, sin navegador) → rápido en el camino caliente.
  - **main:** 4-capas-regresión (`gate`, tras `observe` + `report` en chromium) → cobertura plena en integración.

### Mecanismo
`src/report/gate.ts` (puro) compara `TrustReport` vs `Baseline` y deriva la cobertura del propio report
(`floor` | `four-layer`) para no mezclar baselines. `src/report/gate-run.ts` (runner) sale con:
`0` sin regresión · `1` regresión · `2` error de config (falta fichero / cobertura no casa).

## Consecuencias

- **Positivas:** el build falla por señal real (regresión), nunca por el drift preexistente de shibui; el
  desarrollo de hanko no se acopla al estado de shibui; el mecanismo es reutilizable por cualquier consumer.
- **Coste:** hay que **mantener el baseline** — subirlo cuando sellos nuevos se estabilicen
  (`pnpm baseline:write`). Documentado en [`../../dogfood/BASELINE.md`](../../dogfood/BASELINE.md).
- **Delta de plataforma:** el baseline de 4 capas se siembra en local; axe/Playwright pueden diferir en el ubuntu
  de CI. Mitigación: el gate de 4 capas corre **solo en main**, **tras** publicar el report y subir
  `trust-report.json` como artefacto → refresco trivial si hay una regresión espuria de borde.
- **Prerrequisito (nudo del lockfile):** `pnpm-lock.yaml` debe incluir `@shibui-ui/hanko` para que cualquier job
  de hanko resuelva `pnpm install --frozen-lockfile`. Se regenera en el repo principal y se commitea **antes** de
  que el gate sea efectivo.

## Alternativas descartadas

- **Conformance plena** («todos sellan»): inviable hoy (fallaría por el drift de shibui) y específica de shibui.
  Reservada a un futuro en que shibui limpie su CEM (otro carril).
- **Allowlist con caducidad:** más control pero más mantenimiento manual; el baseline de regresión cubre el caso
  con menos fricción.
- **Histórico/badges de cobertura:** valor añadido, **diferido a vNext** (no es parte del gate).
