import { describe, it, expect } from 'vitest';
import { seal, open, openWithManifest, sealBytes, openBytes } from './warifu';
import { manifestMatch, allSealed, type SealManifest } from './manifest';
import { manifestFromTrustReport } from './hanko';
import hankoReport from '../../demo/fixtures/hanko-trust-report.json';
import { makeBitmap, setPixel, type Bitmap } from '../core/bitmap';
import { compose } from '../core/compose';
import { reconstructError } from '../core/reconstruct';

function motivo(): Bitmap {
  const b = makeBitmap(12, 12);
  for (let y = 3; y < 9; y++) for (let x = 3; x < 9; x++) setPixel(b, x, y, 1);
  setPixel(b, 1, 1, 1);
  setPixel(b, 10, 10, 1);
  return b;
}

const SELLADO: SealManifest = {
  entries: [
    { name: 'lib-button', sealed: true },
    { name: 'lib-card', sealed: true },
    { name: 'lib-input', sealed: true },
  ],
};
const PARCIAL: SealManifest = {
  entries: [
    { name: 'lib-button', sealed: true },
    { name: 'lib-card', sealed: false },
    { name: 'lib-input', sealed: true },
  ],
};

describe('manifestMatch', () => {
  it('cumple (todo sellado) → match determinista', async () => {
    const a = await manifestMatch(SELLADO);
    const b = await manifestMatch(SELLADO);
    expect(a).not.toBeNull();
    expect(a).toHaveLength(32);
    expect([...a!]).toEqual([...b!]);
  });

  it('no cumple (alguno sin sellar) → null', async () => {
    expect(await manifestMatch(PARCIAL)).toBeNull();
  });

  it('manifiesto vacío → null', async () => {
    expect(await manifestMatch({ entries: [] })).toBeNull();
  });

  it('el match queda ligado al roster sellado', async () => {
    const otro: SealManifest = { entries: [{ name: 'lib-button', sealed: true }] };
    const a = await manifestMatch(SELLADO);
    const b = await manifestMatch(otro);
    expect([...a!]).not.toEqual([...b!]);
  });
});

describe('warifu — sellar / abrir (motivo visual)', () => {
  it('abre con el match correcto → revela el motivo (error 0)', async () => {
    const motif = motivo();
    const match = (await manifestMatch(SELLADO))!;
    const w = await seal(motif, match);
    const layers = await open(w, match);
    expect(reconstructError(compose([...layers]), motif)).toBe(0);
  });

  it('abre con un match equivocado → NO revela el motivo', async () => {
    const motif = motivo();
    const match = (await manifestMatch(SELLADO))!;
    const w = await seal(motif, match);
    const otro: SealManifest = { entries: [{ name: 'x', sealed: true }] };
    const malo = (await manifestMatch(otro))!;
    const layers = await open(w, malo);
    expect(reconstructError(compose([...layers]), motif)).toBeGreaterThan(0.1);
  });

  it('la tally, sola, no reproduce el motivo (ruido marginal)', async () => {
    const motif = motivo();
    const match = (await manifestMatch(SELLADO))!;
    const w = await seal(motif, match);
    // Una sola mitad compuesta consigo misma no revela el motivo.
    expect(reconstructError(compose([w.tally]), motif)).toBeGreaterThan(0.1);
  });

  it('openWithManifest: cumplido revela, no cumplido devuelve null', async () => {
    const motif = motivo();
    const match = (await manifestMatch(SELLADO))!;
    const w = await seal(motif, match);

    const abierto = await openWithManifest(w, SELLADO);
    expect(abierto).not.toBeNull();
    expect(reconstructError(compose([...abierto!]), motif)).toBe(0);

    expect(await openWithManifest(w, PARCIAL)).toBeNull();
  });
});

describe('warifu — bytes sellados al manifiesto', () => {
  it('round-trip con el match correcto recupera los bytes', async () => {
    const secret = new Uint8Array([1, 2, 3, 250, 0, 128, 64]);
    const match = (await manifestMatch(SELLADO))!;
    const locked = await sealBytes(secret, match);
    expect([...locked]).not.toEqual([...secret]); // realmente sellado
    const back = await openBytes(locked, match);
    expect([...back]).toEqual([...secret]);
  });

  it('match equivocado → bytes incoherentes', async () => {
    const secret = new Uint8Array([9, 9, 9, 9, 9, 9, 9, 9]);
    const match = (await manifestMatch(SELLADO))!;
    const locked = await sealBytes(secret, match);
    const otro: SealManifest = { entries: [{ name: 'z', sealed: true }] };
    const malo = (await manifestMatch(otro))!;
    const back = await openBytes(locked, malo);
    expect([...back]).not.toEqual([...secret]);
  });
});

describe('adaptador hanko', () => {
  it('un Trust Report todo-sellado cumple allSealed y abre la tablilla', async () => {
    const report = {
      untrusted: 0,
      components: [
        { tagName: 'lib-button', trusted: true },
        { tagName: 'lib-card', trusted: true },
      ],
    };
    const manifest = manifestFromTrustReport(report);
    expect(allSealed(manifest)).toBe(true);

    const motif = motivo();
    const match = (await manifestMatch(manifest))!;
    const w = await seal(motif, match);
    const layers = await open(w, match);
    expect(reconstructError(compose([...layers]), motif)).toBe(0);
  });

  it('un Trust Report con algún componente sin sellar NO abre', async () => {
    const report = {
      untrusted: 1,
      components: [
        { tagName: 'lib-button', trusted: true },
        { tagName: 'lib-card', trusted: false },
      ],
    };
    const manifest = manifestFromTrustReport(report);
    expect(allSealed(manifest)).toBe(false);
    expect(await manifestMatch(manifest)).toBeNull();
  });
});

describe('e2e · Trust Report real de hanko (snapshot)', () => {
  it('refleja el estado real: no todo sellado → la tablilla no abre hoy', async () => {
    const manifest = manifestFromTrustReport(hankoReport);
    expect(manifest.entries.length).toBe(hankoReport.total);
    expect(hankoReport.trusted).toBeLessThan(hankoReport.total); // hoy 4/102
    expect(allSealed(manifest)).toBe(false);
    expect(await manifestMatch(manifest)).toBeNull();
  });

  it('cuando los mismos componentes estén todos sellados, la tablilla abre', async () => {
    const roster = hankoReport.components.map((c) => c.tagName);
    const sealed: SealManifest = { entries: roster.map((name) => ({ name, sealed: true })) };
    const match = (await manifestMatch(sealed))!;

    const motif = motivo();
    const w = await seal(motif, match);

    // Con el report real de hoy → cerrada.
    expect(await openWithManifest(w, manifestFromTrustReport(hankoReport))).toBeNull();
    // Con el proyecto entero sellado → revela (error 0).
    const layers = await open(w, match);
    expect(reconstructError(compose([...layers]), motif)).toBe(0);
  });
});
