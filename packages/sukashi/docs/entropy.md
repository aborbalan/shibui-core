# F7 — Semilla del cielo (kumo 雲)

> Adaptador **opcional** y enchufable. El núcleo nunca depende de la cámara: solo conoce
> el *seam* `SeedSource` de F1. Da a los patrones un origen físico y poético —una foto del
> cielo— sin cambiar nada del *weave*.

---

## Idea

El motor de patrones se siembra de una `SeedSource` (F1, default `systemSeed` = aleatoriedad
del sistema). `kumo` añade una fuente alternativa: **mira al cielo**, condensa la imagen y la
**mezcla** con la semilla del sistema. Estilo *LavaRand*: la entropía física del sensor
suplementa la del sistema, nunca la sustituye.

```
cámara → fotogramas → health-test → SHA-256 (condensa) → XOR sobre systemSeed → SeedSource
                          │ falla
                          └──────────────────────────────→ systemSeed (fallback)
```

## Garantía de seguridad — «mezcla, nunca reemplaza»

La mezcla es **XOR sobre la salida de `systemSeed`** (`mixSeed`). Como `systemSeed` ya es un
CSPRNG (uniforme), XOR con cualquier pool independiente conserva la entropía completa:

- El resultado **nunca degrada por debajo de la semilla del sistema**, aunque el cielo sea
  pobre (pool de ceros → XOR identidad → exactamente `systemSeed`).
- El cielo solo **suma** imprevisibilidad física; no es la seguridad del esquema (esa sigue
  siendo la del *weave* de F1–F6).

Por eso el *gotcha* del diseño se cumple por construcción: si la entropía del cielo es mala,
no puede empeorar la del sistema.

## Health-test (`health.ts`)

Antes de mezclar nada se valida la captura:

- **Imagen congelada** — algún par de fotogramas consecutivos idéntico byte a byte (cámara
  parada, foto fija) → descartar. Con menos de 2 fotogramas tampoco hay movimiento → congelado.
- **Entropía baja** — entropía de Shannon (bits/byte, 0..8) por debajo del umbral
  (`minEntropyBitsPerByte`, default 4): cielo plano, lente tapada, noche cerrada → descartar.

Cualquier fallo del health-test ⇒ **fallback** a `systemSeed`.

## API (`src/entropy/`)

| Símbolo | Qué hace |
|---|---|
| `SkyCapture` | Interfaz inyectable: `frames(count) → Promise<Uint8Array[]>`. El núcleo solo conoce esto. |
| `openSky(capture, opts?)` | Captura + health-test + condensa + mezcla → `SkySeedResult`. Cae a `systemSeed` ante cualquier fallo. |
| `mixSeed(system, pool)` | Puro: `SeedSource` que XOR-mezcla `pool` sobre `system`. Pool vacío → `system` intacto. |
| `condense(frame)` | SHA-256 → 32 bytes de pool (determinista). |
| `healthCheck(frames, opts?)` | `{ ok, reason?, entropy }`. |
| `cameraSky(opts?)` | Adaptador de cámara (**solo navegador**, fuera del barrel node). |

`SkySeedResult = { source, usedSky, reason?, entropy? }` — `source` siempre es usable; `usedSky`
distingue cielo de fallback (útil para mensajería de la demo).

```ts
import { openSky } from '../src/entropy';
import { cameraSky } from '../src/entropy/camera'; // adaptador DOM, import directo (no barrel)

const sky = await openSky(cameraSky());            // pide cámara; cae a sistema si falla
const layers = kasaneWeave(motif, { rng: rngFrom(sky.source) });
```

## Frontera node / navegador

El núcleo (`condense` · `health` · `sky`) es **puro y testeable en node**: la cámara entra por
la interfaz `SkyCapture`. El adaptador real `cameraSky` usa `navigator.mediaDevices` + `<canvas>`
y **no** se re-exporta desde el barrel node (`entropy/index.ts`) —la demo lo importa directo,
mismo patrón que `web/`. Así el `weave` funciona idéntico con `systemSeed` o con el cielo.

## Verificación

- `mixSeed`: XOR real, pool vacío/ceros = sin degradación, longitud exacta.
- `openSky`: cielo vivo → mezcla; cámara falla / congelada / entropía baja → fallback a sistema.
- `condense`: 32 bytes, determinista, sensible al input.
- `health`: congelado, entropía baja, vivo.
- **weave-compat**: `reconstructError(compose(kasaneWeave(motif, { rng: rngFrom(sky.source) })), motif) === 0`.

Demo: botón **🌥 Del cielo** en sukashi.web.app — pide cámara, mezcla, y si no hay permiso lo
dice y se queda con la semilla del sistema.
