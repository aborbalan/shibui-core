#!/usr/bin/env node
// Servidor MCP de uml. Renderiza PlantUML y devuelve LA IMAGEN, no su marcado.
//
// Por que existe habiendo un servidor MCP oficial (@plantuml/mcp-js): el oficial
// devuelve el SVG como string dentro de un JSON de texto. Para un agente eso son
// dos problemas — no ve el diagrama, lo lee; y le cuesta ~4.000 tokens por
// diagrama (15.381 caracteres para uno de 30 lineas). Aqui el motor es el mismo
// (es su engine.js), pero la salida es un bloque `image` con el PNG y tres
// lineas de resumen.
//
// Diseno a prueba de clientes: la respuesta lleva SIEMPRE la ruta del fichero en
// el texto, ademas de la imagen. Si el cliente pinta bloques `image`, una
// llamada y listo. Si no los pinta, el agente abre la ruta. La incognita no
// bloquea nada.
//
// stdout es SAGRADO en modo stdio: solo JSON-RPC. Por eso lo primero que hace
// este fichero es desviar console.log a stderr, antes de importar nada que
// pueda escribir (el motor TeaVM mapea ahi el System.out de Java).
console.log = (...a) => console.error(...a);
console.info = (...a) => console.error(...a);
console.debug = (...a) => console.error(...a);

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, isAbsolute, join, resolve } from 'node:path';
import { z } from 'zod';
import { arrancarMotor, ErrorDeEntorno, rasterizar } from './nucleo.mjs';

const motor = await arrancarMotor({ traza: 'stderr' });

const DIR_TEMP = join(tmpdir(), 'uml-mcp');
mkdirSync(DIR_TEMP, { recursive: true });

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

const texto = (t) => ({ content: [{ type: 'text', text: t }] });
const fallo = (t) => ({ isError: true, content: [{ type: 'text', text: t }] });

const falloDeSintaxis = (d, de) =>
  fallo(
    `Error de sintaxis${de ? ` en ${de}` : ''}, linea ${d.errorLineNumber}: ${d.errorMessage}\n` +
      (d.errorLine ? `  ${d.errorLineNumber} | ${d.errorLine}\n` : '') +
      'Nota: el motor dice que tipo de diagrama asumio. Si no cuadra con lo que querias dibujar, ' +
      'el fallo real suele estar ANTES de esa linea (una directiva de apertura mal escrita hace que ' +
      'PlantUML adivine mal el tipo y luego se queje de una linea correcta).'
  );

const nombreSeguro = (n) => (n ?? 'diagrama').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '') || 'diagrama';

/**
 * Renderiza y compone la respuesta MCP: imagen + resumen con rutas.
 */
const responder = async ({ fuente, destino, nombre, escala, formato, origen }) => {
  let datos;
  try {
    datos = await motor.renderSvg(fuente);
  } catch (e) {
    return fallo(`No he podido renderizar: ${e.message}`);
  }

  if (!datos.valid) return falloDeSintaxis(datos, origen);

  mkdirSync(destino, { recursive: true });
  const rutaSvg = join(destino, `${nombre}.svg`);
  writeFileSync(rutaSvg, datos.svg, 'utf8');

  const lineas = [`${datos.diagramType}, ${datos.lineCount} lineas.`];
  if ((datos.warnings ?? []).length) lineas.push(`Avisos: ${datos.warnings.join('; ')}`);

  if (formato === 'svg') {
    lineas.push(`svg: ${rutaSvg} (${kb(statSync(rutaSvg).size)})`);
    return texto(lineas.join('\n'));
  }

  const rutaPng = join(destino, `${nombre}.png`);
  let medida;
  try {
    medida = rasterizar({ rutaSvg, rutaPng, svg: datos.svg, escalaPedida: escala });
  } catch (e) {
    if (e instanceof ErrorDeEntorno) {
      lineas.push(`svg: ${rutaSvg}`);
      lineas.push(`No he podido rasterizar a png: ${e.message}`);
      return fallo(lineas.join('\n'));
    }
    throw e;
  }

  lineas.push(`png: ${rutaPng} (${medida.w}x${medida.h}, ${kb(statSync(rutaPng).size)})`);
  lineas.push(`svg: ${rutaSvg}`);

  return {
    content: [
      { type: 'image', data: readFileSync(rutaPng).toString('base64'), mimeType: 'image/png' },
      { type: 'text', text: lineas.join('\n') },
    ],
  };
};

// --- servidor -----------------------------------------------------------------

const server = new McpServer({ name: 'uml', version: '0.2.0' });

server.tool(
  'render_uml',
  'Renderiza un diagrama PlantUML pasado como texto y DEVUELVE LA IMAGEN, para poder revisarla ' +
    'de verdad. Usar siempre despues de escribir o modificar un diagrama: PlantUML coloca los ' +
    'elementos por su cuenta y los solapes solo se ven mirando el resultado. Escribe el .svg y el ' +
    '.png en un directorio temporal y devuelve sus rutas.',
  {
    source: z.string().describe('El fuente PlantUML completo, con @startuml/@enduml'),
    name: z.string().optional().describe('Nombre para los ficheros, sin extension (por defecto "diagrama")'),
    scale: z.number().optional().describe('Factor de rasterizado, por defecto 2'),
    format: z.enum(['png', 'svg']).optional().describe('"svg" salta el rasterizado y no devuelve imagen'),
  },
  async ({ source, name, scale, format }) =>
    responder({
      fuente: source,
      destino: DIR_TEMP,
      nombre: nombreSeguro(name),
      escala: scale ?? 2,
      formato: format ?? 'png',
      origen: null,
    })
);

server.tool(
  'render_uml_file',
  'Renderiza un fichero .puml que ya existe en disco y DEVUELVE LA IMAGEN. Escribe el .svg y el ' +
    '.png junto al fuente, que es lo que quieres para diagramas versionados en un repo.',
  {
    path: z.string().describe('Ruta al fichero .puml'),
    scale: z.number().optional().describe('Factor de rasterizado, por defecto 2'),
    format: z.enum(['png', 'svg']).optional().describe('"svg" salta el rasterizado y no devuelve imagen'),
    out: z.string().optional().describe('Directorio de salida (por defecto, junto al fuente)'),
  },
  async ({ path, scale, format, out }) => {
    const abs = isAbsolute(path) ? path : resolve(path);
    if (!existsSync(abs)) return fallo(`No existe el fichero ${abs}`);
    let fuente;
    try {
      fuente = readFileSync(abs, 'utf8');
    } catch (e) {
      return fallo(`No he podido leer ${abs}: ${e.message}`);
    }
    return responder({
      fuente,
      destino: out ? (isAbsolute(out) ? out : resolve(out)) : dirname(abs),
      nombre: basename(abs, extname(abs)),
      escala: scale ?? 2,
      formato: format ?? 'png',
      origen: basename(abs),
    });
  }
);

server.tool(
  'check_uml',
  'Valida la sintaxis de un diagrama PlantUML sin renderizarlo. Rapido, para comprobar antes de ' +
    'lanzar un lote. No sustituye a mirar la imagen: la sintaxis correcta no garantiza un layout legible.',
  { source: z.string().describe('El fuente PlantUML completo, con @startuml/@enduml') },
  async ({ source }) => {
    let d;
    try {
      d = motor.checkSyntax(source);
    } catch (e) {
      return fallo(`No he podido validar: ${e.message}`);
    }
    if (!d.valid) return falloDeSintaxis(d, null);
    const avisos = (d.warnings ?? []).length ? `\nAvisos: ${d.warnings.join('; ')}` : '';
    return texto(`Sintaxis correcta. ${d.diagramType}, ${d.lineCount} lineas.${avisos}`);
  }
);

server.tool(
  'explain_uml',
  'Explica linea a linea como interpreta PlantUML un diagrama. Util para entender un .puml ajeno ' +
    'o para localizar por que una directiva no hace lo que esperabas.',
  { source: z.string().describe('El fuente PlantUML completo, con @startuml/@enduml') },
  async ({ source }) => {
    let filas;
    try {
      filas = motor.explain(source);
    } catch (e) {
      return fallo(`No he podido explicarlo: ${e.message}`);
    }
    const cuerpo = filas
      .map((f) => `${f.line != null ? `${String(f.line).padStart(4)} | ` : '     | '}${f.input ?? ''}\n       ${f.explain ?? ''}`)
      .join('\n');
    return texto(cuerpo || 'El motor no ha devuelto explicacion para este diagrama.');
  }
);

await server.connect(new StdioServerTransport());
console.error(`[uml] servidor listo. PlantUML ${motor.version()}. Temporales en ${DIR_TEMP}`);
