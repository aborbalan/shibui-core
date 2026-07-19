# Draft: catálogo de tareas para un orquestador de agentes en shibui

**Estado:** Borrador / exploración — NO es una decisión ni un compromiso
**Fecha:** 2026-07-19
**Relacionado:** `docs/decisions/local-model-delegation.md` (delegación a modelo local — descartado)

---

## Propósito

Determinar **qué tareas concretas** justificarían construir un orquestador de agentes
(Opus 4.8 / Fable 5 como driver) para shibui, antes de escribir una línea de código.
El objetivo es evitar montar infraestructura "porque mola tener agentes" y aterrizar
en casos con ROI medible.

## Premisas de partida (de la discusión previa)

1. **El motor ya existe.** Orquestación multi-agente con subagentes, carga de context
   pack (`CLAUDE.md`, skills) y delegación ya la da Claude Code / el Claude Agent SDK.
   Lo que NO viene por defecto es un orquestador **embebido en el producto**, disparado
   **programáticamente** (evento, cron, endpoint) y **desatendido**.

2. **La calidad "específica" viene del contexto, no de la arquitectura.** Un motor
   parametrizable + un *context pack de shibui* rinde igual que uno hardcodeado. La
   especificidad se mete por system prompt / skills / tools curadas / rúbrica, no
   reescribiendo el loop.

3. **El único beneficio tangible es la automatización desatendida / programática** de
   tareas **recurrentes + bien especificadas + de volumen**. Fuera de eso, el ROI es
   negativo (coste de tokens, errores silenciosos, mantenimiento) y Claude Code
   interactivo ya cubre el trabajo ad-hoc.

## Herencia de `local-model-delegation.md` — objeciones que siguen vigentes

Aquel documento descartó delegar a Gemma 12B. Con un modelo frontier la objeción #2
(falta de juicio sobre el design system) se relaja, pero **dos objeciones se mantienen
y deben filtrar este catálogo**:

- **Objeción #1 — si es verificable por `grep`, no necesita un LLM.** Los checks binarios
  (`@layer` en línea 1, 6 exports Katachi, `declare global` presente) son más fiables y
  baratos como script Bash. Un agente aquí solo añade latencia y un vector de error.
  → Estas tareas se marcan **"script, no agente"** más abajo.

- **Objeción #3 — la capa de invocación no existe.** Antes de bulk, hay que validar el
  wrapper (encoding de ficheros TS reales) y hacer **evaluación empírica sobre 5-10
  ficheros reales contra ground truth**. Esto aplica igual a un orquestador frontier.

**Criterio de admisión de una tarea a este catálogo:** que necesite **juicio** (no
resoluble por `grep`/script) **y** que su salida sea **verificable por herramienta**
(tests, tipos, lint, build) o revisable de forma barata por un humano.

---

## Catálogo de tareas candidatas

Cada tarea se valora por: **Recurrencia**, **Especificable** (¿se puede definir "hecho"
sin ambigüedad?), **Volumen**, **Verificación** (cómo se comprueba el resultado) y
**Veredicto** de si merece un agente o no.

### A. Componentes (`packages/shibui-ui`, ~99 `*.component.ts`, patrón de 5 ficheros)

| # | Tarea | Recur. | Espec. | Vol. | Verificación | Veredicto |
|---|-------|--------|--------|------|--------------|-----------|
| A1 | **Migración batch** de N componentes a un nuevo patrón/token | Ocasional | Alta (con rúbrica) | 99 | type-check + lint + consumer-tests + revisión humana | ✅ **Buen candidato** con rúbrica + verificación + review obligatorio. Ojo objeción #2: errores CSS sutiles |
| A2 | **Generar componente nuevo** desde spec siguiendo el patrón de 5 ficheros | Por evento | Alta | Bajo/acumulativo | type-check + storybook + consumer-tests | ⚠️ Útil como **feature/acelerador**, pero Claude Code ya lo hace interactivo — solo paga si se expone como endpoint |
| A3 | Auditoría de consistencia (checks binarios de estructura) | Continua | Total | 99 | `grep`/script | ❌ **Script, no agente** (objeción #1) |
| A4 | Enriquecer `stories/` con variantes/ejemplos que falten | Ocasional | Media | Medio | build-storybook | ⚠️ Depende de juicio; verificación débil |

### B. Consumer contract tests (`packages/consumer-tests*`, React × Svelte × Angular)

| # | Tarea | Recur. | Espec. | Vol. | Verificación | Veredicto |
|---|-------|--------|--------|------|--------------|-----------|
| B1 | **Actualizar consumer tests** cuando cambia la API pública de un componente | Por cambio | Alta | Medio | los propios tests (verde/rojo) = rúbrica natural | ✅ **Buen candidato** — "hecho" es objetivo y verificable |
| B2 | Generar el test inicial para un componente sin cobertura | Ocasional | Alta | Medio | tests verdes | ✅ Candidato razonable |

### C. API de componentes (`apps/shibui-api`, NestJS)

| # | Tarea | Recur. | Espec. | Vol. | Verificación | Veredicto |
|---|-------|--------|--------|------|--------------|-----------|
| C1 | Regenerar `components.generated.ts` (parte mecánica) | Por cambio | Total | — | script (`analyze` + `generate`) | ❌ **Ya lo hace el pre-commit hook** |
| C2 | **Enriquecer** metadata con juicio (descripciones semánticas, categorías, ejemplos de uso) sobre lo que el hook genera | Por cambio | Media | Medio | build + revisión | ⚠️ Candidato: aporta lo que el script no puede, pero verificación semántica es cara |
| C3 | Mantener DTOs/entities/OpenAPI en sync con el dominio | Por cambio | Alta | Bajo | `generate-openapi.ts` + type-check | ⚠️ Parcialmente script |

### D. CI / Pull Requests (`.github/workflows/orchestrator.yml`, GitFlow)

| # | Tarea | Recur. | Espec. | Vol. | Verificación | Veredicto |
|---|-------|--------|--------|------|--------------|-----------|
| D1 | **Bot de revisión de PRs** con context pack de shibui (GitFlow, convenciones, tokens, scopes de commit) | Por PR | Alta | Según volumen de PRs | Revisión humana del comentario | ✅ **Candidato fuerte** si hay volumen de PRs |
| D2 | **Triage de fallos de CI** — diagnosticar por qué falló un pipeline del orchestrator y proponer fix | Por fallo | Media | Medio | Revisión humana | ✅ Candidato — alto valor, verificación barata |
| D3 | Guardián de GitFlow / Conventional Commits | Por commit/push | Total | — | commitlint + pre-push hook | ❌ **Ya hay hooks** (objeción #1) |

### E. Documentación y releases (`docs/`, `release.yml`)

| # | Tarea | Recur. | Espec. | Vol. | Verificación | Veredicto |
|---|-------|--------|--------|------|--------------|-----------|
| E1 | Generar release notes / changelog desde commits convencionales | Por release | Alta | Bajo | Revisión humana | ⚠️ Mitad script (parseo) + LLM (prosa) — ROI bajo salvo cadencia alta |
| E2 | Mantener `docs/ARCHITECTURE.md` / `decisions/` al día tras cambios estructurales | Rara | Baja | Bajo | Difícil | ❌ Baja frecuencia, verificación difícil |

### F. Apps de producto (`app-cv`, `app-opencells`, sukashi, hanko)

| # | Tarea | Recur. | Espec. | Vol. | Verificación | Veredicto |
|---|-------|--------|--------|------|--------------|-----------|
| F1 | Features de producto (p.ej. generar CV desde datos en `app-cv`) | Según producto | Variable | Variable | Según feature | ⚠️ Solo si es una feature de producto real, no automatización interna |
| F2 | Correr la harness de `hanko` y resumir/priorizar hallazgos | Por cambio | Media | Medio | Los propios checks de hanko | ⚠️ Candidato a explorar (hanko ya produce reports) |

---

## Shortlist (por dónde empezaría)

Ordenado por ROI y por tener "hecho" verificable:

1. **B1 — Actualizar consumer tests al cambiar la API de un componente.** El mejor primer
   caso: recurrente, la rúbrica es objetiva (tests verdes), y encaja con el trigger que
   ya existe en el orchestrator (`ui_behavior`).
2. **D1 — Bot de revisión de PRs con context pack de shibui.** Alto valor, verificación
   humana barata, se apoya en el flujo de PRs existente.
3. **A1 — Migración batch de componentes**, pero **solo** con: rúbrica explícita,
   verificación automática (type-check + consumer-tests) y **review humano obligatorio**,
   por la objeción #2 (errores CSS/design-system sutiles).

Todo lo marcado ❌ queda **fuera**: son scripts, no agentes.

---

## Arquitectura implícita (si se avanza)

- **Motor:** envolver el **Claude Agent SDK** (no reimplementar el loop con el Tool
  Runner), embebido como app/paquete del monorepo (`apps/agent-orchestrator` propuesto).
- **Parametrizable:** recibe `targetRepo` — por defecto shibui, sin cerrarse a otros repos.
- **Context pack de shibui:** system prompt + skills + tools curadas + rúbrica **por tarea**.
- **Orquestador:** Opus 4.8 por defecto; Fable 5 solo para sub-problemas de razonamiento
  muy exigentes.

## Preguntas abiertas (para decidir antes de construir)

1. ¿Hay **volumen real** de PRs que justifique D1, o son pocos y esporádicos?
2. ¿Existe una **migración batch concreta** pendiente (A1), o es hipotética?
3. ¿El disparo es **CI/local** o un **servicio** dentro de `shibui-api`?
4. ¿Quién asume el **coste de tokens** de correr esto desatendido, y con qué presupuesto/tope?
5. ¿Se hará la **evaluación empírica** (5-10 casos reales vs ground truth) que exige
   `local-model-delegation.md` antes de cualquier bulk?

## Próximo paso sugerido

No construir nada todavía. Elegir **una** tarea de la shortlist (mi apuesta: **B1**),
definir su rúbrica, y hacer un PoC de un solo caso real para medir calidad y coste antes
de generalizar.
