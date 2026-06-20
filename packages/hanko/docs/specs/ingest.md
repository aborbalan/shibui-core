# Spec · Ingestión del manifest (F1)

> **Estado:** v0 — implementado en `src/ingest/`.
> **Fase:** F1 (ingestión del manifest). Depende de [`data-model.md`](data-model.md).

---

## Propósito

Convertir un **Custom Elements Manifest (CEM)** ya parseado en el modelo interno `ContractSet`.
Es el **borde de ingestión**: el único punto del motor que conoce el formato de cable. A partir de aquí,
todo habla el modelo interno.

```
custom-elements.json  ──►  ingestCem()  ──►  ContractSet
   (formato de cable)        (borde)          (modelo interno)
```

## Superficie pública

```ts
ingestCem(manifest: CustomElementsManifest): ContractSet   // src/ingest/cem.ts
parseType(raw: string | undefined): TypeModel              // src/ingest/parse-type.ts
```

`CustomElementsManifest` y demás tipos de **entrada** (parciales, solo lo que usamos) viven en
`src/ingest/cem-types.ts`. No se reutilizan tipos de shibui: el core es genérico.

## Pipeline

1. Recorrer `manifest.modules[].declarations[]`.
2. **Filtrar** a unidades de sellado: `kind === 'class' && customElement === true && tagName`.
   Mixins, funciones y clases base sueltas se descartan.
3. Por cada declaración válida, construir un `ComponentContract` con `source = { kind: 'cem' }`.
4. Indexar por `tagName` en un `Map`.

## Mapeo de miembros

| CEM | Modelo | Regla |
|---|---|---|
| `members[]` (field) | `properties[]` | Campos `kind:'field'`, no `private`/`protected`, no `static`. |
| `members[]` (method) | `methods[]` | Métodos `kind:'method'` públicos (no `private`/`protected`/`static`). **Poblados desde F3.** |
| `member.attribute` | `property.attribute` | Solo si está presente. |
| `member.reflects` | `property.reflects` | `=== true` → `true`; ausente → `false`. |
| `member.default` | `property.default` | **Raw**, sin parsear. |
| `member.type.text` | `property.type` | Vía `parseType` (ver abajo). |
| `member.inheritedFrom.name` | `property.inheritedFrom` | Aplanado + etiquetado (decisión del modelo). |
| `events[]` | `events[]` | |
| `slots[]` | `slots[]` | `name` ausente/`''` = slot por defecto. |
| `cssParts[]` | `cssParts[]` | |
| `cssProperties[]` | `cssProps[]` | |

## Semántica de presencia (regla de oro)

Se preserva fielmente la distinción del modelo:

- Faceta **ausente** en el CEM (p.ej. el decl no trae `events`) → el campo queda **`undefined`** → no verificable.
- Faceta **presente** → se mapea, aunque resulte **`[]`** → verificable (debe estar vacía).

Implementación: cada faceta solo se asigna dentro de `if (decl.<faceta> !== undefined)`.

## `parseType` — parseo superficial

Devuelve `TypeModel { raw, kind, literals? }`. `raw` **siempre** se conserva (lossless).

| Entrada | `kind` | `literals` |
|---|---|---|
| `boolean` / `number` / `string` | el primitivo | — |
| `'a' \| 'b' \| 'c'` | `string-union` | `['a','b','c']` |
| `'md'` (literal único) | `string-union` | `['md']` |
| `'a' \| number` (mixta) | `unknown` | — |
| `Array<string \| number>` | `unknown` | — (no trocea genéricos) |
| `{ … }` / `Record<…>` | `object` | — |
| vacío / ausente | `unknown` | — |

El troceo de uniones es **consciente de profundidad** (`<> () [] {}` y literales), para no romper
`Array<string | number>` por el `|` interno.

## Manejo de entrada incompleta

Ingestión **leniente**, coherente con *ausencia ≠ incumplimiento*: lo que falta queda `undefined`,
no se lanza. `modules`/`declarations`/`members` ausentes se tratan como vacíos. La validación de
"¿es un CEM válido?" (schema, Floor del ADR-001) es responsabilidad de un check posterior, no del parser.

## Fuera de alcance (futuro)

- **Adapters de formatos custom** (caso especial): enchufarán en este mismo borde emitiendo `ContractSet`.
  No se construyen aún.
- **Inferencia runtime** (sin manifest): camino aparte, también fuera de F1.
- **Carga de fichero / `cem analyze`**: `ingestCem` recibe el manifest **ya parseado**; de dónde sale el JSON
  (lectura de disco, etc.) es responsabilidad del llamante.

## Criterios de aceptación (F1)

1. `ingestCem` filtra correctamente a custom elements con `tagName`.
2. Campos públicos a `properties[]` y métodos públicos a `methods[]`; privadas/protegidas/estáticas excluidas.
3. `reflect`, `attribute`, `default` (raw) e `inheritedFrom` preservados.
4. Semántica de presencia respetada (faceta ausente → `undefined`).
5. `parseType` resuelve primitivos y uniones de literales; degrada a `unknown` con `raw` intacto.
6. Tests verdes en `src/ingest/*.test.ts`.
