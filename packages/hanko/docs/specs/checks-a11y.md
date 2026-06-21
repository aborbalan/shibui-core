# Spec · Check de Accesibilidad (F4)

> **Estado:** v0 (incremento 1) — implementado en `src/checks/a11y.ts`.
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

## Regla de oro (simétrica)

Como en F3: lo **no observado** se **omite** (queda en `skipped`), no falla. `checked` lista lo evaluado de verdad.
El sello a11y declara su cobertura — nunca finge haber comprobado lo que el harness no le dio.

## Criterios de aceptación (F4 · incremento 1)

1. Violaciones de axe `>= failOn` fallan; las inferiores son `warnings`.
2. `failOn` ajusta el umbral (más estricto/laxo).
3. Interactivos exigen teclado + foco + nombre; no interactivos los omiten.
4. Lo no observado se omite sin fallar; `checked`/`skipped` reflejan la cobertura.
5. Tests verdes en `src/checks/a11y.test.ts`.

## Incremento 2 (siguiente) — harness a11y

- Renderizar cada componente con `@vitest/browser`, correr **`axe-core`** sobre su subárbol (Shadow DOM incluido),
  sondear foco/teclado (tabular, comprobar `:focus-visible`) y resolver el nombre accesible → construir la
  `A11yObservation` real.
- Calibrar `failOn` y las reglas universales contra los resultados reales de shibui-ui (generalizar desde el uso).
- Agregar el resultado al sello (camino hacia el Trust Report de F6).
