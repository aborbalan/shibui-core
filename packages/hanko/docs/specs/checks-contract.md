# Spec · Check de Contrato (F3)

> **Estado:** v0 (incremento 1) — implementado en `src/checks/contract.ts` + `src/core/runtime.ts`.
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
ContractViolation { facet: 'registration'|'property'|'attribute'|'method'|'reflect'; member?; message }
ContractChecked   { registration; properties; attributes; methods; reflect }   // cuánto se verificó
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

## Facetas verificadas (incremento 1)

1. **Registrabilidad** *(siempre)* — `registered === false` ⇒ violación `registration`. Es la parte runtime
   del Floor que F2 dejó pendiente. Sin registro no hay instancia → el resto se omite.
2. **Propiedades** — cada prop declarada debe existir en `runtime.properties`.
3. **Atributos** — cada prop con `attribute` debe figurar en `observedAttributes`.
4. **Reflect** — cada prop con `reflects: true` debe reflejar de verdad (solo si el harness lo probó vía
   `reflectingProperties`).
5. **Métodos** — cada método declarado debe existir en `runtime.methods`.

> **Eventos y slots** se modelan en el contrato pero su verificación runtime (event-spy / render de Shadow DOM)
> llega en un incremento posterior: requieren montar y ejercitar el elemento, no solo inspeccionarlo.

## Niveles (ADR-001)

| Nivel | Qué exige | Cómo |
|---|---|---|
| **conformance** *(def.)* | lo declarado existe/coincide en runtime | facetas 1–5 |
| **strict** *(opt-in)* | además, el runtime **no expone API pública no declarada** (completitud) | `{ level: 'strict' }` |

En `strict`, una prop pública presente en el elemento pero ausente del manifest es violación: convierte la
*ausencia de declaración* en fallo para quien busca el sello alto (un Lit rico lo cumple con poco esfuerzo).
La completitud de **métodos** en strict se difiere (la firma del CEM aún no modela parámetros/retorno).

## Cambio en la ingestión (F1 → F3)

F3 **puebla `methods`** (campos `kind:'method'` públicos), que el modelo difería desde F0. La separación
campos→`properties` / métodos→`methods` ocurre en `ingestCem`. Ver [`ingest.md`](ingest.md).

## Criterios de aceptación (F3 · incremento 1)

1. `contractCheck` detecta props/atributos/métodos declarados ausentes en runtime.
2. Verifica reflect solo cuando el harness lo prueba; lo omite (sin fallar) si no.
3. Respeta *ausencia ≠ incumplimiento* en ambos sentidos; `checked`/`skipped` reflejan la cobertura real.
4. `registration` falla si el elemento no está registrado y omite el resto.
5. `strict` marca la API pública no declarada; `conformance` la ignora.
6. Tests verdes en `src/checks/contract.test.ts`.

## Incremento 2 (siguiente) — harness de runtime + ejecución real

- **Probe DOM genérico:** dado un módulo que registra los elementos y la lista de `tagName`, montar cada uno
  con `@vitest/browser` (Playwright) y **construir el `ComponentRuntime`** real (props del prototipo,
  `observedAttributes`, métodos, prueba de reflect set/get). Genérico y parametrizado: **no** importa shibui.
- **Integración:** correr `contractCheck` sobre los componentes reales de shibui-ui y agregar al sello (camino
  hacia el Trust Report de F6). Eventos y slots entran aquí.
