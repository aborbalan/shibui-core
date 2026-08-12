import { describe, it, expect } from 'vitest';
import { defaultFormat, isFormat, render } from './format';
import { fail, ok, KuraError } from './envelope';

const rows = [
  { target: 'cv', build: 'ready', entries: 12, modified: null, sites: ['shibui-cv'] },
  { target: 'sukashi', build: 'missing', entries: 0, modified: null, sites: ['sukashi'] },
];

describe('elección de formato', () => {
  it('con TTY delante hay un humano: tabla', () => {
    expect(defaultFormat(true)).toBe('table');
  });

  it('sin TTY hay una tubería o un agente: ndjson', () => {
    expect(defaultFormat(false)).toBe('ndjson');
  });

  it('reconoce solo los tres formatos declarados', () => {
    expect(isFormat('json')).toBe(true);
    expect(isFormat('yaml')).toBe(false);
  });
});

describe('ndjson', () => {
  it('emite un sobre por fila, no un sobre con un array dentro', () => {
    const lines = render(ok(rows), 'ndjson').split('\n');
    expect(lines).toHaveLength(2);
    for (const line of lines) {
      expect(JSON.parse(line)).toMatchObject({ ok: true, data: { target: expect.any(String) } });
    }
  });

  it('emite el error como una única línea parseable', () => {
    const line = render(fail(new KuraError('AUTH', 'sin credenciales')), 'ndjson');
    expect(line).not.toContain('\n');
    expect(JSON.parse(line)).toEqual({ ok: false, error: { code: 'AUTH', message: 'sin credenciales' } });
  });
});

describe('json', () => {
  it('devuelve el sobre completo indentado', () => {
    const parsed: unknown = JSON.parse(render(ok(rows), 'json'));
    expect(parsed).toEqual({ ok: true, data: rows });
  });
});

describe('tabla', () => {
  it('alinea las columnas a la anchura de su contenido', () => {
    const [header, rule, primera] = render(ok(rows), 'table').split('\n');
    expect(header).toContain('target');
    // La regla solo lleva el filete y los separadores.
    expect(rule).toMatch(/^[─ ]+$/);
    // Alineación de verdad: la columna `build` arranca en la misma posición
    // en la cabecera y en la primera fila.
    expect(primera?.indexOf('ready')).toBe(header?.indexOf('build'));
  });

  it('no deja espacios colgando al final de las filas', () => {
    for (const line of render(ok(rows), 'table').split('\n')) {
      expect(line).toBe(line.trimEnd());
    }
  });

  it('traduce booleanos, nulos y arrays a algo legible', () => {
    const out = render(ok([{ listo: true, roto: false, fecha: null, sitios: ['a', 'b'] }]), 'table');
    expect(out).toContain('sí');
    expect(out).toContain('no');
    expect(out).toContain('—');
    expect(out).toContain('a, b');
  });

  it('cae a JSON cuando los datos no son un array de objetos planos', () => {
    expect(render(ok({ project: 'lib-ui-b67c5' }), 'table')).toBe('{\n  "project": "lib-ui-b67c5"\n}');
    expect(render(ok([1, 2]), 'table')).toBe('[\n  1,\n  2\n]');
  });

  it('dice que no hay resultados en vez de imprimir una tabla vacía', () => {
    expect(render(ok([]), 'table')).toBe('(sin resultados)');
  });

  it('muestra el error con su pista debajo', () => {
    const out = render(fail(new KuraError('PRECONDITION', 'falta el build', 'corre pnpm build:cv')), 'table');
    expect(out).toBe('PRECONDITION: falta el build\n  corre pnpm build:cv');
  });
});
