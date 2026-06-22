# Spec · Check de Accesibilidad (F4)

> **Estado:** **F4 terminada** — política (`src/checks/a11y.ts`) + mecanismo (`src/harness/probe.ts`) +
> calibraciones **C** (nombre aportable) y **F4-cierre** (teclado real · landmarks · foco diferido).
> **Fase:** F4. Comparte el entorno de browser con [`checks-contract.md`](checks-contract.md) (F3, incr. 2).
> **Naturaleza:** **universal** — no depende del contrato declarado.

---

## Propósito

Verificar que un componente renderizado es **accesible**, declare lo que declare su manifest. A diferencia del
contrato (F3, condicional a lo declarado), la a11y se aplica **a todos por igual**: axe + teclado + foco + nombre
accesible. Es una de las dos capas universales de hanko (la otra es resiliencia, F5).

```
elemento renderizado ──► (harness: axe + sondeo) ──► A11yObservation ──► a11yCheck() ──► A11yResult
```

## Política vs mecanismo (igual que F3)

| | Qué es | Dónde | Cuándo |
|---|---|---|---|
| **mecanismo** | renderizar, correr axe, sondear teclado/foco/nombre | harness (`@vitest/browser` + `axe-core`) | incremento 2 |
| **política** | qué severidad falla, qué se exige a interactivos, cobertura | `a11yCheck` (motor puro) | **incremento 1 (este)** |

`a11yCheck` **no toca el DOM ni importa axe**: recibe la observación ya hecha y decide. Por eso se testea en
Node con observaciones falsas, y el sello a11y es una **política explícita y auditable**, no una caja negra.

## Superficie pública

```ts
a11yCheck(observation, options?): A11yResult   // src/checks/a11y.ts
```

```ts
A11yObservation {
  tagName;
  axeViolations?: { id; impact; help?; nodes? }[];   // axe ya ejecutado
  interactive?;                                       // ¿botón/input/link?
  keyboardReachable?; focusVisible?; hasAccessibleName?;
  nameSupplyable?;                                     // ¿el consumidor puede aportar el nombre? (calibración C)
}
A11yResult { tagName; pass; violations[]; warnings[]; checked[]; skipped[] }
A11yFinding { rule; impact: 'minor'|'moderate'|'serious'|'critical'; message }
A11yOptions { failOn?: AxeImpact }   // umbral; def. 'serious'
```

## La política (incremento 1)

1. **axe** — cada violación se clasifica por `impact`. Las `>= failOn` (def. `serious`) **fallan**; las inferiores
   pasan a `warnings` (informan, no fallan). Si axe no corrió → se omite.
2. **teclado / foco / nombre** — exigibles **solo a elementos interactivos** (`interactive === true`):
   - alcanzable por teclado, foco visible y nombre accesible; cada incumplimiento es violación `serious`.
   - `interactive === false` → se omiten (no aplican a decorativos).
   - interactividad u observación ausente → se omiten (no es fallo).
   - **nombre accesible — matiz de la calibración C** (ver abajo): un nombre ausente solo es violación si el
     componente **no puede recibirlo**. Si es **aportable por el consumidor** (`nameSupplyable === true`) la
     regla `name` se **omite** (montaje vacío no lo prueba); si `nameSupplyable === false` la ausencia **es**
     violación real; `undefined` (sin señal) → política estricta previa (violación).

## Calibración C — nombre accesible aportable por el consumidor

El harness monta cada componente **vacío** (sin contenido en slots, sin props de texto). Un componente bien
diseñado cuyo nombre sale de su **slot por defecto** (un `<lib-button>Guardar</lib-button>`) o de una **prop de
etiqueta** (`label`/`ariaLabel`) aparece, montado así, *sin* nombre accesible — pero **no tiene defecto alguno**:
el nombre lo aporta el consumidor. Marcarlo violación sería un **falso positivo**.

La señal `nameSupplyable` (la calcula el **mecanismo**, ver [`harness.md`](harness.md)) distingue ese ruido de la
señal real, aplicando la **regla de oro** al nombre: *ausencia ≠ incumplimiento cuando el nombre es aportable*.

- `nameSupplyable === true` → el contrato declara un **slot por defecto** o una **prop de etiqueta** → el nombre
  es aportable → `name` se **omite** (no verificable sin contenido).
- `nameSupplyable === false` → no hay mecanismo de nombre → la ausencia **es** violación real (deuda del
  componente: añadir `aria-label`/`label` o un slot por defecto).
- `nameSupplyable === undefined` → la política **estricta previa** se conserva (violación), por compatibilidad.

> **Verifica capacidad, no cableado.** Esta política comprueba que el componente *puede* nombrarse, no que el
> nombre realmente se conecte al árbol de accesibilidad (una `label` prop ignorada *seguiría* omitiéndose). Esa
> verificación —sembrar un nombre y comprobar que aflora— se valoró (opción «a») y se **difirió**: rozaba
> «sembrar datos» (que en resiliencia no compró señal) y arriesgaba **falsos negativos** por enmascarado. Si se
> retoma, su sitio es el harness, no esta política.

## Calibración F4-cierre — teclado real · landmarks · foco diferido

Las tres heurísticas v0 que quedaban en el **mecanismo** ([`probe.ts`](../../src/harness/probe.ts), ver
[`harness.md §Calibración`](harness.md)) se cerraron. La **política** (`a11yCheck`) no cambió: ya trataba
`false → viola` y `undefined → omite` correctamente. Lo que cambió es la calidad de la *señal* que recibe.

1. **Teclado — señal real, no proxy (1.1).** `keyboardReachable` era `tabIndex>=0 || shadowRoot!==null`: como
   **todo** LitElement tiene shadow, la regla `keyboard` **nunca fallaba** — laxitud que *fingía* cobertura (el
   reverso del falso `reflect` de la calibración D). Ahora es `host tabbable **o** un tabbable GENUINO en el shadow`
   (selector que excluye `[tabindex="-1"]` y deshabilitados). La regla `keyboard` muerde en su caso real: un
   componente que **declara** un rol interactivo pero **no** es alcanzable por teclado.
2. **Interactividad — un `tabindex="-1"` no es un control (1.1, corolario).** El barrido del shadow de
   `isInteractive` usaba un selector laxo (`[tabindex]`) que capturaba el `-1`. Un `[tabindex="-1"]` es foco
   *programático*, no un tab-stop: marcaba interactivos a presentacionales/contenedores (`<span role=note
   tabindex=-1>` de `lib-chip`, `[role=dialog tabindex=-1]` de `lib-drawer`) que, al no ser nunca alcanzables,
   **fabricaban un falso `keyboard`**. `isInteractive` ahora reusa el mismo tabbable genuino → la señal de teclado
   deja de auto-contradecirse.
3. **Landmarks no son controles (1.2).** `isInteractive` marcaba interactivo a una **región** por *contener*
   controles (`lib-footer` = `<footer>` con enlaces). Un landmark demarca una zona, no es operable: ahora se
   descarta si el host expone un **rol de landmark** o el elemento más externo del shadow es un **landmark nativo**
   (`<header>`/`<footer>`/`<nav>`/`<main>`/`<aside>` — shibui usa elementos en vez de `role`). Es deliberadamente
   estrecho (el landmark ha de ser el *wrapper*) para **no** perder los `*-button`-like que delegan en un hijo.
4. **Foco visible — diferido formalmente (1.3).** `focusVisible` queda **sin observar** → la regla `focus` se
   **omite** (regla de oro). Verificar el anillo exige foco real + leer `:focus-visible`/outline: caro y frágil en
   headless, con la peor relación señal/coste de la capa. **Decisión, no olvido**: se difiere a vNext; su sitio
   sería el harness (sembrar foco y mirar), con el mismo riesgo de fragilidad que «sembrar datos» en resiliencia.

> **Lección de #549 (en sus dos caras).** No se introdujo *estricteza que no compra señal* (el falso `keyboard` de
> los presentacionales se eliminó alineando los selectores) **ni** se mantuvo *laxitud que finge cobertura* (el
> proxy de `keyboardReachable`). La regla de oro es el árbitro: lo que no se puede probar honestamente se **omite**.

### Deuda a11y de shibui (no de hanko)

Tras la calibración, el dogfood sobre shibui (102 componentes) deja **4** `a11y/name` reales — controles genuinos,
alcanzables por teclado, **sin** nombre accesible y **sin** forma de aportarlo (`nameSupplyable=false`):
`lib-rating`, `lib-editor-toolbar`, `lib-header`, `lib-tree-select`. Son **deuda de shibui** (añadir `aria-label`/
prop de etiqueta/slot por defecto, o —en `lib-header`— el rol `banner`/elemento `<header>`), **no** falsos
positivos de hanko: la capa a11y hace lo correcto al señalarlos. `lib-footer` salió de la lista (landmark);
`lib-chip`/`lib-drawer`/`lib-file-browser` también (presentacional/contenedor/data-driven sin items en montaje
vacío — límite conocido del montaje vacío, no falso negativo).

## Regla de oro (simétrica)

Como en F3: lo **no observado** se **omite** (queda en `skipped`), no falla. `checked` lista lo evaluado de verdad.
El sello a11y declara su cobertura — nunca finge haber comprobado lo que el harness no le dio.

## Criterios de aceptación (F4 · incremento 1)

1. Violaciones de axe `>= failOn` fallan; las inferiores son `warnings`.
2. `failOn` ajusta el umbral (más estricto/laxo).
3. Interactivos exigen teclado + foco + nombre; no interactivos los omiten.
4. Lo no observado se omite sin fallar; `checked`/`skipped` reflejan la cobertura.
5. Tests verdes en `src/checks/a11y.test.ts`.

## Incremento 2 — harness a11y · HECHO

- `observeA11y` (`src/harness/probe.ts`) renderiza cada componente con `@vitest/browser`, corre **`axe-core`** sobre
  su subárbol (Shadow DOM incluido), sondea interactividad/teclado/nombre y construye la `A11yObservation` real.
- Calibrado contra shibui-ui real (102 componentes) en **C** (nombre aportable) y **F4-cierre** (teclado real ·
  landmarks · foco diferido) — ver secciones arriba.
- Agregado al sello vía el Trust Report (F6). Estado dogfood: **47 sellados · 4 `a11y/name` reales** (deuda de
  shibui, documentada arriba).

## Criterios de «F4 terminada»

1. `keyboardReachable` ya no es un proxy: verifica tab-reachability genuina o se omite (sin fingir cobertura).
2. `isInteractive` no marca landmarks como controles (`lib-footer` fuera) sin perder los `*-button`-like.
3. `focusVisible` con decisión **explícita**: diferido formalmente (rationale arriba).
4. Los `a11y/name` restantes = solo controles genuinos, documentados como deuda de shibui.
5. Sin estricteza que no compra señal **ni** laxitud que finge cobertura (lección #549, ambas caras).
6. sellados estable (47 → 47); tests verdes (node 80 · browser 23, +4 de F4-cierre).
