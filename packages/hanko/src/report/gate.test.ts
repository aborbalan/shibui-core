import { describe, it, expect } from 'vitest';
import { gateAgainstBaseline, baselineFromReport, reportCoverage, type Baseline } from './gate';
import type { TrustReport, ComponentTrust, LayerVerdict, TrustLayer } from './trust-report';

const AT = '2026-06-22T00:00:00.000Z';

const verdict = (layer: TrustLayer, status: 'pass' | 'fail' | 'skipped'): LayerVerdict => ({
  layer,
  status,
  violations: status === 'fail' ? 1 : 0,
  warnings: 0,
});

/** Componente con Floor pass + (opcional) contrato evaluado, para fijar la cobertura. */
const comp = (tagName: string, trusted: boolean, fourLayer = true): ComponentTrust => ({
  tagName,
  source: { kind: 'cem' },
  trusted,
  layers: [
    verdict('floor', 'pass'),
    verdict('contract', fourLayer ? (trusted ? 'pass' : 'fail') : 'skipped'),
    verdict('a11y', 'skipped'),
    verdict('resilience', 'skipped'),
  ],
  findings: [],
});

const report = (components: ComponentTrust[]): TrustReport => {
  const trusted = components.filter((c) => c.trusted).length;
  return {
    generatedAt: AT,
    total: components.length,
    trusted,
    untrusted: components.length - trusted,
    components,
  };
};

const baseline = (trustedTags: string[], coverage: Baseline['coverage'] = 'four-layer'): Baseline => ({
  coverage,
  generatedAt: AT,
  total: trustedTags.length,
  trusted: trustedTags.length,
  trustedTags: [...trustedTags].sort(),
});

describe('reportCoverage', () => {
  it('es "four-layer" si alguna capa no-floor se evaluó', () => {
    expect(reportCoverage(report([comp('lib-a', true, true)]))).toBe('four-layer');
  });

  it('es "floor" si solo Floor se evaluó (las demás skipped)', () => {
    expect(reportCoverage(report([comp('lib-a', true, false)]))).toBe('floor');
  });
});

describe('baselineFromReport', () => {
  it('captura los tags sellados ordenados con su cobertura', () => {
    const b = baselineFromReport(report([comp('lib-b', true), comp('lib-a', true), comp('lib-c', false)]));
    expect(b.trustedTags).toEqual(['lib-a', 'lib-b']);
    expect(b.trusted).toBe(2);
    expect(b.total).toBe(3);
    expect(b.coverage).toBe('four-layer');
  });
});

describe('gateAgainstBaseline', () => {
  it('pasa cuando el suelo se preserva', () => {
    const r = gateAgainstBaseline(report([comp('lib-a', true), comp('lib-b', true)]), baseline(['lib-a', 'lib-b']));
    expect(r.ok).toBe(true);
    expect(r.regressed).toEqual([]);
  });

  it('falla si un tag sellado pierde el sello (regresión per-tag)', () => {
    const r = gateAgainstBaseline(report([comp('lib-a', true), comp('lib-b', false)]), baseline(['lib-a', 'lib-b']));
    expect(r.ok).toBe(false);
    expect(r.regressed).toEqual(['lib-b']);
  });

  it('estricto: una mejora en otro tag NO compensa la caída de uno sellado', () => {
    // lib-b se cae, lib-c (nuevo) sella → el conteo no baja, pero igual falla.
    const r = gateAgainstBaseline(
      report([comp('lib-a', true), comp('lib-b', false), comp('lib-c', true)]),
      baseline(['lib-a', 'lib-b']),
    );
    expect(r.currentTrusted).toBe(2);
    expect(r.baselineTrusted).toBe(2);
    expect(r.ok).toBe(false);
    expect(r.regressed).toEqual(['lib-b']);
    expect(r.newlyTrusted).toEqual(['lib-c']);
  });

  it('un componente nuevo sin sello no es regresión', () => {
    const r = gateAgainstBaseline(report([comp('lib-a', true), comp('lib-new', false)]), baseline(['lib-a']));
    expect(r.ok).toBe(true);
    expect(r.regressed).toEqual([]);
  });

  it('un componente sellado eliminado no es regresión (se reporta como removed)', () => {
    const r = gateAgainstBaseline(report([comp('lib-a', true)]), baseline(['lib-a', 'lib-gone']));
    expect(r.ok).toBe(true);
    expect(r.removed).toEqual(['lib-gone']);
  });

  it('aborta si la cobertura no coincide con el baseline', () => {
    const r = gateAgainstBaseline(report([comp('lib-a', true, false)]), baseline(['lib-a'], 'four-layer'));
    expect(r.coverageMismatch).toBe(true);
    expect(r.ok).toBe(false);
  });
});
