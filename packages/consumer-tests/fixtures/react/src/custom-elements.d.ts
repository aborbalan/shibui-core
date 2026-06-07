// Augmentación del namespace JSX para elementos lib-* de @shibui-ui/ui.
// Import obligatorio: React debe estar importado para que el module augment sea efectivo.
import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: `lib-${string}`]: React.HTMLAttributes<HTMLElement> & {
        [propName: string]: unknown;
      };
    }
  }
}
