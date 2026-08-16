# uml

PlantUML en local: **sin Java, sin servidor externo, sin mandar nada fuera de la máquina.**

Viene en dos formas sobre el mismo motor:

- **Servidor MCP** (`server.mjs`) — el agente pide un diagrama y recibe **la imagen**, no el marcado.
- **CLI** (`uml.mjs`) — `.puml` → `.svg` + `.png` desde la terminal.

Es un directorio autocontenido: no toca el `package.json` del repo que lo hospeda ni depende de
nada suyo. Se copia a cualquier proyecto tal cual.

## Por qué existe

El motor ya estaba resuelto: [`@plantuml/mcp-js`](https://www.npmjs.com/package/@plantuml/mcp-js)
es oficial de PlantUML, MIT, y lleva dentro el build TeaVM del motor. Lo que no encajaba era el
**formato de salida**: su tool MCP devuelve el SVG como string dentro de un JSON, ~15.000
caracteres de marcado por diagrama. Para un agente son dos problemas a la vez — no *ve* el
diagrama, solo lo lee, y cada render le cuesta unos 4.000 tokens de contexto.

Aquí el motor es el mismo (literalmente su `engine.js`), pero la respuesta es un bloque `image`
con el PNG y tres líneas de resumen. Un defecto de layout —una etiqueta pisando una línea de vida,
dos cajas solapadas— salta a la vista y es invisible en el marcado.

La respuesta lleva **siempre** la ruta del fichero además de la imagen. Si el cliente pinta bloques
`image`, es una llamada. Si no los pinta, el agente abre la ruta. Ningún cliente se queda fuera.

## Estructura

| Fichero | Qué es |
|---|---|
| `nucleo.mjs` | Arranque del motor TeaVM y rasterizado. Todo lo delicado vive aquí |
| `server.mjs` | Servidor MCP: `render_uml`, `render_uml_file`, `check_uml`, `explain_uml` |
| `uml.mjs` | CLI |
| `smoke.mjs` | Prueba el servidor MCP de punta a punta. `node smoke.mjs` |
| `SKILL.md` | Skill para el agente. Copiar a `~/.claude/skills/uml/` o `.claude/skills/uml/` |
| `ejemplos/` | Secuencia, clases (camino Graphviz) y uno roto a propósito |

## Instalación

```bash
npm install
```

Node >= 18 y un Chromium para rasterizar: vale Chrome, Chromium o **Edge** (que en Windows viene
de serie). Se busca en las rutas estándar de Windows, macOS y Linux; si está en un sitio raro,
apunta `CHROME_PATH` al ejecutable.

Registrar el servidor MCP en Claude Code, para todos los proyectos:

```bash
claude mcp add-json uml "{\"type\":\"stdio\",\"command\":\"node\",\"args\":[\"/ruta/a/uml/server.mjs\"]}" --scope user
```

En Windows, usa barras normales en la ruta — Node las acepta y te ahorra el infierno de escapado.

Comprobar que quedó bien:

```bash
node smoke.mjs
```

## Uso del CLI

```bash
node uml.mjs diagrama.puml
```

```
diagrama.puml  SequenceDiagram  30 lineas  ->  diagrama.svg (15.0 KB)  diagrama.png (1362x908, 79.1 KB)
```

| Opción | Qué hace |
|---|---|
| `--out <dir>` | Directorio de salida. Por defecto, junto al fuente |
| `--format svg\|png\|both` | Por defecto `both` |
| `--scale <n>` | Factor de rasterizado. Por defecto `2`, con tope automático de 2400 px |
| `--check` | Solo valida la sintaxis, no escribe nada |
| `--verbose` | Deja ver la traza del motor |

Acepta varios ficheros en una invocación, bastante más rápido que llamarlo N veces: el motor tarda
~1 s en arrancar y luego va a ~300 ms por diagrama.

Códigos de salida: `0` bien · `1` error de sintaxis · `2` problema de entorno.

```
roto.puml  ERROR de sintaxis en la linea 3: Syntax Error? (Assumed diagram type: sequence)
      3 | %%%%esta no lo esta%%%%
```

## Las tres trampas

Están comentadas en `nucleo.mjs`, pero conviene tenerlas a mano porque las tres fallan **en
silencio**, que es la peor forma de fallar.

1. **`--headless=new`, no `--headless`.** Con el flag antiguo, Chrome sale con código 0, no imprime
   ningún error y no escribe el fichero. Por eso se borra el PNG antes de invocar a Chromium: así
   comprobar que el fichero existe después es una comprobación de verdad.

2. **`globalThis.Viz` hay que publicarlo antes de importar el motor.** Los diagramas que necesitan
   layout de Graphviz (clases, estados, componentes) llaman a un `@JSBody` que espera un `Viz`
   global. Sin él fallan esos tipos y los de secuencia siguen funcionando: un fallo a medias, el
   más difícil de diagnosticar. `ejemplos/clases.puml` existe para cubrir ese camino.

3. **Hay que silenciar `console.log` antes de importar el motor.** TeaVM mapea el `System.out` de
   Java a `console.log` y el motor escupe ~20 líneas de traza por diagrama. En el CLI sepulta la
   salida útil; en el servidor MCP rompería el framing JSON-RPC de stdout, que es mucho peor.

Y una cuarta, de npm: **`npm install --prefix <dir>` desde otra cwd** mete el paquete del
directorio de trabajo como dependencia. Instala desde dentro del directorio.

## Llevarlo a otro proyecto

Si está registrado en ámbito de usuario, no hay que hacer nada: ya está en todos.

Para una copia por proyecto:

```bash
cp -r tools/uml /ruta/al/otro/repo/tools/uml
cd /ruta/al/otro/repo/tools/uml && npm install
```

No hay nada que ajustar: no lee configuración del repo que lo hospeda ni escribe en él.
