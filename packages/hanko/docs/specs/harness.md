# Spec · Harness de runtime (incremento 2 de F3/F4/F5)

> **Estado:** implementado en `src/harness/probe.ts` y **cableado al Trust Report** vía la sonda
> `dogfood/probe-shibui.ts` (Etapa 1 del puente de F6). **Validado en navegador** (Playwright/chromium): tests
> `*.browser.test.ts` verdes + dogfood real sobre los ~102 componentes de shibui. Calibraciones async, D, C,
> F4-cierre, **F3-cierre (reflexión)** y **F5-cierre (resiliencia)** **resueltas** — ver §Calibración. Con F3, F4
> y F5 cerradas, las tres capas emiten señal honesta (Trust Report: 102 · **49 sellados**).
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
observeA11y(tagName, runAxe, declaredProps?, declaredSlots?): Promise<A11yObservation>  // browser, axe inyectado
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
  (`runCapturingWindowErrors` en `probe.ts`). **Política de escenarios (calibración F5-cierre, decisión 5.1):**
  `empty`/`junk-attrs`/`rtl` se montan *sin datos* (`DATA_DEPENDENT_SCENARIOS`) → `optional` → un crash es
  **warning**; **`remount` es OBLIGATORIO** —re-montarse vacío no depende de datos, un crash ahí es fragilidad
  de ciclo de vida real → descalifica el sello. `observeRemount` solo cuenta el fallo del **2º** montaje (si el
  1º vacío ya peta, eso es asunto de `empty`) para no doble-contar ni reintroducir el falso positivo data-driven
  (#549). La capa deja de ser **verde por construcción**; sobre shibui ningún componente trip­ea `remount`
  (sellados estable) pero el gate muerde de verdad (fixture `hanko-remount-crasher`). Ver `checks-resilience.md`.
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
  **Trade-off asumido (cobertura cruzada F3↔F5, decisión 3.1 — verificada):** la red de captura también absorbe
  un crash genuino de montaje por defecto en `observeRuntime`; lo capta igualmente la capa de resiliencia
  (escenario `empty`, hoy `optional` → aflora como **warning** + diagnóstico, no se pierde entre capas). Tras la
  calibración F5-cierre la cobertura sigue intacta (sobre shibui `empty` no peta en ningún componente; el
  mecanismo lo prueban las fixtures `hanko-needs-data`/`hanko-window-thrower`).

- **Reflexión sin falsos negativos (calibración F3-cierre) — RESUELTO.** Tras D quedaban **31** `contract/reflect`,
  y la mayoría eran **falsos negativos de la sonda**, no drift de shibui. Dos mecanismos + un tercer estado,
  calibrados en `probeReflect` (`probe.ts`):
  1. **Booleano que refleja QUITANDO el atributo** (presente `''` → ausente `null`): el viejo guard
     `after !== null` lo descartaba. Un default `true`→`false` (charts: `showGrid`/`showLegend`) reflejaba de
     verdad. → detectado por `after !== before`.
  2. **Refleja-luego-peta**: Lit refleja prop→attr DENTRO de `update()`; un hook posterior (`updated()`, p.ej.
     reconstruir un canvas — `lib-button-liquid` con `variant`/`tone`) peta y rechaza `updateComplete`, pero la
     reflexión YA ocurrió. El viejo `continue` ante el rechazo la perdía. → se lee el atributo aunque rechace.
  3. **Reflexión INCONCLUSA** (`reflectInconclusiveProperties`): si el sentinel adverso rompe el render ANTES de
     reflejar (enum-alias sin literales en el CEM → string → `SIZE_MAP[size]` peta, `lib-progress-circle`), no se
     puede verificar → la prop se marca inconclusa y `contractCheck` la **OMITE**, no la viola (regla de oro).
     Cada prop se sondea **aislada** (restaura su valor previo) para que un crasher no marque inconclusas en
     cascada a las siguientes (lo que enmascararía un «no refleja» genuino).

  **Efecto medido (dogfood real):** `contract/reflect` **31 → 1** (el residual = `lib-timeline-item` `nKind`,
  drift de nombre del CEM); **sellados 47 → 49** (`lib-button-liquid` y `lib-progress-circle` sellan). Cambio
  esencialmente monotónico: solo deja de **violar en falso** reflexiones reales o no verificables. El resto del
  sin-sello de contrato (property kebab-fantasma 105, slot `—` 20, attribute camelCase 7) es **drift del CEM de
  shibui** confirmado (verificado contra el CEM), no falsos positivos de hanko — ver `checks-contract.md`.

- **Nombre accesible aportable por el consumidor (calibración C) — RESUELTO.** El harness monta cada componente
  **vacío**: un componente cuyo nombre sale de su slot por defecto o de una prop de etiqueta aparece sin nombre
  *sin tener defecto* (lo aporta el consumidor). `observeA11y` ahora produce la señal **`nameSupplyable`** —¿hay un
  mecanismo de nombre?— y la política a11y omite la regla `name` cuando es aportable (ver
  [`checks-a11y.md`](checks-a11y.md)). El mecanismo (`isNameSupplyable` en `probe.ts`) la calcula por **capacidad**,
  no por el render vacío, en tres vías genéricas:
  1. **slot por defecto DECLARADO** en el CEM (`''`) → el runner pasa los nombres de slot por tag (lista plana,
     como `propTypes`); cubre el slot condicional al contenido que el montaje vacío no renderiza (p.ej.
     `lib-code-block`);
  2. **slot por defecto en el shadow vivo** (`readSlots`) → cubre CEM incompletos;
  3. **prop de etiqueta declarada** — regex `NAMEISH_PROP` (`label`/`ariaLabel`/`text`/`heading`/`caption`/`title`/
     `alt`), de **alta precisión** a propósito: incluir una prop que NO nombra sería un falso negativo. Excluye
     `name` (atributo de formulario) y `placeholder` (no es nombre accesible fiable).

  **Efecto medido (dogfood real):** `a11y/name` **29 → 6**; **sellados 38 → 47**. Cambio **monotónico** (solo relaja
  `name`, nunca añade violación → sin regresión posible). Los **6** restantes son **señal real** —interactivos que
  no declaran ni slot por defecto ni prop de etiqueta: `lib-rating`, `lib-editor-toolbar`, `lib-tree-select`,
  `lib-file-browser`, `lib-header`, `lib-footer`— = deuda a11y de **shibui** (añadirles `aria-label`/`label` o un
  slot por defecto), no de hanko. **Verifica capacidad, no cableado** (una `label` prop ignorada seguiría
  omitiéndose): la opción de *sembrar* el nombre y comprobar que aflora (opción «a») se **difirió** (rozaba «sembrar
  datos» y arriesgaba falsos negativos por enmascarado).

- **Teclado real · landmarks · foco diferido (calibración F4-cierre) — RESUELTO.** Cerró las tres heurísticas v0
  de a11y que quedaban en el mecanismo. La política (`a11yCheck`) **no** cambió; cambió la calidad de la señal:
  1. **`keyboardReachable` — señal real, no proxy.** Era `tabIndex>=0 || shadowRoot!==null`: como **todo**
     LitElement tiene shadow, la regla `keyboard` **nunca** fallaba — laxitud que fingía cobertura (el reverso del
     falso `reflect` de D). Ahora `host tabbable **o** un tabbable GENUINO en el shadow` (`TABBABLE_SELECTOR`,
     que excluye `[tabindex="-1"]` y deshabilitados).
  2. **`isInteractive` — un `tabindex="-1"` no es un control.** El barrido del shadow usaba un selector laxo
     (`[tabindex]`) que capturaba el `-1` (foco programático): marcaba interactivos a presentacionales/contenedores
     (`<span role=note tabindex=-1>` de `lib-chip`, `[role=dialog tabindex=-1]` de `lib-drawer`) que, al no ser
     nunca alcanzables, **fabricaban un falso `keyboard`**. Ahora `isInteractive` reusa `hasTabbableInShadow` (el
     mismo tabbable genuino) → la señal de teclado deja de auto-contradecirse.
  3. **landmarks no son controles.** `isInteractive` descarta una **región** (host con rol de landmark, o
     elemento más externo del shadow = landmark nativo `<header>/<footer>/<nav>/<main>/<aside>`): contiene
     controles pero no es operable. Estrecho a propósito (el landmark ha de ser el *wrapper*) para no perder los
     `*-button`-like que delegan en un hijo.
  4. **`focusVisible` — diferido formalmente.** Sigue sin observarse → la regla `focus` se **omite** (regla de
     oro). Verificar el anillo exige foco real + `:focus-visible`/outline: caro y frágil en headless. Decisión
     explícita (vNext), no olvido.

  **Efecto medido (dogfood real):** `a11y/name` **6 → 4** (`lib-footer` sale = landmark; `lib-file-browser`/`-chip`/
  `-drawer` salen = presentacional/contenedor/data-driven vacío); `a11y/keyboard` **0 falso-verde → 0 honesto**
  (los 3 falsos que aparecieron al quitar el proxy se eliminaron al alinear los selectores; shibui SÍ pasa la regla
  real); **sellados 47 → 47** (estable). Las **4** `a11y/name` restantes —`lib-rating`, `lib-editor-toolbar`,
  `lib-header`, `lib-tree-select`— son controles genuinos sin nombre aportable = **deuda de shibui**.

### Triado — drift del CEM de shibui (NO trabajo de hanko)

- **Miembros fantasma kebab en el CEM (≈105) — TRIADO como deuda de shibui.** Algunos componentes declaran un
  *field* con el nombre KEBAB del atributo (`show-labels`) además del field JS real (`showLabels`): el primero
  no existe en runtime → `contract/property: ausente`. Confirmado contra el CEM (el `attributes[].fieldName`
  apunta al `showLabels` real). Es un *smell* de generación del CEM de shibui — se arregla en la generación del
  manifest, no en hanko. hanko lo reporta correctamente.
- **Slot `"—"` (≈20) — TRIADO como deuda de shibui (decisión 3.3).** El analizador de shibui cuela el em-dash de
  una descripción JSDoc (`@slot — …`) como **nombre** del slot; ese slot no existe en el shadow DOM. **El `â€”`
  que reportaban sesiones previas era artefacto de codificación del TERMINAL, NO un bug de hanko:** hanko lee el
  CEM (`readFileSync` utf-8) y escribe el report en UTF-8 correctos (0 bytes mojibake en `trust-report.json` /
  `index.html`; el em-dash `—` figura bien). No hay fix de ingestión que hacer en hanko.
- **reflexión (calibración D + F3-cierre)**: **RESUELTA** — `contract/reflect` 71 → 31 → **1** (residual = drift
  del CEM). Ver §Calibración.
- **nombre accesible**: **calibrado (C, RESUELTO)** — `nameSupplyable` bajó `a11y/name` de 29 a 6 señales reales.
- **interactividad (`isInteractive`)**: **calibrado (F4-cierre, RESUELTO)** — landmarks descartados + `tabindex="-1"`
  presentacional ya no fabrica interactividad (ver arriba).
- **`keyboardReachable`**: **calibrado (F4-cierre, RESUELTO)** — señal real (tabbable genuino), ya no es un proxy.
- **focusVisible**: **diferido formalmente (F4-cierre)** — sin observar → la regla `focus` se omite (regla de oro);
  decisión explícita a vNext, no olvido.

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
