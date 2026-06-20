/* ============================================================
   hanko · Superficie pública de @shibui-ui/hanko

   Punto de entrada único del paquete (`exports` → este fichero).
   Reexporta los subsistemas a través de sus barrels curados. El
   core nunca importa shibui (garantizado por src/genericity.test.ts);
   este barrel tampoco.
   ============================================================ */

// Modelo de datos (lo declarado) y observación de runtime (lo observado).
export * from './core/contract';
export * from './core/runtime';

// Ingestión del CEM → modelo.
export * from './ingest';

// Las cuatro capas de verificación (Floor · contrato · a11y · resiliencia).
export * from './checks';

// Sello agregado (Trust Report) + renderers JSON/HTML.
export * from './report';

// Harness de runtime (observa elementos vivos → observaciones). Browser-only en uso.
export * from './harness';

// Flujo smoke (primer sello Floor + cobertura).
export * from './smoke';
