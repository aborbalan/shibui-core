# Spec · Harness de runtime (incremento 2 de F3/F4/F5)

> **Estado:** v0 — implementado en `src/harness/probe.ts` y **cableado al Trust Report** vía la sonda
> `dogfood/probe-shibui.ts` (Etapa 1 del puente de F6). **Pendiente de validar en navegador** (el worktree no
> tiene `node_modules`; se valida desde el repo principal — Paso 0).
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
- **render asíncrono de Lit**: los componentes de shibui (LitElement) construyen su shadow DOM en una *microtask*
  tras montar, no de forma síncrona. `observeRuntime` lee de forma síncrona, así que en v0:
  - los **slots** de un componente Lit suelen quedar **sin observar** (`shadowRoot` aún null) → el check los
    **omite** (`skipped`), no genera un falso fallo (regla de oro);
  - el **reflect** puede quedar corto (Lit refleja en el ciclo de update). Afinarlo = hacer `observeRuntime`
    consciente de `updateComplete`; es trabajo de calibración del Paso 0, no de esta v0.

## Dogfood sobre shibui-ui — `dogfood/` (Etapa 1 del puente de F6)

El dogfood **no vive en `src/`**: el guard `src/genericity.test.ts` prohíbe que el core importe shibui, y para
montar los componentes reales hay que cargar su código. Por eso el único punto de acople vive **fuera de `src/`**,
en `dogfood/` — tooling, no publicable (no entra en `files`).

| Fichero | Rol |
|---|---|
| `dogfood/browser-glue.ts` | corre EN el navegador: `import '../../shibui-ui/dist/index.js'` (side-effect: registra los CE) + harness + axe → expone `window.__hankoProbe` |
| `dogfood/probe-shibui.ts` | orquesta EN node: lee el CEM → tags; **esbuild** bundlea el glue a un IIFE inline; **Playwright/chromium** lo inyecta y sondea cada tag; escribe `hanko-report/observations.json` |

```bash
pnpm --filter @shibui-ui/hanko exec playwright install chromium   # una vez
pnpm --filter @shibui-ui/hanko observe                            # Etapa 1 → observations.json
pnpm --filter @shibui-ui/hanko report                            # Etapa 2 → report con 4 capas
# o, encadenado:  pnpm --filter @shibui-ui/hanko report:full
```

Requiere el build de shibui (`pnpm build:shibui`) para tener su `dist/` + CEM. El runner consume las
observaciones y corre los checks puros (contrato/a11y/resiliencia) → **Trust Report de 4 capas** (F6). Si la sonda
falla, el runner degrada a Floor (las otras capas → `–`), sin romper el deploy.

> El bundle inline (esbuild → IIFE) evita resolver módulos/chunks por `file://` (CORS de `about:blank`): todo
> —shibui, harness, axe— viaja en un solo script que `addScriptTag({ content })` inyecta.
