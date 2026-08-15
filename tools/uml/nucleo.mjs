// Nucleo compartido por el CLI (uml.mjs) y el servidor MCP (server.mjs).
//
// Aqui vive todo lo delicado: el arranque del motor TeaVM de PlantUML y el
// rasterizado con Chromium. Las tres trampas del arranque estan explicadas en
// arrancarMotor(), y las dos fallan en silencio, asi que no toquetear el orden.
import { spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));

export const MAX_PX = 2400; // tope del lado mayor del png; por encima solo gasta bytes

export class ErrorDeEntorno extends Error {}

// --- motor --------------------------------------------------------------------

const localizarMotor = () => {
  let dir = AQUI;
  for (let i = 0; i < 8; i++) {
    const p = join(dir, 'node_modules', '@plantuml', 'mcp-js', 'engine.js');
    if (existsSync(p)) return p;
    const arriba = dirname(dir);
    if (arriba === dir) break;
    dir = arriba;
  }
  return null;
};

let motorCache = null;

/**
 * Arranca el motor TeaVM. Hace tres cosas obligatorias y en este orden:
 *
 *   1. Desviar console.log ANTES de importar el motor. TeaVM mapea el
 *      System.out de Java a console.log y el motor escupe ~20 lineas de traza
 *      por diagrama. En el CLI eso sepulta la salida util; en el servidor MCP
 *      romperia el framing JSON-RPC de stdout, que es un fallo mucho peor.
 *   2. Publicar globalThis.Viz ANTES de importar el motor. Los diagramas que
 *      necesitan layout de Graphviz (clases, estados, componentes) llaman a un
 *      @JSBody que espera un `Viz` global con `Viz.instance()`. Sin el fallan
 *      SOLO esos tipos y los de secuencia siguen yendo: un fallo a medias.
 *   3. Importar con pathToFileURL: en Windows el loader ESM rechaza una ruta
 *      absoluta "C:\..." como esquema de URL desconocido.
 *
 * @param {{ traza?: 'silencio' | 'stderr' }} opciones
 */
export const arrancarMotor = async ({ traza = 'silencio' } = {}) => {
  if (motorCache) return motorCache;

  const ruta = localizarMotor();
  if (!ruta) {
    throw new ErrorDeEntorno(`no encuentro @plantuml/mcp-js. Ejecuta "npm install" dentro de ${AQUI}`);
  }

  const sumidero = traza === 'stderr' ? console.error.bind(console) : () => {};
  console.log = sumidero;
  console.info = sumidero;
  console.debug = sumidero;

  let vizPromesa = null;
  try {
    const viz = await import('@viz-js/viz');
    globalThis.Viz = { instance: () => (vizPromesa ??= viz.instance()) };
  } catch (e) {
    throw new ErrorDeEntorno(
      `no encuentro @viz-js/viz, que es lo que da layout de Graphviz a los diagramas de clases y estados (${e.message})`
    );
  }

  const motor = await import(pathToFileURL(ruta).href);

  motorCache = {
    version: () => motor.version(),
    checkSyntax: (fuente) => JSON.parse(motor.checkSyntax(fuente)),
    explain: (fuente) => JSON.parse(motor.explain(fuente)),
    renderSvg: (fuente) =>
      new Promise((res, rej) => {
        const reloj = setTimeout(() => rej(new Error('el motor no ha contestado en 60s')), 60000);
        motor.renderSvg(fuente, (resultado) => {
          clearTimeout(reloj);
          try {
            res(JSON.parse(resultado));
          } catch (e) {
            rej(new Error(`el motor no ha devuelto JSON valido (${e.message})`));
          }
        });
      }),
  };

  return motorCache;
};

// --- rasterizado ---------------------------------------------------------------

const candidatosChromium = () => {
  const delEntorno = [process.env.CHROME_PATH, process.env.PUPPETEER_EXECUTABLE_PATH].filter(Boolean);
  if (process.platform === 'win32') {
    const pf = process.env.ProgramFiles ?? 'C:\\Program Files';
    const pf86 = process.env['ProgramFiles(x86)'] ?? 'C:\\Program Files (x86)';
    const local = process.env.LOCALAPPDATA ?? '';
    return [
      ...delEntorno,
      join(pf, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      join(pf86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      join(local, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      join(pf, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      join(pf86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    ];
  }
  if (process.platform === 'darwin') {
    return [
      ...delEntorno,
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    ];
  }
  const which = (n) => {
    const r = spawnSync('which', [n], { encoding: 'utf8' });
    return r.status === 0 ? r.stdout.trim() : null;
  };
  return [...delEntorno, which('google-chrome'), which('chromium'), which('chromium-browser'), which('microsoft-edge')].filter(Boolean);
};

let chromiumCache;
export const buscarChromium = () => {
  if (chromiumCache !== undefined) return chromiumCache;
  chromiumCache = candidatosChromium().find((p) => p && existsSync(p)) ?? null;
  return chromiumCache;
};

export const medidas = (svg) => {
  const m = svg.match(/<svg[^>]*?\bwidth="([\d.]+)px"[^>]*?\bheight="([\d.]+)px"/);
  if (m) return { w: Math.ceil(+m[1]), h: Math.ceil(+m[2]) };
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (vb) return { w: Math.ceil(+vb[1]), h: Math.ceil(+vb[2]) };
  return { w: 1200, h: 800 };
};

export const escalaReal = (w, h, pedida) => {
  let s = pedida;
  while (s > 1 && (w * s > MAX_PX || h * s > MAX_PX)) s -= 0.5;
  return Math.max(1, s);
};

/**
 * Rasteriza un .svg ya escrito en disco a .png con Chromium headless.
 * Lanza ErrorDeEntorno si no hay navegador o si el fichero no aparece.
 */
export const rasterizar = ({ rutaSvg, rutaPng, svg, escalaPedida = 2 }) => {
  const chromium = buscarChromium();
  if (!chromium) {
    throw new ErrorDeEntorno(
      'no encuentro Chrome, Chromium ni Edge para rasterizar. Apunta CHROME_PATH al ejecutable, o pide formato svg.'
    );
  }

  const { w, h } = medidas(svg);
  const escala = escalaReal(w, h, escalaPedida);

  // Borrar antes: Chrome puede salir con codigo 0 SIN escribir nada, asi que la
  // unica comprobacion fiable es que el fichero vuelva a aparecer.
  rmSync(rutaPng, { force: true });

  const r = spawnSync(
    chromium,
    [
      '--headless=new', // OJO: con "--headless" a secas sale con 0 y no escribe
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--virtual-time-budget=5000',
      '--default-background-color=FFFFFF',
      `--force-device-scale-factor=${escala}`,
      `--window-size=${w},${h}`,
      `--screenshot=${rutaPng}`,
      pathToFileURL(rutaSvg).href,
    ],
    { stdio: 'ignore', timeout: 90000 }
  );

  if (!existsSync(rutaPng)) {
    throw new ErrorDeEntorno(
      `chromium no ha escrito ${basename(rutaPng)} (codigo ${r.status ?? 'sin codigo'}). ` +
        `Ejecutable: ${chromium}. Si es una version vieja puede que no acepte --headless=new.`
    );
  }

  return { w: Math.round(w * escala), h: Math.round(h * escala), escala };
};
