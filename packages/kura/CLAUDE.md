# kura (`@shibui-ui/kura`) — CLI de Firebase Hosting

蔵 — el almacén: qué hay guardado, qué hay publicado y qué falta por subir.

Capa fina sobre `firebase-tools` para los nueve sitios del ecosistema, pensada para que la
usen por igual un humano en la terminal y un agente por Bash. **No** reemplaza a
`firebase-tools`: rellena lo que le falta para ese uso.

> El estado vivo (fase actual, bloqueos, siguiente paso) vive en
> [`docs/HANDOFF.md`](docs/HANDOFF.md), no aquí. Aquí va lo estable.

---

## Principios (no negociables)

1. **`stdout` es datos, `stderr` es narración.** Cargar `firebase-tools` ya escupe avisos
   ajenos por stderr; el ruido es inevitable y tiene que caer donde no estorbe.
2. **Cero interactividad.** Nunca hay un prompt. Si falta algo, se sale con código y se dice
   qué flag añadir. Un prompt cuelga a un agente hasta el timeout.
3. **El formato lo decide el destino, no un flag.** Tabla con TTY delante, NDJSON sin él.
4. **Los frenos se dosifican según lo que cuesta deshacer el error**, no por uniformidad.
   Crear un sitio es aditivo y reversible: basta la simulación por defecto. Publicar en
   producción es irreversible de hecho: exige `--live` y `--confirm <target>`.
5. **`src/commands/*` son funciones puras** que reciben su adaptador y devuelven datos. No
   imprimen ni salen del proceso. Es lo que permite testear sin red ni credenciales, y lo
   que deja la puerta abierta a un servidor MCP sobre el mismo núcleo.

---

## ⛔ La regla que no se debe «simplificar»

**`src/adapter.ts` invoca `firebase-tools` POR SUBPROCESO. No lo cambies a un import.**

La API programática (`require('firebase-tools')`) **solo tolera dos llamadas por proceso**.
A la tercera lanza `Cannot read properties of undefined (reading 'indexOf')` desde
`commander@5.1.0`: los comandos se registran de forma perezosa en un programa compartido y el
registro repetido corrompe ese estado global. Medido: en serie funcionan 2 de 9 llamadas; en
paralelo fallan las 9 en 1 ms, antes de tocar la red.

F0 eligió el import porque solo comprobó que los métodos *existían*. F2 lo tumbó al usarlos.
Está documentado con su medición en [`docs/f0-hallazgos.md`](docs/f0-hallazgos.md).

Se invoca el entry JS con `process.execPath`, no el shim `firebase.CMD`: sin shell, sin
comillas que escapar y sin depender de que `node_modules/.bin` exista.

---

## Estructura (`src/`)

```
cli.ts            → ÚNICO fichero que toca process, imprime o decide códigos de salida
spec.ts           → superficie maquinable; de aquí se DERIVAN los flags de parseArgs
envelope.ts       → sobre {ok,data}/{ok,error} + códigos de salida
format.ts         → table | json | ndjson
config.ts         → .firebaserc × firebase.json → modelo de targets (sin red)
http.ts           → cliente HTTP inyectable (verify no necesita credenciales)
adapter.ts        → ÚNICA frontera con firebase-tools (subproceso + parseadores puros)
commands/
  targets.ts      → configuración × disco
  status.ts       → + qué hay publicado
  verify.ts       → comprobaciones HTTP sobre lo servido
  sites.ts        → inventario y aprovisionamiento de sitios
  deploy.ts       → la única operación con efectos hacia fuera
```

Tests `*.test.ts` conviven con su fuente. **Ninguno sale a la red ni usa credenciales.**

---

## Scripts

```bash
pnpm --filter @shibui-ui/kura type-check
pnpm --filter @shibui-ui/kura test
pnpm exec tsx packages/kura/src/cli.ts <comando>   # desde la raíz, en desarrollo
```

Desde la raíz hay `pnpm kura`, pero **para uso maquinal hace falta `pnpm --silent kura`**:
sin `--silent`, pnpm escribe su banner en stdout y rompe el NDJSON.

---

## Instrucciones para Claude

- **Antes de tocar `adapter.ts`**, lee arriba por qué va por subproceso. No es una decisión
  estética y tiene una medición detrás.
- **Un flag nuevo se declara en `src/spec.ts`**, no en `cli.ts`: `parseArgs` se deriva de ahí
  y `spec.test.ts` falla si la ayuda en prosa se queda atrás.
- **Nunca ejecutes `deploy --live`.** Publicar en estos sitios es publicar en internet y lo
  autoriza el usuario en cada ocasión. `deploy` a canal de preview y `sites create` también
  tienen efectos: pídelos antes de lanzarlos con `--execute`.
- Los comandos sin red (`targets`) **no deben importar el adaptador**: cargarlo cuesta cerca
  de un segundo. Import diferido con `await import()`.
- Antes de dar por bueno un parseador, comprueba la forma real leyendo la fuente de
  `firebase-tools` en `node_modules`. Se hizo así con `hosting:channel:deploy` y evitó
  adivinar.
- GitFlow del monorepo: destino `develop`, nunca `main`.
