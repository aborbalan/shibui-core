
declare global {
  namespace svelteHTML {
    interface IntrinsicElements {
      // El comodín para Svelte
      [elemName: `lib-${string}`]: HTMLAttributes<HTMLElement> & {
        [propName: string]: any;
      };
    }
  }
}

export {}; // Esto asegura que se trate como un módulo