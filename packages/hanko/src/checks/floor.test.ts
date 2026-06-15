import { describe, it, expect } from 'vitest';
import { floorCheck, isValidCustomElementName } from './floor';
import type { ComponentContract } from '../core/contract';

const comp = (tagName: string): ComponentContract => ({
  tagName,
  modulePath: 'm.ts',
  source: { kind: 'cem' },
});

describe('isValidCustomElementName', () => {
  it('acepta nombres válidos', () => {
    expect(isValidCustomElementName('lib-button')).toBe(true);
    expect(isValidCustomElementName('lib-scatter-3d')).toBe(true);
  });

  it('rechaza sin guion, con mayúsculas o reservados', () => {
    expect(isValidCustomElementName('button')).toBe(false);
    expect(isValidCustomElementName('Lib-Button')).toBe(false);
    expect(isValidCustomElementName('font-face')).toBe(false);
  });
});

describe('floorCheck', () => {
  it('pasa con tagName de custom element válido', () => {
    expect(floorCheck(comp('lib-button'))).toEqual({
      tagName: 'lib-button',
      pass: true,
      violations: [],
    });
  });

  it('falla con tagName inválido y reporta la violación', () => {
    const r = floorCheck(comp('Button'));
    expect(r.pass).toBe(false);
    expect(r.violations).toHaveLength(1);
  });

  it('falla sin tagName', () => {
    const r = floorCheck(comp(''));
    expect(r.pass).toBe(false);
    expect(r.violations).toContain('sin tagName');
  });
});
