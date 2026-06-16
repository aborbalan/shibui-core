# Spec · Check de Contrato (F3)

> **Estado:** v0 — incremento 1 (motor puro `src/checks/contract.ts` + `src/core/runtime.ts`) **e
> incremento 2** (harness `src/harness/probe.ts` con `observeRuntime`, incl. faceta **slot**). Validado en
> Node; el nivel navegador (`probe.browser.test.ts`) está escrito, pendiente de correr sobre shibui real.
> **Fase:** F3. Depende de [`data-model.md`](data-model.md) (F0), [`ingest.md`](ingest.md) (F1) y [`smoke.md`](smoke.md) (F2).
> **Nivel ADR-001:** Conformance (1) + Strict (2). Recoge además la registrabilidad runtime del Floor (0)
> que F2 difirió. Ver [`../decisions/adr-001-baseline-minima-viable.md`](../decisions/adr-001-baseline-minima-viable.md).

---

## Propósito

Verificar que lo que el manifest **declara** coincide con lo que el elemento **vivo** expone. Es la primera
capa que mira el **runtime**: F0–F2 son estáticos (leen el CEM); F3 compara ese contrato declarado contra una
**observación del elemento real**.

```
ComponentContract  (declarado, del CEM)  ─┐
                                          ├─►  contractCheck()  ─►  ContractResult
ComponentRuntime   (observado, del DOM)  ─┘
```

## El par declarado ↔ observado

| | Qué es | De dónde sale |
|---|---|---|
| `ComponentContract` | lo **declarado** | `ingestCem()` sobre el `custom-elements.json` |
| `ComponentRuntime` | lo **observado** | un **harness** que monta el elemento y lo inspecciona |

`ComponentRuntime` (`src/core/runtime.ts`) es el **límite de abstracción de F3**. El core de hanko **no**
instancia componentes —hacerlo importaría runtime ajeno y rompería la genericidad—; recibe la observación ya
hecha. Esto permite que el **motor de comparación sea puro** y se teste en Node con observaciones falsas, sin
navegador. El harness real (que monta el elemento con `@vitest/browser`, ADR-002) es el **incremento 2**.

```ts
interface ComponentRuntime {
  tagName: string;
  registered: boolean;              // ¿customElements.get(tagName) definido?
  properties?: string[];            // props alcanzables en la instancia
  observedAttributes?: string[];    // observedAttributes del elemento
  methods?: string[];               // métodos públicos del prototipo
  reflectingProperties?: string[];  // props que reflejan a su atributo (probado)
  slots?: string[];                 // <slot> del shadow DOM ('' = por defecto)
}
```

## Superficie pública

```ts
contractCheck(component, runtime, options?): ContractResult   // src/checks/contract.ts
```

```ts
ContractResult {
  tagName; level: 'conformance' | 'strict'; pass; violations[]; checked; skipped[]
}
ContractViolation { facet: 'registration'|'property'|'attribute'|'method'|'reflect'|'slot'; member?; message }
ContractChecked   { registration; properties; attributes; methods; reflect; slots }   // cuánto se verificó
```

## Regla de oro, en AMBOS sentidos

La validación es **condicional a lo presente** — y "presente" aplica a las dos entradas:

| Situación | hanko |
|---|---|
| el manifest **no declara** la faceta | **omite** (no es fallo) — `skipped[]` lo registra |
| el harness **no observó** la faceta | **omite** (no es fallo) — `skipped[]` lo registra |
| declarado **y** el runtime lo **contradice** | **violación** |

`checked` cuenta lo verificado de verdad y `skipped` explica lo omitido: el sello declara su **cobertura**,
nunca finge haber comprobado lo que no pudo.

## Facetas verificadas

1. **Registrabilidad** *(siempre)* — `registered === false` ⇒ violación `registration`. Es la parte runtime
   del Floor que F2 dejó pendiente. Sin registro no hay instancia → el resto se omite.
2. **Propiedades** — cada prop declarada debe existir en `runtime.properties`.
3. **Atributos** — cada prop con `attribute` debe figurar en `observedAttributes`.
4. **Reflect** — cada prop con `reflects: true` debe reflejar de verdad (solo si el harness lo probó vía
   `reflectingProperties`).
5. **Métodos** — cada método declarado debe existir en `runtime.methods`.
6. **Slots** *(incremento 2)* — cada slot declarado debe aparecer como `<slot>` en el shadow DOM. El `''`
   declarado exige un slot por defecto. Solo se verifica si el harness observó slots (montó el elemento).

> **Eventos:** se modelan en el contrato pero **no** se verifican aún. A diferencia de los slots —enumerables
> inspeccionando el shadow DOM montado— los eventos no son observables estáticamente: habría que **disparar
> comportamiento** (event-spy) para saber cuáles emite el componente. Enumerarlos a ciegas sería especular, así
> que quedan **declarados-only** hasta un incremento de verificación conductual.

## Niveles (ADR-001)

| Nivel | Qué exige | Cómo |
|---|---|---|
| **conformance** *(def.)* | lo declarado existe/coincide en runtime | facetas 1–6 |
| **strict** *(opt-in)* | además, el runtime **no expone API pública no declarada** (completitud) | `{ level: 'strict' }` |

En `strict`, una prop pública presente en el elemento pero ausente del manifest es violación: convierte la
*ausencia de declaración* en fallo para quien busca el sello alto (un Lit rico lo cumple con poco esfuerzo).
La completitud de **métodos** en strict se difiere (la firma del CEM aún no modela parámetros/retorno).

## Cambio en la ingestión (F1 → F3)

F3 **puebla `methods`** (campos `kind:'method'` públicos), que el modelo difería desde F0. La separación
campos→`properties` / métodos→`methods` ocurre en `ingestCem`. Ver [`ingest.md`](ingest.md).

## Criterios de aceptación

**Incremento 1 (motor puro):**

1. `contractCheck` detecta props/atributos/métodos declarados ausentes en runtime.
2. Verifica reflect solo cuando el harness lo prueba; lo omite (sin fallar) si no.
3. Respeta *ausencia ≠ incumplimiento* en ambos sentidos; `checked`/`skipped` reflejan la cobertura real.
4. `registration` falla si el elemento no está registrado y omite el resto.
5. `strict` marca la API pública no declarada; `conformance` la ignora.
6. Tests verdes en `src/checks/contract.test.ts`.

**Incremento 2 (harness de runtime):**

7. `observeRuntime` monta el elemento y construye el `ComponentRuntime` real (props, `observedAttributes`,
   métodos, prueba de reflect, **slots del shadow DOM**) sin importar shibui.
8. La faceta **slot** detecta slots declarados ausentes en el shadow DOM y omite (sin fallar) si el manifest
   no declara slots o el harness no los observó.
9. Tests de navegador verdes en `src/harness/probe.browser.test.ts` (Playwright vía `@vitest/browser`).

## Incremento 2 — estado y pendientes

- ✅ **Probe DOM genérico (`observeRuntime`):** monta cada elemento con `@vitest/browser` (Playwright) y
  construye el `ComponentRuntime` real —props del prototipo, `observedAttributes`, métodos, reflect set/get y
  **slots** del shadow DOM. Genérico y parametrizado: **no** importa shibui. Verificado por `probe.browser.test.ts`
  (autocontenido); **pendiente de correr sobre el CEM real de shibui** (dogfood — ver [`harness.md`](harness.md)).
- ⏳ **Eventos:** declarados-only hasta un incremento de verificación conductual (event-spy). Ver nota arriba.
- ⏳ **Integración:** agregar `contractCheck` sobre los componentes reales al sello (camino al Trust Report de F6).
