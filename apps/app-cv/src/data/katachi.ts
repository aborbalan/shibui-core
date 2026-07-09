/**
 * Catálogo de katachi disponibles para el selector del CV.
 * Los 6 contextos sellados del sistema Shibui — se activan poniendo
 * `data-katachi="<id>"` sobre un ancestro (aquí, `<html>`).
 */
export type KatachiId = 'shizen' | 'celadon' | 'sabi' | 'kintsugi' | 'wabi' | 'terminal';

/** Katachi por defecto (papel claro, tinta oscura) — coincide con index.html. */
export const DEFAULT_KATACHI: KatachiId = 'shizen';

/** Orden de presentación en el panel (empezando por el default). */
export const KATACHI_IDS: KatachiId[] = ['shizen', 'celadon', 'sabi', 'kintsugi', 'wabi', 'terminal'];

export const KATACHI_KANJI: Record<KatachiId, string> = {
  shizen: '自然',
  celadon: '青磁',
  sabi: '寂び',
  kintsugi: '金継ぎ',
  wabi: '侘び',
  terminal: '端末',
};

/** Nombre legible en ES para el panel. */
export const KATACHI_LABEL: Record<KatachiId, string> = {
  shizen: 'Shizen — natural',
  celadon: 'Celadon — celedón',
  sabi: 'Sabi — pátina',
  kintsugi: 'Kintsugi — oro',
  wabi: 'Wabi — sobrio',
  terminal: 'Terminal — retro',
};
