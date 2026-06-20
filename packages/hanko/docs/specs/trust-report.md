# Spec · Trust Report (F6)

> **Estado:** incr. 1 (agregador `src/report/trust-report.ts` + renderers `src/report/render.ts`, puro) +
> incr. 2 **completo (4 capas)** vía el puente en dos etapas: sonda `dogfood/probe-shibui.ts` → `observations.json`
> → runner `src/report/run.ts` → deploy a `hanko-report.web.app` en main. **Pendiente:** validar el harness en
> navegador (Paso 0) y el gate duro.
> **Fase:** F6. Agrega los veredictos de [`smoke.md`](smoke.md) (Floor, F2),
> [`checks-contract.md`](checks-contract.md) (F3), [`checks-a11y.md`](checks-a11y.md) (F4) y
> [`checks-resilience.md`](checks-resilience.md) (F5).

---

## Propósito

Componer el **sello de confianza** de cada componente a partir de las cuatro capas de verificación, declarando
su **procedencia** (de dónde sale el contrato) y su **cobertura** (qué se evaluó y qué no). Es el artefacto que
un humano lee para confiar en el componente sin revisar su implementación línea a línea.

```
FloorResult ┐
ContractResult ├─► buildTrustReport() ─► TrustReport ─┬─► renderTrustReportJson()  (CI/badges)
A11yResult  │                                         └─► renderTrustReportHtml()  (humano)
ResilienceResult ┘
```

## Separación motor puro / runner

| | Qué | Dónde |
|---|---|---|
| **Incremento 1** *(este)* | agregar `*Result` ya calculados → `TrustReport`; serializar a JSON/HTML | `src/report/` — **puro**, node-testable, sin DOM ni shibui |
| **Incremento 2** *(hecho)* | ejecutar de verdad las 4 capas sobre el shibui-ui real y **escribir** los ficheros | sonda `dogfood/` (navegador, harness) → `observations.json` → runner (node) + CEM real |

`buildTrustReport` **no corre checks**: recibe los resultados. Así el cerebro de F6 se testea con resultados
falsos, igual que los checks se testean con observaciones falsas.

## Superficie pública

```ts
buildTrustReport(components: ComponentChecks[], options?): TrustReport   // src/report/trust-report.ts
renderTrustReportJson(report): string                                    // src/report/render.ts
renderTrustReportHtml(report, note?): string                             // src/report/render.ts (note → banner de cobertura)
```

```ts
ComponentChecks { tagName; source; floor?; contract?; a11y?; resilience? }   // una capa ausente → skipped
LayerVerdict    { layer:'floor'|'contract'|'a11y'|'resilience'; status:'pass'|'fail'|'skipped'; violations; warnings }
ComponentTrust  { tagName; source; trusted; layers[]; findings[] }
TrustReport     { generatedAt; total; trusted; untrusted; components[] }
```

## Regla de oro, agregada

Coherente con los checks, en la composición:

| Situación | Sello |
|---|---|
| una capa **no se evaluó** (resultado ausente) | `skipped` — **no descalifica** |
| una capa evaluada **falla** | `fail` — el componente queda **sin sello** (`trusted:false`) |
| **ninguna** capa evaluada | `trusted:false` — no hay base para confiar (pero **no** acumula violaciones) |

`trusted = (hay ≥1 capa evaluada) ∧ (todas las evaluadas pasan)`. Los `warnings` (avisos a11y/resiliencia)
**no** descalifican: se cuentan en el `LayerVerdict` y se muestran, pero no tumban el sello.

## Procedencia (fuerza del sello)

Cada `ComponentTrust` arrastra su `ContractSource` (`cem` · `adapter:<formato>` · `inferido`). Un sello sobre
un CEM nativo vale más que uno inferido del runtime: el reporte lo expone para que el lector calibre su confianza.

## Renderers

- **JSON** — `JSON.stringify` indentado. Formato de cable para gates de CI, badges e histórico. Round-trip sin pérdida.
- **HTML** — documento autónomo con la marca washi de hanko: resumen (total/sellados/sin sello), tabla por
  componente con las 4 capas (`✓`/`✗`/`–`) y origen, y un bloque de hallazgos plegable. Puro (string in → string out).

## Criterios de aceptación (F6 · incremento 1)

1. `buildTrustReport` marca `trusted` solo si hay ≥1 capa evaluada y todas pasan.
2. Las capas ausentes quedan `skipped` y no descalifican; las que fallan dejan `trusted:false` + `findings`.
3. Los `warnings` se cuentan pero no tumban el sello.
4. `total`/`trusted`/`untrusted` cuadran; `generatedAt` es inyectable (determinismo).
5. `renderTrustReportJson` reidrata sin pérdida; `renderTrustReportHtml` produce un documento válido con la marca.
6. Tests verdes en `src/report/trust-report.test.ts`.

## Incremento 2 — puente en dos etapas, deploy y gate

Las observaciones del navegador y los checks puros se mantienen **separados** por un fichero
(`observations.json`), igual que el agregador se mantiene separado de los checks por los `*Result`:

```
Etapa 1 (navegador)                          Etapa 2 (node, puro)
dogfood/probe-shibui.ts                      src/report/run.ts
 · carga shibui (registra CE)                 · lee observations.json + CEM
 · harness sobre cada tag del CEM   ──JSON──► · Floor estático
 · axe inyectado                              · contractCheck/a11yCheck/resilienceCheck
 ► hanko-report/observations.json             · buildTrustReport → index.html + trust-report.json
```

- ✅ **Sonda** (`dogfood/probe-shibui.ts`, script `observe`): esbuild bundlea el glue de navegador (shibui +
  harness + axe) a un IIFE; Playwright/chromium lo inyecta y sondea cada tag → `observations.json`. Vive **fuera
  de `src/`** (único punto que carga shibui; el guard de genericidad cubre solo `src/`). No publicable.
- ✅ **Runner** (`src/report/run.ts`, script `report`): Floor estático **+** las observaciones (si existe
  `observations.json`) → `contractCheck`/`a11yCheck`/`resilienceCheck` → `buildTrustReport` → escribe
  `hanko-report/index.html` + `trust-report.json`. **Sin** `observations.json` degrada a Floor (otras capas
  `skipped`): robusto en una corrida solo-node. El banner de cobertura del HTML es **dinámico**.
- ✅ **Deploy** (`ci-lib.yml` · job `deploy-hanko-report`): en **main**, `observe` → `report` → publica el HTML
  en **`hanko-report.web.app`** (target Firebase `hanko-report`). El JSON queda en `/trust-report.json`.
- ⏳ **Validar el harness en navegador (Paso 0):** `test:browser` + el dogfood sobre shibui real, calibrando las
  heurísticas v0 contra Lit (ver `harness.md`). Es la puerta que hace fiables las 3 capas del harness.
- ⏳ **Gate duro:** fallar el build cuando un componente no alcanza su nivel exigido — promover el `hanko-seal`
  actual (report-only). Diferido hasta que el sello sea estable.
- ⏳ **Histórico/badges:** consumir el JSON publicado para *trend* de cobertura y badge de % sellado.
