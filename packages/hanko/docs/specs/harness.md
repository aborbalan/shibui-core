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

- **Miembros privados en el CEM — RESUELTO.** El analizador emite métodos/propiedades `_x` con `privacy: ''`
  (no los marca `private`), pero `publicApiOf` los excluye por nombre (contrato = API **pública**). La ingestión
  ahora hace lo mismo (`isPublicMember` descarta los `_`-prefijados) → fuera los falsos `contract/method`.

- **Resiliencia ante crashes async — RESUELTO.** `observeResilience` corre cada trial dentro de una ventana que
  escucha `window` (`error` + `unhandledrejection`, con `preventDefault` para adueñarse del error y no rebotarlo
  como uncaught) **además** del throw síncrono / rechazo de `updateComplete`, y cede un macrotask antes de
  cerrarla → capta tanto los rechazos de `updateComplete` como los throws que Lit emite a nivel de **ventana**
  (`runCapturingWindowErrors` en `probe.ts`). Los escenarios son adversos *sin datos*
  (`empty`/`junk-attrs`/`rtl`/`remount`), `optional` → un crash es **warning**, no descalifica el sello.
  **Hallazgo (dogfood, validado aislando el probe):** sobre shibui un montaje adverso-vacío **sobrevive limpio**
  salvo **2** componentes que petan en `junk-attrs` (`lib-button-liquid`, `lib-progress-circle`, ambos rechazan
  `updateComplete`). Los ~24 `pageerror` de `report-full.html` **NO son fallos de resiliencia**: corriendo el
  probe con **solo** `observeResilience` montando salen **0** diagnósticos; los 24 vienen de
  `observeRuntime`/`observeA11y`. El patrón (`X.flatMap`/`map`/`find` *is not a function*) delata el **sentinel
  string de `probeReflect`** asignado a props data-driven → era trabajo de **calibración D** (sentinel tipado,
  **RESUELTA** — ver abajo), no de resiliencia. Sembrar datos mínimos por tipo (`valid-min`) sigue **diferido** (se probó: los
  componentes renderizan con datos pero su contrato no mejora → el ruido restante es drift del CEM).

- **Sentinel de reflexión tipado (calibración D) — RESUELTO.** `probeReflect` asignaba el string `'hanko-probe'`
  a CUALQUIER prop reflejable. Para una prop **data-driven** array (`series`/`links`/`files`, inicializadas a `[]`)
  eso la dejaba en string → el render hacía `series.flatMap(...)` y petaba ASÍNCRono (los ~24 `pageerror`). Ahora
  el sentinel es **coherente con el tipo** (`chooseSentinel`/`typedSentinel` en `probe.ts`):
  1. **Inferencia por runtime** (`typeof`/`Array.isArray` del valor inicial — genérica, sin acoplar al CEM):
     bool→invertido, number→distinto, array→`[]`, object→`{}`, string→`'hanko-probe'`.
  2. **Tipo declarado del CEM** (`PropTypeHint` = `{kind, literals}` que el runner inyecta por tag): lidera donde
     el runtime no acierta — un **enum** (`string-union`) → primer literal VÁLIDO ≠ actual (un string arbitrario
     indexaría mal un mapa interno: `SIZE_MAP[size].px`). Pasa como dato plano, no el `ComponentContract` → el
     harness sigue sin conocer lo declarado.
  3. **Red de captura**: la mayoría de enums de shibui son **alias con nombre** (`LibProgressCircleSize`) → el CEM
     los deja `kind:'unknown'` SIN literales, así que caen al string y aún pueden petar. Ese crash es **artefacto
     del sondeo** (de la fragilidad ante basura ya se ocupa la resiliencia con `junk-attrs`), y Lit lo emite
     DIFERIDO a `window` (re-render en cascada, no rechazo de `updateComplete`). `observeRuntime` envuelve TODA su
     fase montada (montaje, sondeo, settle de 2 macrotasks, desmontaje) escuchando `window` con `preventDefault`
     → no rebota como `pageerror`. Genérico (`window`/`setTimeout`), respeta `genericity.test.ts`.

  **Efecto medido (dogfood real):** diagnósticos de navegador **24 → 1** (el único restante es genuino: un
  `console.warning` de `lib-progress` por JSON inválido — comportamiento defensivo correcto); `contract/reflect`
  **71 → 31** (el sentinel tipado detecta reflexión en booleanos/enums que el string daba como falso negativo);
  **sellados 36 → 38**. Resto de facetas sin regresión (slot 29, property 108, attribute 7, a11y 29).
  **Trade-off asumido:** la red de captura también absorbe un crash genuino de montaje por defecto en
  `observeRuntime` (lo capta igualmente la capa de resiliencia, escenario `empty`).

### ⚠️ Pendiente de calibrar

- **Miembros fantasma kebab en el CEM**: algunos componentes declaran DOS miembros para una misma prop —el real
  `showLegend` (attribute `show-legend`) y un duplicado `show-legend` (kind field, sin attribute)—. El segundo no
  existe en runtime → `contract/property: ausente`. Es un *smell* de generación del CEM de shibui (se arregla en
  la generación del manifest, no en hanko).
- **Slot por defecto con etiqueta `—` mal codificada** (`"â€”"`): bug de encoding (UTF-8 leído como latin1) en el
  nombre del slot por defecto del CEM/render → revisar la ingestión/render del nombre de slot.
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
