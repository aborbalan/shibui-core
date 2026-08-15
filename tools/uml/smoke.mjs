#!/usr/bin/env node
// Smoke test del servidor MCP: lo arranca de verdad, habla JSON-RPC por stdio y
// comprueba lo que importa — que un render valido devuelva un bloque `image`
// (no marcado), que uno roto devuelva isError con numero de linea, y que la
// respuesta lleve SIEMPRE la ruta del fichero en el texto.
//
//   node smoke.mjs
//
// Sale 0 si todo pasa, 1 si algo falla.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));

const hijo = spawn(process.execPath, [join(AQUI, 'server.mjs')], { stdio: ['pipe', 'pipe', 'pipe'] });
let trazaServidor = '';
hijo.stderr.on('data', (d) => {
  trazaServidor += d;
});

let buf = '';
const pendientes = new Map();
hijo.stdout.on('data', (trozo) => {
  buf += trozo;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const linea = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!linea) continue;
    let m;
    try {
      m = JSON.parse(linea);
    } catch {
      console.error(`stdout contaminado (esto rompe el protocolo): ${linea.slice(0, 160)}`);
      continue;
    }
    if (m.id != null && pendientes.has(m.id)) {
      pendientes.get(m.id)(m);
      pendientes.delete(m.id);
    }
  }
});

let id = 1;
const rpc = (method, params) =>
  new Promise((res, rej) => {
    const mio = id++;
    pendientes.set(mio, (m) => (m.error ? rej(new Error(`${method}: ${JSON.stringify(m.error)}`)) : res(m.result)));
    hijo.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id: mio, method, params })}\n`);
    setTimeout(() => {
      if (pendientes.has(mio)) {
        pendientes.delete(mio);
        rej(new Error(`${method}: timeout a los 90s`));
      }
    }, 90000);
  });

const llamar = (name, args) => rpc('tools/call', { name, arguments: args });

let fallos = 0;
const comprobar = (etiqueta, condicion, detalle = '') => {
  if (condicion) {
    console.log(`  ok    ${etiqueta}`);
  } else {
    console.log(`  FALLO ${etiqueta}${detalle ? ` — ${detalle}` : ''}`);
    fallos++;
  }
};

const SEQ = '@startuml\nAlice -> Bob : hola\nBob --> Alice : que tal\n@enduml';
const CLS = '@startuml\nclass A\nclass B\nA *-- B\n@enduml';
const ROTO = '@startuml\nAlice -> Bob : bien\n%%%%mal%%%%\n@enduml';

const bloques = (r) => ({
  imagen: (r.content ?? []).find((c) => c.type === 'image'),
  texto: (r.content ?? []).find((c) => c.type === 'text'),
});

const main = async () => {
  const init = await rpc('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'smoke', version: '0' },
  });
  hijo.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} })}\n`);
  console.log(`servidor: ${init.serverInfo.name} ${init.serverInfo.version}`);

  const { tools } = await rpc('tools/list', {});
  console.log(`\ntools (${tools.length}): ${tools.map((t) => t.name).join(', ')}`);
  comprobar('estan las cuatro tools', tools.length === 4);

  console.log('\nrender_uml con un diagrama de secuencia');
  const a = await llamar('render_uml', { source: SEQ, name: 'smoke-seq' });
  const ba = bloques(a);
  comprobar('devuelve bloque image', !!ba.imagen, `bloques: ${(a.content ?? []).map((c) => c.type).join(',')}`);
  comprobar('la imagen es png', ba.imagen?.mimeType === 'image/png');
  comprobar('la imagen trae datos', (ba.imagen?.data?.length ?? 0) > 1000);
  comprobar('el texto lleva la ruta del png', /\.png/.test(ba.texto?.text ?? ''));
  comprobar('el texto NO lleva el svg entero', (ba.texto?.text?.length ?? 0) < 600, `${ba.texto?.text?.length} chars`);
  const ruta = (ba.texto?.text ?? '').match(/png: (.+?) \(/)?.[1];
  comprobar('el png existe en disco', !!ruta && existsSync(ruta), ruta ?? 'sin ruta');

  console.log('\nrender_uml con un diagrama de clases (camino Graphviz)');
  const b = await llamar('render_uml', { source: CLS, name: 'smoke-cls' });
  comprobar('renderiza y devuelve imagen', !!bloques(b).imagen);
  comprobar('no marcado como error', !b.isError);

  console.log('\nrender_uml con sintaxis rota');
  const c = await llamar('render_uml', { source: ROTO, name: 'smoke-roto' });
  comprobar('marcado isError', c.isError === true);
  comprobar('sin bloque image', !bloques(c).imagen);
  comprobar('dice el numero de linea', /linea 3/.test(bloques(c).texto?.text ?? ''));

  console.log('\ncheck_uml');
  const d = await llamar('check_uml', { source: SEQ });
  comprobar('valido sin error', !d.isError);
  const e = await llamar('check_uml', { source: ROTO });
  comprobar('roto con isError', e.isError === true);

  console.log('\nexplain_uml');
  const f = await llamar('explain_uml', { source: SEQ });
  comprobar('devuelve explicacion', (bloques(f).texto?.text?.length ?? 0) > 20);

  console.log(`\n${fallos === 0 ? 'TODO OK' : `${fallos} comprobaciones fallidas`}`);
  if (fallos > 0 && trazaServidor) console.error(`\ntraza del servidor:\n${trazaServidor.slice(-1500)}`);
  hijo.kill();
  process.exit(fallos > 0 ? 1 : 0);
};

main().catch((e) => {
  console.error(`FALLO: ${e.message}`);
  if (trazaServidor) console.error(`traza del servidor:\n${trazaServidor.slice(-1500)}`);
  hijo.kill();
  process.exit(1);
});
