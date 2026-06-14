# hanko · ADR-002 — Estrategia de testing (tooling desde 0)

> **Estado:** Aceptada (planificación) · **Fecha:** 2026-06-14 · **Fase:** F0 (cimientos)
> **Relacionado:** [`adr-001-baseline-minima-viable.md`](adr-001-baseline-minima-viable.md) · [`../specs/data-model.md`](../specs/data-model.md)

---

## Contexto

F0 exige montar el **tooling de test desde 0** — NO heredar la infra a medida de `@shibui-ui/ui`
(Playwright + visual regression + Storybook), que está calibrada para componentes Lit, no para un motor.

La superficie a testear de hanko tiene **dos naturalezas distintas**:

- **Lógica pura, sin DOM:** `core/` (modelo de datos, coverage) e `ingest/` (parseo CEM → modelo, adapters).
  Es la mayoría del motor y la base de todo. Se testea rápido, en Node, sin navegador.
- **Verificación contra el DOM vivo:** los `checks/` de runtime (contrato↔runtime, a11y con axe, resiliencia).
  Necesitan un entorno con `customElements`, Shadow DOM y un render real. Llegan en F3–F5.

## Decisión

**Vitest** como runner único, en **dos niveles**:

| Nivel | Entorno | Qué cubre | Cuándo |
|---|---|---|---|
| **Unit** | `node` | `core/` + `ingest/` — lógica pura | **F0 en adelante** (ya) |
| **Browser** | `@vitest/browser` (Playwright provider) | `checks/` runtime — DOM, custom elements, axe | F3–F5 |

Un solo runner (Vitest) para ambos niveles evita fragmentar la infra. El nivel browser se añade **solo cuando
F3 lo necesite** (principio: generalizar desde el uso, no especular). En F0 montamos **solo el nivel unit**.

- Versión alineada con el monorepo: **`vitest ^4.0.18`** (la que ya usa shibui-ui → sin duplicar en el lockfile).
- Sin globals: los tests importan `{ describe, it, expect }` de `vitest` explícitamente (tsconfig limpio).
- Config propia y mínima en `vitest.config.ts` (no se copia la de shibui-ui).

## Por qué Vitest y no Playwright a secas

- El **core** es lógica pura: un runner unitario es órdenes de magnitud más rápido y simple que arrancar un browser.
- Cuando lleguen los checks de runtime, **`@vitest/browser` usa Playwright por debajo** → mismo runner, mismo
  modelo mental, y el navegador real que la a11y necesita. No hay que elegir entre uno u otro.
- shibui-ui ya tiene `@vitest/browser` + Playwright en su stack → el ecosistema de versiones es conocido.

## Alcance en F0

1. `vitest.config.ts` mínimo, entorno `node`, incluye `src/**/*.test.ts`.
2. Scripts: `test` (`vitest run`) y `test:watch` (`vitest`).
3. **Primer test del modelo**: bloquea la distinción semántica `undefined` (no declarado) vs `[]`
   (declarado vacío) — la regla de oro encarnada en el tipo. Verifica de paso que el runner corre y que los
   tipos de `contract.ts` son usables.

## Consecuencias

- ✅ Feedback rápido sobre la lógica pura desde el primer día.
- ✅ El salto a tests de runtime (F3) es aditivo, no una migración de runner.
- ⚠️ El nivel browser queda **pendiente y sin configurar** hasta F3 — deliberado.
- ⚠️ Sin `node_modules` en el worktree, los tests **no se han ejecutado aún**; se validan desde el repo principal.
