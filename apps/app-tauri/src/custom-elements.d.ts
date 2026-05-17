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
