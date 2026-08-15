#!/usr/bin/env node
// uml - convierte ficheros .puml en .svg y .png. Sin Java, sin servidor
// externo, sin mandar nada fuera de la maquina.
//
// Todo lo delicado (arranque del motor TeaVM, rasterizado) vive en nucleo.mjs,
// compartido con el servidor MCP.
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, join, resolve } from 'node:path';
import { arrancarMotor, ErrorDeEntorno, MAX_PX, rasterizar } from './nucleo.mjs';

const out = (linea) => process.stdout.write(`${linea}\n`);
const err = (linea) => process.stderr.write(`${linea}\n`);
const morir = (codigo, mensaje) => {
  err(`uml: ${mensaje}`);
  process.exit(codigo);
};

// --- argumentos --------------------------------------------------------------

const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
  out(`uml - de .puml a .svg + .png

  node uml.mjs <fichero.puml> [mas ficheros...] [opciones]

  --out <dir>     directorio de salida (por defecto, junto al fuente)
  --format <fmt>  svg | png | both        (por defecto both)
  --scale <n>     factor de rasterizado   (por defecto 2, con tope de ${MAX_PX}px)
  --check         solo valida la sintaxis, no escribe nada
  --verbose       deja ver la traza del motor
  --help          esto

  Codigos de salida: 0 todo bien - 1 error de sintaxis - 2 problema de entorno`);
  process.exit(0);
}

const opcion = (nombre, pordefecto) => {
  const i = argv.indexOf(nombre);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : pordefecto;
};
const bandera = (nombre) => argv.includes(nombre);

const dirSalida = opcion('--out', null);
const formato = opcion('--format', 'both');
const escalaPedida = Number(opcion('--scale', '2'));
const soloCheck = bandera('--check');
const verbose = bandera('--verbose');

if (!['svg', 'png', 'both'].includes(formato)) morir(2, `--format tiene que ser svg, png o both (era "${formato}")`);
if (!Number.isFinite(escalaPedida) || escalaPedida <= 0) morir(2, `--scale tiene que ser un numero positivo (era "${opcion('--scale', '')}")`);

const CON_VALOR = new Set(['--out', '--format', '--scale']);
const entradas = argv.filter((a, i) => !a.startsWith('--') && !CON_VALOR.has(argv[i - 1]));
if (entradas.length === 0) morir(2, 'no me has dado ningun fichero .puml');

for (const f of entradas) if (!existsSync(f)) morir(2, `no existe el fichero "${f}"`);

// --- bucle principal ----------------------------------------------------------

let motor;
try {
  motor = await arrancarMotor({ traza: verbose ? 'stderr' : 'silencio' });
} catch (e) {
  morir(2, e.message);
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
let fallos = 0;

for (const entrada of entradas) {
  const fuente = readFileSync(entrada, 'utf8');
  const nombre = basename(entrada, extname(entrada));
  const destino = dirSalida ? (isAbsolute(dirSalida) ? dirSalida : resolve(dirSalida)) : dirname(resolve(entrada));
  if (!existsSync(destino)) mkdirSync(destino, { recursive: true });

  let datos;
  try {
    datos = await motor.renderSvg(fuente);
  } catch (e) {
    err(`${entrada}  FALLO  ${e.message}`);
    fallos++;
    continue;
  }

  if (!datos.valid) {
    err(`${entrada}  ERROR de sintaxis en la linea ${datos.errorLineNumber}: ${datos.errorMessage}`);
    if (datos.errorLine) err(`   ${String(datos.errorLineNumber).padStart(4)} | ${datos.errorLine}`);
    fallos++;
    continue;
  }

  const avisos = (datos.warnings ?? []).length ? `  avisos: ${datos.warnings.join('; ')}` : '';

  if (soloCheck) {
    out(`${entrada}  ${datos.diagramType}  ${datos.lineCount} lineas  sintaxis OK${avisos}`);
    continue;
  }

  const piezas = [];
  const rutaSvg = join(destino, `${nombre}.svg`);
  // El svg se escribe siempre: es la entrada del rasterizado. Si el formato
  // pedido era solo png, se borra al final.
  writeFileSync(rutaSvg, datos.svg, 'utf8');
  if (formato !== 'png') piezas.push(`${basename(rutaSvg)} (${kb(statSync(rutaSvg).size)})`);

  if (formato !== 'svg') {
    const rutaPng = join(destino, `${nombre}.png`);
    try {
      const { w, h, escala } = rasterizar({ rutaSvg, rutaPng, svg: datos.svg, escalaPedida });
      const nota = escala !== escalaPedida ? ` @${escala}x` : '';
      piezas.push(`${basename(rutaPng)} (${w}x${h}${nota}, ${kb(statSync(rutaPng).size)})`);
    } catch (e) {
      if (e instanceof ErrorDeEntorno) morir(2, e.message);
      throw e;
    }
  }

  if (formato === 'png') rmSync(rutaSvg, { force: true });

  out(`${entrada}  ${datos.diagramType}  ${datos.lineCount} lineas  ->  ${piezas.join('  ')}${avisos}`);
}

process.exit(fallos > 0 ? 1 : 0);
