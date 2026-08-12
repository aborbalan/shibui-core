import { describe, it, expect } from 'vitest';
import { planDeploy, runDeploy, type DeployOptions } from './deploy';
import type { TargetReport } from './targets';
import type { HostingAdapter } from '../adapter';
import type { HostingConfig } from '../config';
import type { HttpClient } from '../http';
import { KuraError } from '../envelope';

const URL_CANAL = 'https://shibui-cv--preview-a1b2.web.app';

function report(build: TargetReport['build'] = 'ready'): TargetReport {
  return {
    target: 'cv',
    sites: ['shibui-cv'],
    publicDir: 'apps/app-cv/dist/app-cv/browser',
    build,
    entries: 12,
    modified: '2026-08-01T00:00:00.000Z',
  };
}

function config(): HostingConfig {
  return {
    root: '/repo',
    project: 'lib-ui-b67c5',
    targets: [{ target: 'cv', sites: ['shibui-cv'], publicDir: 'apps/app-cv/dist/app-cv/browser', spa: true }],
  };
}

/** Adaptador que apunta lo que se le pide y no toca nada. */
function fakeAdapter(record: string[]): HostingAdapter {
  return {
    listSites: async () => [],
    liveRelease: async () => null,
    deployChannel: async (project, target, channel, cwd) => {
      record.push(`channel ${project} ${target} ${channel} ${cwd}`);
      return { url: URL_CANAL, expiresAt: '2026-08-19T00:00:00.000Z', version: 'abc123' };
    },
    deployLive: async (project, target, site, cwd) => {
      record.push(`live ${project} ${target} ${site} ${cwd}`);
      return { url: `https://${site}.web.app`, expiresAt: null, version: null };
    },
  };
}

function fakeHttp(body = '<html><head></head><body>ok</body></html>'): HttpClient {
  return {
    get: async () => ({ status: 200, contentType: 'text/html', body, failure: null }),
  };
}

function codeOf(run: () => unknown): string {
  try {
    run();
  } catch (err) {
    return err instanceof KuraError ? err.code : `ajeno: ${String(err)}`;
  }
  return 'no-lanzó';
}

describe('kura deploy · frenos antes de tocar la red', () => {
  it('exige --target: no despliega los nueve de golpe', () => {
    expect(codeOf(() => planDeploy([report()], {}))).toBe('USAGE');
  });

  it('rechaza un target que no existe', () => {
    expect(codeOf(() => planDeploy([report()], { target: 'inventado' }))).toBe('NOT_FOUND');
  });

  it.each(['missing', 'empty', 'no-index'] as const)('se niega a publicar con build %s', (build) => {
    expect(codeOf(() => planDeploy([report(build)], { target: 'cv' }))).toBe('PRECONDITION');
  });

  it('nombra el directorio en el error de build, para saber qué construir', () => {
    try {
      planDeploy([report('missing')], { target: 'cv' });
      expect.unreachable();
    } catch (err) {
      expect((err as KuraError).message).toContain('apps/app-cv/dist/app-cv/browser');
    }
  });
});

describe('kura deploy · destino', () => {
  it('por defecto va a un canal de preview llamado preview', () => {
    expect(planDeploy([report()], { target: 'cv' })).toMatchObject({ destination: 'preview', channel: 'preview' });
  });

  it('acepta otro nombre de canal', () => {
    expect(planDeploy([report()], { target: 'cv', channel: 'pr-42' }).channel).toBe('pr-42');
  });

  it('rechaza nombres de canal que Firebase no acepta', () => {
    expect(codeOf(() => planDeploy([report()], { target: 'cv', channel: 'PR 42' }))).toBe('USAGE');
    expect(codeOf(() => planDeploy([report()], { target: 'cv', channel: '-empieza-mal' }))).toBe('USAGE');
  });
});

describe('kura deploy · el freno de producción', () => {
  it('--live sin --confirm no pasa', () => {
    expect(codeOf(() => planDeploy([report()], { target: 'cv', live: true }))).toBe('PRECONDITION');
  });

  it('--confirm con otro nombre tampoco pasa', () => {
    expect(codeOf(() => planDeploy([report()], { target: 'cv', live: true, confirm: 'sukashi' }))).toBe('PRECONDITION');
  });

  it('el error dice exactamente qué teclear', () => {
    try {
      planDeploy([report()], { target: 'cv', live: true });
      expect.unreachable();
    } catch (err) {
      expect((err as KuraError).hint).toBe('Añade: --confirm cv');
    }
  });

  it('con el nombre repetido, sí', () => {
    expect(planDeploy([report()], { target: 'cv', live: true, confirm: 'cv' }).destination).toBe('live');
  });

  it('el freno se aplica también en simulación, no solo al ejecutar', async () => {
    // Deliberado: que la simulación de --live pase sin --confirm daría una
    // falsa sensación de "ya está listo" antes del comando de verdad.
    await expect(runDeploy(config(), [report()], fakeAdapter([]), fakeHttp(), { target: 'cv', live: true })).rejects.toSatisfy(
      (err: unknown) => err instanceof KuraError && err.code === 'PRECONDITION',
    );
  });
});

describe('kura deploy · simulación por defecto', () => {
  const opciones: DeployOptions = { target: 'cv' };

  it('no llama al adaptador si no se pide --execute', async () => {
    const record: string[] = [];
    await runDeploy(config(), [report()], fakeAdapter(record), fakeHttp(), opciones);
    expect(record).toEqual([]);
  });

  it('cuenta qué subiría y cómo hacerlo de verdad', async () => {
    const { rows, failed } = await runDeploy(config(), [report()], fakeAdapter([]), fakeHttp(), opciones);
    expect(failed).toBe(false);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ check: 'dry-run', ok: true });
    expect(rows[0]?.detail).toContain('12 entradas');
    expect(rows[0]?.detail).toContain('--execute');
  });
});

describe('kura deploy · ejecución real', () => {
  it('despliega al canal de preview desde la raíz del repo', async () => {
    const record: string[] = [];
    const { rows } = await runDeploy(config(), [report()], fakeAdapter(record), fakeHttp(), {
      target: 'cv',
      execute: true,
    });
    expect(record).toEqual(['channel lib-ui-b67c5 cv preview /repo']);
    expect(rows[0]).toMatchObject({ check: 'deploy', ok: true, url: URL_CANAL });
    expect(rows[0]?.detail).toContain('caduca');
  });

  it('despliega a live solo con el nombre repetido', async () => {
    const record: string[] = [];
    await runDeploy(config(), [report()], fakeAdapter(record), fakeHttp(), {
      target: 'cv',
      live: true,
      confirm: 'cv',
      execute: true,
    });
    expect(record).toEqual(['live lib-ui-b67c5 cv shibui-cv /repo']);
  });

  it('verifica lo recién publicado y encadena sus comprobaciones', async () => {
    const { rows } = await runDeploy(config(), [report()], fakeAdapter([]), fakeHttp(), {
      target: 'cv',
      execute: true,
    });
    expect(rows.map((row) => row.check)).toContain('root-200');
    expect(rows.every((row) => row.url === URL_CANAL)).toBe(true);
  });

  it('un deploy que publica basura NO cuenta como éxito', async () => {
    const conLocalhost = '<html><script>fetch("http://localhost:3000/api")</script></html>';
    const { rows, failed } = await runDeploy(config(), [report()], fakeAdapter([]), fakeHttp(conLocalhost), {
      target: 'cv',
      execute: true,
    });
    expect(failed).toBe(true);
    expect(rows.find((row) => row.check === 'no-localhost')?.ok).toBe(false);
  });
});
