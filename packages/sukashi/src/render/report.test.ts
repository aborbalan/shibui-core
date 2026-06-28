import { describe, it, expect } from 'vitest';
import { renderContrastReport, type ContrastReportEntry } from './report';
import type { MultiCoverMetric } from '../core/multicover';

function metric(over: Partial<MultiCoverMetric> = {}): MultiCoverMetric {
  return {
    contrast: [0.5, 0.5],
    pivotFidelity: [0.8],
    petalFidelity: [0.7, 0.72],
    belowThreshold: false,
    warnings: [],
    ...over,
  };
}

describe('renderContrastReport', () => {
  it('produce un documento HTML autónomo con una fila por caso', () => {
    const entries: ContrastReportEntry[] = [
      { title: 'caso A', cover: 'seigaiha + asanoha', metric: metric() },
      { title: 'caso B', metric: metric() },
    ];
    const html = renderContrastReport(entries);
    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain('caso A');
    expect(html).toContain('caso B');
    expect(html).toContain('seigaiha + asanoha');
    // dos filas de datos en el <tbody>.
    expect(html.match(/<tr>/g)?.length).toBe(3); // 1 cabecera + 2 datos
  });

  it('refleja el estado: ok, bajo umbral y fallback', () => {
    const entries: ContrastReportEntry[] = [
      { title: 'verde', metric: metric() },
      { title: 'aviso', metric: metric({ belowThreshold: true, warnings: ['contraste bajo'] }) },
      { title: 'ruido', metric: metric({ belowThreshold: true, warnings: ['fallback'] }), fellBack: true },
    ];
    const html = renderContrastReport(entries);
    expect(html).toContain('badge ok');
    expect(html).toContain('badge warn');
    expect(html).toContain('badge fb');
    expect(html).toContain('contraste bajo');
    // resumen: 1 en umbral de 3.
    expect(html).toContain('En umbral: <b>1</b>');
  });

  it('escapa el HTML del contenido externo', () => {
    const entries: ContrastReportEntry[] = [
      { title: '<script>x</script>', metric: metric({ belowThreshold: true, warnings: ['<b>w</b>'] }) },
    ];
    const html = renderContrastReport(entries);
    expect(html).not.toContain('<script>x</script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;b&gt;w&lt;/b&gt;');
  });
});
