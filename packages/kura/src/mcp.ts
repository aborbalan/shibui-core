/* ============================================================
   kura · servidor MCP (F7)

   Segundo transporte sobre el MISMO núcleo. `src/commands/*` son
   funciones puras que reciben su adaptador, así que aquí no se
   reimplementa nada: se traduce entrada y salida.

   Qué gana un agente frente a invocar el CLI por Bash: no tiene que
   recordar la ruta al fuente, ni el `--silent` de pnpm, ni qué
   formato pedir, ni leerse el CLAUDE.md para saber qué es seguro.
   Las herramientas llegan descritas y anotadas.

   Las anotaciones NO se escriben a mano: salen de las banderas
   network / credentials / mutates de `src/spec.ts`, que ya es la
   fuente de verdad del CLI. Una herramienta nueva sin entrada en el
   spec hace fallar a mcp.test.ts.

   El sobre de salida es EL MISMO que por CLI: {ok,data} o
   {ok,error{code,message,hint}}. Un agente que aprenda a leer uno
   sabe leer el otro.

   ÚNICA dependencia del paquete: el SDK oficial de MCP. Se acepta
   porque el protocolo lo mantiene otro, y porque ya estaba en el
   lockfile como dependencia de firebase-tools.
   ============================================================ */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { fail, ok, KuraError } from './envelope';
import { findRepoRoot, readHostingConfig, type HostingConfig } from './config';
import { reportTargets } from './commands/targets';
import { COMMANDS, type CommandSpec } from './spec';

/** Nombre de herramienta MCP para un comando del spec: `sites create` → `kura_sites_create`. */
export function toolName(command: string): string {
  return `kura_${command.replace(/ /g, '_')}`;
}

/**
 * Las anotaciones se derivan del spec, no se escriben a mano.
 *
 * - `readOnlyHint`   ← no muta nada fuera del proceso
 * - `openWorldHint`  ← sale a la red
 * - `destructiveHint`← puede pisar algo ya publicado. Crear un sitio es
 *                      aditivo; desplegar sobrescribe lo que estaba.
 * - `idempotentHint` ← repetirlo no cambia el resultado. Crear un sitio que
 *                      ya existe es un no-op; cada deploy publica algo nuevo.
 */
export function annotationsFor(command: CommandSpec): ToolAnnotations {
  return {
    readOnlyHint: !command.mutates,
    openWorldHint: command.network,
    destructiveHint: command.name === 'deploy',
    idempotentHint: !command.mutates || command.name === 'sites create',
  };
}

const ROOT = {
  root: z.string().optional().describe('Raíz del repo; por defecto se busca hacia arriba desde el cwd'),
};

type Result = { data: unknown; failed?: boolean };
type ToolResult = { content: Array<{ type: 'text'; text: string }>; isError?: boolean };

/**
 * Envuelve un comando en el sobre de kura. Un informe con comprobaciones en
 * rojo llega con `isError`, igual que por CLI sale con código 6: el comando
 * funcionó, pero lo que verificaba no está sano.
 */
async function envelope(run: () => Promise<Result> | Result): Promise<ToolResult> {
  try {
    const { data, failed } = await run();
    const text = JSON.stringify(ok(data), null, 2);
    return failed === true ? { content: [{ type: 'text', text }], isError: true } : { content: [{ type: 'text', text }] };
  } catch (err) {
    return { content: [{ type: 'text', text: JSON.stringify(fail(err), null, 2) }], isError: true };
  }
}

function configFrom(root: string | undefined): HostingConfig {
  return readHostingConfig(root ?? findRepoRoot(process.cwd()));
}

function specFor(name: string): CommandSpec {
  const found = COMMANDS.find((command) => command.name === name);
  if (found === undefined) {
    throw new KuraError('UNEXPECTED', `El comando '${name}' no está en el spec`);
  }
  return found;
}

export function createKuraMcpServer(): McpServer {
  const server = new McpServer({ name: 'kura', version: '0.0.0' });

  const register = (command: string, inputSchema: z.ZodRawShape, cb: (args: never) => Promise<ToolResult>): void => {
    const spec = specFor(command);
    server.registerTool(
      toolName(command),
      {
        title: `kura ${command}`,
        description: spec.summary,
        inputSchema,
        annotations: annotationsFor(spec),
      },
      cb as never,
    );
  };

  register('targets', ROOT, async (args: { root?: string }) =>
    envelope(() => ({ data: reportTargets(configFrom(args.root)) })),
  );

  register(
    'status',
    { ...ROOT, target: z.string().optional().describe('Restringe a un target') },
    async (args: { root?: string; target?: string }) =>
      envelope(async () => {
        const config = configFrom(args.root);
        const [{ createFirebaseAdapter }, { reportStatus }] = await Promise.all([
          import('./adapter'),
          import('./commands/status'),
        ]);
        return { data: await reportStatus(config, reportTargets(config), createFirebaseAdapter(), args.target) };
      }),
  );

  register(
    'verify',
    {
      ...ROOT,
      target: z.string().optional().describe('Restringe a un target'),
      expectOrigin: z.string().optional().describe('Exige que el bundle servido contenga esa cadena'),
    },
    async (args: { root?: string; target?: string; expectOrigin?: string }) =>
      envelope(async () => {
        const config = configFrom(args.root);
        const [{ createHttpClient }, { reportVerify }] = await Promise.all([
          import('./http'),
          import('./commands/verify'),
        ]);
        const rows = await reportVerify(config, createHttpClient(), {
          onlyTarget: args.target,
          expectOrigin: args.expectOrigin,
        });
        return { data: rows, failed: rows.some((row) => !row.ok) };
      }),
  );

  register('sites', ROOT, async (args: { root?: string }) =>
    envelope(async () => {
      const config = configFrom(args.root);
      const [{ createFirebaseAdapter }, { reportSites }] = await Promise.all([
        import('./adapter'),
        import('./commands/sites'),
      ]);
      return { data: await reportSites(config, createFirebaseAdapter()) };
    }),
  );

  register(
    'sites create',
    {
      ...ROOT,
      site: z.string().optional().describe('Sitio concreto a crear'),
      missing: z.boolean().optional().describe('Crea todo lo que .firebaserc declara y no existe'),
      execute: z.boolean().optional().describe('Sin esto solo simula y cuenta qué haría'),
    },
    async (args: { root?: string; site?: string; missing?: boolean; execute?: boolean }) =>
      envelope(async () => {
        const config = configFrom(args.root);
        const [{ createFirebaseAdapter }, { createSites }] = await Promise.all([
          import('./adapter'),
          import('./commands/sites'),
        ]);
        const { rows, failed } = await createSites(config, createFirebaseAdapter(), {
          site: args.site,
          missing: args.missing,
          execute: args.execute,
        });
        return { data: rows, failed };
      }),
  );

  register(
    'deploy',
    {
      ...ROOT,
      target: z.string().describe('Target a publicar; obligatorio'),
      channel: z.string().optional().describe('Canal de preview; por defecto preview'),
      live: z.boolean().optional().describe('Destino producción. Exige confirm con el nombre del target'),
      confirm: z.string().optional().describe('Repite el nombre del target para autorizar el deploy a live'),
      execute: z.boolean().optional().describe('Sin esto solo simula y cuenta qué haría'),
      expectOrigin: z.string().optional().describe('Exige que el bundle publicado contenga esa cadena'),
    },
    async (args: {
      root?: string;
      target: string;
      channel?: string;
      live?: boolean;
      confirm?: string;
      execute?: boolean;
      expectOrigin?: string;
    }) =>
      envelope(async () => {
        const config = configFrom(args.root);
        const [{ createFirebaseAdapter }, { createHttpClient }, { runDeploy }] = await Promise.all([
          import('./adapter'),
          import('./http'),
          import('./commands/deploy'),
        ]);
        const { rows, failed } = await runDeploy(
          config,
          reportTargets(config),
          createFirebaseAdapter(),
          createHttpClient(),
          {
            target: args.target,
            channel: args.channel,
            live: args.live,
            confirm: args.confirm,
            execute: args.execute,
            expectOrigin: args.expectOrigin,
          },
        );
        return { data: rows, failed };
      }),
  );

  return server;
}

/** Arranque real por stdio. Se salta cuando el módulo se importa desde un test. */
export async function main(): Promise<void> {
  await createKuraMcpServer().connect(new StdioServerTransport());
}
