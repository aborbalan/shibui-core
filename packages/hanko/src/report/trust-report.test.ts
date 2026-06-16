import { describe, it, expect } from 'vitest';
import { buildTrustReport, type ComponentChecks } from './trust-report';
import { renderTrustReportJson, renderTrustReportHtml } from './render';
import type { FloorResult } from '../checks/floor';
import type { ContractResult } from '../checks/contract';
import type { A11yResult, A11yFinding } from '../checks/a11y';
import type { ResilienceResult } from '../checks/resilience';

const AT = '2026-06-16T00:00:00.000Z';

const floor = (pass: boolean): FloorResult => ({
  tagName: 'lib-x',
  pass,
  violations: pass ? [] : ['sin tagName'],
});

const contract = (pass: boolean): ContractResult => ({
  tagName: 'lib-x',
  level: 'conformance',
  pass,
  violations: pass ? [] : [{ facet: 'method', member: 'reset', message: 'método declarado "reset" ausente' }],
  checked: { registration: true, properties: 1, attributes: 0, methods: 1, reflect: 0, slots: 0 },
  skipped: [],
});

const a11y = (pass: boolean, warnings = 0): A11yResult => ({
  tagName: 'lib-x',
  pass,
  violations: pass ? [] : [{ rule: 'color-contrast', impact: 'serious', message: 'contraste insuficiente' }],
  warnings: Array.from(
    { length: warnings },
    (): A11yFinding => ({ rule: 'minor-x', impact: 'minor', message: 'aviso' }),
  ),
  checked: ['axe'],
  skipped: [],
});

const resilience = (pass: boolean): ResilienceResult => ({
  tagName: 'lib-x',
  pass,
  violations: pass ? [] : [{ scenario: 'junk-attrs', message: 'rompió con atributos basura' }],
  warnings: [],
  checked: ['empty', 'junk-attrs'],
  skipped: [],
});

const base = (over: Partial<ComponentChecks> = {}): ComponentChecks => ({
  tagName: 'lib-x',
  source: { kind: 'cem' },
  ...over,
});

describe('buildTrustReport · agregación', () => {
  it('sella un componente cuando todas las capas evaluadas pasan', () => {
    const r = buildTrustReport(
      [base({ floor: floor(true), contract: contract(true), a11y: a11y(true), resilience: resilience(true) })],
      { generatedAt: AT },
    );
    expect(r.trusted).toBe(1);
    expect(r.untrusted).toBe(0);
    expect(r.components[0]!.trusted).toBe(true);
    expect(r.components[0]!.layers.every((l) => l.status === 'pass')).toBe(true);
  });

  it('no sella si una capa falla, y registra el hallazgo prefijado por capa', () => {
    const r = buildTrustReport([base({ floor: floor(true), contract: contract(false) })], { generatedAt: AT });
    const c = r.components[0]!;
    expect(c.trusted).toBe(false);
    expect(c.layers.find((l) => l.layer === 'contract')!.status).toBe('fail');
    expect(c.findings.some((f) => f.startsWith('contract/method:'))).toBe(true);
  });

  it('las capas no evaluadas quedan skipped y no descalifican', () => {
    const r = buildTrustReport([base({ floor: floor(true) })], { generatedAt: AT });
    const c = r.components[0]!;
    expect(c.trusted).toBe(true); // solo floor evaluado y pasa
    expect(c.layers.filter((l) => l.status === 'skipped').map((l) => l.layer)).toEqual([
      'contract',
      'a11y',
      'resilience',
    ]);
  });

  it('un componente sin ninguna capa evaluada no es trusted (no hay base)', () => {
    const r = buildTrustReport([base()], { generatedAt: AT });
    expect(r.components[0]!.trusted).toBe(false);
    expect(r.untrusted).toBe(1);
  });

  it('los warnings no descalifican el sello, pero se cuentan', () => {
    const r = buildTrustReport([base({ floor: floor(true), a11y: a11y(true, 2) })], { generatedAt: AT });
    const c = r.components[0]!;
    expect(c.trusted).toBe(true);
    expect(c.layers.find((l) => l.layer === 'a11y')!.warnings).toBe(2);
  });

  it('cuenta sellados y sin sello en el total', () => {
    const r = buildTrustReport(
      [
        base({ tagName: 'lib-a', floor: floor(true), contract: contract(true) }),
        base({ tagName: 'lib-b', floor: floor(true), contract: contract(false) }),
      ],
      { generatedAt: AT },
    );
    expect(r.total).toBe(2);
    expect(r.trusted).toBe(1);
    expect(r.untrusted).toBe(1);
    expect(r.generatedAt).toBe(AT);
  });
});

describe('renderers', () => {
  const report = buildTrustReport(
    [base({ tagName: 'lib-button', floor: floor(true), contract: contract(false) })],
    { generatedAt: AT },
  );

  it('renderTrustReportJson serializa y reidrata sin pérdida', () => {
    expect(JSON.parse(renderTrustReportJson(report))).toEqual(report);
  });

  it('renderTrustReportHtml produce un documento con el tag del componente', () => {
    const html = renderTrustReportHtml(report);
    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain('lib-button');
    expect(html).toContain('sin sello');
  });
});
