# Fases de desarrollo — hanko

> 🖼️ **Vista visual:** [`development-phases.html`](development-phases.html) — timeline de los 3 hitos y las 8 fases.

Plan de obra en **8 fases** agrupadas en **3 hitos**. Cada fase tiene criterio de cierre propio y solo se
aborda cuando la anterior está estable. Este documento está pensado para **retomarse en cualquier sesión**:
define cada fase con detalle suficiente para continuar en frío.

---

## ▶ Cómo retomar este proyecto en una sesión nueva

**Estado a 2026-06-22:** Hito 1 **cerrado** — F0·F1·F2 en `develop` y `main` (PR #502 → #510); `hanko-seal`
selló 102/102 (report-only). **Hito 2 (capas de verificación) CERRADO: F3·F4·F5 ✅ TERMINADAS** — los tres
motores puros (incr. 1) + el harness de runtime (incr. 2, `src/harness/probe.ts`, Playwright/axe) + sus
calibraciones, **validados ejecutando el dogfood** sobre los ~102 componentes de shibui. Las tres capas emiten
señal honesta (Trust Report: 102 · **48 sellados** medidos fresco el 2026-06-22); el sin-sello restante es
**drift del CEM de shibui**, no falsos positivos de hanko. **Hito 3: F6 (Trust Report + gate) TERMINADA** — gate
duro de CI en dos carriles desacoplados (correctitud de hanko + regresión sobre baseline,
[ADR-003](../decisions/adr-003-gate-regresion.md)). **F7 (publicación npm) diferida.** Prerrequisito vivo del
gate: incluir `@shibui-ui/hanko` en `pnpm-lock.yaml` (regenerar en el principal + commitear).

**Orden de lectura recomendado:**
1. Memoria `project_hanko.md` (se autocarga) — contexto y decisiones vivas.
2. [`../../README.md`](../../README.md) — qué es hanko, tesis y principios de arquitectura.
3. **Este documento** — plan completo y definición de cada fase.
4. La spec de la fase actual en [`../specs/`](../specs/) (p.ej. `ingest.md` para F1).
5. Las decisiones en [`../decisions/`](../decisions/) (ADR-001 validación, ADR-002 testing).

**Reglas del flujo de trabajo (críticas para no tropezar):**
- **Worktree sin `node_modules`** (`pnpm install` cuelga en Windows). Para ejecutar desde el worktree, montar
  **junctions** del repo principal (`node_modules` ×3 + `dist` de shibui) y correr los binarios de
  `node_modules/.bin/{tsc,vitest,tsx}.CMD`. Quitarlos al acabar por `LinkType -eq 'Junction'` con `cmd /c rmdir`,
  **nunca `rm -rf`** (atraviesa el junction y borra el target).
  **Trampa:** el dogfood mide el árbol DESDE donde se ejecuta + la `dist` de shibui junctioneada → ejecútalo
  **siempre desde el worktree** y verifica que el principal no esté en una rama ajena.
- **Commits con hooks** (con los junctions, el pre-commit `@shibui-ui/ui type-check` pasa). Conventional Commits.
- **GitFlow:** ya **reconciliado**. F0 fue directo a `main` (PR #502), pero después se alineó `develop`
  (PR #503) y se sincronizó `develop ↔ main` (PR #504 + back-merge). A partir de aquí, **cada fase = rama
  `feature/hanko-*` desde `develop`** y PR a `develop` (flujo correcto).

**Próximo paso accionable:** **regenerar `pnpm-lock.yaml`** incluyendo `@shibui-ui/hanko` (en el repo principal:
`pnpm install` + commit) para que los jobs de hanko resuelvan `pnpm install --frozen-lockfile` en CI — es el
prerrequisito para que el gate de F6 sea efectivo. Después, **F7 (publicación npm)**: desacople final + build
publicable + release (diferida a propósito; quitar `private: true`).

---

## Resumen

| Hito | Fases | Foco |
|---|---|---|
| **1 · Cimientos e ingestión** | F0 · F1 · F2 | Esqueleto, modelo, lectura de manifest, primer sello a escala real |
| **2 · Capas de verificación** | F3 · F4 · F5 | Contrato, accesibilidad y resiliencia |
| **3 · Reporte y desacople** | F6 · F7 | Trust Report + gates CI, publicación npm (diferida) |

Esfuerzo F0–F6 ≈ **12–16 días**. Primera tanda acordada = **F0 + F1 + F2** (el primer sello valida la tesis).

---

## Definición por fase

> Formato: **Objetivo · Entregables · Criterios de aceptación · Dependencias · Estado**.
> Las fases ya abordadas enlazan su spec/decisiones; las futuras están definidas a nivel de resumibilidad
> (suficiente para retomar), no especuladas en detalle de implementación.

### F0 · Cimientos + modelo de datos — ✅ mergeado a `main` (PR #502)
- **Objetivo:** esqueleto del paquete, tooling de test desde 0 y el modelo de datos del contrato (forma
  normalizada interna que consumen todos los checks).
- **Entregables:** `src/core/contract.ts` · spec [`data-model.md`](../specs/data-model.md) · `tsconfig` estricto ·
  Vitest ([ADR-002](../decisions/adr-002-estrategia-testing.md)) + primer test · [ADR-001](../decisions/adr-001-baseline-minima-viable.md).
- **Criterios:** tipos compilan; semántica `undefined` vs `[]` expresable; `TypeModel` con `raw` lossless +
  fallback `unknown`; `ContractSource` cubre `cem|adapter|inferred`; `inheritedFrom` distingue propias/heredadas.
- **Dependencias:** ninguna.
- **Estado:** ✅ completa y mergeada.

### F1 · Ingestión del manifest — ✅ mergeado (develop + main)
- **Objetivo:** convertir un CEM ya parseado en `ContractSet`. Definir el **borde de ingestión** (donde luego
  enchufarán adapters de formatos custom).
- **Entregables:** `src/ingest/` (`ingestCem`, `parseType`, `cem-types.ts`) · spec [`ingest.md`](../specs/ingest.md) · tests.
- **Criterios:** filtra a custom elements con `tagName`; mapea props públicas (excl. privadas/métodos); respeta
  `reflect`/`attribute`/`default` raw/`inheritedFrom`; preserva presencia (ausente → `undefined`); `parseType`
  resuelve primitivos + uniones de literales y degrada a `unknown` con `raw` intacto.
- **Dependencias:** F0.
- **Estado:** ✅ mergeado a `develop` (PR #503) y `main` (PR #504).

### F2 · Smoke · primer sello — ✅ hecho · ★ valida la tesis
- **Objetivo:** primer flujo end-to-end *manifest → verificación → sello* sobre componentes reales de shibui-ui
  (10 → 99). Responder: ¿el modelo funciona a escala real?
- **Entregables:** check **Floor** (`src/checks/floor.ts`: tagName de custom element válido) · motor
  `smoke()` (`src/smoke/smoke.ts`: ingestión + Floor + **cobertura** por componente) · spec
  [`smoke.md`](../specs/smoke.md) · tests. **Pendiente:** runner que lea el CEM real de shibui-ui.
- **Criterios:** se emite sello para N componentes reales sin caídas; el Floor distingue pasa/no-pasa; queda
  demostrado que el flujo escala de 10 a 99.
- **Dependencias:** F1 · acceso al CEM real de shibui-ui (`packages/shibui-ui/dist/custom-elements.json`).
- **Estado:** ✅ **TERMINADA**. Floor + smoke + runner `src/smoke/run.ts`; el job CI `hanko-seal` evolucionó en
  F6 de report-only a **gate de regresión Floor** (ver F6). **Prerrequisito CI vivo:** `@shibui-ui/hanko` en
  `pnpm-lock.yaml` (`pnpm install` + commit en el principal).

### F3 · Contrato — ✅ hecho
- **Objetivo:** verificar lo declarado (props/atributos/métodos/reflect) contra el **runtime** del elemento vivo.
  Se **pueblan los `methods`** (deferidos desde F0) y se introduce el **nivel browser** de test
  (`@vitest/browser`, ver ADR-002) en el incremento 2.
- **Entregables:** motor `contractCheck` (`src/checks/contract.ts`) + límite `ComponentRuntime`
  (`src/core/runtime.ts`) · niveles Conformance/Strict + registrabilidad runtime · spec
  [`checks-contract.md`](../specs/checks-contract.md) · tests. **Incremento 2 (escrito, pend. validar):** harness
  `src/harness/` que observa elementos vivos y corre el check sobre shibui-ui real; eventos y slots.
- **Criterios:** detecta drift declarado↔runtime; respeta *ausencia ≠ incumplimiento* en ambos sentidos;
  Strict opt-in exige completitud; cobertura (`checked`/`skipped`) transparente.
- **Dependencias:** F2 · (incr. 2) entorno de navegador (custom elements + Shadow DOM).
- **Estado:** ✅ **TERMINADA**. Motor (incr. 1) + harness `observeRuntime` (incr. 2) + calibraciones D y
  **F3-cierre** (reflexión sin falsos negativos + reflexión inconclusa), **validada ejecutando el dogfood** sobre
  los ~102 componentes de shibui (`contract/reflect` 31 → 1; el sin-sello restante es drift del CEM de shibui).

### F4 · Accesibilidad (a11y) — ✅ hecho
- **Objetivo:** verificación **universal** de a11y (no lee el contrato): axe + teclado + foco + nombre accesible.
- **Entregables:** motor de política `a11yCheck` (`src/checks/a11y.ts`) + observación `A11yObservation` ·
  umbral de severidad (`failOn`) + checks de teclado/foco/nombre exigidos a interactivos · spec
  [`checks-a11y.md`](../specs/checks-a11y.md) · tests. **Incremento 2 (escrito, pend. validar):** harness
  `src/harness/` con `axe-core` inyectado que renderiza y sondea cada componente real.
- **Criterios:** violaciones axe `>= failOn` fallan; interactivos exigen teclado/foco/nombre; lo no observado se
  omite (cobertura transparente vía `checked`/`skipped`).
- **Dependencias:** F3 (entorno browser; el incr. 1 de F4 es independiente en código).
- **Estado:** ✅ **TERMINADA**. Motor (incr. 1) + harness `observeA11y` (incr. 2) + calibraciones C y F4-cierre
  (nombre aportable, teclado real, landmarks, foco diferido), validada sobre shibui (PR #554/#555).

### F5 · Resiliencia — ✅ hecho
- **Objetivo:** el componente no se rompe ante entradas adversas: props basura/vacías, SSR, RTL. **Universal**
  (no lee el contrato, como a11y).
- **Entregables:** motor de política `resilienceCheck` (`src/checks/resilience.ts`) + observación
  `ResilienceObservation` · escenarios obligatorios vs tolerables (`optional`) · spec
  [`checks-resilience.md`](../specs/checks-resilience.md) · tests. **Incremento 2 (escrito):** parte del harness
  compartido — montar bajo escenarios adversos.
- **Criterios:** un escenario obligatorio roto → violación; tolerable roto → warning; lo no probado se omite.
- **Dependencias:** F3 (entorno browser; el incr. 1 es independiente en código).
- **Estado:** ✅ **TERMINADA**. Motor (incr. 1) + harness `observeResilience` (incr. 2) + calibración **F5-cierre**
  (`remount` obligatorio y honesto — solo el 2º montaje; `empty`/`junk-attrs`/`rtl` tolerables; `valid-min`
  diferido a vNext), validada sobre shibui. La capa deja de ser verde-por-construcción (gate real, 0 fallos reales).

### F6 · Trust Report + gates de CI — ✅ hecho
- **Objetivo:** consolidar resultados en un **Trust Report** (JSON + HTML) que declara **procedencia** y
  **cobertura** del sello, e integrarlo como **gate** de CI.
- **Entregables:** generador de report (`src/report/`: `trust-report.ts` agregador puro + `render.ts` JSON/HTML +
  `run.ts` runner); puente en 2 etapas (`dogfood/probe-shibui.ts` → `observations.json` → `run.ts`) + deploy a
  `hanko-report.web.app`; emisor de issues opt-in (`github-issues.ts`); **gate** (`gate.ts` + `gate-run.ts` +
  `dogfood/baseline*.json`); specs [`trust-report.md`](../specs/trust-report.md) · [`github-issues.md`](../specs/github-issues.md) ·
  [ADR-003](../decisions/adr-003-gate-regresion.md); integración en `ci-lib.yml`.
- **Criterios:** el report comunica qué se verificó y qué se omitió; el gate **falla el build ante una regresión**
  sin castigar el drift preexistente del consumer; tres fuerzas de sello visibles según procedencia.
- **Dependencias:** F3–F5.
- **Estado:** ✅ **TERMINADA**. incr. 1 (agregador puro) + incr. 2 (puente 4 capas + deploy) + incr. 3 (issues
  opt-in) + **gate duro en dos carriles** (correctitud de hanko `hanko-test`; regresión sobre baseline:
  Floor en PR / 4 capas en main). Suelo medido 2026-06-22: Floor 102/102 · 4 capas 48/102. **Prerrequisito vivo:**
  `@shibui-ui/hanko` en `pnpm-lock.yaml` antes de que el gate sea efectivo.

### F7 · Desacople + publicación npm — ⬜ diferida
- **Objetivo:** garantizar que el `core` no depende de shibui y publicar `@shibui-ui/hanko` como paquete independiente.
- **Entregables (previstos):** verificación de genericidad del core; build publicable; release npm.
- **Criterios:** el core no importa nada de shibui; el paquete se instala y usa en un proyecto externo.
- **Dependencias:** F6 · validación del uso local. **Diferida** a propósito.
- **Estado:** ⬜.

---

## Tabla de estado

| Fase | Estado |
|---|---|
| F0 | ✅ mergeado (develop + main) |
| F1 | ✅ mergeado (develop + main) |
| F2 | ✅ mergeado (develop + main) — Floor + `smoke` + runner + job CI `hanko-seal` (102/102) |
| F3 | ✅ **hecho** — motor + harness + calibraciones D/F3-cierre; validada en dogfood (`reflect` 31→1) |
| F4 | ✅ **hecho** — motor + harness + calibraciones C/F4-cierre; validada en dogfood (#554/#555) |
| F5 | ✅ **hecho** — motor + harness + calibración F5-cierre (`remount` obligatorio honesto); validada en dogfood |
| F6 | ✅ **hecho** — Trust Report (puro + puente 4 capas + deploy + issues) + **gate duro** (`hanko-test` + regresión Floor/4-capas, ADR-003); suelo 102 Floor · 48 sellados. Prerrequisito: lockfile con hanko |
| F7 | ⬜ diferida — desacople final + publicación npm |

> Caso especial fuera de este plan (componentes sin manifest / formato custom): ver
> [`../special-cases/manifest-ausente-o-custom.html`](../special-cases/manifest-ausente-o-custom.html). Decisión **abierta**.
