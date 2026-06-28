// pattern — covers generativos (seigaiha, asanoha, sashiko, mon, moiré).

import type { PatternGenerator } from './field';
import { seigaiha } from './seigaiha';
import { asanoha } from './asanoha';
import { sashiko } from './sashiko';
import { mon } from './mon';
import { moire } from './moire';
import { spiral } from '../warp/uzumaki';

export { clamp01, halftone, type PatternField, type PatternOptions, type PatternGenerator } from './field';
export { seigaiha } from './seigaiha';
export { asanoha } from './asanoha';
export { sashiko } from './sashiko';
export { mon } from './mon';
export { moire } from './moire';
export { KATACHI } from './palette';

export type PatternName = 'seigaiha' | 'asanoha' | 'sashiko' | 'mon' | 'moire' | 'uzumaki';

// Registro por nombre, para que la demo/consumidores elijan un cover por etiqueta.
// `uzumaki` (espiral) lo aporta el módulo warp — mismo remolino que deforma capas, como cover.
export const PATTERNS_BY_NAME: Readonly<Record<PatternName, PatternGenerator>> = {
  seigaiha,
  asanoha,
  sashiko,
  mon,
  moire,
  uzumaki: spiral,
};
