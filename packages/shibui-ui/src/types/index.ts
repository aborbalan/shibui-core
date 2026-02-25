export type LibSize = 'sm' | 'md' | 'lg' | 'xl';

// Colores semánticos que mapean directamente a tus tokens
export type LibSemanticColor = 'primary' | 'danger' | 'text' | 'inherit';
export type LibVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

export interface UiClickEventDetail {
  originalEvent: Event;
  timestamp: number;
}
