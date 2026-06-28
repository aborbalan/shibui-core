// entropy — fuente de semilla del cielo (kumo). Núcleo PURO, node-safe.
// El adaptador de cámara (`camera.ts`) usa el DOM y NO se re-exporta aquí;
// la demo lo importa directamente (mismo patrón que `web/`).
export { concatFrames, condense, expandPool } from './condense';
export {
  framesFrozen,
  entropyEstimate,
  healthCheck,
  type HealthOptions,
  type HealthResult,
} from './health';
export {
  mixSeed,
  openSky,
  type SkyCapture,
  type SkySeedOptions,
  type SkySeedResult,
} from './sky';
