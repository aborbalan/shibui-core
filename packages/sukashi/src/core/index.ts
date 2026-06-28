// core — motor de composición de capas. Puro, sin DOM; no importa @shibui-ui/ui.
export { makeBitmap, getPixel, setPixel, type Bitmap } from './bitmap';
export { PATTERNS, complement, patternIndex, type Block } from './patterns';
export { systemSeed, type SeedSource } from './seed';
export { rngFrom, seeded, type Rng } from './rng';
export { kasaneWeave, readBlock, writeBlock, type Layer, type WeaveOptions } from './weave';
export {
  kasaneMultiWeave,
  type MultiWeaveOptions,
  type MultiWeaveResult,
} from './multiweave';
export {
  kasaneMultiCoverWeave,
  type MultiCover,
  type MultiCoverWeaveOptions,
  type MultiCoverMetric,
  type MultiCoverWeaveResult,
} from './multicover';
export { compose } from './compose';
export { downsample, reconstructError } from './reconstruct';
export {
  kasaneCoverWeave,
  type CoverPair,
  type CoverWeaveOptions,
  type CoverMetric,
  type CoverWeaveResult,
} from './cover';
