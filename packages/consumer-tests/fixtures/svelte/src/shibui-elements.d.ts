// Declaración de tipos para elementos lib-* de @shibui-ui/ui en Svelte.
// Extiende el namespace svelteHTML para que el compilador acepte
// <lib-button>, <lib-modal>, etc. sin errores de tipo.
declare global {
  namespace svelteHTML {
    interface IntrinsicElements {
      [elemName: `lib-${string}`]: import('svelte/elements').HTMLAttributes<HTMLElement> & {
        [propName: string]: unknown;
      };
    }
  }
}

export {};
