/// <reference types="vite/client" />

/** Envoltorio estándar de respuestas de la API Shibui. */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta: { timestamp: string; path: string };
}

const BASE_URL = import.meta.env.VITE_API_URL as string;

/**
 * GET público a la API: desempaqueta el `ApiEnvelope` y devuelve `data`.
 * Endpoints de componentes/categorías/ejemplos son públicos (sin JWT).
 */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status} en ${path}`);
  }
  const envelope = (await res.json()) as ApiEnvelope<T>;
  return envelope.data;
}
