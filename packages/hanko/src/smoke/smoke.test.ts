import { describe, it, expect } from 'vitest';
import { smoke } from './smoke';
import type { CustomElementsManifest } from '../ingest/cem-types';

const manifest: CustomElementsManifest = {
  schemaVersion: '1.0.0',
  modules: [
    {
      path: 'a.ts',
      declarations: [
        {
          kind: 'class',
          customElement: true,
          tagName: 'lib-button',
          name: 'LibButton',
          members: [{ kind: 'field', name: 'variant', type: { text: "'solid' | 'outlined'" } }],
          events: [{ name: 'ui-lib-click' }],
          // sin slots/cssParts/cssProps → no declarados
        },
        // tagName inválido → ingerido (dice ser custom element) pero falla el Floor.
        { kind: 'class', customElement: true, tagName: 'BadName', name: 'Bad' },
      ],
    },
  ],
};

describe('smoke', () => {
  it('emite un sello por componente y agrega pass/fail', () => {
    const r = smoke(manifest);
    expect(r.total).toBe(2);
    expect(r.passed).toBe(1);
    expect(r.failed).toBe(1);
  });

  it('sella Floor según validez del tagName', () => {
    const r = smoke(manifest);
    const ok = r.seals.find((s) => s.tagName === 'lib-button')!;
    const bad = r.seals.find((s) => s.tagName === 'BadName')!;
    expect(ok.pass).toBe(true);
    expect(bad.pass).toBe(false);
    expect(bad.violations.length).toBeGreaterThan(0);
  });

  it('reporta cobertura por presencia, no por contenido', () => {
    const ok = smoke(manifest).seals.find((s) => s.tagName === 'lib-button')!;
    expect(ok.coverage.properties).toBe(true); // declaró members
    expect(ok.coverage.events).toBe(true); // declaró events
    expect(ok.coverage.slots).toBe(false); // no declaró slots
    expect(ok.coverage.cssParts).toBe(false);
  });

  it('preserva la procedencia en el sello', () => {
    const ok = smoke(manifest).seals.find((s) => s.tagName === 'lib-button')!;
    expect(ok.source).toEqual({ kind: 'cem' });
    expect(ok.level).toBe('floor');
  });
});
