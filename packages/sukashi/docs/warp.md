# F4½ — Deformación en remolino (uzumaki 渦)

> Adaptador **opcional** y enchufable. El núcleo no depende de él: el warp opera sobre
> `Bitmap`/`Layer` ya tejidos. Da movimiento —covers en espiral y un giro reversible de las
> capas— sin tocar el *weave*.

---

## Idea

Un **campo de deflexión angular dependiente del radio**: cada anillo concéntrico gira un
ángulo `Ω·falloff(r/R)`. En el continuo es una rotación pura por anillo, así que es
**exactamente invertible** — deshacer con `−Ω` recupera la imagen. En discreto, el único error
es el redondeo al vecino más próximo del muestreo *backward*, concentrado cerca del eje.

```
warp(b, Ω)  →  cada anillo gira Ω·falloff(r/R)
warp(_, −Ω) →  lo deshace   (ida y vuelta ≈ identidad)
```

`falloff(ρ) = (1−ρ)²` para `ρ<1`, `0` fuera del radio: el remolino se funde con la zona quieta
sin costura (derivada nula en el borde).

## ⚠️ Ω es estética, no la clave

El warp **no añade ninguna garantía de seguridad**. La secrecía sigue siendo la del *weave*
(una capa aislada es ruido). Ω solo redistribuye píxeles de forma determinista y reversible:
ofuscación + estética. Quien tenga las capas y el `Ω` correcto revela igual; quien no tenga
las capas no revela nada, con o sin warp.

## Doble rol

**1 · Cover en espiral (`spiral`).** Un campo de molinete (brazos por ángulo) que se enrosca
radialmente — hermana de seigaiha/moiré. Vista sola, cada capa es un remolino decorativo, no
ruido. Registrada como cover `'uzumaki'` en `PATTERNS_BY_NAME`, teje igual que los demás.

**2 · Deformar / des-deformar capas (`warpAll` / `unwarpAll`).** Como `compose` conmuta con un
remap idéntico de píxeles, deformar **todas** las capas con el mismo Ω cumple:

```
compose(warpAll(layers, Ω))  ===  warp(compose(layers), Ω)     // exacto, sin tolerancia
```

es decir, la superposición revela el **motivo girado**, y `unwarpAll(_, Ω)` lo devuelve a su
sitio. Una capa deformada solo "encaja" limpiamente con su Ω.

## API (`src/warp/`)

| Símbolo | Qué hace |
|---|---|
| `warp(src, Ω, opts?)` | Deforma un `Bitmap` girando cada anillo `Ω·falloff(r/R)`. Muestreo *backward*. |
| `warpAll(layers, Ω, opts?)` | Deforma todas las capas con el mismo Ω. |
| `unwarpAll(layers, Ω, opts?)` | Inverso: des-deforma con `−Ω`. |
| `spiral(opts)` | `PatternGenerator`: cover en espiral determinista (`arms`, `scale`, `seed`). |
| `UzumakiOptions` | `center?` (default centro) · `radius?` (default media diagonal). |

```ts
import { warpAll, unwarpAll, spiral } from '../src/warp';

const layers = kasaneWeave(motif);                 // tejido normal
const twisted = warpAll([...layers], Math.PI / 3); // gira ambas capas 60° en el centro
// compose(twisted) revela el motivo girado; unwarpAll(twisted, Math.PI/3) lo endereza.

const cover = spiral({ width: 52, height: 52, scale: 9, arms: 3 }); // cover en remolino
```

## Frontera node / navegador

El módulo es **puro y testeable en node**: opera sobre `Bitmap`, sin DOM. Se re-exporta desde
el barrel raíz (`src/index.ts`); la demo lo usa para el deslizador **Remolino (Ω)** y para el
cover `Uzumaki`.

## Verificación

- `Ω=0` ⇒ identidad exacta.
- El warp mueve píxeles de verdad (no es un no-op).
- **Ida y vuelta** (`Ω` luego `−Ω`) ≈ identidad dentro de tolerancia.
- Fuera del radio, ningún píxel cambia.
- **Conmutatividad**: `compose(warpAll(L, Ω)) === warp(compose(L), Ω)` (exacto).
- Deformar + des-deformar conserva el motivo revelado.
- `spiral`: tamaño correcto, estructura (ni todo tinta ni todo fondo), determinista por
  semilla, sensible al número de brazos.

Demo: deslizador **Remolino (Ω)** + cover **Uzumaki** en sukashi.web.app.
