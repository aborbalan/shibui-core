import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { annotationsFor, createKuraMcpServer, toolName } from './mcp';
import { COMMANDS } from './spec';

/* ============================================================
   Se conecta un cliente MCP de verdad contra el servidor por un
   transporte en memoria. Así el handshake, el esquema de entrada y
   la forma de la respuesta se ejercitan como lo haría Claude, en vez
   de comprobar por dentro que las funciones existen.
   ============================================================ */

const temps: string[] = [];

afterEach(() => {
  let dir = temps.pop();
  while (dir !== undefined) {
    rmSync(dir, { recursive: true, force: true });
    dir = temps.pop();
  }
});

function fixtureRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'kura-mcp-'));
  temps.push(root);
  writeFileSync(
    join(root, '.firebaserc'),
    JSON.stringify({ projects: {}, targets: { 'proyecto-x': { hosting: { cv: ['sitio-cv'] } } } }),
  );
  writeFileSync(join(root, 'firebase.json'), JSON.stringify({ hosting: [{ target: 'cv', public: 'dist' }] }));
  return root;
}

async function connected(): Promise<Client> {
  const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test', version: '0' });
  await Promise.all([createKuraMcpServer().connect(serverSide), client.connect(clientSide)]);
  return client;
}

/** Extrae el sobre de kura del primer bloque de texto de la respuesta. */
function envelopeOf(result: unknown): { ok: boolean; data?: unknown; error?: { code: string } } {
  const content = (result as { content: Array<{ type: string; text: string }> }).content;
  const first = content[0];
  expect(first?.type).toBe('text');
  return JSON.parse(first?.text ?? '{}') as { ok: boolean };
}

describe('servidor MCP · superficie', () => {
  it('publica una herramienta por cada comando del spec', async () => {
    const { tools } = await (await connected()).listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual(COMMANDS.map((c) => toolName(c.name)).sort());
  });

  it('cada herramienta llega descrita', async () => {
    const { tools } = await (await connected()).listTools();
    expect(tools.filter((tool) => (tool.description ?? '').length < 10)).toEqual([]);
  });

  it('marca de solo lectura lo que no muta, y al revés', async () => {
    const { tools } = await (await connected()).listTools();
    const byName = new Map(tools.map((tool) => [tool.name, tool]));
    expect(byName.get('kura_targets')?.annotations?.readOnlyHint).toBe(true);
    expect(byName.get('kura_deploy')?.annotations?.readOnlyHint).toBe(false);
    expect(byName.get('kura_sites_create')?.annotations?.readOnlyHint).toBe(false);
  });

  it('solo deploy se anuncia como destructivo: crear un sitio es aditivo', async () => {
    const { tools } = await (await connected()).listTools();
    const destructivas = tools.filter((tool) => tool.annotations?.destructiveHint === true).map((t) => t.name);
    expect(destructivas).toEqual(['kura_deploy']);
  });

  it('targets es la única que no sale a la red', async () => {
    const { tools } = await (await connected()).listTools();
    const cerradas = tools.filter((tool) => tool.annotations?.openWorldHint === false).map((t) => t.name);
    expect(cerradas).toEqual(['kura_targets']);
  });
});

describe('servidor MCP · derivación desde el spec', () => {
  it('el nombre traduce los subcomandos', () => {
    expect(toolName('targets')).toBe('kura_targets');
    expect(toolName('sites create')).toBe('kura_sites_create');
  });

  it('las anotaciones salen de las banderas, no de una lista a mano', () => {
    const targets = COMMANDS.find((command) => command.name === 'targets');
    expect(targets && annotationsFor(targets)).toEqual({
      readOnlyHint: true,
      openWorldHint: false,
      destructiveHint: false,
      idempotentHint: true,
    });
  });
});

describe('servidor MCP · llamadas', () => {
  it('devuelve el MISMO sobre que el CLI', async () => {
    const result = await (await connected()).callTool({ name: 'kura_targets', arguments: { root: fixtureRoot() } });
    const envelope = envelopeOf(result);
    expect(envelope.ok).toBe(true);
    expect(envelope.data).toEqual([
      { target: 'cv', sites: ['sitio-cv'], publicDir: 'dist', build: 'missing', entries: 0, modified: null },
    ]);
  });

  it('un error de kura llega como isError con su código, no como excepción de transporte', async () => {
    const result = await (await connected()).callTool({
      name: 'kura_targets',
      arguments: { root: join(tmpdir(), 'kura-no-existe-jamas') },
    });
    expect((result as { isError?: boolean }).isError).toBe(true);
    expect(envelopeOf(result).error?.code).toBe('NOT_FOUND');
  });

  it('el esquema de entrada para un deploy sin target antes de ejecutar nada', async () => {
    const client = await connected();
    const result = await client.callTool({ name: 'kura_deploy', arguments: { root: fixtureRoot() } });

    // La validación ocurre en el SDK, ANTES de que corra el manejador, así que
    // aquí no llega el sobre de kura: llega el detalle del esquema. Es la
    // diferencia con el CLI, donde el mismo caso sale por USAGE con código 2.
    expect((result as { isError?: boolean }).isError).toBe(true);
    const texto = (result as { content: Array<{ text: string }> }).content[0]?.text ?? '';
    expect(texto).toContain('target');
  });
});
