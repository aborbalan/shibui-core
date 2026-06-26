// core — motor de composición de capas. Puro, sin DOM; no importa @shibui-ui/ui.
export { makeBitmap, getPixel, setPixel, type Bitmap } from './bitmap';
export { PATTERNS, complement, patternIndex, type Block } from './patterns';
export { systemSeed, type SeedSource } from './seed';
export { rngFrom, seeded, type Rng } from './rng';
export { kasaneWeave, readBlock, type Layer, type WeaveOptions } from './weave';
export { compose } from './compose';
export { downsample, reconstructError } from './reconstruct';
