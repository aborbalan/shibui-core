import { describe, it, expect } from 'vitest';
import { EXIT, KuraError, exitCodeFor, fail, ok, type ErrorCode } from './envelope';

describe('sobre de salida', () => {
  it('mapea cada clase de error a su código de salida', () => {
    const expected: Array<[ErrorCode, number]> = [
      ['UNEXPECTED', EXIT.unexpected],
      ['USAGE', EXIT.usage],
      ['NOT_FOUND', EXIT.notFound],
      ['AUTH', EXIT.auth],
      ['PRECONDITION', EXIT.precondition],
      ['VERIFICATION', EXIT.verification],
    ];
    for (const [code, exit] of expected) {
      expect(exitCodeFor(fail(new KuraError(code, 'x')))).toBe(exit);
    }
  });

  it('el éxito sale con 0', () => {
    expect(exitCodeFor(ok([1, 2, 3]))).toBe(EXIT.ok);
  });

  it('conserva código y pista de un KuraError', () => {
    const envelope = fail(new KuraError('PRECONDITION', 'falta el build', 'corre pnpm build:cv'));
    expect(envelope).toEqual({
      ok: false,
      error: { code: 'PRECONDITION', message: 'falta el build', hint: 'corre pnpm build:cv' },
    });
  });

  it('omite la clave hint cuando no hay pista, en vez de emitirla como undefined', () => {
    const envelope = fail(new KuraError('USAGE', 'comando desconocido'));
    expect('hint' in envelope.error).toBe(false);
    expect(JSON.stringify(envelope)).not.toContain('hint');
  });

  it('degrada a UNEXPECTED cualquier error ajeno conservando su mensaje', () => {
    expect(fail(new TypeError('x.map is not a function')).error).toEqual({
      code: 'UNEXPECTED',
      message: 'x.map is not a function',
    });
  });

  it('degrada también lo que se lanza sin ser un Error', () => {
    expect(fail('vaya').error).toEqual({ code: 'UNEXPECTED', message: 'vaya' });
  });
});
