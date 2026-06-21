# Handoff · Calibración D (sentinel tipado) + restantes

> **Para una sesión nueva, en frío.** hanko (`packages/hanko`, `@shibui-ui/hanko`) es un motor de
> verificación de confianza manifest-driven para Web Components. Dogfood = shibui-ui (~102 componentes).
> Stack: pnpm workspaces, TS estricto, vitest (node + `@vitest/browser`/Playwright), tsx.
> GitFlow del repo: ramas desde `develop`, merge `--no-ff`, **nunca a `main` directo**, PR a `develop`.

---

## 0. TL;DR — dónde estamos

El Trust Report real sobre shibui da **102 componentes · 36 sellados · 66 «sin sello»**. Calibraciones
hechas (todas hanko-side):

| # | Calibración | PR | Efecto |
|---|---|---|---|
| 1 | **Lit async** — `observeRuntime` espera `updateComplete` antes de leer slots/reflect | #546 (merged) | quitó el falso `contract/reflect` de ~98 componentes |
| 2 | **Filtrar privados `_` en la ingestión** | #546 (merged) | quitó el falso `contract/method` (42→0) |
| 3 | **Resiliencia async/throw-aware** — `observeResilience` espera `updateComplete` | #549 (merged) | capta 2 crashers de `junk-attrs` |
| A | **Resiliencia: captura COMPLETA por trial** — listener de `window` (`error`/`unhandledrejection`) + tick | **#551 (open → develop)** | capta también los crashes a nivel ventana; mecanismo cerrado |

### El hallazgo que ORDENA lo que queda (resultado de cerrar A)

Al validar A se descubrió, **con evidencia dura** (aislando el probe a solo `observeResilience` →
**0** diagnósticos `pageerror`), que:

> **Los ~24 `pageerror` del Trust Report NO son fallos de resiliencia.** Un montaje adverso-vacío de
> shibui **sobrevive limpio** (salvo 2 crashers reales en `junk-attrs`). Los 24 vienen de
> `observeRuntime`/`observeA11y`, y el patrón (`X.flatMap`/`map`/`find` *is not a function*) los delata:
> es el **sentinel string de `probeReflect`** (`'hanko-probe'`) asignado a props data-driven.

Por tanto **el lever que de verdad encoge los 24 es la calibración D (sentinel tipado), no la resiliencia.**

---

## 1. Calibración D — sentinel tipado en `probeReflect` · **prioridad alta, ES EL LEVER**

### El bug
`probeReflect` (`src/harness/probe.ts:97-120`) sondea reflexión prop⇄attr asignando el **mismo string**
`'hanko-probe'` a CUALQUIER prop con atributo observado:
```ts
(el as Record<string, unknown>)[prop] = 'hanko-probe';
await elUpdateComplete(el);
```
Para un chart que espera `series`/`links`/`items`/`nodes` como **array**, eso deja la prop como string →
el render hace `'hanko-probe'.flatMap(...)` y **peta** (los `series.flatMap is not a function`, etc.).
Hay un `try/catch` alrededor del set, pero el throw es **async** (en el `updateComplete`/render de Lit),
así que el catch síncrono no lo ataja → el error aflora a `window` y lo recoge `page.on('pageerror')` del
dogfood. Resultado: ~24 `pageerror` en `report-full.html` que **no son señal de contrato ni de resiliencia**,
son ruido del propio sondeo.

Además, el efecto secundario clásico: para un **booleano** que refleja por defecto, o un **enum**, el
converter de Lit puede no producir un atributo «cambiado» con un string → posible **falso negativo de
reflexión** (la prop refleja pero hanko no lo detecta).

### El plan
Leer el **tipo declarado en el CEM** (ya disponible en el modelo de contrato, `ComponentContract.properties[].type`)
y elegir un sentinel **coherente con el tipo** en vez de `'hanko-probe'` para todo:

| tipo CEM | sentinel propuesto |
|---|---|
| `string` | un string que NO sea el valor actual (p.ej. `'hanko-probe'`, como hoy) |
| `boolean` | invertir el valor actual (`!el[prop]`) — fuerza un cambio observable |
| `number` | un número distinto del actual (p.ej. `(current ?? 0) + 1` o `1`) |
| enum (union de literales) | el **primer literal válido** que no sea el actual |
| `array`/`object` | un valor mínimo del tipo (`[]` / `{}`) — **no rompe** el render data-driven |
| desconocido | fallback al string actual |

Notas de implementación:
- `probeReflect` hoy recibe solo `properties: string[]` + `observed`. Necesitará el **contrato declarado**
  (o un mapa `prop → type`) para tipar el sentinel. `observeRuntime` no tiene el contrato; decidir:
  (a) pasar el `ComponentContract` al harness (rompe un poco la pureza «harness no conoce lo declarado»), o
  (b) inferir el tipo en runtime (`typeof el[prop]` del valor inicial) — más genérico, no necesita el CEM,
  pero menos preciso para enums/uniones. **Recomendado: (b) primero** (genérico, sin acoplar el harness al
  modelo declarado), y solo subir a (a) si (b) no basta. Medir el efecto sobre los 24.
- Mantener el `try/catch`, pero el objetivo es que con un sentinel **del tipo correcto** el render NO pete,
  así que los `pageerror` deben caer drásticamente.
- **Criterio de éxito:** los ~24 `pageerror` de `report-full.html` caen a ~0 (o solo los genuinos); el conteo
  de reflexión (`contract/reflect`) no empeora y puede mejorar (booleanos/enums que antes daban falso negativo);
  36 sellados estable o al alza.

### Verificación específica de D
- Test browser nuevo: un fixture data-driven (como `HankoNeedsData`, que espera un array) con una prop
  reflejable de tipo array → con el sentinel tipado `observeRuntime` ya **no** lo hace petar.
- Test browser: un booleano `reflects:true` por defecto → el sentinel tipado SÍ detecta la reflexión
  (cubre el falso negativo).
- Dogfood: comparar `report-full.html` antes/después — los `X.map is not a function` deben desaparecer.

---

## 2. Otras calibraciones pendientes (menor prioridad)

### B. Slot por defecto con mojibake `"â€”"` · **fix pequeño**
~20 componentes declaran un slot por defecto cuya etiqueta sale `"â€”"` (UTF-8 `—` leído como latin1).
Bug de **encoding** en hanko, no del consumer. Rastrear el nombre del slot: `ingest/cem.ts` (`toSlot`) →
`contractCheck` (faceta slot) → `report/render.ts`. Los `readFileSync`/`writeFileSync` ya pasan `'utf-8'`;
sospechar del render HTML o de un escape. Repro: buscar el componente con slot `—` en el CEM y seguir el string.

### C. a11y v0 — calibrar heurísticas · **necesita criterio**
29 componentes fallan a11y; parte es señal real, parte ruido por montar vacío (sin contenido → sin nombre
accesible). `observeA11y`/`isInteractive`/`hasAccessibleName` son v0. **OJO:** en #549 se REVIRTIÓ a propósito
el `await updateComplete` dentro de `observeA11y` (subía a11y 29→37 sin pagar). Si se vuelve a tocar, medirlo.
`focusVisible` sigue sin observar.

---

## 3. Mundo 2 (CONSUMER-side, shibui) — NO es calibración de hanko

hanko reporta esto **bien**; el arreglo va en shibui (o se decide filtrar). No lo metas como «calibración».
- **Fantasmas kebab en el CEM** (domina los `contract/property`, 108): doble miembro por prop (el real
  `showLegend` + un duplicado `show-legend` kind field sin attribute). Artefacto de generación del CEM de
  shibui. Fork: arreglar la config del analizador en shibui, o que hanko deduplique en la ingestión.
- **`reflects:true` espurios**: charts que declaran `reflects:true` pero no reflejan. Drift real → arreglo en shibui.

---

## 4. Entorno (Windows del usuario) — LÉELO, ahorra horas

- **El worktree NO tiene `node_modules`** (`pnpm install` se cuelga en Windows). Para ejecutar CUALQUIER cosa,
  crea junctions desde el repo principal (`<MAIN>` = `D:\PROYECTOS\shibui-ecosystem`; `<WT>` = tu worktree):
  ```powershell
  cmd /c mklink /J "<WT>\node_modules" "<MAIN>\node_modules"
  cmd /c mklink /J "<WT>\packages\hanko\node_modules" "<MAIN>\packages\hanko\node_modules"
  cmd /c mklink /J "<WT>\packages\shibui-ui\node_modules" "<MAIN>\packages\shibui-ui\node_modules"
  cmd /c mklink /J "<WT>\packages\shibui-ui\dist" "<MAIN>\packages\shibui-ui\dist"   # dist + CEM para el dogfood
  ```
  Quítalos al acabar con **`cmd /c rmdir "<ruta>"`** (NUNCA `rm -rf`: atravesaría el junction y borraría el target real).
- **Binarios** desde `<WT>\packages\hanko\node_modules\.bin\{tsc,vitest,tsx}.CMD`.
- **EDITA EL WORKTREE CORRECTO** (rutas absolutas dentro del worktree; comparte `.git` con el repo principal pero
  es otro directorio).
- **Commits CON hooks** (no `--no-verify`): con los junctions, el pre-commit (`@shibui-ui/ui type-check`) pasa.
- `git fetch`/`push`/`gh pr create` **funcionan** (la TLS de Node solo afecta al emisor de issues real, no a git/gh).
- **El ref local `develop` está rancio** — ramea desde `origin/develop` tras `git fetch`.

### Verificación (con junctions puestos)
```powershell
$H="<WT>\packages\hanko"
& "$H\node_modules\.bin\tsc.CMD" --noEmit -p "$H\tsconfig.json"                 # type-check
& "$H\node_modules\.bin\vitest.CMD" run                                          # node (78 tests)
& "$H\node_modules\.bin\vitest.CMD" run --config vitest.browser.config.ts        # browser (Playwright)
& "$H\node_modules\.bin\tsx.CMD" dogfood/probe-shibui.ts                          # → hanko-report/observations.json
& "$H\node_modules\.bin\tsx.CMD" src/report/run.ts                               # → index.html + trust-report.json + report-full.html
```
`hanko-report/` está gitignored. Para AISLAR el origen de un `pageerror`: edita temporalmente
`dogfood/browser-glue.ts` (`observe()`) para montar solo la observación que investigas, corre el probe,
**restaura el fichero** (así se cazó que los 24 son de runtime/a11y, no de resiliencia).

---

## 5. Mapa de ficheros
- `src/harness/probe.ts` — el harness. **`probeReflect` (97-120) = el objetivo de D.** `observeRuntime` ·
  `observeA11y` · `observeResilience` (ahora con `runCapturingWindowErrors`, listener de window por trial) ·
  `publicApiOf` (puro) · `elUpdateComplete` · `mountThenRemove` · `ADVERSE_SCENARIOS`.
- `src/core/contract.ts` — `ComponentContract` con `properties[].type` (la fuente del tipo para el sentinel).
- `src/checks/{contract,a11y,resilience}.ts` — motores puros (node-testable).
- `src/ingest/cem.ts` — ingestión CEM→modelo (`toSlot` para el bug B).
- `src/report/{run.ts,render.ts}` — runner + render del Trust Report (render HTML para el bug B).
- `dogfood/probe-shibui.ts` (node) + `dogfood/browser-glue.ts` (browser, ÚNICO punto que importa shibui).
- `src/genericity.test.ts` — guard ejecutable: el core NO importa shibui/Lit. Respétalo.
- Specs: `docs/specs/harness.md` (§Calibración = estado vivo), `checks-contract.md`, `checks-resilience.md`,
  `ingest.md`. Tracker: `docs/phases/development-phases.html` (mantener al cerrar incremento).

---

## 6. Reglas de trabajo del proyecto (memoria)
- **Reportar en VISUAL**: HTML (show_widget inline + `.html` en docs), NO Mermaid.
- **Tracker de fases**: actualizar `development-phases.html` en CADA avance, sin pedirlo (solo hanko;
  el consumer = «la librería consumidora», no metas hallazgos de shibui como ruido).
- **Bucle incremento→review**: al cerrar un incremento, `/code-review` sobre el diff y planificar el siguiente.
- **GitFlow ABSOLUTO**: destino `develop`, nunca `main`; `--no-ff`; no borrar ramas sin confirmar.

> Antes de tocar nada estructural, carga las tools `codegraph_*` (llegan deferred): `ToolSearch "codegraph"`.
