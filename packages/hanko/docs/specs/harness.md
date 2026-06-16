# Spec · Harness de runtime (incremento 2 de F3/F4/F5)

> **Estado:** v0 — implementado en `src/harness/probe.ts`. **Escrito, pendiente de validar en navegador**
> (el worktree no tiene `node_modules`; se valida desde el repo principal).
> **Fase:** incremento 2 común a F3 (contrato), F4 (a11y) y F5 (resiliencia).

---

## Propósito

Los checks de F3/F4/F5 son **motores puros**: consumen observaciones (`ComponentRuntime`, `A11yObservation`,
`ResilienceObservation`) y deciden. El **harness** es el músculo que produce esas observaciones a partir de un
custom element **vivo**. Cierra el flujo: *elemento real → observación → check → sello*.

```
custom element registrado ──► observe*() ──► Observación ──► *Check() ──► resultado
```

## Principio: genérico e inyectado

- El harness es **genérico**: opera sobre cualquier custom element registrado en el documento; **no importa shibui**.
- **axe se inyecta** (`AxeRunner`), no se importa en `probe.ts` → el harness no se acopla a axe ni al runner.
- Reparto **puro / navegador**:
  - `publicApiOf(instance, stopProto)` — **puro**: reflexiona la cadena de prototipos (accessors/campos →
    properties; funciones → methods; excluye `constructor` y `_`). Node-testable (`probe.test.ts`).
  - `observeRuntime` / `observeA11y` / `observeResilience` — **navegador**: usan `document`/`customElements`.
    Se ejercitan en `*.browser.test.ts` (Playwright vía `@vitest/browser`).

## Superficie pública

```ts
publicApiOf(instance, stopProto?): { properties; methods }     // puro
observeRuntime(tagName): ComponentRuntime                       // browser
observeA11y(tagName, runAxe): Promise<A11yObservation>          // browser, axe inyectado
observeResilience(tagName): ResilienceObservation               // browser
```

## Niveles de test (ADR-002)

| Config | Corre | Entorno |
|---|---|---|
| `vitest.config.ts` | `src/**/*.test.ts` (excl. browser) | node |
| `vitest.browser.config.ts` | `src/**/*.browser.test.ts` | Playwright (chromium) |

Scripts: `pnpm --filter @shibui-ui/hanko test` (node) · `… test:browser` (navegador).
Antes del browser: `pnpm install` + `pnpm --filter @shibui-ui/hanko exec playwright install chromium`.

## ⚠️ v0 — heurísticas a calibrar

- **reflect**: sonda con un sentinel string; no detecta reflexión de booleanos → a refinar.
- **interactividad / nombre accesible**: heurísticas (tabindex/role/shadow, aria-label/texto) → calibrar contra
  shibui real.
- **focusVisible**: requiere foco/render real; v0 lo deja sin observar (el check lo omite, no falla).

## Dogfood sobre shibui-ui (paso de validación)

No se commitea acoplado (importar el CEM construido rompería `type-check` si no hay build, y acoplaría hanko a
shibui). Para correrlo en validación, añadir `@shibui-ui/ui` como devDep y un `src/harness/dogfood.browser.test.ts`:

```ts
import * as axe from 'axe-core';
import '@shibui-ui/ui';                                   // registra los custom elements
import cem from '../../../shibui-ui/dist/custom-elements.json';
import { ingestCem } from '../ingest';
import { observeRuntime, observeA11y, observeResilience } from './probe';
import { contractCheck } from '../checks/contract';
import { a11yCheck } from '../checks/a11y';
import { resilienceCheck } from '../checks/resilience';

const set = ingestCem(cem as never);
it.each([...set.components.keys()])('hanko · %s', async (tag) => {
  const c = set.components.get(tag)!;
  const contract = contractCheck(c, observeRuntime(tag));
  const a11y = a11yCheck(await observeA11y(tag, (el) => axe.run(el)));
  const resilience = resilienceCheck(observeResilience(tag));
  // report-only hasta calibrar; luego: expect(contract.pass).toBe(true), etc.
});
```

Requiere build previo de shibui (`pnpm build:shibui`). Este es el paso que cierra los incrementos 2 y alimenta
el **Trust Report** de F6.
