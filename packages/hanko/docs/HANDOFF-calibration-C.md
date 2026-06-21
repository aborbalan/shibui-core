# Handoff · Calibración C (a11y v0) + estado restante

> **Para una sesión nueva, en frío.** hanko (`packages/hanko`, `@shibui-ui/hanko`) es un motor de
> verificación de confianza manifest-driven para Web Components. Dogfood = shibui-ui (~102 componentes).
> Stack: pnpm workspaces, TS estricto, vitest (node + `@vitest/browser`/Playwright), tsx.
> GitFlow del repo: ramas desde `develop`, merge `--no-ff`, **nunca a `main` directo**, PR a `develop`.

---

## 0. TL;DR — dónde estamos

El Trust Report real sobre shibui da **102 componentes · 38 sellados · 64 «sin sello»**. Las
calibraciones hanko-side ya hechas y mergeadas (o en vuelo) a `develop`:

| # | Calibración | PR | Efecto |
|---|---|---|---|
| 1 | **Lit async** (`observeRuntime` espera `updateComplete`) + **privados `_` fuera de la ingestión** | #546 (merged) | quitó el falso `contract/reflect` masivo + `contract/method` 42→0 |
| 3 | **Resiliencia async/throw-aware** (`observeResilience` espera `updateComplete`) | #549 (merged) | capta 2 crashers de `junk-attrs` |
| A | **Resiliencia: captura COMPLETA por trial** (listener de `window` + tick) | #551 (merged) | capta crashes a nivel ventana |
| **D** | **Sentinel de reflexión TIPADO + red de captura** | **#552 (→ develop)** | **pageerror 24→1 · contract/reflect 71→31 · sellados 36→38** |

> **D (sentinel tipado) = RESUELTA.** 3 capas en `src/harness/probe.ts`: (1) `typedSentinel` infiere por
> runtime (`typeof`/`Array.isArray`); (2) `chooseSentinel` usa el tipo del CEM (`PropTypeHint {kind, literals}`
> que el runner inyecta por tag) para enums = primer literal válido; (3) `observeRuntime` envuelve su fase
> montada absorbiendo a `window` los crashes que el propio sondeo provoca (artefacto del sondeo, no fallo de
> contrato). Ver `docs/specs/harness.md §Calibración`.

### Lo que queda (por prioridad)

- **C — a11y v0 (ESTA sesión).** El único lever hanko-side restante. **Necesita una DECISIÓN de política tuya
  antes de tocar código** (ver §1).
- **B — slot `"—"` = NO es de hanko (ya diagnosticado, NO repetir).** El CEM de shibui registra slots llamados
  `"—"` porque 13 componentes usan `@slot —` (EM-DASH) en vez de `@slot -` (guion ASCII) → el analizador toma el
  em-dash como NOMBRE del slot. El output de hanko es UTF-8 limpio y con `<meta charset>` (el `â€"` que se vio era
  visual). **Fix = consumer-side (shibui):** cambiar `—`→`-` en esos 13 JSDoc + regenerar el CEM → quita ~13
  falsos `contract/slot`. Ya hay un **chip de tarea spawneado** para ello. NO es trabajo de hanko.
- **Drift del CEM de shibui (NO es de hanko):** `contract/property` 108 (domina: fantasmas kebab — doble miembro
  `showLegend` + `show-legend` por prop) y los `reflects:true` espurios de los charts. Arreglo en la generación
  del CEM de shibui, no en hanko.

---

## 1. Calibración C — a11y v0 · **DECISIÓN DE POLÍTICA PRIMERO, luego código**

### El dato duro
De los 64 «sin sello», **29 fallan a11y y los 29 son el MISMO hallazgo: `a11y/name`** (regla `name`, impacto
`serious`, mensaje *«el elemento interactivo carece de nombre accesible»*). **NO vienen de axe** — vienen de la
política de hanko sobre elementos interactivos. axe corre y sus violaciones son aparte (no dominan).

### Por qué saltan los 29
La cadena (todo en `src/harness/probe.ts` + `src/checks/a11y.ts`):
1. `observeA11y(tag, runAxe)` monta el elemento **VACÍO** (sin contenido en slots, sin props de texto) y rellena
   `A11yObservation`.
2. `isInteractive(el)` (heurística v0): `tabIndex>=0` **o** `role` interactivo **o** el shadow root contiene
   `button,a[href],input,select,textarea,[tabindex]`. → muchos componentes de shibui dan `interactive: true`.
3. `hasAccessibleName(el)` (heurística v0): `aria-label` **o** `aria-labelledby` **o** `textContent.trim() !== ''`.
   Montado **vacío**, el `textContent` está vacío y no hay `aria-label` → `hasAccessibleName: false`.
4. `a11yCheck` (`checks/a11y.ts:113-126`): si `interactive === true` y `hasAccessibleName === false` →
   **violación `serious` `name`** → no sella.

→ El nombre accesible de esos componentes vendría del **contenido que pone el consumidor** (texto en el slot por
defecto, o una prop `label`/`aria-label`). Montados vacíos por el harness, no lo tienen. **Parte es señal real**
(un componente interactivo sin NINGÚN mecanismo de nombre SÍ es inaccesible) y **parte es ruido del montaje vacío**
(el nombre es *aportable* por el consumidor y el harness simplemente no lo aportó).

### ⚠️ Trampa conocida (NO repetir el error de #549)
En #549 se **revirtió a propósito** un `await updateComplete` dentro de `observeA11y`: lo añadía subía a11y de
**29 → 37** (más estricto, *«sin pagar»* — más fallos sin ganar señal). Conclusión de entonces: no metas
estricteza en a11y sin que compre señal real. `observeA11y` hoy **NO** espera `updateComplete` a propósito.
`focusVisible` **nunca se observa** (queda `undefined` → la regla `focus` se omite, no falla); `keyboardReachable`
se aproxima como `tabIndex>=0 || shadowRoot!==null`.

### La decisión que necesito de ti (elige la política para `a11y/name` con montaje vacío)
- **(a) Sembrar un nombre antes del check** — el harness, para componentes con mecanismo de nombre aportable
  (prop `label`/`aria-label`, o slot por defecto), siembra contenido/label mínimo y RE-evalúa → solo quedan como
  violación los que NO tienen forma de nombrarse. Encoge los 29 a la señal real. (Análogo al `valid-min` que se
  difirió en resiliencia; aquí sí podría pagar porque el nombre es la señal a11y central.)
- **(b) Omitir (regla de oro) cuando el nombre es aportable** — si el componente declara una prop de nombre o un
  slot por defecto, `name` pasa a `skipped` (no verificable sin contenido), no a violación. Más barato que (a),
  pero no verifica nada para esos.
- **(c) Aceptar los 29 como reales** — un interactivo sin nombre en su estado por defecto ES inaccesible; no se
  calibra nada y esos 29 no sellan a11y hasta que shibui les dé un nombre por defecto. (Cierra C como «no hay
  ruido que quitar, es deuda de shibui».)

Mi lectura: **(a)** es la que de verdad separa señal de ruido y mueve el número de forma honesta, pero es la más
cara y roza otra vez «sembrar datos» (que en resiliencia no pagó). **(b)** es el término medio barato y alineado
con la regla de oro de hanko (*ausencia ≠ incumplimiento*: sin contenido no es verificable). Pide criterio antes
de codear.

### Plan según la decisión
- Si **(b)**: en `observeA11y`/`a11yCheck`, cuando el elemento es interactivo pero el nombre es *aportable* (heurística:
  el componente tiene una prop cuyo nombre sugiere etiqueta — `label`/`text`/`ariaLabel` — o expone un `<slot>` por
  defecto), marcar `name` como no observado → `skipped`, no violación. Medir el efecto en sellados.
- Si **(a)**: añadir al harness una siembra mínima de nombre (texto en el slot por defecto y/o set de la prop de
  etiqueta) antes de `runAxe`/lectura de nombre; re-medir. Cuidado: que la siembra no enmascare violaciones reales
  (un componente que ignora su prop `label` debe seguir fallando).
- Si **(c)**: documentar y cerrar C; los 29 son deuda de shibui (añadir nombres por defecto o documentar el
  requisito de nombre en el consumidor).

### Heurísticas v0 a revisar de paso (`src/harness/probe.ts`)
- `isInteractive` (líneas ~184-190): ¿sobre-detecta? (cualquier `[tabindex]` o `button` en el shadow lo marca
  interactivo, aunque el componente no sea un control). Calibrar contra falsos interactivos.
- `hasAccessibleName` (líneas ~193-198): solo aria-label/labelledby/textContent. No mira `title`, `alt`, ni el
  `aria-label` de un control INTERNO del shadow (un `<button aria-label>` dentro). Posible falso negativo.
- `focusVisible`: sin observar (v0). Requiere foco real + comprobar el anillo; difícil y caro. Probablemente dejar
  diferido salvo que la decisión sea ir a por a11y a fondo.

### Criterio de éxito de C
Que los `a11y/name` bajen a la **señal real** (los componentes genuinamente sin forma de nombrarse) sin
introducir falsos negativos; sellados estable o al alza; sin volver a meter estricteza que «no compra señal»
(lección de #549). Documentar la política elegida en `docs/specs/checks-a11y.md` + `harness.md §Calibración`.

---

## 2. Entorno (Windows del usuario) — LÉELO, ahorra horas

- **El worktree NO tiene `node_modules`** (`pnpm install` se cuelga en Windows). Para ejecutar CUALQUIER cosa,
  crea junctions desde el repo principal (`<MAIN>` = `D:\PROYECTOS\shibui-ecosystem`; `<WT>` = tu worktree):
  ```powershell
  cmd /c mklink /J "<WT>\node_modules" "<MAIN>\node_modules"
  cmd /c mklink /J "<WT>\packages\hanko\node_modules" "<MAIN>\packages\hanko\node_modules"
  cmd /c mklink /J "<WT>\packages\shibui-ui\node_modules" "<MAIN>\packages\shibui-ui\node_modules"
  cmd /c mklink /J "<WT>\packages\shibui-ui\dist" "<MAIN>\packages\shibui-ui\dist"   # dist + CEM para el dogfood
  ```
  **Quítalos al acabar** con `cmd /c rmdir "<ruta>"` (o PowerShell guardando por `LinkType`); **NUNCA `rm -rf`**
  (atravesaría el junction y borraría el target real). Tras quitarlos, verifica que `<MAIN>\node_modules` sigue ahí.
- **Binarios** desde `<WT>\packages\hanko\node_modules\.bin\{tsc,vitest,tsx}.CMD`.
- **EDITA EL WORKTREE CORRECTO** (rutas absolutas dentro del worktree). El dogfood importa el `src` del worktree:
  si editas el repo principal por error, la sonda usa el código sin editar.
- **Commits CON hooks** (no `--no-verify`): con los junctions, el pre-commit (`@shibui-ui/ui type-check`) pasa.
- `git fetch`/`push`/`gh pr create` funcionan. **El ref local `develop` suele estar rancio → ramea de `origin/develop`
  tras `git fetch`.**
- `hanko-report/` está **gitignored**.

### Verificación (con junctions puestos), desde `<WT>\packages\hanko`
```powershell
$H="<WT>\packages\hanko"
& "$H\node_modules\.bin\tsc.CMD" --noEmit -p "$H\tsconfig.json"                 # type-check (cubre solo src/)
& "$H\node_modules\.bin\vitest.CMD" run                                          # node (78 tests)
& "$H\node_modules\.bin\vitest.CMD" run --config vitest.browser.config.ts        # browser (Playwright, 15 tests)
& "$H\node_modules\.bin\tsx.CMD" dogfood/probe-shibui.ts                          # → hanko-report/observations.json
& "$H\node_modules\.bin\tsx.CMD" src/report/run.ts                               # → index.html + trust-report.json + report-full.html
```
> `tsconfig.json` solo incluye `src/**`; **`dogfood/` NO entra en el type-check** (ni en CI). Si tocas el puente,
> valida aparte con un tsconfig temporal que incluya `dogfood/**` + `src/**` (mismas opciones estrictas).
>
> Para AISLAR el origen de un diagnóstico: edita temporalmente `dogfood/browser-glue.ts` (`observe()`) para correr
> solo la observación que investigas (p.ej. solo `observeA11y`), corre el probe, **restaura el fichero**.

### Métricas rápidas del Trust Report (node)
```js
// node metrics.cjs <ruta-absoluta>/hanko-report/trust-report.json   (usa RUTA ABSOLUTA: require() resuelve relativo al script)
const r = require(process.argv[2]);
let a11yFail=0; const tally={};
for (const c of r.components) {
  for (const l of (c.layers||[])) if (l.layer==='a11y' && l.status==='fail') a11yFail++;
  for (const f of (c.findings||[])) { const k=f.split(':')[0].trim(); tally[k]=(tally[k]||0)+1; }
}
console.log({ trusted:r.trusted, total:r.total, a11yFail, tally });
```

---

## 3. Mapa de ficheros (a11y)
- `src/checks/a11y.ts` — política PURA (node-testable): `a11yCheck(obs, {failOn?})`. Regla `name` salta en
  `interactive===true && hasAccessibleName===false`. Códigos de hallazgo: `axe:<id>` · `keyboard` · `focus` · `name`.
- `src/harness/probe.ts` — el mecanismo browser: `observeA11y(tag, runAxe)` · `isInteractive` · `hasAccessibleName`
  (heurísticas v0, el objetivo de C). axe se INYECTA (no se importa en el harness).
- `src/core/contract.ts` — `ComponentContract` (props/slots declarados → útil si la política (a)/(b) mira si el
  nombre es «aportable» por una prop `label`/slot por defecto).
- `dogfood/{probe-shibui.ts, browser-glue.ts}` — puente node→browser (único punto que importa shibui, fuera de `src/`).
- `src/genericity.test.ts` — guard ejecutable: el core NO importa shibui/Lit. Respétalo (un `import type` de
  `core/*` dentro de hanko es legal; importar `@shibui-ui/ui` o trepar a `shibui-ui/` NO).
- Specs: `docs/specs/checks-a11y.md` · `harness.md §Calibración` (estado vivo) · `docs/phases/development-phases.html`
  (tracker — actualizar al cerrar el incremento).

---

## 4. Reglas de trabajo del proyecto (memoria)
- **Reportar en VISUAL**: HTML (show_widget inline + `.html` en docs), NO Mermaid.
- **Tracker de fases**: actualizar `development-phases.html` (+ spec) en CADA avance, sin pedirlo (solo hanko; el
  consumer = «la librería consumidora», no metas hallazgos de shibui como ruido).
- **Bucle incremento→review**: al cerrar un incremento, `/code-review` sobre el diff y planificar el siguiente.
- **GitFlow ABSOLUTO**: destino `develop`, nunca `main`; `--no-ff`; no borrar ramas sin confirmar. No iniciar una
  feature nueva sin haber mergeado la anterior a `develop`.
- Antes de tocar nada estructural, carga las tools `codegraph_*` (llegan deferred): `ToolSearch "codegraph"`.
