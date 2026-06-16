import { describe, it, expect } from 'vitest';
import { publicApiOf, dasherize } from './probe';

/* Tests del NÚCLEO PURO del harness (reflexión de prototipos), en Node con
   clases falsas. Las funciones browser (observeRuntime/A11y/Resilience) se
   ejercitan en probe.browser.test.ts. */

class Base {
  baseMethod(): void {}
  get inherited(): number {
    return 1;
  }
}

class Widget extends Base {
  field = 'x';
  _private = 'no';
  get accessor(): number {
    return 2;
  }
  set accessor(_v: number) {}
  doThing(): void {}
}

describe('publicApiOf', () => {
  it('separa accessors/campos (properties) de funciones (methods)', () => {
    const api = publicApiOf(new Widget(), Object.prototype);
    expect(api.properties).toEqual(expect.arrayContaining(['accessor', 'field', 'inherited']));
    expect(api.methods).toEqual(expect.arrayContaining(['doThing', 'baseMethod']));
  });

  it('excluye constructor y nombres privados (_)', () => {
    const api = publicApiOf(new Widget(), Object.prototype);
    expect(api.methods).not.toContain('constructor');
    expect(api.properties).not.toContain('_private');
  });

  it('respeta stopProto: corta la herencia en la clase base', () => {
    const api = publicApiOf(new Widget(), Base.prototype);
    expect(api.properties).toContain('accessor');
    expect(api.properties).not.toContain('inherited'); // quedó por encima del corte
    expect(api.methods).not.toContain('baseMethod');
  });
});

describe('dasherize', () => {
  it('convierte camelCase a kebab-case', () => {
    expect(dasherize('variant')).toBe('variant');
    expect(dasherize('maxLength')).toBe('max-length');
    expect(dasherize('ariaLabel')).toBe('aria-label');
  });
});
