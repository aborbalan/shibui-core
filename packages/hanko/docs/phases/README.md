# Fases de desarrollo — hanko

> 🖼️ **Vista visual:** [`development-phases.html`](development-phases.html) — timeline de los 3 hitos y las 8 fases.

Plan de obra en **8 fases** agrupadas en **3 hitos**. Cada fase tiene criterio de cierre propio y solo se
aborda cuando la anterior está estable. Este documento está pensado para **retomarse en cualquier sesión**:
define cada fase con detalle suficiente para continuar en frío.

---

## ▶ Cómo retomar este proyecto en una sesión nueva

**Estado a 2026-06-16:** Hito 1 **cerrado** — F0·F1·F2 en `develop` y `main` (PR #502 → #510); `hanko-seal`
selló 102/102 (report-only). **Hito 2 a fondo: F3·F4·F5 en curso** — los tres motores puros (incr. 1) hechos en
ramas apiladas `feature/hanko-contract` → `feature/hanko-a11y` → `feature/hanko-resilience`. El **harness de
runtime (incr. 2, `src/harness/`)** que cierra los tres está **escrito pero pendiente de validar en navegador**
(deps `@vitest/browser`/`axe-core`/Playwright + build de shibui). Ninguna rama mergeada aún.

**Orden de lectura recomendado:**
1. Memoria `project_hanko.md` (se autocarga) — contexto y decisiones vivas.
2. [`../../README.md`](../../README.md) — qué es hanko, tesis y principios de arquitectura.
3. **Este documento** — plan completo y definición de cada fase.
4. La spec de la fase actual en [`../specs/`](../specs/) (p.ej. `ingest.md` para F1).
5. Las decisiones en [`../decisions/`](../decisions/) (ADR-001 validación, ADR-002 testing).

**Reglas del flujo de trabajo (críticas para no tropezar):**
- **Worktree sin `node_modules`.** Se trabaja en `.claude/worktrees/…`; ahí `pnpm install` cuelga en Windows.
  → **No se pueden ejecutar `tsc`/`vitest` desde el worktree.** El código se escribe a ciegas para el tsconfig
  estricto (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`…) y **lo valida el usuario desde el repo principal**:
  ```bash
  git checkout <rama-actual> && pnpm install
  pnpm --filter @shibui-ui/hanko type-check
  pnpm --filter @shibui-ui/hanko test
  ```
- **Commits con `--no-verify`** — obligado, porque los hooks pre-commit (type-check/lint) y commit-msg
  (commitlint) necesitan `node_modules` que el worktree no tiene. No es saltarse calidad: los gates los corre
  el usuario. Mantener mensajes en formato Conventional Commits igualmente.
- **GitFlow:** ya **reconciliado**. F0 fue directo a `main` (PR #502), pero después se alineó `develop`
  (PR #503) y se sincronizó `develop ↔ main` (PR #504 + back-merge). A partir de aquí, **cada fase = rama
  `feature/hanko-*` desde `develop`** y PR a `develop` (flujo correcto).

**Próximo paso accionable:** **validar el harness (incr. 2) en navegador** desde el repo principal:
`pnpm install` (regenera el lockfile con las nuevas deps), `pnpm --filter @shibui-ui/hanko exec playwright
install chromium`, luego `pnpm --filter @shibui-ui/hanko test` (node) y `… test:browser`. Después, añadir el
dogfood sobre shibui real (snippet en [`../specs/harness.md`](../specs/harness.md)) y calibrar las heurísticas
v0 (reflect, interactividad, nombre accesible). Tras eso, **F6 (Trust Report)**.

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

### F2 · Smoke · primer sello — 🟡 en curso · ★ valida la tesis
- **Objetivo:** primer flujo end-to-end *manifest → verificación → sello* sobre componentes reales de shibui-ui
  (10 → 99). Responder: ¿el modelo funciona a escala real?
- **Entregables:** check **Floor** (`src/checks/floor.ts`: tagName de custom element válido) · motor
  `smoke()` (`src/smoke/smoke.ts`: ingestión + Floor + **cobertura** por componente) · spec
  [`smoke.md`](../specs/smoke.md) · tests. **Pendiente:** runner que lea el CEM real de shibui-ui.
- **Criterios:** se emite sello para N componentes reales sin caídas; el Floor distingue pasa/no-pasa; queda
  demostrado que el flujo escala de 10 a 99.
- **Dependencias:** F1 · acceso al CEM real de shibui-ui (`packages/shibui-ui/dist/custom-elements.json`).
- **Estado:** 🟡 incrementos 1+2 hechos (Floor + smoke + runner `src/smoke/run.ts` + job CI `hanko-seal`
  report-only). **Bloqueante para CI:** regenerar `pnpm-lock.yaml` para incluir hanko (`pnpm install` + commit).

### F3 · Contrato — 🟡 en curso (incremento 1)
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
- **Estado:** 🟡 incremento 1 hecho (motor puro, node-testable) en `feature/hanko-contract`; harness incr. 2 escrito.

### F4 · Accesibilidad (a11y) — 🟡 en curso (incremento 1)
- **Objetivo:** verificación **universal** de a11y (no lee el contrato): axe + teclado + foco + nombre accesible.
- **Entregables:** motor de política `a11yCheck` (`src/checks/a11y.ts`) + observación `A11yObservation` ·
  umbral de severidad (`failOn`) + checks de teclado/foco/nombre exigidos a interactivos · spec
  [`checks-a11y.md`](../specs/checks-a11y.md) · tests. **Incremento 2 (escrito, pend. validar):** harness
  `src/harness/` con `axe-core` inyectado que renderiza y sondea cada componente real.
- **Criterios:** violaciones axe `>= failOn` fallan; interactivos exigen teclado/foco/nombre; lo no observado se
  omite (cobertura transparente vía `checked`/`skipped`).
- **Dependencias:** F3 (entorno browser; el incr. 1 de F4 es independiente en código).
- **Estado:** 🟡 incremento 1 hecho (motor puro, node-testable) en `feature/hanko-a11y`; falta incr. 2.

### F5 · Resiliencia — 🟡 en curso (incremento 1)
- **Objetivo:** el componente no se rompe ante entradas adversas: props basura/vacías, SSR, RTL. **Universal**
  (no lee el contrato, como a11y).
- **Entregables:** motor de política `resilienceCheck` (`src/checks/resilience.ts`) + observación
  `ResilienceObservation` · escenarios obligatorios vs tolerables (`optional`) · spec
  [`checks-resilience.md`](../specs/checks-resilience.md) · tests. **Incremento 2 (escrito):** parte del harness
  compartido — montar bajo escenarios adversos.
- **Criterios:** un escenario obligatorio roto → violación; tolerable roto → warning; lo no probado se omite.
- **Dependencias:** F3 (entorno browser; el incr. 1 es independiente en código).
- **Estado:** 🟡 incremento 1 hecho (motor puro) en `feature/hanko-resilience`; falta validar el harness.

### F6 · Trust Report + gates de CI — ⬜ no iniciada
- **Objetivo:** consolidar resultados en un **Trust Report** (JSON + HTML) que declara **procedencia** y
  **cobertura** del sello, e integrarlo como **gate** de CI.
- **Entregables (previstos):** generador de report (`src/report/`); spec `trust-report.md`; integración en el
  orchestrator de CI.
- **Criterios:** el report comunica qué se verificó y qué se omitió; el gate falla el build si un componente no
  cumple su nivel exigido; tres fuerzas de sello visibles según procedencia.
- **Dependencias:** F3–F5.
- **Estado:** ⬜.

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
| F3 | 🟡 en curso — `contractCheck` + `ComponentRuntime` (incr. 1); harness escrito, pend. validar (incr. 2) |
| F4 | 🟡 en curso — `a11yCheck` + `A11yObservation` (incr. 1); harness escrito, pend. validar (incr. 2) |
| F5 | 🟡 en curso — `resilienceCheck` + `ResilienceObservation` (incr. 1); harness escrito (incr. 2) |
| F6–F7 | ⬜ no iniciadas |

> Caso especial fuera de este plan (componentes sin manifest / formato custom): ver
> [`../special-cases/manifest-ausente-o-custom.html`](../special-cases/manifest-ausente-o-custom.html). Decisión **abierta**.
