import { describe, it, expect } from 'vitest';
import { classify, parseLiveRelease, parseSites, unwrap } from './adapter';
import { KuraError } from './envelope';

/* Respuestas REALES capturadas de la API el 2026-08-12 contra lib-ui-b67c5.
   Son el contrato observado: si firebase-tools cambia de forma, estos
   fixtures dejan de parecerse a la realidad y el test de humo del adaptador
   es lo que lo delata. */
const SITES_PAYLOAD = {
  sites: [
    { name: 'projects/lib-ui-b67c5/sites/hanko-report', defaultUrl: 'https://hanko-report.web.app', type: 'USER_SITE' },
    { name: 'projects/lib-ui-b67c5/sites/shibui-cv', defaultUrl: 'https://shibui-cv.web.app', type: 'USER_SITE' },
  ],
};

const CHANNELS_PAYLOAD = {
  channels: [
    {
      name: 'projects/lib-ui-b67c5/sites/shibui-cv/channels/live',
      url: 'https://shibui-cv.web.app',
      release: {
        name: 'projects/lib-ui-b67c5/sites/shibui-cv/channels/live/releases/1784718282224000',
        version: {
          name: 'projects/lib-ui-b67c5/sites/shibui-cv/versions/6a60dbb5c02a0d96',
          status: 'FINALIZED',
          labels: { 'deployment-tool': 'cli-firebase' },
          createTime: '2026-07-22T11:04:40.683489Z',
          fileCount: '41',
          versionBytes: '3792265',
        },
        type: 'DEPLOY',
        releaseTime: '2026-07-22T11:04:42.224Z',
        releaseUser: { email: 'alguien@example.com' },
      },
      createTime: '2026-06-05T11:39:11.187463268Z',
      updateTime: '2026-07-22T11:04:42.224Z',
    },
  ],
};

function codeOf(run: () => unknown): string {
  try {
    run();
  } catch (err) {
    return err instanceof KuraError ? err.code : `ajeno: ${String(err)}`;
  }
  return 'no-lanzó';
}

describe('parseo de sitios', () => {
  it('reduce el nombre completo al identificador corto', () => {
    expect(parseSites(SITES_PAYLOAD)).toEqual([
      { site: 'hanko-report', url: 'https://hanko-report.web.app' },
      { site: 'shibui-cv', url: 'https://shibui-cv.web.app' },
    ]);
  });

  it('revienta si desaparece la clave sites', () => {
    expect(codeOf(() => parseSites({}))).toBe('UNEXPECTED');
    expect(codeOf(() => parseSites([]))).toBe('UNEXPECTED');
  });

  it('revienta si una entrada pierde su name', () => {
    expect(codeOf(() => parseSites({ sites: [{ defaultUrl: 'x' }] }))).toBe('UNEXPECTED');
  });
});

describe('parseo del canal live', () => {
  it('extrae la release publicada y normaliza fileCount a número', () => {
    expect(parseLiveRelease(CHANNELS_PAYLOAD)).toEqual({
      url: 'https://shibui-cv.web.app',
      releasedAt: '2026-07-22T11:04:42.224Z',
      files: 41,
      releasedBy: 'alguien@example.com',
      tool: 'cli-firebase',
    });
  });

  it('devuelve null si no hay canal live, en vez de fallar', () => {
    const soloPreview = {
      channels: [{ name: 'projects/p/sites/s/channels/pr-42', url: 'https://x.web.app', release: {} }],
    };
    expect(parseLiveRelease(soloPreview)).toBeNull();
  });

  it('devuelve null cuando el proyecto aún no tiene canales', () => {
    expect(parseLiveRelease({ channels: [] })).toBeNull();
  });

  it('degrada a null los campos opcionales ausentes, sin reventar', () => {
    const sinRelease = { channels: [{ name: 'projects/p/sites/s/channels/live', url: 'https://x.web.app' }] };
    expect(parseLiveRelease(sinRelease)).toEqual({
      url: 'https://x.web.app',
      releasedAt: null,
      files: null,
      releasedBy: null,
      tool: null,
    });
  });

  it('revienta si desaparece la clave channels', () => {
    expect(codeOf(() => parseLiveRelease({}))).toBe('UNEXPECTED');
  });
});

describe('sobre --json de firebase', () => {
  it('devuelve el result en el caso de éxito', () => {
    expect(unwrap({ status: 'success', result: SITES_PAYLOAD }, 'listar')).toEqual(SITES_PAYLOAD);
  });

  it('convierte el sobre de error real en NOT_FOUND', () => {
    // Capturado ejecutando el CLI contra un sitio inexistente.
    const real = { status: 'error', error: 'could not find channels for site "sitio-que-no-existe"' };
    expect(codeOf(() => unwrap(real, 'leer los canales'))).toBe('NOT_FOUND');
  });

  it('revienta si falta la clave result', () => {
    expect(codeOf(() => unwrap({ status: 'success' }, 'listar'))).toBe('UNEXPECTED');
    expect(codeOf(() => unwrap('vaya', 'listar'))).toBe('UNEXPECTED');
  });
});

describe('clasificación de errores de firebase', () => {
  it('reconoce el fallo de credenciales por el texto', () => {
    expect(classify('Failed to authenticate, have you run firebase login?', 'listar').code).toBe('AUTH');
    expect(classify('Request had insufficient authentication scopes', 'listar').code).toBe('AUTH');
  });

  it('reconoce lo que no existe', () => {
    expect(classify('could not find channels for site "x"', 'leer').code).toBe('NOT_FOUND');
  });

  it('todo lo demás cae en UNEXPECTED conservando el mensaje y el contexto', () => {
    const error = classify('socket hang up', 'listar los sitios');
    expect(error.code).toBe('UNEXPECTED');
    expect(error.message).toContain('socket hang up');
    expect(error.message).toContain('listar los sitios');
  });
});
