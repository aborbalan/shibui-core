import { describe, it, expect } from 'vitest';
import { assetUrls, chunkUrls, reportVerify, type CheckRow } from './verify';
import type { HostingConfig, HostingTarget } from '../config';
import type { HttpClient, HttpResponse } from '../http';
import { KuraError } from '../envelope';

function target(name: string, site: string, spa = true): HostingTarget {
  return { target: name, sites: [site], publicDir: `dist/${name}`, spa };
}

function config(...targets: HostingTarget[]): HostingConfig {
  return { root: '/repo', project: 'lib-ui-b67c5', targets };
}

function html(body: string): HttpResponse {
  return { status: 200, contentType: 'text/html; charset=utf-8', body, failure: null };
}

function js(body: string): HttpResponse {
  return { status: 200, contentType: 'application/javascript', body, failure: null };
}

/** Cliente falso: un mapa de URL a respuesta. Lo no declarado da 404. */
function client(routes: Record<string, HttpResponse>): HttpClient {
  return {
    get: async (url) => routes[url] ?? { status: 404, contentType: '', body: '', failure: null },
  };
}

const INDEX = '<!doctype html><html><head><script src="/assets/app-abc123.js"></script></head><body></body></html>';

function pick(rows: CheckRow[], check: string): CheckRow | undefined {
  return rows.find((row) => row.check === check);
}

describe('kura verify · la raíz responde', () => {
  it('pasa cuando devuelve 200 con HTML', async () => {
    const rows = await reportVerify(
      config(target('cv', 'shibui-cv', false)),
      client({ 'https://shibui-cv.web.app/': html(INDEX), 'https://shibui-cv.web.app/assets/app-abc123.js': js('const x=1') }),
    );
    expect(pick(rows, 'root-200')).toMatchObject({ ok: true, url: 'https://shibui-cv.web.app' });
  });

  it('falla y se detiene si el sitio no responde', async () => {
    const caido: HttpResponse = { status: 0, contentType: '', body: '', failure: 'getaddrinfo ENOTFOUND' };
    const rows = await reportVerify(config(target('cv', 'shibui-cv')), client({ 'https://shibui-cv.web.app/': caido }));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ check: 'root-200', ok: false });
    expect(rows[0]?.detail).toContain('ENOTFOUND');
  });

  it('falla si responde 200 pero no es HTML', async () => {
    const rows = await reportVerify(
      config(target('cv', 'shibui-cv')),
      client({ 'https://shibui-cv.web.app/': { status: 200, contentType: 'application/json', body: '{}', failure: null } }),
    );
    expect(pick(rows, 'root-200')?.ok).toBe(false);
  });
});

describe('kura verify · reescritura de SPA', () => {
  const rutaProbe = 'https://shibui-cv.web.app/kura-comprueba-el-rewrite-no-borrar';

  it('pasa cuando una ruta inexistente devuelve el index', async () => {
    const rows = await reportVerify(
      config(target('cv', 'shibui-cv', true)),
      client({ 'https://shibui-cv.web.app/': html(INDEX), [rutaProbe]: html(INDEX) }),
    );
    expect(pick(rows, 'spa-rewrite')?.ok).toBe(true);
  });

  it('falla cuando una ruta inexistente da 404', async () => {
    const rows = await reportVerify(
      config(target('cv', 'shibui-cv', true)),
      client({ 'https://shibui-cv.web.app/': html(INDEX) }),
    );
    expect(pick(rows, 'spa-rewrite')).toMatchObject({ ok: false });
  });

  it('no comprueba el rewrite en targets que no son SPA', async () => {
    const rows = await reportVerify(
      config(target('storybook', 'shibui-showcase-storybook', false)),
      client({ 'https://shibui-showcase-storybook.web.app/': html('<html></html>') }),
    );
    expect(pick(rows, 'spa-rewrite')).toBeUndefined();
  });
});

describe('kura verify · configuración de desarrollo incrustada', () => {
  it('caza el localhost:3000 en el bundle publicado', async () => {
    const rows = await reportVerify(
      config(target('react', 'shibui-showcase-react', true)),
      client({
        'https://shibui-showcase-react.web.app/': html(INDEX),
        'https://shibui-showcase-react.web.app/kura-comprueba-el-rewrite-no-borrar': html(INDEX),
        'https://shibui-showcase-react.web.app/assets/app-abc123.js': js('const API="http://localhost:3000/api/v1";'),
      }),
    );
    const row = pick(rows, 'no-localhost');
    expect(row?.ok).toBe(false);
    expect(row?.detail).toContain('localhost:3000');
    expect(row?.detail).toContain('app-abc123.js');
  });

  it('también lo caza si está en el propio index', async () => {
    const rows = await reportVerify(
      config(target('cv', 'shibui-cv', false)),
      client({ 'https://shibui-cv.web.app/': html('<html><script>var a="http://127.0.0.1:8080"</script></html>') }),
    );
    expect(pick(rows, 'no-localhost')?.ok).toBe(false);
  });

  it('no confunde la palabra localhost sin puerto con un origen de desarrollo', async () => {
    const rows = await reportVerify(
      config(target('cv', 'shibui-cv', false)),
      client({ 'https://shibui-cv.web.app/': html('<html><!-- no usar localhost en produccion --></html>') }),
    );
    expect(pick(rows, 'no-localhost')?.ok).toBe(true);
  });

  it('pasa cuando el bundle está limpio', async () => {
    const rows = await reportVerify(
      config(target('cv', 'shibui-cv', false)),
      client({
        'https://shibui-cv.web.app/': html(INDEX),
        'https://shibui-cv.web.app/assets/app-abc123.js': js('const API="https://shibui-core.onrender.com";'),
      }),
    );
    expect(pick(rows, 'no-localhost')?.ok).toBe(true);
  });
});

describe('kura verify · origen esperado', () => {
  const routes = {
    'https://shibui-showcase-react.web.app/': html(INDEX),
    'https://shibui-showcase-react.web.app/assets/app-abc123.js': js('fetch("https://shibui-core.onrender.com/api/v1")'),
  };

  it('no se comprueba si no se pide', async () => {
    const rows = await reportVerify(config(target('react', 'shibui-showcase-react', false)), client(routes));
    expect(pick(rows, 'expect-origin')).toBeUndefined();
  });

  it('pasa si el origen aparece en algún recurso', async () => {
    const rows = await reportVerify(config(target('react', 'shibui-showcase-react', false)), client(routes), {
      expectOrigin: 'shibui-core.onrender.com',
    });
    expect(pick(rows, 'expect-origin')?.ok).toBe(true);
  });

  it('falla si no aparece', async () => {
    const rows = await reportVerify(config(target('react', 'shibui-showcase-react', false)), client(routes), {
      expectOrigin: 'api.ejemplo.com',
    });
    expect(pick(rows, 'expect-origin')?.ok).toBe(false);
  });
});

describe('kura verify · selección de assets', () => {
  it('resuelve scripts y modulepreload relativos contra el sitio', () => {
    const page = `
      <script src="/assets/a.js"></script>
      <script src="b.js"></script>
      <link rel="modulepreload" href="/assets/c.js">
    `;
    expect(assetUrls(page, 'https://sitio.web.app')).toEqual([
      'https://sitio.web.app/assets/a.js',
      'https://sitio.web.app/b.js',
      'https://sitio.web.app/assets/c.js',
    ]);
  });

  it('descarta lo que vive en otro origen', () => {
    const page = '<script src="https://cdn.ejemplo.com/x.js"></script><script src="/local.js"></script>';
    expect(assetUrls(page, 'https://sitio.web.app')).toEqual(['https://sitio.web.app/local.js']);
  });

  it('no repite un mismo asset referenciado dos veces', () => {
    const page = '<script src="/a.js"></script><link rel="modulepreload" href="/a.js"><script src="/a.js"></script>';
    expect(assetUrls(page, 'https://sitio.web.app')).toEqual(['https://sitio.web.app/a.js']);
  });
});

describe('kura verify · chunks diferidos', () => {
  it('extrae rutas de import() ya construidas, relativas al bundle que las contiene', () => {
    const bundle = 'e(()=>import("./Componentes-Bx9.js"),[]);t("/assets/otro.js")';
    expect(chunkUrls(bundle, 'https://sitio.web.app/assets/index-abc.js')).toEqual([
      'https://sitio.web.app/assets/Componentes-Bx9.js',
      'https://sitio.web.app/assets/otro.js',
    ]);
  });

  it('descarta chunks de otro origen', () => {
    const bundle = 'import("https://cdn.ejemplo.com/x.js")';
    expect(chunkUrls(bundle, 'https://sitio.web.app/assets/index.js')).toEqual([]);
  });

  it('CAZA el localhost escondido en un chunk diferido, no solo en el bundle ansioso', async () => {
    // Es el caso real de app-react y app-cv: todas las páginas van con lazy(),
    // así que el módulo que llama a la API no cuelga del index.
    const rows = await reportVerify(
      config(target('react', 'shibui-showcase-react', false)),
      client({
        'https://shibui-showcase-react.web.app/': html(INDEX),
        'https://shibui-showcase-react.web.app/assets/app-abc123.js': js('e(()=>import("./Componentes-Bx9.js"))'),
        'https://shibui-showcase-react.web.app/assets/Componentes-Bx9.js': js('fetch("http://localhost:3000/api/v1")'),
      }),
    );
    const row = pick(rows, 'no-localhost');
    expect(row?.ok).toBe(false);
    expect(row?.detail).toContain('Componentes-Bx9.js');
  });

  it('encuentra el origen esperado aunque viva en un chunk diferido', async () => {
    const rows = await reportVerify(
      config(target('react', 'shibui-showcase-react', false)),
      client({
        'https://shibui-showcase-react.web.app/': html(INDEX),
        'https://shibui-showcase-react.web.app/assets/app-abc123.js': js('e(()=>import("./Componentes-Bx9.js"))'),
        'https://shibui-showcase-react.web.app/assets/Componentes-Bx9.js': js('fetch("https://shibui-core.onrender.com/api/v1")'),
      }),
      { expectOrigin: 'shibui-core.onrender.com' },
    );
    expect(pick(rows, 'expect-origin')?.ok).toBe(true);
  });
});

describe('kura verify · filtro por target', () => {
  it('falla con NOT_FOUND si el target no existe', async () => {
    await expect(
      reportVerify(config(target('cv', 'shibui-cv')), client({}), { onlyTarget: 'inventado' }),
    ).rejects.toSatisfy((err: unknown) => err instanceof KuraError && err.code === 'NOT_FOUND');
  });
});
