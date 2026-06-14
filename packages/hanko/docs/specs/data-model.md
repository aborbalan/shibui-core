# Spec · Modelo de datos del contrato (F0)

> **Estado:** v0 — acordado en diseño, implementación en `src/core/contract.ts`.
> **Fase:** F0 (cimientos + modelo de datos). Todo lo demás del motor cuelga de aquí.

---

## Propósito

El modelo de datos es la **representación de trabajo normalizada** de un componente. **No es el CEM**:
el CEM es el formato de cable (cómo llega la información); este modelo es lo que consumen todos los `checks`
(contrato, a11y, resiliencia, drift) y el `report`.

Tres propiedades lo hacen más que un "CEM re-tipado", y son las que habilitan los principios de hanko:

1. **Semántica de presencia** — el sustrato de *ausencia ≠ incumplimiento*.
2. **Tipos parseados** — de string crudo a literales estructurados, para que los checks generen y validen valores.
3. **Procedencia** — por componente, para que el Trust Report gradúe la fuerza del sello.

> Este modelo representa el **contrato DECLARADO** (lo que dice el manifest). La observación del **runtime**
> (lo que hace el elemento vivo) es una estructura separada que se compara contra este modelo en F3.

---

## Regla central: semántica de presencia (`undefined` vs `[]`)

La encarnación en el tipo de la regla de oro (*ausencia ≠ incumplimiento*):

| Valor de una faceta | Significado | ¿Se verifica? |
|---|---|---|
| `undefined` | El manifest **no declaró** esta faceta | **No** — no es fallo |
| `[]` | El manifest declaró explícitamente **"ninguno"** | **Sí** — debe estar vacío |
| `[...]` | El manifest declaró estos elementos | **Sí** — deben coincidir |

Un check **nunca** mira un campo `undefined`. Un `[]` sí lo verifica. Esta distinción es la decisión de
diseño central del modelo, no un detalle de implementación.

---

## Entidades

### `ComponentContract` — la unidad que hanko sella

Un custom element. Clave primaria = `tagName` (el elemento, no la clase).

| Campo | Tipo | Notas |
|---|---|---|
| `tagName` | `string` | Clave primaria. |
| `className` | `string?` | Clase que lo implementa. |
| `modulePath` | `string` | Traza de vuelta al manifest. |
| `description` | `string?` | |
| `source` | `ContractSource` | Procedencia. Alimenta la fuerza del sello. |
| `properties` | `PropertyContract[]?` | Presencia: `undefined`/`[]`/`[…]`. |
| `events` | `EventContract[]?` | |
| `slots` | `SlotContract[]?` | |
| `cssParts` | `CssPartContract[]?` | |
| `cssProps` | `CssPropContract[]?` | |
| `methods` | `MethodContract[]?` | Modelados pero **no poblados hasta F3**. |

### `PropertyContract`

| Campo | Tipo | Notas |
|---|---|---|
| `property` | `string` | Nombre de la prop JS. |
| `attribute` | `string?` | Atributo HTML mapeado, si existe. |
| `reflects` | `boolean` | prop ⇄ attribute. Clave para el nivel **Floor**. |
| `type` | `TypeModel` | |
| `default` | `string?` | **Raw**, tal cual lo declara el CEM (`"false"`, `"'md'"`, `"4"`). |
| `description` | `string?` | |
| `inheritedFrom` | `string?` | Clase base de origen. `undefined` = propia. Ver [herencia](#herencia). |

> **`required` queda fuera:** el CEM no expresa "required". No se inventa un campo sin fuente.

### `TypeModel` — diseñado para extensión

| Campo | Tipo | Notas |
|---|---|---|
| `raw` | `string` | **SIEMPRE presente, lossless.** Nunca se pierde info. |
| `kind` | `TypeKind` | Discriminador **abierto**, no enum cerrado. |
| `literals` | `string[]?` | Solo para `string-union`. |

```
TypeKind (F0) = 'boolean' | 'number' | 'string' | 'string-union' | 'object' | 'unknown'
```

Dos reglas que lo blindan para fases futuras:
- **`raw` siempre se conserva** → un parser futuro lo enriquece sin pérdida.
- **Degradación a `'unknown'`** → lo que F0 no entiende cae a `'unknown'` + `raw`; un check que solo entiende
  `string-union` lo ignora sin romperse (*ausencia ≠ incumplimiento* aplicado a los tipos).

### Entidades simples

```
EventContract   { name; type?; description? }
SlotContract    { name; description? }          // name '' = slot por defecto
CssPartContract { name; description? }
CssPropContract { name; default?; description? }
MethodContract  { name; signature?; description? }   // no poblado hasta F3
```

### `ContractSource` — procedencia

```
ContractSource =
  | { kind: 'cem' }                      // CEM nativo  → sello pleno
  | { kind: 'adapter'; format: string }  // formato custom normalizado
  | { kind: 'inferred' }                 // inferido del runtime (caso especial)
```

> Entra en el modelo **desde el día 1** aunque F0 solo maneje `'cem'`: el caso especial (adapters/inferred)
> y el Trust Report dependen de ella, y meterla después es caro.

### `ContractSet` — contenedor raíz

```
ContractSet { components: Map<string, ComponentContract> }   // índice por tagName, lookup O(1)
```

---

## Decisiones de diseño

### Identidad
- Clave primaria = `tagName`. `className` es secundario.
- Las declaraciones del manifest que **no** son custom elements (mixins, clases base sueltas) se **filtran**
  en ingestión: no son unidades de sellado.

### Herencia
hanko **incluye** las props heredadas, **aplanadas**, con `inheritedFrom` marcando el origen.

- **Razón 1 — hanko sella lo que el consumidor ve.** Un `disabled` heredado es tan real como un `variant` propio;
  el elemento vivo lo expone y los checks deben probarlo. Excluirlo = infra-testear.
- **Razón 2 — consistencia con el camino sin-CEM.** La introspección runtime no distingue heredado de propio
  (da la superficie ya aplanada). Modelo canónico = "contrato efectivo aplanado" → camino CEM e inferido
  producen la misma forma; `inheritedFrom` es metadato extra que solo el CEM rellena.
- **Razón 3 — sin ruido de framework.** El CEM solo documenta miembros declarados, no las tripas de LitElement.

Reglas de aplanado:
- **Lo propio gana sobre lo heredado** en colisión de nombre (override).
- **No se modela la jerarquía de clases** — solo aplanar + etiquetar. Modelar el árbol sería especular sin uso.

### `default` raw
Se guarda crudo en F0. El parseo a valor real se hará cuando un check lo necesite (resiliencia querrá el
valor efectivo). Lossless primero.

### `methods` diferidos
Se modelan en el tipo (son contrato: API imperativa) pero **no se pueblan ni validan hasta F3**. Ningún
check temprano los usa.

---

## Extensibilidad (fases futuras / hanko sin CEM)

El modelo de F0 está preparado para estructuras más complejas que llegarán con el **camino sin-CEM**
(inferencia runtime y adapters de formato custom), donde los tipos serán más turbios (objetos, formas
inferidas, encodings propios):

- **`TypeKind` es abierto** → futuras fases añaden `kind`s (`object-shape`, `array`, `function-sig`…) sin
  reformar el modelo.
- **`TypeModel.raw` es lossless** → ningún tipo se pierde aunque hanko no sepa parsearlo aún.
- **`ContractSource` ya contempla `adapter` e `inferred`** → el modelo no cambia de forma según la procedencia;
  solo cambia qué facetas vienen pobladas y con qué fidelidad.

Esto es "diseñar para la costura": el modelo nace listo para los caminos no-CEM sin especular su implementación.

---

## Criterios de aceptación (F0)

1. Existen los tipos en `src/core/contract.ts` y compilan bajo el tsconfig del paquete.
2. La distinción `undefined` (no declarado) vs `[]` (declarado vacío) es expresable y está documentada.
3. `TypeModel` conserva `raw` siempre y admite `'unknown'` como fallback.
4. `ContractSource` cubre `cem | adapter | inferred` desde el inicio.
5. `inheritedFrom` permite distinguir props propias de heredadas.
