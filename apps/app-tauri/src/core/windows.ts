import { getCurrentWindow } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

export const SECONDARY_LABEL = 'secondary';

/** True si estamos dentro del runtime nativo de Tauri (no en `pnpm dev` puro). */
function isTauriRuntime(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

/**
 * Abre la segunda ventana del macro entorno (workspace con tabs Files/Git).
 *
 * Se crea en tiempo de ejecución —no de forma estática en tauri.conf.json—
 * para que NO aparezca antes del login. Debe llamarse tras autenticarse.
 *
 * Idempotente: si la ventana ya existe, la enfoca en lugar de duplicarla.
 * Devuelve `true` si la ventana se abrió/enfocó, `false` si no se intentó
 * (p.ej. fuera del runtime Tauri).
 */
export async function openSecondaryWindow(): Promise<boolean> {
  if (!isTauriRuntime()) {
    console.debug('[macro-entorno] sin runtime Tauri; no se abre 2ª ventana.');
    return false;
  }

  try {
    const existing = await WebviewWindow.getByLabel(SECONDARY_LABEL);
    if (existing) {
      await existing.setFocus();
      return true;
    }
  } catch (err) {
    // No abortar por esto: si no se puede consultar, intentamos crearla igual.
    console.warn('[macro-entorno] getByLabel falló, se intenta crear igual:', err);
  }

  return await new Promise<boolean>((resolve) => {
    // url relativa a la raíz servida (devUrl / frontendDist). '/' es lo más
    // robusto; 'index.html' puede no resolver según cómo sirva el asset server.
    const win = new WebviewWindow(SECONDARY_LABEL, {
      url: '/',
      title: 'Shibui — Workspace',
      width: 900,
      height: 700,
      minWidth: 600,
      minHeight: 400,
      x: 200,
      y: 200,
    });

    win.once('tauri://created', () => {
      console.info('[macro-entorno] 2ª ventana creada.');
      resolve(true);
    });

    win.once('tauri://error', (e: { payload?: unknown }) => {
      // Error VISIBLE: antes se tragaba y parecía que "no pasaba nada".
      console.error('[macro-entorno] no se pudo abrir la 2ª ventana:', e?.payload ?? e);
      resolve(false);
    });
  });
}

/** True si la ventana actual es la principal (`main`). */
export function isMainWindow(): boolean {
  if (!isTauriRuntime()) return true; // sin Tauri asumimos contexto principal
  try {
    return getCurrentWindow().label === 'main';
  } catch {
    return true;
  }
}
