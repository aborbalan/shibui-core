import { describe, it, expect } from 'vitest';
import { createSites, reportSites } from './sites';
import type { HostingAdapter } from '../adapter';
import type { HostingConfig } from '../config';
import { KuraError } from '../envelope';

function config(): HostingConfig {
  return {
    root: '/repo',
    project: 'lib-ui-b67c5',
    targets: [
      { target: 'cv', sites: ['shibui-cv'], publicDir: 'a', spa: true },
      { target: 'torii', sites: ['shibui-torii'], publicDir: 'b', spa: true },
    ],
  };
}

/** `existentes` son los sitios que ya hay en el proyecto; `creados` apunta las altas. */
function adapter(existentes: string[], creados: string[] = []): HostingAdapter {
  return {
    listSites: async () => existentes.map((site) => ({ site, url: `https://${site}.web.app` })),
    liveRelease: async () => null,
    createSite: async (_project, site) => {
      creados.push(site);
      existentes.push(site);
      return { site, url: `https://${site}.web.app` };
    },
    deployChannel: async () => {
      throw new Error('sites no debe desplegar');
    },
    deployLive: async () => {
      throw new Error('sites no debe desplegar');
    },
  };
}

async function codeOf(run: () => Promise<unknown>): Promise<string> {
  try {
    await run();
  } catch (err) {
    return err instanceof KuraError ? err.code : `ajeno: ${String(err)}`;
  }
  return 'no-lanzó';
}

describe('kura sites · inventario', () => {
  it('cruza los dos sentidos de la deriva', async () => {
    const rows = await reportSites(config(), adapter(['shibui-cv', 'olvidado']));
    expect(rows).toEqual([
      { site: 'shibui-cv', url: 'https://shibui-cv.web.app', target: 'cv', state: 'in-use' },
      { site: 'shibui-torii', url: null, target: 'torii', state: 'declared-missing' },
      { site: 'olvidado', url: 'https://olvidado.web.app', target: null, state: 'orphan' },
    ]);
  });

  it('un sitio huérfano conserva su URL: puede estar sirviendo algo viejo en público', async () => {
    const rows = await reportSites(config(), adapter(['shibui-cv', 'shibui-torii', 'olvidado']));
    expect(rows.find((row) => row.state === 'orphan')?.url).toBe('https://olvidado.web.app');
  });
});

describe('kura sites create · frenos', () => {
  it('exige --site o --missing: no crea nada por inercia', async () => {
    expect(await codeOf(() => createSites(config(), adapter([]), {}))).toBe('USAGE');
  });

  it('rechaza un identificador que Firebase no aceptaría', async () => {
    expect(await codeOf(() => createSites(config(), adapter([]), { site: 'Mal Nombre' }))).toBe('USAGE');
    expect(await codeOf(() => createSites(config(), adapter([]), { site: 'termina-en-' }))).toBe('USAGE');
  });

  it('no toca un sitio que ya existe', async () => {
    const creados: string[] = [];
    const { rows } = await createSites(config(), adapter(['shibui-cv'], creados), {
      site: 'shibui-cv',
      execute: true,
    });
    expect(creados).toEqual([]);
    expect(rows[0]).toMatchObject({ action: 'exists', ok: true });
  });
});

describe('kura sites create · simulación por defecto', () => {
  it('no llama al adaptador sin --execute', async () => {
    const creados: string[] = [];
    const { rows } = await createSites(config(), adapter(['shibui-cv'], creados), { missing: true });
    expect(creados).toEqual([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ site: 'shibui-torii', action: 'would-create' });
    expect(rows[0]?.detail).toContain('--execute');
  });
});

describe('kura sites create · ejecución', () => {
  it('--missing crea solo lo declarado que falta, y nada más', async () => {
    const creados: string[] = [];
    const { rows, failed } = await createSites(config(), adapter(['shibui-cv', 'olvidado'], creados), {
      missing: true,
      execute: true,
    });
    expect(creados).toEqual(['shibui-torii']);
    expect(failed).toBe(false);
    expect(rows).toEqual([
      {
        site: 'shibui-torii',
        target: 'torii',
        action: 'created',
        url: 'https://shibui-torii.web.app',
        ok: true,
        detail: "creado y ya enlazado al target 'torii'",
      },
    ]);
  });

  it('--missing sin nada que crear no devuelve filas ni llama al adaptador', async () => {
    const creados: string[] = [];
    const { rows } = await createSites(config(), adapter(['shibui-cv', 'shibui-torii'], creados), {
      missing: true,
      execute: true,
    });
    expect(rows).toEqual([]);
    expect(creados).toEqual([]);
  });

  it('permite aprovisionar un sitio que aún no declara ningún target', async () => {
    const creados: string[] = [];
    const { rows } = await createSites(config(), adapter(['shibui-cv'], creados), {
      site: 'sitio-nuevo',
      execute: true,
    });
    expect(creados).toEqual(['sitio-nuevo']);
    expect(rows[0]).toMatchObject({ target: null, action: 'created', detail: 'creado' });
  });
});
