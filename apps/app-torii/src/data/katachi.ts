/**
 * Los seis katachi 形 sellados del sistema shibui.
 *
 * Se activan poniendo `data-katachi="<id>"` sobre un ancestro — aquí `<html>` —
 * y las custom properties atraviesan el Shadow DOM por herencia.
 *
 * Este catálogo está duplicado a propósito con `apps/app-cv/src/data/katachi.ts`:
 * aquella app es Angular y no se puede importar desde aquí. El sitio correcto a
 * medio plazo es `@shibui-ui/ui`, que es quien define los tokens.
 */
export type KatachiId = 'shizen' | 'celadon' | 'sabi' | 'kintsugi' | 'wabi' | 'terminal';

/** El hub abre en jade oscuro: es la piel del showcase insignia y la que mejor lee de entrada. */
export const DEFAULT_KATACHI: KatachiId = 'celadon';

export const KATACHI_IDS: readonly KatachiId[] = [
  'shizen',
  'celadon',
  'sabi',
  'kintsugi',
  'wabi',
  'terminal',
] as const;

export const KATACHI_KANJI: Record<KatachiId, string> = {
  shizen: '自然',
  celadon: '青磁',
  sabi: '寂び',
  kintsugi: '金継ぎ',
  wabi: '侘び',
  terminal: '端末',
};

export const KATACHI_LABEL: Record<KatachiId, string> = {
  shizen: 'Shizen — natural',
  celadon: 'Celadon — celedón',
  sabi: 'Sabi — pátina',
  kintsugi: 'Kintsugi — oro',
  wabi: 'Wabi — sobrio',
  terminal: 'Terminal — retro',
};

/**
 * Superficie de `lib-background` afín a cada katachi. Los temas de lib-background
 * están fijados a la paleta y no reaccionan al katachi, así que un tema claro deja
 * ilegible un katachi oscuro: elegir superficie es responsabilidad del consumidor.
 * Se prefieren gradientes a texturas tileadas, salvo `phosphor`, cuyas scanlines
 * son la identidad de terminal y no un tile molesto.
 */
export const KATACHI_BG: Record<KatachiId, string> = {
  shizen: 'kaki-glow',
  celadon: 'jade-deep',
  sabi: 'horizon',
  kintsugi: 'twilight',
  wabi: 'noctiluca',
  terminal: 'phosphor',
};

export const KATACHI_STORAGE_KEY = 'app-torii:katachi';

export function isKatachiId(value: unknown): value is KatachiId {
  return typeof value === 'string' && (KATACHI_IDS as readonly string[]).includes(value);
}

/** Katachi inicial: lo guardado si es válido, si no el de por defecto. */
export function readStoredKatachi(): KatachiId {
  try {
    const stored = localStorage.getItem(KATACHI_STORAGE_KEY);
    return isKatachiId(stored) ? stored : DEFAULT_KATACHI;
  } catch {
    // localStorage puede lanzar en modo privado de algunos navegadores.
    return DEFAULT_KATACHI;
  }
}
