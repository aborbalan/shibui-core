/**
 * Type declarations for LibButton component
 *
 * These declarations allow TypeScript frameworks (like React) to recognize
 * the component properties as HTML attributes and custom events.
 */

import type { UiClickEventDetail } from '../../../types';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lib-button': {
        variant?: 'primary' | 'secondary' | 'outline' | 'dark' | 'light';
        size?: 'sm' | 'md' | 'lg' | 'xl';
        disabled?: boolean;
        type?: 'button' | 'submit' | 'reset';
        'custom-padding'?: string; // New property for custom padding
        'aria-label'?: string;
        onUiLibClick?: (event: CustomEvent<UiClickEventDetail>) => void;
        children?: import('react').ReactNode; // Referencia a ReactNode para compatibilidad con JSX
      };
    }
  }
}

export {};
