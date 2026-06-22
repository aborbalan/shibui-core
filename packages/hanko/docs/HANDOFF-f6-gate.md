# Handoff · Cerrar F6 (Trust Report + gate de CI) — el gate duro

> **Para una sesión nueva, en frío.** hanko (`packages/hanko`, `@shibui-ui/hanko`) es un motor de verificación
> de confianza manifest-driven para Web Components. Dogfood = shibui-ui (~102 componentes). Stack: pnpm
> workspaces, TS estricto, vitest (node + `@vitest/browser`/Playwright), tsx/esbuild. GitFlow del repo: ramas
> desde `develop`, merge `--no-ff`, **nunca a `main` directo**, PR a `develop`.
>
> Este handoff es el **espejo de los de F4 (`HANDOFF-a11y-finalize.md`) y F3/F5 (`HANDOFF-f3-f5-finalize.md`)**,
> ya consumidos en #555 y #558. Mismo patrón: **decisiones de política PRIMERO**, luego cerrar. Para el método,
> lee el commit de F3/F5 (`54a3c9b`, PR #558): cómo se midió el baseline con el dogfood, cómo se triaron los
> hallazgos (drift de shibui vs falsos positivos de hanko), y cómo se corrió `/code-review` al cerrar.

---

## 0. TL;DR — dónde estamos

**Hito 2 (capas de verificación) CERRADO:** F3·F4·F5 terminadas (#554/#555/#558). Las cuatro capas (Floor +
contrato + a11y + resiliencia) emiten señal honesta. **Trust Report real: 102 · ~49 sellados** (re-mídelo fresco
al arrancar; puede haberse movido si la deuda a11y de shibui #556 se mergeó — sube por su cuenta).

**F6 está MAYORITARIAMENTE CONSTRUIDA** (el tracker `phases/README.md` dice «⬜ no iniciada» — es **FALSO**,
parte del cierre es reconciliarlo). Estado real por incremento:

| Incr. | Qué | Estado |
|---|---|---|
| 1 | `buildTrustReport` (agregador puro) + `renderTrustReport{Json,Html}` + spec `trust-report.md` | ✅ #529 |
| 2 | puente en 2 etapas (`dogfood/probe-shibui.ts` → `observations.json` → `src/report/run.ts`) + deploy a `hanko-report.web.app` en main (4 capas) | ✅ #531/#534 |
| 3 | emisor de issues de GitHub **opt-in** (`github-issues.ts` + `issues-run.ts` + spec `github-issues.md`) | ✅ |
| «Paso 0» | validar el harness en navegador sobre shibui real | ✅ **hecho** (lo cubrieron los cierres F3/F4/F5 — el spec lo marca `⏳`, está rancio) |

**Lo que FALTA para «F6 terminada» = el GATE DURO** (+ histórico/badges, diferible). Hoy el job `hanko-seal`
(`.github/workflows/ci-lib.yml`) corre solo `smoke` (Floor, node) y es **`continue-on-error: true`**
(report-only). El propio comentario del workflow lo dice: *«Para convertirlo en gate duro, quitar
`continue-on-error` cuando el sello sea estable. Requiere que el lockfile incluya @shibui-ui/hanko.»*

> **⚠️ Antes de ramear:** confirma que **#558 está MERGED** a `develop` (`gh pr view 558`) y ramea de
> `origin/develop` actualizado (`git fetch` primero; el ref local suele estar rancio). Si NO está mergeado,
> avisa antes de ramear (F6 depende de que F3/F5 estén en develop).

---

## 1. Qué falta para «terminada» — checklist + DECISIONES tuyas primero

Como en F3/F4/F5, **necesito una decisión de política del usuario antes de tocar código** en los puntos 🟠.
Preséntalos con opciones + recomendación y espera el OK (`AskUserQuestion`, una pregunta por decisión).

### El nudo de fondo (léelo antes de las decisiones)

El Trust Report a 4 capas sella **~49/102**. Los **~53 sin sello NO son bugs de los componentes ni de hanko**:
son **drift del CEM de shibui** (property kebab-fantasma ≈105, slot `"—"` de JSDoc ≈20, attribute camelCase 7) —
ver `checks-contract.md §Triaje`. **Un gate duro a conformance plena fallaría el build por la deuda de
generación del manifest de shibui, no por una regresión de código.** Eso es injusto y bloquearía todo. Por tanto
el gate NO puede ser «todos deben sellar» hasta que shibui limpie su CEM (otro carril). Las decisiones de abajo
giran alrededor de esto.

### 6.1 🟠 ¿Qué hace fallar el build? (la decisión central)
Opciones:
- **(a) Gate de regresión sobre baseline.** Commitear un baseline (`hanko-report/baseline.json` o un número de
  sellados) y fallar el build solo si el sello **empeora** respecto al baseline (un componente que estaba sellado
  deja de estarlo, o `sellados < baseline`). NO castiga el drift preexistente de shibui; SÍ atrapa regresiones
  reales. Honesto y desplegable ya. **(recomendación probable — confírmalo midiendo)**
- **(b) Floor duro en PRs + 4-capas report-only en main.** Quitar `continue-on-error` del `hanko-seal` actual
  (que corre `smoke`/Floor, **102/102 hoy** → verde, barato, sin navegador), dejando el Trust Report de 4 capas
  como informativo en main (deploy). Primer escalón barato; el Floor sí muerde (un componente no registrable
  rompe el build).
- **(c) Conformance plena.** Fallar si CUALQUIER componente no sella. **Inviable hoy** (fallaría por los ~53 de
  drift de shibui). Solo tras limpiar el CEM de shibui.
- **(d) Híbrido (a)+(b).** Floor duro en PRs + gate de regresión-desde-baseline sobre las 4 capas en main. Cubre
  ambos: barato en PR, honesto contra regresiones en main.

> **Mide antes de prometer:** corre `smoke` (Floor) y confirma 102/102 hoy; corre el dogfood y fija el baseline
> de sellados FRESCO. El número de baseline es «lo que mida el dogfood al arrancar», no un literal.

### 6.2 🟠 El drift del CEM de shibui — ¿baseline/allowlist o esperar a shibui?
El gate no debe fallar por los ~53 sin-sello de drift de shibui. Opciones:
- **(a) Baseline de regresión** (atado a 6.1a/d): el baseline «congela» el drift conocido; solo fallan las
  regresiones nuevas. No requiere tocar shibui. **(recomendación)**
- **(b) Esperar a que shibui limpie su CEM** (arreglar la generación del manifest: campos kebab-fantasma, slot
  `—` de JSDoc, attribute camelCase — otro carril, ya hay precedente con la deuda a11y #556) y entonces subir a
  conformance plena. Más limpio a largo plazo, pero bloquea el gate hasta que shibui termine.
- **(c) Allowlist explícita** de componentes/findings tolerados con caducidad. Más control, más mantenimiento.

### 6.3 🟠 ¿Dónde corre el gate? (PR vs main · node vs navegador)
El Floor (`smoke`) es node-only y rápido → cabe en PRs. El Trust Report a 4 capas necesita Playwright/chromium
(la sonda del navegador) → más lento (~min). Opciones:
- **(a) Floor duro en PRs (node) + 4-capas con baseline en main (navegador).** Barato en el camino caliente,
  cobertura plena en la integración. **(recomendación)**
- **(b) 4-capas con baseline también en PRs.** Máxima cobertura por PR, pero añade Playwright + ~min a cada PR
  que toque UI. Reusa el job `deploy-hanko-report` (que ya instala chromium) como plantilla.

### 6.4 El lockfile — BLOQUEO de entorno (no decisión, pero léelo)
Quitar `continue-on-error` exige que `pnpm install --frozen-lockfile` en CI **resuelva @shibui-ui/hanko** (y sus
devDeps: vitest, @vitest/browser, playwright, axe-core, esbuild, tsx). El `pnpm-lock.yaml` **debe incluir
hanko**. Es el **NUDO recurrente**: `pnpm install` se cuelga en el worktree de Windows. Patrón establecido: el
agente NO regenera el lockfile en el worktree; **el usuario corre `pnpm install` en el repo principal y commitea
el `pnpm-lock.yaml`**. Coordina esto explícitamente: sin el lockfile actualizado, el job de CI fallaría en el
`install`, no en el sello. (Verifica primero si ya está: `grep -c "@shibui-ui/hanko" pnpm-lock.yaml`.)

### 6.5 🟠 Histórico / badges — implementar o diferir
Consumir el `trust-report.json` publicado para un *trend* de cobertura + badge de «% sellado». **Recomendación:
diferir a vNext** con rationale escrito (como `valid-min` en F5): es valor añadido, no parte del gate. Decidir
explícitamente, no olvidar.

### Criterio de «F6 terminada» (espejo de F3/F4/F5)
1. **Gate duro decidido y cableado** (6.1/6.2/6.3): el build falla ante lo que la política diga (regresión /
   Floor), sin castigar el drift preexistente de shibui. `continue-on-error` quitado **solo** cuando el lockfile
   esté (6.4) y el sello sea estable.
2. **Mecanismo del gate:** el runner (`src/report/run.ts` o `smoke`) sale con **exit code ≠ 0** según la política
   (hoy `run.ts` solo `process.exit(2)` si no lee el manifest; el smoke pasa 102/102). Probablemente un flag
   `--gate`/`--baseline` en `run.ts` o un step que compare el `trust-report.json` contra el baseline.
3. **Histórico/badges** decidido (implementar o diferir con rationale, 6.5).
4. **Tracker reconciliado:** `phases/README.md` (dice «F6 ⬜ no iniciada» — FALSO) y `development-phases.html`
   con F6 incr 1/2/3 = hecho y el gate = hecho/diferido según se cierre; spec `trust-report.md` con el «Paso 0»
   marcado hecho (el harness ESTÁ validado) y el gate al día.
5. **sellados estable o al alza** respecto al baseline que midas al arrancar; validación con el dogfood real
   EJECUTADO DESDE EL WORKTREE; `/code-review` al cerrar el incremento.

> Lo que F6-gate **NO** incluye: **F7** (npm publish real + bundler ESM-Node) sigue diferida. No la metas aquí
> salvo que el usuario lo pida.

---

## 2. Trampas conocidas (NO repetir)
- **No gatees sobre el drift de shibui.** Los ~53 sin-sello son deuda del CEM de shibui, no regresiones. Un gate
  de «todos sellan» bloquea todo injustamente. Usa baseline de regresión (6.1a/d).
- **El lockfile (NUDO).** Sin `@shibui-ui/hanko` en `pnpm-lock.yaml`, el CI falla en `install --frozen-lockfile`,
  no en el sello. `pnpm install` se cuelga en el worktree → el USUARIO lo corre en el principal y commitea.
- **El árbol equivocado.** El repo PRINCIPAL puede estar en una rama ajena. El dogfood importa el `src` de DONDE
  se ejecuta + la `dist` de shibui (junctioneada). **SIEMPRE ejecutar el dogfood desde `$WT\packages\hanko`** (el
  worktree) con los junctions puestos. Verifica `git -C <MAIN> branch --show-current`.
- **Specs/trackers rancios ≠ realidad.** `trust-report.md` dice «Paso 0 ⏳» (FALSO: el harness está validado
  desde F3/F4/F5). `phases/README.md` dice «F6 ⬜ no iniciada» (FALSO: incr 1/2/3 hechos). Parte del cierre es
  ponerlos al día, no creértelos.
- **Cambio monotónico / regla de oro.** El gate debe fallar por señal real (regresión), no por ruido. Lo no
  verificable se omite (no se finge verde ni se fuerza rojo).

---

## 3. Mapa de ficheros
- `src/report/trust-report.ts` — agregador PURO: `buildTrustReport(components)` → `TrustReport`
  (`LayerVerdict` por capa: floor/contract/a11y/resilience; `trusted` si ninguna capa evaluada falla). Node-testable.
- `src/report/render.ts` — `renderTrustReportJson` (cable para gates/badges, round-trip sin pérdida) +
  `renderTrustReportHtml` (acepta `note`/`diagnostics`). El gate consume el JSON.
- `src/report/run.ts` — el RUNNER: lee el CEM + `observations.json` (si existe), corre las 4 capas, escribe
  `hanko-report/index.html` + `trust-report.json`. **Aquí vive el exit-code del gate** (hoy solo `exit(2)` si no
  lee el manifest). Sin `observations.json` degrada a Floor.
- `src/report/observations.ts` — tipos del puente (`ComponentObservation`, etc.).
- `src/smoke/run.ts` — el sello **Floor** estático (node, sin navegador). Lo que corre `hanko-seal` hoy.
- `src/report/github-issues.ts` + `issues-run.ts` — incr 3 (opt-in). Ya hecho; referencia para el patrón de
  consumir el report.
- `dogfood/probe-shibui.ts` + `browser-glue.ts` — la sonda del navegador (Etapa 1; único punto que importa
  shibui, fuera de `src/`). Genera `observations.json`.
- `.github/workflows/ci-lib.yml` — **el sitio del gate:** job `hanko-seal` (líneas ~115, `smoke`/Floor,
  `continue-on-error: true` ← quitar) + job `deploy-hanko-report` (líneas ~264, observe→report→deploy a
  `hanko-report.web.app`, instala chromium — plantilla si el gate de 4 capas corre en CI).
- Specs: `docs/specs/trust-report.md` (estado vivo · «Paso 0» y «gate» rancios) · `docs/specs/github-issues.md` ·
  `docs/phases/development-phases.html` + `docs/phases/README.md` (trackers — reconciliar F6).

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
  **Quítalos al acabar** detectando `LinkType -eq 'Junction'` y con `cmd /c rmdir "<ruta>"`; **NUNCA `rm -rf`**
  (atraviesa el junction y borra el target real). Tras quitarlos, verifica que `<MAIN>\node_modules` sigue ahí.
- **Binarios** desde `<WT>\packages\hanko\node_modules\.bin\{tsc,vitest,tsx}.CMD`.
- **EDITA Y EJECUTA EL WORKTREE** (rutas absolutas dentro del worktree). Ver trampa «árbol equivocado» (§2).
- **Commits CON hooks** (no `--no-verify`): con los junctions, el pre-commit (`@shibui-ui/ui type-check`) pasa.
- `git fetch`/`push`/`gh pr create` funcionan. **Ramea de `origin/develop` tras `git fetch`** (ref local rancio).
- `hanko-report/` está **gitignored**. Para leer el report a mano (bórralo al acabar):
  ```js
  // node metrics.cjs <abs>/hanko-report/trust-report.json
  const r=require(process.argv[2]); const t={};
  for(const c of r.components){ for(const f of (c.findings||[])){ const k=f.split(':')[0].trim(); t[k]=(t[k]||0)+1; } }
  console.log({trusted:r.trusted,total:r.total,tally:t});
  ```

### Verificación (con junctions puestos), desde `<WT>\packages\hanko`
```powershell
$H="<WT>\packages\hanko"
& "$H\node_modules\.bin\tsc.CMD" --noEmit -p "$H\tsconfig.json"                 # type-check (solo src/)
& "$H\node_modules\.bin\vitest.CMD" run                                          # node (82 tras F3/F5)
& "$H\node_modules\.bin\vitest.CMD" run --config vitest.browser.config.ts        # browser (28 tras F3/F5)
& "$H\node_modules\.bin\tsx.CMD" src/smoke/run.ts                                # Floor (102/102) — lo que gatea hoy
& "$H\node_modules\.bin\tsx.CMD" dogfood/probe-shibui.ts                          # → hanko-report/observations.json
& "$H\node_modules\.bin\tsx.CMD" src/report/run.ts                               # → index.html + trust-report.json
```

---

## 5. Reglas de trabajo del proyecto (memoria)
- **Decisión de política PRIMERO** en los puntos 🟠 (6.1/6.2/6.3/6.5): opciones + recomendación y **espera el
  OK** antes de codear (igual que F3/F4/F5).
- **Reportar en VISUAL**: HTML (show_widget inline + `.html` en docs), NO Mermaid.
- **Tracker de fases**: actualizar `development-phases.html` (+ `README.md` + spec) en CADA avance, sin pedirlo
  (solo hanko; el «consumer» = shibui, no metas su deuda como ruido del tracker).
- **Bucle incremento→review**: al cerrar el incremento, `/code-review` sobre el diff y usar los hallazgos.
- **GitFlow ABSOLUTO**: rama `fix/**` (o `chore/**` para docs) desde `develop`; destino `develop`, nunca `main`;
  `--no-ff`; no borrar ramas sin confirmar. (El deploy a `hanko-report.web.app` es en `main` vía el merge normal
  develop→main por PR, no toques eso a mano.)
- Antes de tocar nada estructural, carga las tools `codegraph_*` (llegan deferred): `ToolSearch "codegraph"`.
- Junctions Windows: quitar guardando por `LinkType` con `cmd /c rmdir`, **nunca `rm -rf`**.
