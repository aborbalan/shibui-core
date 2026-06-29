# F8 — Tablilla partida (warifu 割符)

> Une dos productos del ecosistema: un motivo de sukashi que **solo se compone cuando el
> manifiesto de confianza de [hanko](../../hanko/) está completo**. El núcleo no importa hanko
> ni shibui — lee la *forma* del Trust Report como un manifiesto genérico.

---

## Idea

Un *割符* (warifu) es una tablilla histórica partida en dos mitades que solo encajan entre sí —
prueba de autenticidad por coincidencia. Aquí el motivo se reparte en:

- una **mitad guardada** (`tally`) — ruido por sí sola, como cualquier capa de sukashi;
- una **mitad-manifiesto** — no se guarda: se **regenera** de forma determinista a partir de un
  `match`, y el `match` solo existe cuando el manifiesto cumple su condición.

```
manifiesto (todo sellado?) ──sí──▶ match ──▶ regenera la mitad que falta ──▶ compose = motivo
                            └─no──▶ (sin match) ──▶ tablilla incompleta ──▶ ruido
```

La condición por defecto (`allSealed`) se cumple cuando **todos** los patrones del manifiesto
están sellados. Conectado al Trust Report de hanko, eso es: el proyecto entero verificado
(`untrusted === 0`).

## Cómo encaja con el weave (F1)

`kasaneWeave` produce dos mitades `[A, B]`: `A` depende solo del generador de aleatoriedad, `B`
depende del motivo. Sembrando ese generador desde `match`, **`A` es regenerable** desde el
manifiesto; se guarda **`B`** (la `tally`, ruido marginal). Abrir = regenerar `A` y componer.
Un `match` distinto ⇒ otra `A` ⇒ ruido. La secrecía de una sola mitad es la misma de sukashi;
lo que F8 añade es que la mitad que falta **está condicionada al manifiesto**.

## Dos formas, un mismo reparto

- **Motivo visual** — `seal(motif, match)` → `Warifu{ tally }`; `open(warifu, match)` → las dos
  mitades (`compose` revela el motivo si el `match` coincide).
- **Bytes sellados** — `sealBytes(bytes, match)` / `openBytes(locked, match)`: los bytes quedan
  ligados al manifiesto (autoinverso; `match` distinto → bytes incoherentes).

## API (`src/warifu/`)

| Símbolo | Qué hace |
|---|---|
| `SealManifest` · `ManifestEntry` | Conjunto de patrones registrados (`name`) y si están sellados (`sealed`). |
| `allSealed` · `SealPolicy` | Política: por defecto, todos sellados (y ≥1). |
| `manifestMatch(m, policy?)` | El `match` (32 B) si el manifiesto cumple; si no, `null`. Determinista, ligado al roster sellado. |
| `seal(motif, match)` | Reparte el motivo → `Warifu{ tally }` (mitad guardada, ruido sola). |
| `open(warifu, match)` | Regenera la otra mitad → `[Layer, Layer]` (`compose` revela si `match` coincide). |
| `openWithManifest(warifu, m, policy?)` | Cumple → las dos mitades; no cumple → `null`. |
| `sealBytes` / `openBytes` | Sella/recupera bytes contra el `match` (XOR autoinverso). |
| `manifestFromTrustReport(report)` | Adaptador: Trust Report de hanko → `SealManifest` (tipado estructural, sin importar hanko). |

```ts
import { manifestFromTrustReport, openWithManifest, seal, manifestMatch } from '../src/warifu';
import trustReport from '../../hanko/hanko-report/trust-report.json';

const manifest = manifestFromTrustReport(trustReport);
const match = await manifestMatch(manifest);   // null si el proyecto no está entero sellado
const w = await seal(motif, match!);            // (sellado, con un match válido)
const halves = await openWithManifest(w, manifest); // null hasta que hanko cumpla
```

## Frontera / genericidad

El núcleo de `warifu` es **puro y node-safe**: opera sobre `Bitmap` y bytes, no toca DOM y **no
importa hanko ni `@shibui-ui/ui`**. Conoce solo `SealManifest` (genérico). El adaptador
`manifestFromTrustReport` mapea la *forma* del Trust Report por tipado estructural — lee el dato,
no el código. Cualquier fuente que produzca un manifiesto `{ name, sealed }` sirve igual.

## Verificación

- `manifestMatch`: cumple → 32 B deterministas · no cumple / vacío → `null` · ligado al roster.
- `seal`/`open`: `match` correcto → revela (error 0); `match` equivocado → no revela; `tally`
  sola → ruido marginal.
- `openWithManifest`: cumplido revela, no cumplido `null`.
- bytes: round-trip con el `match` correcto; `match` equivocado → incoherente.
- adaptador hanko: report todo-sellado abre; report con algún componente sin sellar no abre.
- **e2e (snapshot real)**: el test carga un recorte del Trust Report real de hanko
  (`demo/fixtures/hanko-trust-report.json`, hoy 4/102) → `allSealed` falso → no abre; con los mismos
  componentes todos sellados → revela (error 0).

## Demo

La demo (`demo/`) incluye la sección **«Candado · tablilla (warifu)»** con un selector de
manifiesto: **Proyecto sellado** (los 102 sellados → la tablilla abre y compone el motivo) ·
**Trust Report real (hoy)** (4/102 → cerrada) · **Casi (falta 1)** (cerrada). El motivo se sella
contra el roster completo de hanko; solo el manifiesto entero sellado regenera la mitad que falta.

> Nota de estado: hoy el consumer #1 (shibui) no está entero sellado, así que la tablilla
> permanece cerrada — por diseño: se abre **cuando se cumpla hanko**. El selector «Proyecto
> sellado» muestra el estado cumplido (futuro) y revela el motivo.
