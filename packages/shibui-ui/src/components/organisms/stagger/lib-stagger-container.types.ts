/**
 * Dirección desde la que aparecen los items
 * up | down → translateY  ·  left | right → translateX  ·  fade → solo opacidad
 */
export type StaggerDirection = 'up' | 'down' | 'left' | 'right' | 'fade';

/**
 * Easing que mapea a tokens --ease-*
 * bounce   → --ease-bounce   (cubic-bezier(0.34,1.56,0.64,1))
 * out      → --ease-out      (cubic-bezier(0,0,0.2,1))
 * default  → --ease-default  (ease)
 */
export type StaggerEasing = 'default' | 'out' | 'bounce';