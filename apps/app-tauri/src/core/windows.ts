import { getCurrentWindow } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

export const SECONDARY_LABEL = 'secondary';

/**
 * Abre la segunda ventana del macro entorno (workspace con tabs Files/Git).
 *
 * Se crea en tiempo de ejecución —no de forma estática en tauri.conf.json—
 * para que NO aparezca antes del login. Debe llamarse tras autenticarse.
 *
 * Idempotente: si la ventana ya existe, la enfoca en lugar de duplicarla.
 * En `pnpm dev` (sin runtime Tauri) degrada silenciosamente.
 */
export async function openSecondaryWindow(): Promise<void> {
  try {
    const existing = await WebviewWindow.getByLabel(SECONDARY_LABEL);
    if (existing) {
      await existing.setFocus();
      return;
    }

    const win = new WebviewWindow(SECONDARY_LABEL, {
      url: 'index.html',
      title: 'Shibui — Workspace',
      width: 900,
      height: 700,
      minWidth: 600,
      minHeight: 400,
      x: 200,
      y: 200,
    });

    win.once('tauri://error', (e) => {
      console.error('[macro-entorno] no se pudo abrir la 2ª ventana:', e);
    });
  } catch (err) {
    // Entorno sin runtime Tauri (vite dev puro): no-op.
    console.debug('[macro-entorno] openSecondaryWindow no disponible:', err);
  }
}

/** True si la ventana actual es la principal (`main`). */
export function isMainWindow(): boolean {
  try {
    return getCurrentWindow().label === 'main';
  } catch {
    // Sin runtime Tauri asumimos contexto principal.
    return true;
  }
}
