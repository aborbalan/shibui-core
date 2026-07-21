import { signal, type Signal } from '@angular/core';
import { DEFAULT_KATACHI, KATACHI_IDS, type KatachiId } from '../data/katachi';

/**
 * Estado compartido del katachi activo. Dos consumidores en ramas distintas
 * del árbol (switcher flotante en App, banda katachi bajo el router-outlet)
 * justifican sacarlo de App. Señales a nivel de módulo, sin DI: App conserva
 * el effect único escritor (data-katachi en <html> + localStorage).
 */
export const STORAGE_KEY = 'app-cv:katachi';

function readInitialKatachi(): KatachiId {
  if (typeof localStorage === 'undefined') return DEFAULT_KATACHI;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && (KATACHI_IDS as string[]).includes(stored)
    ? (stored as KatachiId)
    : DEFAULT_KATACHI;
}

const state = signal<KatachiId>(readInitialKatachi());

/** Katachi activo — solo lectura; mutar siempre vía setKatachi. */
export const katachi: Signal<KatachiId> = state.asReadonly();

export function setKatachi(id: KatachiId): void {
  state.set(id);
}
