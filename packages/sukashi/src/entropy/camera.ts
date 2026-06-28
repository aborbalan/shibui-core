// Adaptador de cámara para kumo (semilla del cielo) — SOLO navegador.
// Implementa `SkyCapture` capturando fotogramas de la cámara vía getUserMedia.
// Usa el DOM (`navigator`, `<video>`, `<canvas>`) → NO se re-exporta desde el barrel
// node (`entropy/index.ts`); la demo lo importa directamente, igual que `web/`.

import type { SkyCapture } from './sky';

export interface CameraSkyOptions {
  /** Resolución de muestreo del fotograma (default 64×64; suficiente para entropía). */
  sampleSize?: number;
  /** Espera entre fotogramas en ms (default 120 → capta movimiento del cielo). */
  intervalMs?: number;
  /** Restricciones de cámara (default cámara trasera si existe). */
  facingMode?: 'environment' | 'user';
}

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

// Captura fotogramas reales de la cámara. Lanza si no hay permiso / cámara:
// `openSky` lo captura y cae a la semilla del sistema.
export function cameraSky(options: CameraSkyOptions = {}): SkyCapture {
  const size = options.sampleSize ?? 64;
  const intervalMs = options.intervalMs ?? 120;
  const facingMode = options.facingMode ?? 'environment';

  return {
    async frames(count: number): Promise<readonly Uint8Array[]> {
      if (!globalThis.navigator?.mediaDevices?.getUserMedia) {
        throw new Error('cámara no disponible en este entorno');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      try {
        await video.play();
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('canvas 2d no disponible');

        const out: Uint8Array[] = [];
        for (let i = 0; i < count; i++) {
          ctx.drawImage(video, 0, 0, size, size);
          const { data } = ctx.getImageData(0, 0, size, size);
          out.push(new Uint8Array(data)); // copia desacoplada del buffer del canvas
          if (i < count - 1) await sleep(intervalMs);
        }
        return out;
      } finally {
        for (const track of stream.getTracks()) track.stop();
      }
    },
  };
}
