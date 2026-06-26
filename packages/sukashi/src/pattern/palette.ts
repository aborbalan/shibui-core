// Paleta katachi para teñir los covers al renderizar (tonos tradicionales de shibui-ui,
// replicados aquí como datos puros — sukashi nunca importa @shibui-ui/ui).

import type { Rgba } from '../render';

export const KATACHI: Readonly<Record<string, Rgba>> = {
  sumi: [26, 20, 14, 255], // 墨 tinta
  washi: [122, 106, 92, 255], // 和紙 neutro cálido
  kaki: [140, 65, 21, 255], // 柿 caqui
  celadon: [36, 82, 73, 255], // 青磁 verde jade
};
