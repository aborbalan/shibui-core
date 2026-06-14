import { describe, it, expect } from 'vitest';
import { ingestCem } from './cem';
import type { CustomElementsManifest } from './cem-types';

const manifest: CustomElementsManifest = {
  schemaVersion: '1.0.0',
  modules: [
    {
      path: 'src/lib-button.ts',
      declarations: [
        {
          kind: 'class',
          customElement: true,
          tagName: 'lib-button',
          name: 'LibButton',
          members: [
            {
              kind: 'field',
              name: 'variant',
              attribute: 'variant',
              reflects: true,
              type: { text: "'solid' | 'outlined'" },
              default: "'solid'",
            },
            { kind: 'field', name: 'disabled', type: { text: 'boolean' }, default: 'false' },
            { kind: 'field', name: '_internal', privacy: 'private', type: { text: 'string' } },
            { kind: 'method', name: 'focus' },
          ],
          events: [{ name: 'ui-lib-click' }],
          // sin `slots` declarados → slots queda undefined
        },
        // No es custom element → se filtra.
        { kind: 'class', name: 'BaseThing' },
      ],
    },
  ],
};

describe('ingestCem', () => {
  it('filtra a solo custom elements con tagName', () => {
    const set = ingestCem(manifest);
    expect([...set.components.keys()]).toEqual(['lib-button']);
  });

  it('mapea props públicas; excluye privadas y métodos', () => {
    const c = ingestCem(manifest).components.get('lib-button')!;
    expect(c.properties?.map((p) => p.property)).toEqual(['variant', 'disabled']);
    expect(c.methods).toBeUndefined(); // deferido a F3
  });

  it('respeta reflect, attribute, default raw y tipo parseado', () => {
    const c = ingestCem(manifest).components.get('lib-button')!;
    const variant = c.properties?.find((p) => p.property === 'variant')!;
    expect(variant.reflects).toBe(true);
    expect(variant.attribute).toBe('variant');
    expect(variant.default).toBe("'solid'");
    expect(variant.type).toEqual({
      raw: "'solid' | 'outlined'",
      kind: 'string-union',
      literals: ['solid', 'outlined'],
    });
  });

  it('presencia: eventos declarados ([...]); slots no declarados (undefined)', () => {
    const c = ingestCem(manifest).components.get('lib-button')!;
    expect(c.events).toEqual([{ name: 'ui-lib-click' }]);
    expect(c.slots).toBeUndefined(); // no verificable
  });

  it('marca la procedencia como cem', () => {
    const c = ingestCem(manifest).components.get('lib-button')!;
    expect(c.source).toEqual({ kind: 'cem' });
  });
});
