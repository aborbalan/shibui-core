import { writable, type Readable } from 'svelte/store';

function readHash(): string {
  const h = (typeof window !== 'undefined' ? window.location.hash : '') || '#/';
  return h.replace(/^#/, '') || '/';
}

const _route = writable<string>(readHash());

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => _route.set(readHash()));
}

export const route: Readable<string> = { subscribe: _route.subscribe };

export function navigate(path: string): void {
  if (typeof window === 'undefined') return;
  const target = path.startsWith('#') ? path : `#${path}`;
  if (window.location.hash !== target) {
    window.location.hash = target;
  } else {
    _route.set(readHash());
  }
}
