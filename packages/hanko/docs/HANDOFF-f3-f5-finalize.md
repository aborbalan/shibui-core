# Handoff · Cerrar F3 (contrato) + F5 (resiliencia) — de «calibrado» a «terminada»

> **Para una sesión nueva, en frío.** hanko (`packages/hanko`, `@shibui-ui/hanko`) es un motor de verificación
> de confianza manifest-driven para Web Components. Dogfood = shibui-ui (~102 componentes). Stack: pnpm
> workspaces, TS estricto, vitest (node + `@vitest/browser`/Playwright), tsx/esbuild. GitFlow del repo: ramas
> desde `develop`, merge `--no-ff`, **nunca a `main` directo**, PR a `develop`.
>
> Este handoff es el **espejo del de F4** (`HANDOFF-a11y-finalize.md`, ya consumido en #555). Mismo patrón:
> decisiones de política PRIMERO, luego cerrar. Lee también, para el método, el commit de F4 (`729e0fd`).

---

## 0. TL;DR — dónde estamos

Las **tres capas de verificación están funcionalmente calibradas** y emiten señal honesta:

| Capa | Calibración | PR | Estado |
|---|---|---|---|
| F3 contrato | **D** — sentinel de reflexión TIPADO + red de captura | #552 | calibrada · spec rancia · tracker «en curso» |
| F4 a11y | **C** (nombre aportable) + **F4-cierre** (teclado real · landmarks · foco diferido) | #554 · **#555** | **✅ TERMINADA** |
| F5 resiliencia | **A** — captura completa de crashes por trial (window + updateComplete) | #551 | calibrada · spec rancia · tracker «en curso» |

**Trust Report real (última medición, 2026-06-22, post-#555):** `102 · 47 sellados · 55 sin sello`.
Tally de hallazgos: `contract/property 108 · contract/reflect 31 · contract/slot 29 · contract/attribute 7 ·
a11y/name 4`. **Resiliencia = 0 fallos duros** (todos los escenarios son `optional` → warnings; ver decisión 5.1).

F4 cerró su capa. **Esta sesión cierra F3 y F5 con el mismo rasero**: confirmar que NO queda *laxitud que finge
cobertura* NI *estricteza que no compra señal* (lección #549, las dos caras), tomar las decisiones de política
🟠 abajo, marcarlas «terminadas» en specs + tracker, y dejar el sin-sello restante clasificado (hanko vs deuda
del CEM de shibui).

> **⚠️ Antes de ramear:** confirma que #555 está MERGED a `develop` (`gh pr view 555`) y ramea de
> `origin/develop` actualizado (`git fetch` primero; el ref local suele estar rancio).

---

## 1. Qué falta para «terminada» — checklist + DECISIONES tuyas primero

Como en F4, **necesito una decisión de política del usuario antes de tocar código** en los puntos 🟠. Preséntalos
con opciones + recomendación y espera el OK (igual que en F4: `AskUserQuestion`, una pregunta por decisión).

### F5 · Resiliencia

#### 5.1 🟠 Todos los escenarios son `optional` → la capa NUNCA falla (el más importante)
Hoy el runner pasa `ADVERSE_SCENARIOS = ['empty','junk-attrs','rtl','remount']` **todos** como `optional`
(`src/report/run.ts` / `src/report/observations.ts` → `resilienceCheck(obs, { optional: [...ADVERSE_SCENARIOS] })`).
Con todos opcionales, **ningún crash descalifica el sello**: la capa resiliencia siempre pasa = es report-only por
construcción. Es el **análogo F5 del proxy `keyboardReachable` de F4**: verde garantizado.

La razón es legítima (documentada en `probe.ts` `ADVERSE_SCENARIOS`): los escenarios montan SIN datos, así que un
componente data-driven peta por *falta de datos*, no por *fragilidad real* — distinguir «frágil» de «necesita
datos» exigiría sembrar datos mínimos por tipo (decisión 5.2). Pero «siempre opcional» finge cobertura.

**Decisión:** ¿qué hace fallar la resiliencia? Opciones:
- **(a) un escenario obligatorio honesto.** Promover `remount` (montar→desmontar→montar) a **obligatorio**: no
  depende de datos (un componente bien hecho sobrevive a montarse/desmontarse vacío), así que su crash SÍ es
  fragilidad real. `empty`/`junk-attrs`/`rtl` siguen `optional` (sin datos, ruido). Compra señal real sin falsos
  positivos data-driven. **(mi recomendación)**
- **(b) seguir todos opcionales, report-only explícito.** Documentar que resiliencia es informativa hasta tener
  el sembrado de datos (5.2). Honesto si se escribe como decisión, pero no muerde.
- **(c) `junk-attrs` obligatorio también.** Más estricto; riesgo de que un componente reaccione a un atributo
  basura de forma legítima (re-render) y se cuente como fallo.

> Mide el efecto en el dogfood antes de dar nada por bueno: con (a), ¿algún componente real peta en `remount`
> vacío? Si peta, es señal real (deuda shibui) o artefacto del harness (revisar, como los 2 crashers de
> `junk-attrs` que cazó #549) → clasifícalo, no lo absorbas a ciegas.

#### 5.2 🟠 Sembrado de datos mínimos (`valid-min`) — implementar o diferir
Diferido en su día (tracker, tarjeta «◷ Diferido»): sembrar datos mínimos por tipo para un escenario duro que
distinga «frágil» de «necesita datos». Se probó y **el contrato no mejoró** (el ruido restante era drift del CEM).

**Decisión:** **(a) implementar** (sembrar `[]`/`{}`/valores mínimos por tipo del CEM y reintentar el montaje) o
**(b) diferir formalmente a vNext** con rationale escrito. Mi lectura: **(b)** — ya se probó sin ganancia, y con
5.1(a) la capa ya muerde donde es honesto. Documéntalo como decisión, no como olvido (igual que `focusVisible` en F4).

### F3 · Contrato

#### 3.1 🟠 Red de absorción de crashes del sondeo de reflexión — ¿se queda?
`observeRuntime`/`probeReflect` (`probe.ts`) absorben a `window` los crashes que el **propio sondeo** provoca
(enum-alias del CEM sin literales → el sentinel cae al string → `MAP[sentinel]` peta). Es correcto (el crash es
artefacto del sondeo, no del componente), pero **trade-off asumido** (documentado en `harness.md §Calibración D`):
la red también absorbe un crash GENUINO de montaje por defecto en `observeRuntime` — que igualmente lo capta la
capa de resiliencia (escenario `empty`). Con 5.1 cambiando qué falla en resiliencia, **revalida** que ese crash
genuino sigue cubierto por F5 y no se pierde entre las dos capas.

**Decisión:** confirmar que la cobertura cruzada F3↔F5 sigue intacta tras 5.1, o ajustar. Probablemente **no
requiere código**, solo verificación + nota en el spec. (Marca 🟠 por si la medición revela un agujero.)

#### 3.2 Triar el sin-sello de contrato (deuda hanko vs deuda shibui) — NO es decisión, es trabajo
Los hallazgos `contract/*` (property 108 · reflect 31 · slot 29 · attribute 7) son el grueso del sin-sello.
La memoria los atribuye a **drift del CEM de shibui** (fantasmas kebab: el CEM declara DOS miembros por prop —el
real `showLegend`/`show-legend` y un duplicado kebab sin attribute— → `contract/property: ausente`; y
`reflects:true` espurios). **Acción (no decisión de hanko):** clasificar una muestra representativa, confirmar
que son drift del CEM (no falsos positivos de `contractCheck`), y documentarlos como **deuda de shibui** (se
arreglan en la generación del manifest, no en hanko) + opcionalmente un chip de tarea hacia shibui. Si alguno
resulta ser un falso positivo de hanko, ESO sí es trabajo de F3 (calibrar el check).

#### 3.3 `B` — encoding del slot por defecto `â€”` (menor, transversal)
Pendiente conocido (harness.md): el nombre del slot por defecto del CEM/render llega como `"â€”"` (UTF-8 leído
como latin1). Afecta a `contract/slot`. Decidir si se cierra aquí (en la ingestión/lectura del nombre de slot) o
se difiere como deuda del CEM de shibui. Bajo riesgo; probablemente un fix de borde de ingestión.

### Criterio de «F3 / F5 terminadas» (espejo de F4)
1. **F5:** la resiliencia deja de ser verde-por-construcción (5.1) o se declara report-only **explícitamente**;
   `valid-min` con decisión escrita (5.2).
2. **F3:** cobertura cruzada F3↔F5 confirmada (3.1); el sin-sello de contrato clasificado y documentado como
   drift del CEM de shibui (3.2); `B` cerrado o diferido con rationale (3.3).
3. Sin reintroducir estricteza que no compra señal NI laxitud que finge cobertura (#549, ambas caras).
4. **sellados estable o al alza** (47 es el suelo); specs (`checks-contract.md` · `checks-resilience.md` ·
   `harness.md §Calibración`) actualizadas de «v0/pendiente» a «terminada»; tracker (`development-phases.html` +
   `phases/README.md`) con **F3 y F5 = hecho**.

> Lo que F3/F5-terminadas **NO** incluyen: el **gate duro** (que el sello rompa el build) es el item global
> siguiente (Hito 3 / F6 enforcer), no de F3/F5. No lo metas aquí salvo que el usuario lo pida.

---

## 2. Trampas conocidas (NO repetir)
- **#549 — las dos caras.** Ni *estricteza que no compra señal* (un escenario obligatorio que peta por falta de
  datos, no por fragilidad) ni *laxitud que finge cobertura* (todo `optional` → la capa nunca falla). La regla de
  oro arbitra: lo que no se puede probar honestamente se **omite**, no se finge verde ni se fuerza rojo.
- **Cambio monotónico.** Como en C/F4-cierre: que lo no observado se OMITA, no que falle por defecto. Si endureces
  resiliencia (5.1), que sea sobre un escenario que un componente sano SIEMPRE pasa (remount vacío), para no
  añadir violaciones espurias.
- **El árbol equivocado (cazado esta sesión, F4).** El repo PRINCIPAL puede estar en una rama ajena
  (en la sesión de F4 estaba en `fix/hanko-github-issues-user-agent`). El dogfood importa el `src` de DONDE se
  ejecuta: correrlo desde `D:\...\packages\hanko` (principal) mide el árbol equivocado → números pre-calibración.
  **SIEMPRE ejecutar el dogfood desde `$WT\packages\hanko` (el worktree) con los junctions puestos.** Verifica de
  paso `git -C <MAIN> branch --show-current`.
- **Specs rancias ≠ código rancio.** `checks-contract.md`/`checks-resilience.md` dicen «v0/pendiente de correr
  sobre shibui»: es FALSO (el dogfood corre desde F4). Parte del cierre es ponerlas al día, no creértelas.

---

## 3. Mapa de ficheros
- `src/checks/contract.ts` — política PURA de contrato (`contractCheck(declared, runtime, { level? })`): facetas
  `property`/`attribute`/`reflect`/`slot`/`method` + registrabilidad. Node-testable. No toca DOM.
- `src/checks/resilience.ts` — política PURA (`resilienceCheck(obs, { optional? })`): obligatorio→viola,
  `optional`→warning, no probado→omite. Aquí vive la mecánica de 5.1 (qué se pasa como `optional`).
- `src/harness/probe.ts` — el mecanismo browser: `observeRuntime` (+ `probeReflect`, sentinel tipado
  `chooseSentinel`/`PropTypeHint`, red de captura), `observeResilience` (+ `ADVERSE_SCENARIOS`, `mountThenRemove`).
  Aquí viven 3.1 y la fuente de los escenarios de 5.1. **GENÉRICO: no importa shibui** (guard `genericity.test.ts`).
- `src/report/run.ts` · `src/report/observations.ts` — el runner que decide qué `optional` pasa a
  `resilienceCheck` (el cableado real de 5.1) y agrega el Trust Report.
- `src/checks/*.test.ts` (node) · `src/harness/probe.browser.test.ts` (Playwright, fixtures `hanko-*`
  autocontenidos, sin shibui). Añade fixtures aquí para 5.1 (p.ej. un `hanko-remount-crasher`).
- `dogfood/{probe-shibui.ts, browser-glue.ts}` — puente node→browser (único punto que importa shibui, fuera de
  `src/`). `browser-glue.ts` cablea `observeResilience` (5.1 toca aquí si el `optional` se decide por tag).
- Specs: `docs/specs/checks-contract.md` · `docs/specs/checks-resilience.md` · `docs/specs/harness.md §Calibración`
  (estado vivo) · `docs/phases/development-phases.html` + `docs/phases/README.md` (trackers — al cerrar, F3 y F5
  = `hecho`).

---

## 4. Entorno (Windows del usuario) — LÉELO, ahorra horas
- **El worktree NO tiene `node_modules`** (`pnpm install` se cuelga en Windows). Para ejecutar CUALQUIER cosa, crea
  junctions desde el repo principal (`<MAIN>` = `D:\PROYECTOS\shibui-ecosystem`; `<WT>` = tu worktree):
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
  (El `phases/README.md` dice `--no-verify` obligatorio: era cierto SIN junctions; con junctions ya no.)
- `git fetch`/`push`/`gh pr create` funcionan. **Ramea de `origin/develop` tras `git fetch`** (ref local rancio).
- `hanko-report/` está **gitignored**. Un `metrics.cjs` ad-hoc para leer el report (bórralo al acabar):
  ```js
  // node metrics.cjs <abs>/hanko-report/trust-report.json
  const r=require(process.argv[2]); const t={}; let res=0;
  for(const c of r.components){ for(const l of (c.layers||[])){ if(l.layer==='resilience'&&l.status==='fail') res++; }
    for(const f of (c.findings||[])){ const k=f.split(':')[0].trim(); t[k]=(t[k]||0)+1; } }
  console.log({trusted:r.trusted,total:r.total,resilienceFail:res,tally:t});
  ```

### Verificación (con junctions puestos), desde `<WT>\packages\hanko`
```powershell
$H="<WT>\packages\hanko"
& "$H\node_modules\.bin\tsc.CMD" --noEmit -p "$H\tsconfig.json"                 # type-check (solo src/)
& "$H\node_modules\.bin\vitest.CMD" run                                          # node (80 tras F4)
& "$H\node_modules\.bin\vitest.CMD" run --config vitest.browser.config.ts        # browser (23 tras F4)
& "$H\node_modules\.bin\tsx.CMD" dogfood/probe-shibui.ts                          # → hanko-report/observations.json
& "$H\node_modules\.bin\tsx.CMD" src/report/run.ts                               # → index.html + trust-report.json
```
> Para AISLAR el origen de un diagnóstico, edita temporalmente `dogfood/browser-glue.ts` (`observe()`) para correr
> solo la observación que investigas (p.ej. solo `observeResilience`), corre el probe, **restaura el fichero**.

---

## 5. Reglas de trabajo del proyecto (memoria)
- **Decisión de política PRIMERO** en los puntos 🟠 (5.1/5.2/3.1, y 3.3 si aplica): opciones + recomendación y
  **espera el OK** antes de codear (igual que C y F4-cierre).
- **Reportar en VISUAL**: HTML (show_widget inline + `.html` en docs), NO Mermaid.
- **Tracker de fases**: actualizar `development-phases.html` (+ `README.md` + spec) en CADA avance, sin pedirlo
  (solo hanko; el «consumer» = la librería consumidora, no metas hallazgos de shibui como ruido del tracker).
- **Bucle incremento→review**: al cerrar el incremento, `/code-review` sobre el diff y usar los hallazgos.
- **GitFlow ABSOLUTO**: rama `fix/**` (o `chore/**` para docs) desde `develop`; destino `develop`, nunca `main`;
  `--no-ff`; no borrar ramas sin confirmar.
- Antes de tocar nada estructural, carga las tools `codegraph_*` (llegan deferred): `ToolSearch "codegraph"`.
- Junctions Windows: quitar guardando por `LinkType` con `cmd /c rmdir`, **nunca `rm -rf`**.
