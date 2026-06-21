# Handoff · Cerrar F4 (a11y) — de «v0 calibrado» a «terminada»

> **Para una sesión nueva, en frío.** hanko (`packages/hanko`, `@shibui-ui/hanko`) es un motor de
> verificación de confianza manifest-driven para Web Components. Dogfood = shibui-ui (~102 componentes).
> Stack: pnpm workspaces, TS estricto, vitest (node + `@vitest/browser`/Playwright), tsx/esbuild.
> GitFlow del repo: ramas desde `develop`, merge `--no-ff`, **nunca a `main` directo**, PR a `develop`.

---

## 0. TL;DR — dónde estamos

F4 (a11y) está **calibrada a nivel v0** y marcada `en curso` en el tracker (a propósito). El Trust Report real
sobre shibui da **102 · 47 sellados · 55 sin sello**. La capa a11y ya emite **señal real**, no ruido de montaje.

| Calibración a11y | PR | Efecto |
|---|---|---|
| Nombre accesible aportable por el consumidor (**C**) | **#554** (`fix/hanko-a11y-nameable` → develop) | `a11y/name` **29 → 6** · sellados **38 → 47** |

> **⚠️ Dependencia:** este handoff describe el estado **tras #554**. Antes de ramear el trabajo de cierre,
> confirma que **#554 está MERGED a develop** (`gh pr view 554`) y ramea de `origin/develop` actualizado
> (`git fetch` primero; el ref local suele estar rancio). Si #554 sigue OPEN, avisa antes de ramear sobre algo
> que aún cambia.

Lo que falta para considerar F4 **terminada** son los **pendientes menores** que C dejó documentados a propósito
(no se tocaron para no arriesgar falsos negativos en aquel incremento). Son el objeto de ESTA sesión.

---

## 0.1 Principio de entrega — **cada fase es un entregable**

> **Regla del proyecto (decisión del 2026-06-21):** cada fase (F0…F7) se trata como un **entregable cerrado**.
> **No se pasa a la fase siguiente hasta que la actual está terminada por completo** — todos sus criterios de
> aceptación cumplidos, validados y documentados (specs + tracker). Nada de «dejar flecos para luego» y arrancar
> la siguiente: los flecos son parte de la entrega, no deuda diferible.

Implicaciones para esta sesión y las próximas:
- **F4 no se da por cerrada** hasta cumplir TODO el «Criterio de F4 terminada» (§1). Los pendientes menores de C
  (keyboard/isInteractive/focus) **son parte de la entrega de F4**, no un «extra opcional».
- **No empieces F5/F6/F7-restante** mientras F4 siga abierta. (Nota: algunas fases ya tienen incrementos hechos en
  ramas previas; eso no contradice la regla — la regla es de **cierre/aceptación**, no de exploración.)
- **Distingue lo que ES de la fase de lo que NO**: meter el gate duro (F6) en F4 «porque ya que estamos» viola la
  regla en sentido inverso — infla el alcance de F4 con trabajo de otra fase. Cada entregable, su alcance exacto.
- El **tracker** (`development-phases.html`) refleja el estado real de cada fase; una fase solo pasa a `hecho`
  cuando su entrega está aceptada de verdad (no «en curso con flecos»).

---

## 1. Qué falta para «terminada» — checklist + DECISIONES tuyas primero

F4 = capa a11y: **axe + teclado + foco + nombre**. Incr. 1 (política pura `a11yCheck`) y incr. 2 (harness
`observeA11y`) están hechos y validados; el nombre ya está calibrado (C). Quedan **cuatro heurísticas/decisiones**.
Como en C, **necesito una decisión de política tuya antes de tocar código** en los puntos marcados 🟠.

### 1.1 🟠 `keyboardReachable` — proxy que NO compra señal (el más urgente)
Hoy, en `observeA11y` (`src/harness/probe.ts`):
```ts
obs.keyboardReachable = el.tabIndex >= 0 || el.shadowRoot !== null;
```
`el.shadowRoot !== null` es **true para casi todos los componentes de shibui** (todos son LitElement con shadow) →
el check `keyboard` **nunca falla**. Es ruido disfrazado de verde: declara `checked: ['keyboard']` sin verificar
nada. Es el equivalente a11y del falso `reflect` que cazamos en D.

**Decisión:** (a) **señal real** — alcanzable por teclado = el host es tabbable (`tabIndex >= 0`) **o** el shadow
contiene un elemento *realmente* enfocable por tab (no solo "existe shadow"); (b) **omitir (regla de oro)** — si
no podemos probar el foco de verdad sin navegar, dejar `keyboardReachable` `undefined` → la regla `keyboard` se
**omite** (no finge). Mi lectura: **(a)** con una comprobación honesta (un `querySelector` de tabbables reales en
el shadow, reusando la misma idea que `isInteractive`) o, si eso no convence, **(b)** antes que mantener el
proxy actual, que es exactamente la "estricteza que no compra señal" que #549 prohíbe (aquí en su forma inversa:
laxitud que finge cobertura).

### 1.2 🟠 `isInteractive` — sobre-detección de landmarks
`isInteractive` (`src/harness/probe.ts`) marca interactivo a cualquier componente cuyo shadow **contenga** un
control:
```ts
return sr !== null && sr.querySelector('button,a[href],input,select,textarea,[tabindex]') !== null;
```
Por eso `lib-header` y `lib-footer` (landmarks `banner`/`contentinfo` que *contienen* enlaces/botones) quedan
entre los 6 `a11y/name`: **no son controles que necesiten nombre, son regiones**. Pero estrechar es delicado:
**muchos web components delegan su interactividad a un hijo del shadow** (un `lib-button` que envuelve `<button>`)
y SÍ deben contar — si los excluyes, pierdes señal real de teclado/nombre.

**Decisión:** ¿qué política contra el falso interactivo? Opciones: (a) **excluir por rol de landmark** — si el host
expone `role` de región (`banner|contentinfo|region|navigation|main|complementary|search`) → no es un control
interactivo aunque contenga controles; (b) **no tocar** `isInteractive` y aceptar que header/footer son "deuda
a11y de shibui" (ponerles un nombre o el rol correcto); (c) algo más fino (distinguir "es un control" de "contiene
controles"). Mi lectura: **(a)** es barata, genérica y de bajo riesgo de falso negativo (un landmark no es un
control); resuelve header/footer sin tocar la detección de los `lib-button`-like. Confírmalo.

### 1.3 🟠 `focusVisible` — implementar o diferir formalmente
Hoy **no se observa** (`focusVisible` queda `undefined` → la regla `focus` se **omite**, no falla). Verificarlo de
verdad exige **foco real + comprobar el anillo** (`:focus-visible` aplicado, contraste/outline) — caro y frágil en
un harness headless.

**Decisión:** (a) **implementar** una versión mínima (enfocar el elemento/su control interno y comprobar que
`:focus-visible` matchea o que hay outline) — a11y a fondo; (b) **diferir formalmente** a vNext con rationale escrito
(seguir omitiendo; la regla de oro ya lo cubre sin fingir). Mi lectura: **(b)**. El foco visible es el check a11y
con peor relación señal/coste en headless, y omitirlo es honesto (no inventa cobertura). Documentarlo como
decisión, no como olvido.

### 1.4 Los 6 `a11y/name` reales — cerrar el lazo (deuda de shibui, no de hanko)
Tras C quedan 6 interactivos sin slot por defecto ni prop de etiqueta declarados: `lib-rating`,
`lib-editor-toolbar`, `lib-tree-select`, `lib-file-browser`, `lib-header`, `lib-footer`. **Son señal real.** Con
1.2 resuelto, header/footer probablemente salgan de la lista (son landmarks) → quedarían ~4 controles genuinos.

**Acción (no decisión de hanko):** documentarlos como **deuda a11y de shibui** (añadir `aria-label`/`label` o un
slot por defecto) — un apunte en el spec + opcionalmente un **chip de tarea** hacia shibui. NO es trabajo de hanko
calibrar esto: la capa a11y ya hace lo correcto al señalarlos.

> **axe (sanity check, no decisión):** confirma de paso que axe corre sobre el shadow DOM y que sus violaciones
> `>= serious` se reflejan (no deberían dominar; lo eran en C). Si axe no estuviera entrando al shadow, eso SÍ
> sería un agujero de F4. Una comprobación rápida en el dogfood basta.

### Criterio de «F4 terminada»
1. `keyboardReachable` deja de ser un proxy: o verifica de verdad, o se omite (sin fingir cobertura).
2. `isInteractive` no marca landmarks como controles (header/footer fuera de `a11y/name`, sin perder los
   `*-button`-like).
3. `focusVisible` con una decisión **explícita** (implementado o diferido con rationale en el spec).
4. Los `a11y/name` restantes = solo controles genuinos, documentados como deuda de shibui.
5. **Sin reintroducir estricteza que no compra señal NI laxitud que finge cobertura** (lección de #549, ambas caras).
6. **Capacidad de enforce presente y apagada**: `a11yCheck` ya acepta `failOn` (umbral de severidad) → la capa
   a11y *podría* gatear. Se entrega esa capacidad **explícitamente en report-only** (documentar que el enforce
   existe y está apagado por decisión de rollout), para que nadie diga «el check no enforce»: enforce existe,
   está deliberadamente off.
7. sellados estable o al alza; specs (`checks-a11y.md` + `harness.md §Calibración`) + tracker
   (`development-phases.html`, marcar F4 `hecho`) actualizados.

> **El gate duro NO es de F4.** Quitar `continue-on-error` del job `hanko-seal` (fallar el build con el sello) es
> un **hito global de F6**: gatea el Trust Report de las **4 capas**, no la a11y sola, y es **un único flip**
> posterior, bloqueado por el drift del CEM de shibui (`property`/`reflect`/`slot`) + el cierre de las otras capas.
> No lo metas en esta entrega. F4 entrega la *capacidad* de enforce (punto 6), no el *encendido* del gate.

---

## 2. Trampas conocidas (NO repetir)
- **#549 — no metas estricteza que no compra señal.** Se revirtió a propósito un `await updateComplete` en
  `observeA11y` que subía a11y 29→37 sin ganar señal. `observeA11y` hoy **NO** espera `updateComplete` a propósito.
  Su cara inversa (este handoff): **no mantengas laxitud que finge cobertura** (el proxy de `keyboardReachable`).
- **Cambio monotónico (C).** La política de `name` se diseñó para que `nameSupplyable: undefined` conserve el
  comportamiento estricto previo → relajar nunca añade violación. Si tocas `keyboard`/`focus`, respeta el mismo
  principio: que lo no observado se OMITA (regla de oro), no que falle por defecto.
- **Verifica capacidad, no cableado (C, diferido).** La opción «a» de C (sembrar el nombre y comprobar que aflora)
  quedó diferida. Si en `focusVisible` te tienta "sembrar foco y mirar", recuerda que eso es la misma clase de
  coste/fragilidad — decisión 1.3 explícita primero.

---

## 3. Mapa de ficheros (a11y)
- `src/checks/a11y.ts` — política PURA (node-testable): `a11yCheck(obs, {failOn?})`. Regla `name` ya implementa la
  política C (`nameSupplyable`); reglas `keyboard`/`focus` siguen en el bucle de `reachabilityChecks`. **No recibe
  el contrato** (debe seguir así): si una decisión necesita datos del CEM, pásalos por la `A11yObservation` (como
  `nameSupplyable`), no acoplando la política.
- `src/harness/probe.ts` — el mecanismo browser: `observeA11y(tag, runAxe, declaredProps?, declaredSlots?)` ·
  `isInteractive` · `hasAccessibleName` · `isNameSupplyable` (C) · `NAMEISH_PROP`. Aquí viven las heurísticas v0
  objeto de 1.1/1.2/1.3. axe se INYECTA (no se importa).
- `src/checks/a11y.test.ts` — tests node de la política (observaciones falsas).
- `src/harness/probe.browser.test.ts` — tests browser del mecanismo (Playwright); define sus propios custom
  elements (`hanko-probe-button`, `hanko-nameless-control`, …), SIN acoplar a shibui. Añade fixtures aquí para
  1.1/1.2 (p.ej. un landmark con rol + control dentro; un control host-tabbable vs uno con tabbable solo en shadow).
- `dogfood/{probe-shibui.ts, browser-glue.ts}` — puente node→browser (único punto que importa shibui, fuera de
  `src/`). `probe-shibui.ts` arma `propTypesByTag`/`slotsByTag` del CEM y los inyecta por tag; `browser-glue.ts`
  los pasa a `observeA11y`. Si una decisión necesita más datos del CEM por tag (p.ej. el `role` declarado), se
  inyectan por aquí, igual que los slots de C.
- `src/genericity.test.ts` — guard ejecutable: el core/`src` NUNCA importa shibui/Lit. Respétalo (heurísticas
  genéricas, sin nombres de shibui en `src/`).
- Specs: `docs/specs/checks-a11y.md` (§Calibración C ya escrita; añade la política de keyboard/focus elegida) ·
  `docs/specs/harness.md §Calibración` (estado vivo) · `docs/phases/development-phases.html` (tracker — al cerrar,
  marcar F4 `hecho` y mover la tarjeta `◷ Pendiente (menor)` a ✓).

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
  **Quítalos al acabar** con `cmd /c rmdir "<ruta>"` (o PowerShell guardando por `LinkType`); **NUNCA `rm -rf`**
  (atravesaría el junction y borraría el target real). Tras quitarlos, verifica que `<MAIN>\node_modules` sigue ahí.
- **Binarios** desde `<WT>\packages\hanko\node_modules\.bin\{tsc,vitest,tsx}.CMD`.
- **EDITA EL WORKTREE CORRECTO** (rutas absolutas dentro del worktree). El dogfood importa el `src` del worktree.
- **Commits CON hooks** (no `--no-verify`): con los junctions, el pre-commit (`@shibui-ui/ui type-check`) pasa.
- `git fetch`/`push`/`gh pr create` funcionan. **El ref local `develop` suele estar rancio → ramea de
  `origin/develop` tras `git fetch`.**
- `hanko-report/` está **gitignored**.

### Verificación (con junctions puestos), desde `<WT>\packages\hanko`
```powershell
$H="<WT>\packages\hanko"
& "$H\node_modules\.bin\tsc.CMD" --noEmit -p "$H\tsconfig.json"                 # type-check (cubre solo src/)
& "$H\node_modules\.bin\vitest.CMD" run                                          # node (80 tests tras C)
& "$H\node_modules\.bin\vitest.CMD" run --config vitest.browser.config.ts        # browser (Playwright, 19 tras C)
& "$H\node_modules\.bin\tsx.CMD" dogfood/probe-shibui.ts                          # → hanko-report/observations.json
& "$H\node_modules\.bin\tsx.CMD" src/report/run.ts                               # → index.html + trust-report.json
```
> `tsconfig.json` solo incluye `src/**`; **`dogfood/` NO entra en el type-check**. Si tocas el puente, valida
> aparte con un tsconfig temporal que incluya `dogfood/**` + `src/**` (mismas opciones estrictas) y bórralo.
>
> Para AISLAR el origen de un diagnóstico: edita temporalmente `dogfood/browser-glue.ts` (`observe()`) para correr
> solo la observación que investigas (p.ej. solo `observeA11y`), corre el probe, **restaura el fichero**.

### Métricas rápidas del Trust Report (node, RUTA ABSOLUTA)
```js
// node metrics.cjs <abs>/hanko-report/trust-report.json
const r = require(process.argv[2]); const tally={}; let a11yFail=0;
for (const c of r.components){ for (const l of (c.layers||[])) if(l.layer==='a11y'&&l.status==='fail') a11yFail++;
  for (const f of (c.findings||[])){ const k=f.split(':')[0].trim(); tally[k]=(tally[k]||0)+1; } }
console.log({ trusted:r.trusted, total:r.total, a11yFail, tally });
```
Para listar los tags con `a11y/name`: filtra `c.findings` que empiecen por `a11y/name`.

---

## 5. Reglas de trabajo del proyecto (memoria)
- **Decisión de política PRIMERO** en los puntos 🟠 (1.1/1.2/1.3): presenta opciones + recomendación y **espera el
  OK** antes de codear (igual que se hizo en C).
- **Reportar en VISUAL**: HTML (show_widget inline + `.html` en docs), NO Mermaid.
- **Tracker de fases**: actualizar `development-phases.html` (+ spec) en CADA avance, sin pedirlo (solo hanko; el
  consumer = «la librería consumidora», no metas hallazgos de shibui como ruido).
- **Bucle incremento→review**: al cerrar el incremento, `/code-review` sobre el diff y usar los hallazgos.
- **GitFlow ABSOLUTO**: rama `fix/**` (o `chore/**` para docs) desde `develop`; destino `develop`, nunca `main`;
  `--no-ff`; no borrar ramas sin confirmar. No iniciar trabajo nuevo sin haber mergeado #554 antes.
- Antes de tocar nada estructural, carga las tools `codegraph_*` (llegan deferred): `ToolSearch "codegraph"`.
- Junctions Windows: quitar con `cmd /c rmdir`/PS guardando por `LinkType`, **nunca `rm -rf`**.
