import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMMANDS, EXIT_CODES, FLAGS, PARSE_OPTIONS, helpSpec } from './spec';
import { EXIT } from './envelope';

/* ============================================================
   Guard del spec (F5)

   El spec es la fuente de verdad de la superficie de kura, pero la
   ayuda en prosa se escribe a mano y podría quedarse atrás. Estos
   tests convierten «están sincronizados» en algo ejecutable, en vez
   de en una promesa. Se lee cli.ts como TEXTO para no importarlo:
   ese módulo ejecuta `main()` al cargarse.
   ============================================================ */

const CLI = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'cli.ts'), 'utf-8');
const INICIO = CLI.indexOf('const USAGE = `');
const USAGE = CLI.slice(INICIO, CLI.indexOf('`;', INICIO));

describe('spec y ayuda en prosa sincronizados', () => {
  it('el bloque de ayuda se localiza en cli.ts', () => {
    expect(INICIO).toBeGreaterThan(-1);
    expect(USAGE.length).toBeGreaterThan(200);
  });

  it('la prosa menciona todos los comandos del spec', () => {
    expect(COMMANDS.filter((command) => !USAGE.includes(command.name)).map((c) => c.name)).toEqual([]);
  });

  it('la prosa menciona todos los flags del spec', () => {
    expect(FLAGS.filter((flag) => !USAGE.includes(`--${flag.flag}`)).map((f) => f.flag)).toEqual([]);
  });
});

describe('coherencia interna del spec', () => {
  it('parseArgs acepta exactamente los flags declarados', () => {
    expect(Object.keys(PARSE_OPTIONS).sort()).toEqual(FLAGS.map((flag) => flag.flag).sort());
  });

  it('conserva el alias corto donde lo hay', () => {
    expect(PARSE_OPTIONS['help']).toEqual({ type: 'boolean', short: 'h' });
    expect(PARSE_OPTIONS['format']).toEqual({ type: 'string' });
  });

  it('ningún flag apunta a un comando inexistente', () => {
    const nombres = new Set(COMMANDS.map((command) => command.name));
    const huerfanos = FLAGS.flatMap((flag) => flag.commands.filter((name) => !nombres.has(name)));
    expect(huerfanos).toEqual([]);
  });

  it('los códigos de salida declarados son los que usa el envelope', () => {
    expect(EXIT_CODES.map((entry) => entry.code).sort()).toEqual(Object.values(EXIT).sort());
  });

  it('todo comando que muta se puede simular: declara --execute', () => {
    const conExecute = new Set(FLAGS.find((flag) => flag.flag === 'execute')?.commands ?? []);
    const mutanSinSimular = COMMANDS.filter((c) => c.mutates && !conExecute.has(c.name)).map((c) => c.name);
    expect(mutanSinSimular).toEqual([]);
  });

  it('ningún comando sin red pide credenciales', () => {
    expect(COMMANDS.filter((command) => !command.network && command.credentials).map((c) => c.name)).toEqual([]);
  });
});

describe('spec maquinable', () => {
  it('lleva lo que un agente necesita para decidir sin preguntar', () => {
    const spec = helpSpec();
    expect(spec.tool).toBe('kura');
    const targets = spec.commands.find((command) => command.name === 'targets');
    expect(targets).toMatchObject({ network: false, credentials: false, mutates: false });
    const deploy = spec.commands.find((command) => command.name === 'deploy');
    expect(deploy).toMatchObject({ network: true, credentials: true, mutates: true });
    expect(spec.notes.join(' ')).toContain('--silent');
  });
});
