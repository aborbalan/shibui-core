import { describe, it, expect } from 'vitest';
import type { ComponentContract } from './contract';

/* Primer test del modelo (F0). Bloquea la decisión de diseño central:
   la distinción de presencia que encarna `ausencia ≠ incumplimiento`.
   De paso verifica que el runner corre y que los tipos son usables. */
describe('ComponentContract · semántica de presencia', () => {
  it('distingue faceta NO declarada (undefined) de declarada vacía ([])', () => {
    // El manifest no dijo nada de eventos → no verificable.
    const sinEventos: ComponentContract = {
      tagName: 'x-sin-eventos',
      modulePath: 'a.ts',
      source: { kind: 'cem' },
    };

    // El manifest declaró explícitamente "cero eventos" → verificable: debe estar vacío.
    const ceroEventos: ComponentContract = {
      tagName: 'x-cero-eventos',
      modulePath: 'b.ts',
      source: { kind: 'cem' },
      events: [],
    };

    expect(sinEventos.events).toBeUndefined(); // un check NUNCA mira esto
    expect(ceroEventos.events).toEqual([]); // un check SÍ verifica que sea vacío
  });

  it('conserva la procedencia desde el día 1 (cem | adapter | inferred)', () => {
    const inferido: ComponentContract = {
      tagName: 'x-inferido',
      modulePath: 'c.ts',
      source: { kind: 'inferred' },
    };
    expect(inferido.source.kind).toBe('inferred');
  });
});
