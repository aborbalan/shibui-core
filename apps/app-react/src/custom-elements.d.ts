import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: `lib-${string}`]: React.HTMLAttributes<HTMLElement> & {
        // Esto permite cualquier propiedad adicional (como variant, value, etc.)
        [propName: string]: unknown; 
      };
    }
  }
}