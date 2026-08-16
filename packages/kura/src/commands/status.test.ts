import { describe, it, expect } from 'vitest';
import { reportStatus } from './status';
import type { TargetReport } from './targets';
import type { HostingAdapter, LiveRelease } from '../adapter';
import type { HostingConfig } from '../config';
import { KuraError } from '../envelope';

const CONFIG: HostingConfig = { root: '/repo', project: 'lib-ui-b67c5', targets: [] };

function listo(name: string, site: string, modified: string): TargetReport {
  return { target: name, sites: [site], publicDir: `dist/${name}`, build: 'ready', entries: 3, modified };
}

function sinBuild(name: string, site: string): TargetReport {
  return { target: name, sites: [site], publicDir: `dist/${name}`, build: 'missing', entries: 0, modified: null };
}

function release(releasedAt: string | null, files: number | null = 41): LiveRelease {
  return { url: 'https://sitio.web.app', releasedAt, files, releasedBy: null, tool: 'cli-firebase' };
}

function adapter(sites: string[], releases: Record<string, LiveRelease | null>): HostingAdapter {
  return {
    listSites: async (_project: string) => sites.map((site) => ({ site, url: `https://${site}.web.app` })),
    liveRelease: async (_project: string, site: string) => releases[site] ?? null,
    createSite: async () => {
      throw new Error('status no debe crear sitios');
    },
    // status nunca despliega; si alguna vez lo intentara, el test se entera.
    deployChannel: async () => {
      throw new Error('status no debe desplegar');
    },
    deployLive: async () => {
      throw new Error('status no debe desplegar');
    },
  };
}

async function driftOf(local: TargetReport, sites: string[], releases: Record<string, LiveRelease | null>) {
  const [report] = await reportStatus(CONFIG, [local], adapter(sites, releases));
  return report?.drift;
}

describe('kura status · deriva entre lo local y lo publicado', () => {
  it('marca local-newer cuando el build es posterior a la release', async () => {
    const drift = await driftOf(listo('cv', 'shibui-cv', '2026-08-01T00:00:00.000Z'), ['shibui-cv'], {
      'shibui-cv': release('2026-07-22T11:04:42.224Z'),
    });
    expect(drift).toBe('local-newer');
  });

  it('marca in-sync cuando la release es igual o posterior al build', async () => {
    const drift = await driftOf(listo('cv', 'shibui-cv', '2026-07-01T00:00:00.000Z'), ['shibui-cv'], {
      'shibui-cv': release('2026-07-22T11:04:42.224Z'),
    });
    expect(drift).toBe('in-sync');
  });

  it('marca never-deployed cuando el sitio existe pero no tiene canal live', async () => {
    const drift = await driftOf(listo('cv', 'shibui-cv', '2026-08-01T00:00:00.000Z'), ['shibui-cv'], {
      'shibui-cv': null,
    });
    expect(drift).toBe('never-deployed');
  });

  it('marca no-build cuando hay algo publicado pero nada construido en local', async () => {
    const drift = await driftOf(sinBuild('cv', 'shibui-cv'), ['shibui-cv'], {
      'shibui-cv': release('2026-07-22T11:04:42.224Z'),
    });
    expect(drift).toBe('no-build');
  });

  it('marca no-site cuando .firebaserc apunta a un sitio que no existe', async () => {
    const drift = await driftOf(listo('cv', 'sitio-fantasma', '2026-08-01T00:00:00.000Z'), ['shibui-cv'], {});
    expect(drift).toBe('no-site');
  });

  it('marca unknown en vez de inventarse una comparación sin fecha', async () => {
    const drift = await driftOf(listo('cv', 'shibui-cv', '2026-08-01T00:00:00.000Z'), ['shibui-cv'], {
      'shibui-cv': release(null),
    });
    expect(drift).toBe('unknown');
  });
});

describe('kura status · informe', () => {
  it('arrastra url y número de ficheros de la release publicada', async () => {
    const [report] = await reportStatus(
      CONFIG,
      [listo('cv', 'shibui-cv', '2026-07-01T00:00:00.000Z')],
      adapter(['shibui-cv'], { 'shibui-cv': release('2026-07-22T11:04:42.224Z', 41) }),
    );
    expect(report).toMatchObject({
      target: 'cv',
      site: 'shibui-cv',
      url: 'https://sitio.web.app',
      live: '2026-07-22T11:04:42.224Z',
      files: 41,
      build: 'ready',
    });
  });

  it('no consulta nada del sitio inexistente y deja los campos a null', async () => {
    const [report] = await reportStatus(
      CONFIG,
      [listo('cv', 'fantasma', '2026-07-01T00:00:00.000Z')],
      adapter(['shibui-cv'], {}),
    );
    expect(report).toMatchObject({ url: null, live: null, files: null, drift: 'no-site' });
  });
});

describe('kura status · filtro por target', () => {
  const local = [
    listo('cv', 'shibui-cv', '2026-07-01T00:00:00.000Z'),
    listo('sukashi', 'sukashi', '2026-07-01T00:00:00.000Z'),
  ];
  const fake = adapter(['shibui-cv', 'sukashi'], {
    'shibui-cv': release('2026-07-22T11:04:42.224Z'),
    sukashi: release('2026-07-22T11:04:42.224Z'),
  });

  it('devuelve solo el target pedido', async () => {
    const report = await reportStatus(CONFIG, local, fake, 'sukashi');
    expect(report.map((entry) => entry.target)).toEqual(['sukashi']);
  });

  it('sin filtro devuelve todos', async () => {
    expect(await reportStatus(CONFIG, local, fake)).toHaveLength(2);
  });

  it('falla con NOT_FOUND y lista los disponibles si el target no existe', async () => {
    await expect(reportStatus(CONFIG, local, fake, 'inventado')).rejects.toSatisfy(
      (err: unknown) => err instanceof KuraError && err.code === 'NOT_FOUND' && (err.hint ?? '').includes('sukashi'),
    );
  });
});
