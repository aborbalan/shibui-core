import { describe, it, expect } from 'vitest';
import { parseType } from './parse-type';

describe('parseType', () => {
  it('primitivos', () => {
    expect(parseType('boolean')).toEqual({ raw: 'boolean', kind: 'boolean' });
    expect(parseType('number')).toEqual({ raw: 'number', kind: 'number' });
    expect(parseType('string')).toEqual({ raw: 'string', kind: 'string' });
  });

  it('unión de literales string → string-union con literales', () => {
    expect(parseType("'solid' | 'outlined' | 'ghost'")).toEqual({
      raw: "'solid' | 'outlined' | 'ghost'",
      kind: 'string-union',
      literals: ['solid', 'outlined', 'ghost'],
    });
  });

  it('un único literal → string-union de uno', () => {
    expect(parseType("'md'")).toEqual({
      raw: "'md'",
      kind: 'string-union',
      literals: ['md'],
    });
  });

  it('unión mixta → unknown con raw preservado (lossless)', () => {
    const r = parseType("'a' | number");
    expect(r.kind).toBe('unknown');
    expect(r.raw).toBe("'a' | number");
    expect(r.literals).toBeUndefined();
  });

  it('no trocea uniones dentro de genéricos', () => {
    const r = parseType('Array<string | number>');
    expect(r.kind).toBe('unknown'); // un solo término a nivel superior
    expect(r.raw).toBe('Array<string | number>');
  });

  it('vacío/ausente → unknown', () => {
    expect(parseType(undefined)).toEqual({ raw: '', kind: 'unknown' });
    expect(parseType('   ')).toEqual({ raw: '', kind: 'unknown' });
  });
});
