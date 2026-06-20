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
            // `_`-prefijados que el analizador deja con privacy '' (caso real shibui):
            // se excluyen por CONVENCIÓN de nombre, igual que en publicApiOf.
            { kind: 'field', name: '_uid', type: { text: 'number' } },
            { kind: 'method', name: '_handleClick' },
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

  it('separa miembros: campos públicos a properties, métodos públicos a methods (F3)', () => {
    const c = ingestCem(manifest).components.get('lib-button')!;
    expect(c.properties?.map((p) => p.property)).toEqual(['variant', 'disabled']); // sin _internal ni focus
    expect(c.methods?.map((m) => m.name)).toEqual(['focus']); // poblados desde F3
  });

  it('excluye miembros `_`-prefijados aunque privacy sea \'\' (simetría con publicApiOf)', () => {
    const c = ingestCem(manifest).components.get('lib-button')!;
    expect(c.properties?.map((p) => p.property)).not.toContain('_uid');
    expect(c.methods?.map((m) => m.name)).not.toContain('_handleClick');
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
