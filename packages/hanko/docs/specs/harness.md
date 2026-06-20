# Spec · Harness de runtime (incremento 2 de F3/F4/F5)

> **Estado:** implementado en `src/harness/probe.ts` y **cableado al Trust Report** vía la sonda
> `dogfood/probe-shibui.ts` (Etapa 1 del puente de F6). **Validado en navegador** (Playwright/chromium): tests
> `*.browser.test.ts` verdes + dogfood real sobre los ~102 componentes de shibui. Calibración async (Lit
> `updateComplete`) **resuelta** — ver §Calibración.
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
observeRuntime(tagName): Promise<ComponentRuntime>             // browser, async (espera updateComplete)
observeA11y(tagName, runAxe): Promise<A11yObservation>          // browser, axe inyectado
observeResilience(tagName): ResilienceObservation               // browser
```

> `observeRuntime` es **async**: tras montar el elemento espera su `updateComplete` (duck-typing por `.then`,
> sin importar Lit) antes de leer slots/reflect, porque LitElement renderiza el shadow DOM y refleja
> prop→attr en la *microtask* siguiente, no de forma síncrona. Ver `elUpdateComplete` en `probe.ts`.

## Niveles de test (ADR-002)

| Config | Corre | Entorno |
|---|---|---|
| `vitest.config.ts` | `src/**/*.test.ts` (excl. browser) | node |
| `vitest.browser.config.ts` | `src/**/*.browser.test.ts` | Playwright (chromium) |

Scripts: `pnpm --filter @shibui-ui/hanko test` (node) · `… test:browser` (navegador).
Antes del browser: `pnpm install` + `pnpm --filter @shibui-ui/hanko exec playwright install chromium`.

## Calibración

- **render asíncrono de Lit — RESUELTO.** Los componentes de shibui (LitElement) construyen su shadow DOM y
  reflejan prop→attr en la *microtask* siguiente al montaje, no de forma síncrona. `observeRuntime` ahora es
  **async** y espera `updateComplete` tras montar (y `probeReflect` tras cada set) → slots y reflect se observan
  de verdad. Antes, leer en el mismo tick daba `shadowRoot` vacío y "no refleja" en TODA la librería (~98
  componentes con el mismo falso `contract/reflect`). Validado end-to-end con el dogfood real (98 → 70 «sin sello»;
  los que sellan en contrato pasan limpio, p.ej. `lib-button`).

### ⚠️ Pendiente de calibrar (descubierto al quitar el ruido async)

- **Miembros privados en el CEM**: el analizador emite métodos/propiedades `_x` (privados) en el manifest, pero
  `publicApiOf` los excluye a propósito (contrato = API **pública**) → cada `_x` declarado sale como
  `contract/method|property: ausente`. Asimetría interna: decidir si la ingestión los filtra (contrato público)
  o si declararlos es un *smell* a reportar. Domina los `contract/method` (todos `_`).
- **Miembros fantasma kebab en el CEM**: algunos componentes declaran DOS miembros para una misma prop —el real
  `showLegend` (attribute `show-legend`) y un duplicado `show-legend` (kind field, sin attribute)—. El segundo no
  existe en runtime → `contract/property: ausente`. Es un *smell* de generación del CEM de shibui.
- **Crash al montar VACÍO** (componentes data-driven: charts/stepper/tabs…): petan en la primera actualización de
  Lit (`series.flatMap is not a function`, etc.). El throw async ahora aflora en el `await updateComplete` y
  `observeRuntime` lo captura (observación parcial → se omite), pero quedan reflect/slots reales sin verificar y
  los crashes solo se ven en `report-full.html` (vía `page.on('pageerror')`). Calibrar: montar con datos mínimos
  válidos por tipo, o política explícita "crash en mount vacío = violación de resiliencia".
- **Slot por defecto con etiqueta `—` mal codificada** (`"â€”"`): bug de encoding (UTF-8 leído como latin1) en el
  nombre del slot por defecto del CEM/render → revisar la ingestión/render del nombre de slot.
- **reflect (sentinel)**: sonda con un sentinel string; para una prop booleana/numérica/enum el converter de Lit
  puede no producir un atributo "cambiado" aunque refleje → considerar sentinel tipado por el CEM.
- **interactividad / nombre accesible**: heurísticas (tabindex/role/shadow, aria-label/texto) → calibrar contra
  shibui real (29 componentes fallan a11y, en parte por montarse vacíos sin nombre accesible).
- **focusVisible**: requiere foco/render real; v0 lo deja sin observar (el check lo omite, no falla).

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
