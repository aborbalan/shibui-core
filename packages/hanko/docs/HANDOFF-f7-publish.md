# Handoff · Cerrar F7 (desacople + publicación npm) — la última fase

> **Para una sesión nueva, en frío.** hanko (`packages/hanko`, `@shibui-ui/hanko`) es un motor de verificación
> de confianza manifest-driven para Web Components. Dogfood = shibui-ui (~102 componentes). Stack: pnpm
> workspaces, TS estricto, vitest (node + `@vitest/browser`/Playwright), tsx/esbuild. GitFlow del repo: ramas
> desde `develop`, merge `--no-ff`, **nunca a `main` directo**, PR a `develop`.
>
> Este handoff es el **espejo de los de F6 (`HANDOFF-f6-gate.md`), F4 (`HANDOFF-a11y-finalize.md`) y F3/F5
> (`HANDOFF-f3-f5-finalize.md`)**, ya consumidos (#555/#558/#559). Mismo patrón: **decisiones de política
> PRIMERO**, luego cerrar. Para el método (medir, triar, `/code-review`, reconciliar trackers, junctions), lee el
> commit de F6 (`fe81117`, PR #559).

---

## 0. TL;DR — dónde estamos

**Hito 1 (F0·F1·F2) y Hito 2 (F3·F4·F5) cerrados. Hito 3: F6 (Trust Report + gate duro) TERMINADA** (PR #559,
`fix/hanko-f6-gate`→develop — confirma que está **MERGED** antes de empezar: `gh pr view 559`). El motor emite
sello honesto a 4 capas, hay gate duro de CI en dos carriles (ADR-003) y el lockfile ya incluye hanko.

**Queda SOLO F7 — la última fase.** Está **medio construida**: el *desacople verificable* y el *andamiaje
publicable* (incr. 1) están hechos; **falta el `npm publish` real** (el plan lo difirió a propósito hasta validar
el uso local — ya validado por el dogfood de F3–F6).

| Pieza de F7 | Estado |
|---|---|
| Desacople ejecutable (`src/genericity.test.ts`: el core nunca importa shibui; se autovalida) | ✅ #530 |
| Barrel público `src/index.ts` (reexporta core·ingest·checks·report·harness·smoke) | ✅ #530 |
| `tsconfig.build.json` (emite `dist/`: `.js`+`.d.ts`+maps, excluye tests) + script `build`/`prepublishOnly` | ✅ #530 |
| Metadata npm en `package.json` (`exports`/`types`/`files`/`sideEffects`/`publishConfig`/keywords/repo) | ✅ #530 |
| spec [`packaging.md`](specs/packaging.md) | ✅ #530 |
| **`npm publish` real** (quitar `private:true`, versionar, credenciales, pipeline) | ⬜ **= F7 que falta** |
| **Bundler / formato de emisión para Node-ESM** | ⬜ decisión abierta |
| **Validar el paquete en un proyecto EXTERNO** (criterio de aceptación del plan) | ⬜ |

**Pestillo de seguridad:** `package.json` mantiene `"private": true` y `"version": "0.0.0"` a propósito — para que
nadie publique por accidente. Quitarlos es el acto deliberado de F7.

> **⚠️ Antes de ramear:** confirma que **#559 está MERGED** a `develop` (`gh pr view 559`) y ramea de
> `origin/develop` actualizado (`git fetch` primero; el ref local suele estar rancio). F7 depende de que F6 esté
> en develop (el barrel/packaging viven ahí).

---

## 1. Qué falta para «terminada» — checklist + DECISIONES tuyas primero

Como en F3–F6, **necesito una decisión de política del usuario antes de tocar código** en los puntos 🟠.
Preséntalos con opciones + recomendación y espera el OK (`AskUserQuestion`, una pregunta por decisión).

### El nudo de fondo (léelo antes de las decisiones)

hanko es un **motor que corre en Node** (CLIs `smoke`/`report`/`gate`/`issues`, hoy vía `tsx`). Sus consumidores
naturales son **proyectos Node/CI** que verifican su propio design system. Eso condiciona el formato de emisión
(7.1) y la superficie (7.2). El **core publicable no tiene deps de runtime** (el `package.json` no declara
`dependencies`; axe-core/playwright son **devDeps** que solo usa el harness en navegador y el dogfood, ambos
inyectados/fuera del barrel — verificado: en `src/` solo el *test* `probe.browser.test.ts` importa axe-core, y los
tests no se emiten). Los runners `*-run.ts` (con `process.argv`/escritura a disco) **no** están en los barrels
(verificado), así que importar el paquete no dispara side-effects.

### 7.1 🟠 Formato de emisión / bundler
El build actual (`tsc -p tsconfig.build.json`, `moduleResolution: bundler`) emite imports **sin extensión** → sirve
a consumidores **con bundler** (Vite, el propio shibui), pero **Node-ESM puro exige `.js` explícitas**. Opciones:
- **(a) `tsup`** (esbuild) → emite ESM con extensiones correctas + `.d.ts`, opcional dual CJS/ESM, treeshake. La
  devDep esbuild ya está. **(recomendación si el target es Node)** — limpio para un tool de CI.
- **(b) `tsc` con `moduleResolution: NodeNext`** y escribir las extensiones `.js` en los imports del código fuente.
  Cero deps nuevas, pero toca todos los imports y es frágil de mantener.
- **(c) Dejar `tsc`/bundler como está** (solo consumidores con bundler). Más simple, pero NO instala-y-corre en un
  Node pelado → choca con el criterio de aceptación «se usa en un proyecto externo».

### 7.2 🟠 Superficie pública del paquete (barrel · subpaths · CLIs)
- **Cabo suelto de F6:** `src/report/gate.ts` (API `gateAgainstBaseline`/`reportCoverage`/`baselineFromReport`)
  **no se reexporta** en `src/report/index.ts` → no está en la superficie pública. Decidir si el gate es API
  pública (coherente con exponer `buildTrustReport`) → añadirlo al barrel. **(recomendación: exponerlo)**
- **`harness` en el barrel principal:** es **browser-only en uso**. Importar el paquete en Node es inofensivo (no
  hay ejecución top-level de DOM), pero un consumidor que solo quiere el motor puro carga código que no usará.
  Opciones: (a) dejarlo en el barrel (simple); (b) moverlo a un **subpath** `@shibui-ui/hanko/harness` (separa el
  núcleo Node del harness de navegador). **(recomendación: subpath si 7.1 apunta a Node)**.
- **CLIs:** ¿exponer `smoke`/`report`/`gate`/`issues` como `bin` del paquete (ejecutables tras instalar) o
  documentar `pnpm dlx`/scripts? **(recomendación: `bin` para `gate` y `report` — son el valor de un consumidor)**.

### 7.3 🟠 Pipeline de release
Hoy [`release.yml`](../../../.github/workflows/release.yml) publica **solo shibui-ui** (semantic-release con
`.config/.releaserc.json` → `npm publish --provenance` en `packages/shibui-ui`, token `secrets.NPM_SECRET`).
Opciones para hanko:
- **(a) Primer publish MANUAL** (`npm publish` una vez a mano, versión `0.1.0`) para validar el tarball end-to-end,
  y **luego** automatizar. **(recomendación: desbloquea sin tocar semantic-release de golpe)**
- **(b) Extender semantic-release a multi-paquete** (config/plugin monorepo) — release automático de hanko junto a
  shibui. Más completo, más riesgo de tocar el release ya estable de shibui.
- **(c) Job/workflow de release independiente para hanko** (su propia versión/tag). Aislado, pero duplica infra.

### 7.4 🟠 Versión y scope
- **Versión:** `0.0.0` → ¿`0.1.0` (señala API que aún puede moverse; **recomendación**) o `1.0.0`?
- **Scope `@shibui-ui`:** confirmar que la org/scope existe en npm y que el token `NPM_SECRET` tiene permiso de
  publish ahí (shibui-ui publica como `@shibui-ui/ui`; reutiliza ese scope + token). `publishConfig.access:public`
  ya está.

### 7.5 Validación en consumidor externo (criterio de aceptación, no es 🟠)
El plan exige «el paquete se instala y usa en un proyecto externo». Plan: `npm pack` → instalar el tarball en un
proyecto throwaway (fuera del monorepo) → `import { ingestCem, smoke, buildTrustReport } from '@shibui-ui/hanko'`
y correr un check sobre un CEM de muestra. Es la prueba de que el formato de emisión (7.1) y la superficie (7.2)
funcionan de verdad. **Hazlo ANTES de quitar `private`.**

### Criterio de «F7 terminada»
1. **Decisiones 7.1/7.2/7.3/7.4 cableadas** (formato de emisión, superficie, pipeline, versión/scope).
2. **`dist/` válido**: `pnpm build` emite un paquete importable; `npm pack` + instalación en proyecto externo
   funciona (7.5) — con el formato que diga 7.1.
3. **`private:true` quitado** y versión fijada — el acto deliberado, **solo tras** 7.5 verde.
4. **Publicado** (manual o CI según 7.3), con `--provenance --access public`.
5. **Genericidad intacta:** `genericity.test.ts` sigue verde (el core no importó shibui al empaquetar).
6. **Trackers/specs al día:** `packaging.md` (quitar la sección «diferido»), `phases/README.md` +
   `development-phases.html` (F7 = hecho; el `◐ Diferido` de F7 pasa a ✓). `/code-review` al cerrar.

> Lo que F7 **NO** incluye: histórico/badges del Trust Report (diferido a vNext, ADR-003) salvo que el usuario lo
> pida.

---

## 2. Trampas conocidas (NO repetir)
- **No publiques con `private:true`** (pestillo). Y **no quites `private` hasta que 7.5 (proyecto externo) pase** —
  publicar un tarball roto es difícil de retirar.
- **Emisión extensionless ≠ Node-ESM.** El `tsc`/bundler actual no instala-y-corre en Node pelado (7.1). Si no se
  resuelve, el criterio «proyecto externo» falla con `ERR_MODULE_NOT_FOUND`.
- **El barrel no debe arrastrar side-effects ni deps de navegador.** Hoy está limpio (runners fuera del barrel;
  axe/playwright solo en tests/dogfood). Si añades algo al barrel, vuelve a verificarlo.
- **`gate.ts` no está en el barrel** (cabo suelto de F6). Decídelo en 7.2; no lo dejes a medias.
- **El release de shibui-ui ya es estable.** Si tocas `release.yml`/semantic-release (7.3b), no rompas el publish
  de `@shibui-ui/ui`. La vía manual (7.3a) lo evita.
- **Lockfile:** ya incluye hanko (importer por **ruta** `packages/hanko:`, no por nombre — grep el path, no el
  nombre del paquete). `--frozen-lockfile` pasa. Si añades una dep de runtime, regenéralo (lo hace el usuario en el
  principal).
- **El árbol equivocado / rama ajena.** El repo PRINCIPAL puede estar en otra rama; trabaja y valida desde el
  worktree con junctions. Verifica `git -C <MAIN> branch --show-current`.
- **Specs/trackers rancios.** `packaging.md` y los trackers dicen «npm publish diferido» / `◐` — parte del cierre
  es ponerlos al día, no creértelos.

---

## 3. Mapa de ficheros
- `package.json` — `private:true` + `version:0.0.0` (pestillos) · `exports`/`main`/`module`/`types`→`dist/` ·
  `files:[dist,README.md]` · `sideEffects:false` · `publishConfig.access:public` · `build`/`prepublishOnly` ·
  devDeps (sin `dependencies` de runtime). **Aquí vive el acto de publicar.**
- `src/index.ts` — barrel público (reexporta core·ingest·checks·report·harness·smoke). 7.2 decide su forma.
- `src/report/index.ts` — barrel de report; **no exporta `gate.ts`** (cabo suelto 7.2).
- `tsconfig.build.json` — build de emisión (`tsc`, extends `tsconfig.json`, `moduleResolution:bundler`). 7.1 decide.
- `src/genericity.test.ts` — guard ejecutable del principio #1 (no debe romperse al empaquetar).
- `.github/workflows/release.yml` — release de shibui-ui (semantic-release + `npm publish --provenance`,
  `NPM_SECRET`). Plantilla/punto de extensión para 7.3.
- Specs: `docs/specs/packaging.md` (estado vivo · sección «diferido» a quitar) · `docs/decisions/` (ADR-001
  validación, ADR-002 testing, ADR-003 gate) — F7 quizá merezca un **ADR-004** (formato de emisión + pipeline).
- Trackers: `docs/phases/development-phases.html` + `docs/phases/README.md` (F7 → reconciliar a hecho).

---

## 4. Entorno (Windows del usuario) — LÉELO, ahorra horas
- **El worktree NO tiene `node_modules`** (`pnpm install` se cuelga en Windows). Para ejecutar cualquier cosa, crea
  junctions desde el repo principal (`<MAIN>` = `D:\PROYECTOS\shibui-ecosystem`; `<WT>` = tu worktree):
  ```powershell
  cmd /c mklink /J "<WT>\node_modules" "<MAIN>\node_modules"
  cmd /c mklink /J "<WT>\packages\hanko\node_modules" "<MAIN>\packages\hanko\node_modules"
  cmd /c mklink /J "<WT>\packages\shibui-ui\node_modules" "<MAIN>\packages\shibui-ui\node_modules"
  ```
  **Quítalos al acabar** detectando `LinkType -eq 'Junction'` con `cmd /c rmdir "<ruta>"`; **NUNCA `rm -rf`**
  (atraviesa el junction y borra el target real). Tras quitarlos, verifica que `<MAIN>\node_modules` sigue ahí.
- **Binarios** desde `<WT>\packages\hanko\node_modules\.bin\{tsc,vitest,tsx}.CMD`.
- **Commits CON hooks** (no `--no-verify`): con los junctions, el pre-commit (`@shibui-ui/ui type-check`) pasa.
- `git fetch`/`push`/`gh pr create` funcionan. **Ramea de `origin/develop` tras `git fetch`** (ref local rancio).
- **Validación F7 (con junctions), desde `<WT>\packages\hanko`:**
  ```powershell
  $H="<WT>\packages\hanko"
  & "$H\node_modules\.bin\tsc.CMD" --noEmit -p "$H\tsconfig.json"      # type-check
  & "$H\node_modules\.bin\vitest.CMD" run                              # node (incl. genericity.test.ts)
  pnpm --filter @shibui-ui/hanko build                                 # emite dist/ (según 7.1)
  cd "$H"; npm pack                                                    # tarball; instálalo en un proyecto externo (7.5)
  ```

---

## 5. Reglas de trabajo del proyecto (memoria)
- **Decisión de política PRIMERO** en los puntos 🟠 (7.1/7.2/7.3/7.4): opciones + recomendación y **espera el OK**
  antes de codear (igual que F3–F6).
- **Reportar en VISUAL**: HTML (show_widget inline + `.html` en docs), NO Mermaid.
- **Tracker de fases**: actualizar `development-phases.html` (+ `README.md` + spec) en CADA avance, sin pedirlo.
- **Bucle incremento→review**: al cerrar el incremento, `/code-review` sobre el diff y usar los hallazgos.
- **GitFlow ABSOLUTO**: rama `feat/**`/`fix/**` (o `chore/**` para docs) desde `develop`; destino `develop`, nunca
  `main`; `--no-ff`; no borrar ramas sin confirmar.
- Antes de tocar nada estructural, carga las tools `codegraph_*` (llegan deferred): `ToolSearch "codegraph"`.
- Junctions Windows: quitar guardando por `LinkType` con `cmd /c rmdir`, **nunca `rm -rf`**.
