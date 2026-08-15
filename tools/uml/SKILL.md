---
name: uml
description: Usar al crear, editar o revisar diagramas UML y PlantUML (secuencia, clases, componentes, estados, casos de uso, despliegue, actividad, ERD) o al documentar arquitectura con diagramas. Cubre escribir el .puml, renderizarlo y verificarlo visualmente. Trigger words - UML, PlantUML, puml, diagrama de secuencia, diagrama de clases, sequence diagram, class diagram, diagrama de arquitectura, diagrama de componentes.
---

# UML con verificación visual

Hay un servidor MCP `uml` en ámbito de usuario, disponible en todos los proyectos. Renderiza en
local: sin Java, sin servidor externo, sin mandar el diagrama fuera de la máquina — importante
cuando el sistema que dibujas es de un cliente.

## La regla que importa

**Escribir el `.puml` no es terminar. Terminar es haber mirado el diagrama.**

PlantUML coloca los elementos por su cuenta y sale mal a menudo: etiquetas pisando líneas de vida,
cajas solapadas, flechas cruzando texto, diagramas estirados hasta ser ilegibles. Nada de eso se
ve leyendo el fuente ni el SVG — el marcado siempre "parece" correcto. Solo se ve mirando la
imagen. Un diagrama entregado sin haberlo mirado es un diagrama sin revisar.

Por eso `render_uml` devuelve la imagen en la propia respuesta. No hay que dar un paso extra para
verla: ya está ahí. Mírala.

## Las tools

| Tool | Cuándo |
|---|---|
| `render_uml` | Diagrama nuevo o en iteración. Le pasas el fuente, devuelve la imagen |
| `render_uml_file` | Un `.puml` que ya vive en el repo. Escribe el `.svg` y el `.png` junto al fuente |
| `check_uml` | Solo validar sintaxis, sin renderizar. Para comprobar rápido antes de un lote |
| `explain_uml` | Entender un `.puml` ajeno, o por qué una directiva no hace lo que esperabas |

Si el servidor MCP no estuviera disponible, el mismo motor está como CLI:

```bash
node ~/.claude/tools/uml/uml.mjs diagrama.puml
```

## Al revisar la imagen

Mira específicamente: ¿se lee todo el texto?, ¿hay cajas o etiquetas solapadas?, ¿alguna flecha
cruza texto?, ¿la proporción es razonable o se ha estirado a lo ancho? Si algo falla, corrige el
fuente y vuelve a renderizar. En diagramas no triviales suelen hacer falta dos o tres vueltas.

Cuando un diagrama se vuelve ilegible por número de elementos, la solución no es pelear el layout:
es partirlo en varios diagramas. Uno general con las piezas y el flujo principal, y luego uno por
sub-flujo interesante.

## Errores de sintaxis

Vienen con número de línea y la línea literal. El mensaje dice qué tipo de diagrama *asumió* el
motor: cuando eso no cuadra con lo que querías dibujar, el fallo real casi siempre está **antes**
de esa línea — una directiva de apertura mal escrita hace que PlantUML adivine mal el tipo y luego
se queje de una línea perfectamente válida.

## Dónde van los ficheros

Los `.puml` se versionan en el repo, junto a la documentación que ilustran: son texto, se revisan
en un PR y se ven en diff. El `.svg` y el `.png` son build output regenerable, así que al
`.gitignore` — salvo que la documentación tenga que verse donde no se renderiza PlantUML (un
README de GitHub), y entonces se versiona solo el PNG.

## Cuándo NO usar PlantUML

- **El diagrama vive en un README o una issue de GitHub** → Mermaid, que GitHub renderiza nativo.
- **El diagrama es para comunicar, no para documentar** → SVG a mano. El layout automático deja de
  ser presentable pasados unos 15 nodos y no se puede pelear del todo.
- **Arquitectura de alto nivel para humanos** → considera C4 (`C4-PlantUML`) antes que UML estricto.

## Ingeniería inversa desde el código

Cuando el diagrama debe reflejar código que ya existe, sácalo del código y no de lo que el equipo
cree que hace el sistema. Con CodeGraph disponible, `codegraph_callers` y `codegraph_impact` dan el
grafo de llamadas y el de herencia, que son literalmente un diagrama de secuencia y uno de clases.
Sin él, lectura de código.
