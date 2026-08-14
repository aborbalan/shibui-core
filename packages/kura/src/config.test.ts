import { describe, it, expect, afterEach } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { findRepoRoot, readHostingConfig } from './config';
import { KuraError } from './envelope';

const temps: string[] = [];

afterEach(() => {
  let dir = temps.pop();
  while (dir !== undefined) {
    rmSync(dir, { recursive: true, force: true });
    dir = temps.pop();
  }
});

function fixture(rc: unknown, firebaseJson: unknown): string {
  const root = mkdtempSync(join(tmpdir(), 'kura-cfg-'));
  temps.push(root);
  writeFileSync(join(root, '.firebaserc'), JSON.stringify(rc));
  writeFileSync(join(root, 'firebase.json'), JSON.stringify(firebaseJson));
  return root;
}

/** Devuelve el código del KuraError lanzado, para aserciones legibles. */
function codeOf(run: () => unknown): string {
  try {
    run();
  } catch (err) {
    return err instanceof KuraError ? err.code : `ajeno: ${String(err)}`;
  }
  return 'no-lanzó';
}

const RC = {
  projects: {},
  targets: { 'lib-ui-b67c5': { hosting: { cv: ['shibui-cv'], sukashi: ['sukashi'] } } },
};

const FIREBASE = {
  hosting: [
    { target: 'cv', public: 'apps/app-cv/dist/app-cv/browser' },
    { target: 'sukashi', public: 'packages/sukashi/demo/dist' },
  ],
};

describe('lectura de la configuración de hosting', () => {
  it('cruza .firebaserc y firebase.json en un solo modelo', () => {
    const config = readHostingConfig(fixture(RC, FIREBASE));
    expect(config.project).toBe('lib-ui-b67c5');
    expect(config.targets).toEqual([
      { target: 'cv', sites: ['shibui-cv'], publicDir: 'apps/app-cv/dist/app-cv/browser', spa: false },
      { target: 'sukashi', sites: ['sukashi'], publicDir: 'packages/sukashi/demo/dist', spa: false },
    ]);
  });

  it('detecta la reescritura a index.html en sus dos formas', () => {
    const conRewrite = {
      hosting: [
        { target: 'cv', public: 'dist', rewrites: [{ source: '**', destination: '/index.html' }] },
        { target: 'sukashi', public: 'dist', rewrites: [{ glob: '**', path: '/index.html' }] },
      ],
    };
    const config = readHostingConfig(fixture(RC, conRewrite));
    expect(config.targets.map((target) => target.spa)).toEqual([true, true]);
  });

  it('no marca como SPA una reescritura que no apunta al index', () => {
    const otra = { hosting: [{ target: 'cv', public: 'dist', rewrites: [{ source: '/api/**', destination: '/api.html' }] }] };
    expect(readHostingConfig(fixture(RC, otra)).targets[0]?.spa).toBe(false);
  });

  it('acepta hosting como objeto suelto, no solo como array', () => {
    const config = readHostingConfig(fixture(RC, { hosting: { target: 'cv', public: 'dist' } }));
    expect(config.targets).toHaveLength(1);
    expect(config.targets[0]?.target).toBe('cv');
  });

  it('nombra el target que está en firebase.json pero no en .firebaserc', () => {
    const root = fixture(RC, { hosting: [{ target: 'fantasma', public: 'dist' }] });
    expect(codeOf(() => readHostingConfig(root))).toBe('NOT_FOUND');
  });

  it('nombra el target sin directorio public', () => {
    const root = fixture(RC, { hosting: [{ target: 'cv' }] });
    expect(codeOf(() => readHostingConfig(root))).toBe('PRECONDITION');
  });

  it('falla si no hay ningún target de hosting', () => {
    expect(codeOf(() => readHostingConfig(fixture(RC, {})))).toBe('PRECONDITION');
  });

  it('prefiere projects.default cuando hay varios proyectos', () => {
    const rc = {
      projects: { default: 'segundo' },
      targets: {
        primero: { hosting: { cv: ['a'] } },
        segundo: { hosting: { cv: ['b'] } },
      },
    };
    const config = readHostingConfig(fixture(rc, { hosting: [{ target: 'cv', public: 'dist' }] }));
    expect(config.project).toBe('segundo');
    expect(config.targets[0]?.sites).toEqual(['b']);
  });

  it('se niega a adivinar si hay varios proyectos y ninguno por defecto', () => {
    const rc = {
      projects: {},
      targets: { primero: { hosting: { cv: ['a'] } }, segundo: { hosting: { cv: ['b'] } } },
    };
    const root = fixture(rc, { hosting: [{ target: 'cv', public: 'dist' }] });
    expect(codeOf(() => readHostingConfig(root))).toBe('PRECONDITION');
  });

  it('rechaza un .firebaserc que no es JSON válido', () => {
    const root = mkdtempSync(join(tmpdir(), 'kura-cfg-'));
    temps.push(root);
    writeFileSync(join(root, '.firebaserc'), '{ esto no es json');
    writeFileSync(join(root, 'firebase.json'), '{}');
    expect(codeOf(() => readHostingConfig(root))).toBe('UNEXPECTED');
  });
});

describe('localización de la raíz del repo', () => {
  it('sube hasta encontrar la pareja firebase.json + .firebaserc', () => {
    const root = fixture(RC, FIREBASE);
    const nested = join(root, 'packages', 'kura', 'src');
    mkdirSync(nested, { recursive: true });
    expect(findRepoRoot(nested)).toBe(root);
  });

  it('falla con NOT_FOUND si no hay repo por encima', () => {
    const orphan = mkdtempSync(join(tmpdir(), 'kura-huerfano-'));
    temps.push(orphan);
    expect(codeOf(() => findRepoRoot(orphan))).toBe('NOT_FOUND');
  });
});
