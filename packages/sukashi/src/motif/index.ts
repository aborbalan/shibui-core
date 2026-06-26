// motif — borde de ingestión: rasteriza una fuente a bitmap b/n y alinea pares.
export {
  rasterize,
  coverageFromRGBA,
  type GraySource,
  type RgbaSource,
  type CoverageChannel,
  type RasterizeOptions,
} from './rasterize';
export { alignPair, sameSize } from './align';
