import { describe, it, expect, afterEach } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { reportTargets } from './targets';
import type { HostingConfig } from '../config';

const temps: string[] = [];

afterEach(() => {
  let dir = temps.pop();
  while (dir !== undefined) {
    rmSync(dir, { recursive: true, force: true });
    dir = temps.pop();
  }
});

/**
 * Monta una raíz con cuatro targets, uno por estado posible de build.
 * `ausente` no crea directorio a propósito.
 */
function fixtureRoot(): HostingConfig {
  const root = mkdtempSync(join(tmpdir(), 'kura-tgt-'));
  temps.push(root);

  mkdirSync(join(root, 'dist-vacio'), { recursive: true });

  mkdirSync(join(root, 'dist-sin-index'), { recursive: true });
  writeFileSync(join(root, 'dist-sin-index', 'main.js'), 'console.log(0)');

  mkdirSync(join(root, 'dist-listo', 'assets'), { recursive: true });
  writeFileSync(join(root, 'dist-listo', 'index.html'), '<!doctype html><title>ok</title>');

  return {
    root,
    project: 'lib-ui-b67c5',
    targets: [
      { target: 'ausente', sites: ['a'], publicDir: 'dist-que-no-existe', spa: true },
      { target: 'vacio', sites: ['b'], publicDir: 'dist-vacio', spa: true },
      { target: 'sin-index', sites: ['c'], publicDir: 'dist-sin-index', spa: true },
      { target: 'listo', sites: ['d'], publicDir: 'dist-listo', spa: true },
    ],
  };
}

describe('kura targets', () => {
  it('distingue los cuatro estados de build sin tocar la red', () => {
    const report = reportTargets(fixtureRoot());
    expect(report.map((r) => [r.target, r.build])).toEqual([
      ['ausente', 'missing'],
      ['vacio', 'empty'],
      ['sin-index', 'no-index'],
      ['listo', 'ready'],
    ]);
  });

  it('solo fecha el build cuando hay index.html que fechar', () => {
    const byTarget = new Map(reportTargets(fixtureRoot()).map((r) => [r.target, r]));
    expect(byTarget.get('ausente')?.modified).toBeNull();
    expect(byTarget.get('sin-index')?.modified).toBeNull();

    const listo = byTarget.get('listo')?.modified;
    expect(listo).toEqual(expect.any(String));
    expect(new Date(listo ?? '').getTime()).not.toBeNaN();
  });

  it('cuenta las entradas del primer nivel, no el árbol entero', () => {
    const byTarget = new Map(reportTargets(fixtureRoot()).map((r) => [r.target, r]));
    // dist-listo contiene index.html y el directorio assets/
    expect(byTarget.get('listo')?.entries).toBe(2);
    expect(byTarget.get('vacio')?.entries).toBe(0);
  });

  it('arrastra sitios y directorio público al informe', () => {
    const listo = reportTargets(fixtureRoot()).find((r) => r.target === 'listo');
    expect(listo).toMatchObject({ sites: ['d'], publicDir: 'dist-listo' });
  });
});
