# F0 — Reconocimiento: ¿hace falta `kura`?

**Fecha:** 2026-08-11 · **Entorno:** Windows 10, Node v22.13.0, pnpm 9.15.9,
`firebase-tools@15.14.0` (devDep de la raíz).

F0 existe para poder **matar el proyecto barato**. Su criterio de parada, fijado antes de
mirar nada: *si el servidor MCP oficial de `firebase-tools` ya cubre `status` y `verify` de
forma utilizable, el plan se recorta a F3 y F4 sobre lo que falte.*

**Resultado: el criterio no se dispara. El plan sigue completo.**

---

## 1. El servidor MCP oficial no toca Hosting

`firebase-tools` trae su propio servidor MCP (`firebase mcp`, alias `experimental:mcp`,
definido en `lib/commands/mcp.js`, con `requireAuth` como precondición). Sus herramientas se
agrupan por producto en `lib/mcp/tools/`:

```
apphosting  apptesting  auth  core  crashlytics  dataconnect
firestore   functions   messaging  realtime_database  remoteconfig  storage
```

**No hay directorio `hosting`.** El que se le parece, `apphosting`, es Firebase App Hosting
—el producto de SSR con builds gestionados—, no el Hosting estático clásico que usan los
nueve sitios del ecosistema. Sobre Hosting clásico, el servidor MCP oficial no expone nada.

De paso queda confirmado el resto del mapa de huecos: `lib/mcp/tools/firestore/index.js`
registra una única herramienta (`query_collection`) y `storage` solo `get_download_url`.

**Consecuencia:** cablear el MCP oficial en `.mcp.json` no resuelve nada de lo que `kura`
pretende resolver. Puede añadirse igualmente por otros motivos, pero no como alternativa.

## 2. La API programática expone exactamente lo que hace falta

`require('firebase-tools')` devuelve un objeto con 32 claves de primer nivel. La rama de
Hosting, recorrida entera:

```
hosting.channel.create()   hosting.channel.delete()   hosting.channel.deploy()
hosting.channel.list()     hosting.channel.open()
hosting.clone()            hosting.disable()
hosting.sites.create()     hosting.sites.delete()
hosting.sites.get()        hosting.sites.list()
```

Más lo necesario alrededor: `deploy()`, `target()`, `use()`, `projects.list()`, `login()`,
`logout()`.

`hosting.sites.list` y `hosting.channel.list` cubren F2 (`status`) directamente, y
`hosting.channel.deploy` cubre el destino por defecto de F4. **No se ha invocado ninguna**:
todas exigen autenticación y red, y F0 solo inspecciona formas.

## 3. La interoperabilidad ESM funciona

El paquete es CommonJS (`"main": "./lib/index.js"`, sin `"type": "module"`). Verificado que
llega correctamente por importación por defecto desde ESM:

```js
import fbt from 'firebase-tools';
// typeof fbt                        → 'object'
// typeof fbt.hosting.channel.list   → 'function'
// typeof fbt.hosting.sites.list     → 'function'
```

No hacen falta `createRequire` ni artificios de interoperabilidad.

## 4. Coste de arranque: aceptable, pero hay que diferirlo

| Medición | Tiempo |
|---|---|
| Node en vacío (`node -e "0"`) | 57 ms |
| `require('firebase-tools')`, en caliente | 747 – 1016 ms |
| `require('firebase-tools')`, caché de disco fría | 30 265 ms |

El import cuesta unos **700–950 ms netos** sobre el arranque de Node. Es asumible para un
CLI que se invoca una vez por comando, pero **no es gratis**: confirma el riesgo nº3 del
plan y convierte su mitigación en obligatoria. Los comandos que no tocan la red —`targets`
en F1— no deben importar el adaptador; carga diferida con `await import()`.

Los 30 s del primer arranque eran caché de disco fría, no un coste real recurrente. Se
anotan para que nadie vuelva a asustarse con la primera medición.

Detalle menor con efecto en el contrato de E/S: cargar el módulo imprime un
`DeprecationWarning` de `punycode` **por stderr**. Es exactamente la razón por la que el
contrato reserva `stdout` para datos: el ruido de terceros es inevitable y debe caer donde
no estorbe.

## 5. El fallback a subproceso no es viable en este entorno

El plan contemplaba, como mitigación del riesgo nº1, caer a subproceso con `--json` si la
API programática resultaba inestable. **Esa salida no existe aquí:**

```
pnpm --dir D:\PROYECTOS\shibui-ecosystem exec firebase --version
→ "firebase" no se reconoce como un comando interno o externo   (exit 255)
```

No hay `node_modules/.bin` en la raíz del repo principal: la instalación local está
degradada, en la línea de lo ya conocido sobre este entorno. En CI, donde cada job hace
`pnpm install --frozen-lockfile` en limpio, los binarios sí se crean y los deploys
funcionan —de ahí que no se hubiera notado.

**Consecuencia:** el import programático deja de ser la opción preferida y pasa a ser la
única. La mitigación del riesgo nº1 se sustituye: en vez de un fallback a subproceso, el
test de humo de F2 sobre la forma de la respuesta gana importancia, y la versión de
`firebase-tools` se fija exacta.

## 6. Deriva de configuración detectada al ramificar

La rama se creó desde `origin/develop` recién traído (`4a35fc0`), que iba **19 commits por
delante** de la referencia local. En esos commits, `app-opencells` pasó a llamarse
`app-torii`.

Siguen siendo nueve targets, pero el noveno es `torii` → sitio `shibui-torii`, no
`opencells`. La sección de contexto del plan queda corregida en ese punto. `kura targets`
leerá esto del disco en F1, así que no hay nada que codificar a mano, pero conviene que la
documentación no mienta.

---

## Decisión

Seguir con el plan completo, con tres ajustes:

1. El adaptador de F2 usa **solo** el import programático. No hay fallback a subproceso.
2. La carga diferida del adaptador deja de ser una optimización y pasa a ser un requisito
   de F1: `targets` debe responder en ~60 ms, no en un segundo.
3. Cablear `firebase mcp` en `.mcp.json` sale del alcance de `kura`. No aporta nada a
   Hosting; si se añade, será por Firestore o Auth y con su propia justificación.

---

# Corrección (F2) — el punto 1 era erróneo

Al implementar F2 se cayó la premisa central de este documento. Se deja escrita en vez de
reescribir la historia, porque el error tiene una lección.

**La API programática solo tolera dos invocaciones por proceso.** A partir de la tercera
lanza, desde dentro de `commander@5.1.0`:

```
TypeError: Cannot read properties of undefined (reading 'indexOf')
  at new Option            (commander/index.js:23:27)
  at Command.register      (firebase-tools/lib/command.js:77:22)
  at load                  (firebase-tools/lib/commands/index.js:9:17)
```

Los comandos se registran de forma **perezosa en un programa de `commander` compartido**, y
el registro repetido corrompe ese estado global. Medido sobre los nueve sitios: en serie
funcionan las dos primeras llamadas y fallan las siete restantes; lanzadas en paralelo
fallan las nueve en 1 ms, es decir, antes de tocar la red.

Para un CLI que consulta nueve sitios, eso lo hace inservible.

**Lo que F0 no vio y por qué.** La sonda de F0 se limitó a inspeccionar la FORMA del objeto
exportado. Comprobó que `hosting.channel.list` era una función, no que se pudiera llamar dos
veces. Un reconocimiento que solo mira firmas no distingue una API usable de una que se
autodestruye al tercer uso: hay que ejercitarla.

**Y el fallback sí existía.** Este documento concluyó que no había salida por subproceso
porque faltaba `node_modules/.bin` en la raíz. Ese defecto se reparó después con un
`pnpm install --frozen-lockfile`, así que la alternativa que aquí se daba por muerta es
justo la que F2 acabó usando. Un hallazgo de entorno no es un hallazgo de arquitectura.

**Decisión vigente:** el adaptador invoca el entry JS con `process.execPath` (sin shell, sin
depender de `.bin`) y lee el sobre `--json`. Se paga ~2,7-4 s por llamada, mitigado con un
límite de cuatro consultas en paralelo. Detalle en la cabecera de `src/adapter.ts`.
