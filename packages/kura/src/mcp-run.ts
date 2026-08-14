/* Arranque del servidor MCP por stdio. Vive aparte de `mcp.ts` para que los
   tests puedan importar el servidor sin conectarlo a nada. */
import { main } from './mcp';

await main();
