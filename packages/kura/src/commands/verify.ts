/* ============================================================
   kura verify · comprobar lo que de verdad se está sirviendo

   Sin credenciales: solo HTTP público contra `https://<sitio>.web.app`.
   Eso permite correrlo desde CI sin secretos y desde cualquier sitio.

   La comprobación que justifica el comando es `no-localhost`. El
   fallo que ataca ya ocurrió en este repo: los showcases leen el
   catálogo de una API por variable de entorno de build, y cuando esa
   variable falta el bundle desplegado apunta a localhost. No falla
   nada en CI, el deploy sale verde, y las páginas quedan vacías en
   producción. Solo se ve mirando lo servido.

   `expect-origin` es opcional a propósito. Codificar aquí el dominio
   de la API convertiría una herramienta genérica en una a medida de
   este repo; se pasa por flag y se documenta la invocación.
   ============================================================ */
import type { HostingConfig, HostingTarget } from '../config';
import type { HttpClient } from '../http';
import { KuraError } from '../envelope';

export type CheckName = 'root-200' | 'spa-rewrite' | 'no-localhost' | 'expect-origin';

export interface CheckRow {
  target: string;
  url: string;
  check: CheckName;
  ok: boolean;
  detail: string;
}

export interface VerifyOptions {
  onlyTarget?: string | undefined;
  expectOrigin?: string | undefined;
}

/** Un origen de desarrollo en un bundle publicado. El puerto evita falsos positivos con la palabra suelta. */
const ORIGEN_DE_DESARROLLO = /(?:localhost|127\.0\.0\.1)(?::\d+)/;

/** Ruta que no existe en ningún sitio: si responde 200 con HTML, hay reescritura de SPA. */
const RUTA_INEXISTENTE = '/kura-comprueba-el-rewrite-no-borrar';

/**
 * Techos del rastreo por sitio. Hay que seguir los chunks diferidos, no solo
 * lo que cuelga del index: en una app con división de código, el módulo que
 * llama a la API es JUSTO el que se carga tarde. Un escáner que solo mire los
 * assets ansiosos no puede ver el fallo que este comando existe para cazar.
 */
const MAX_ASSETS = 40;
const MAX_BYTES = 24 * 1024 * 1024;

interface Documento {
  url: string;
  text: string;
}

export async function reportVerify(
  config: HostingConfig,
  http: HttpClient,
  options: VerifyOptions = {},
): Promise<CheckRow[]> {
  const selected = select(config.targets, options.onlyTarget);
  const rows: CheckRow[] = [];

  for (const target of selected) {
    rows.push(...(await verifyTarget(target, http, options.expectOrigin)));
  }
  return rows;
}

async function verifyTarget(
  target: HostingTarget,
  http: HttpClient,
  expectOrigin: string | undefined,
): Promise<CheckRow[]> {
  const site = target.sites[0];
  const url = site === undefined ? '' : `https://${site}.web.app`;
  const row = (check: CheckName, ok: boolean, detail: string): CheckRow => ({
    target: target.target,
    url,
    check,
    ok,
    detail,
  });

  if (site === undefined) {
    return [row('root-200', false, 'el target no declara ningún sitio en .firebaserc')];
  }

  const root = await http.get(`${url}/`);
  if (root.failure !== null) {
    return [row('root-200', false, `sin respuesta: ${root.failure}`)];
  }
  if (root.status !== 200) {
    return [row('root-200', false, `respondió ${root.status}`)];
  }
  if (!/html/i.test(root.contentType)) {
    return [row('root-200', false, `respondió 200 pero con content-type ${root.contentType || 'desconocido'}`)];
  }

  const rows: CheckRow[] = [row('root-200', true, `200 · ${root.body.length} bytes de HTML`)];

  if (target.spa) {
    const probe = await http.get(`${url}${RUTA_INEXISTENTE}`);
    const served = probe.status === 200 && /<html/i.test(probe.body);
    rows.push(
      row(
        'spa-rewrite',
        served,
        served ? 'una ruta inexistente devuelve el index' : `una ruta inexistente devolvió ${probe.status}`,
      ),
    );
  }

  const documents = await crawl(http, url, root.body);

  const culprit = documents.find((document) => ORIGEN_DE_DESARROLLO.test(document.text));
  rows.push(
    culprit === undefined
      ? row('no-localhost', true, `sin origen de desarrollo en ${documents.length} recursos`)
      : row(
          'no-localhost',
          false,
          `${shortName(culprit.url)} contiene ${ORIGEN_DE_DESARROLLO.exec(culprit.text)?.[0] ?? 'un origen local'}`,
        ),
  );

  if (expectOrigin !== undefined) {
    const found = documents.some((document) => document.text.includes(expectOrigin));
    rows.push(
      row(
        'expect-origin',
        found,
        found ? `${expectOrigin} presente` : `${expectOrigin} no aparece en ${documents.length} recursos`,
      ),
    );
  }

  return rows;
}

/** Scripts y módulos precargados que cuelgan del index, resueltos a absolutos. */
export function assetUrls(html: string, base: string): string[] {
  const found = new Set<string>();
  const patterns = [
    /<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi,
    /<link\b[^>]*\brel\s*=\s*["']modulepreload["'][^>]*\bhref\s*=\s*["']([^"']+)["']/gi,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const raw = match[1];
      if (raw === undefined) continue;
      try {
        const resolved = new URL(raw, `${base}/`);
        // Solo del propio sitio: un CDN de terceros no es asunto nuestro.
        if (resolved.origin === new URL(base).origin) found.add(resolved.toString());
      } catch {
        // src no resoluble: se ignora en vez de tumbar la verificación.
      }
    }
  }
  return [...found];
}

/**
 * Chunks referenciados como literal DENTRO de un bundle ya descargado. Es la
 * forma que toma un `import()` diferido una vez construido, y por tanto el
 * único rastro que deja el código que se carga tarde.
 */
export function chunkUrls(js: string, documentUrl: string): string[] {
  const found = new Set<string>();
  const origin = new URL(documentUrl).origin;

  for (const match of js.matchAll(CHUNK_LITERAL)) {
    const raw = match[1];
    if (raw === undefined) continue;
    try {
      const resolved = new URL(raw, documentUrl);
      if (resolved.origin === origin) found.add(resolved.toString());
    } catch {
      // Literal que no es una ruta resoluble: se ignora.
    }
  }
  return [...found];
}

/** Rutas `.js` en literales: `"./Pagina-abc123.js"`, `"/assets/x.js"`. */
const CHUNK_LITERAL = /["'`]((?:\.{1,2})?\/[\w./-]*\.js)["'`]/g;

/**
 * Recorre el index y, en anchura, todo lo que va apareciendo, con tope de
 * recursos y de bytes para que un sitio grande no dispare el comando.
 */
async function crawl(http: HttpClient, base: string, rootHtml: string): Promise<Documento[]> {
  const documents: Documento[] = [{ url: `${base}/`, text: rootHtml }];
  const seen = new Set<string>([`${base}/`]);
  const queue = assetUrls(rootHtml, base);
  let bytes = rootHtml.length;

  while (queue.length > 0 && documents.length < MAX_ASSETS && bytes < MAX_BYTES) {
    const url = queue.shift();
    if (url === undefined) break;
    if (seen.has(url)) continue;
    seen.add(url);

    const response = await http.get(url);
    if (response.failure !== null || response.status !== 200) continue;

    documents.push({ url, text: response.body });
    bytes += response.body.length;

    for (const chunk of chunkUrls(response.body, url)) {
      if (!seen.has(chunk)) queue.push(chunk);
    }
  }
  return documents;
}

function select(targets: readonly HostingTarget[], onlyTarget?: string): readonly HostingTarget[] {
  if (onlyTarget === undefined) return targets;

  const found = targets.filter((target) => target.target === onlyTarget);
  if (found.length === 0) {
    throw new KuraError(
      'NOT_FOUND',
      `No hay ningún target llamado '${onlyTarget}'`,
      `Disponibles: ${targets.map((target) => target.target).join(' · ')}`,
    );
  }
  return found;
}

function shortName(url: string): string {
  const path = new URL(url).pathname;
  return path === '/' ? 'index.html' : path.slice(path.lastIndexOf('/') + 1);
}
