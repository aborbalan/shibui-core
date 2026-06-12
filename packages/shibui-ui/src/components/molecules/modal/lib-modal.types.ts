
/** Ancho máximo del panel. */
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Tratamiento visual del panel (LibVariant + extensión documentada `editorial`).
 * - `solid`      — header con borde y fondo neutro (era 'default').
 * - `editorial`  — sin separador de header, título expandido.
 */
export type ModalVariant = 'solid' | 'editorial';

/**
 * Tinte semántico del panel (subconjunto canónico de `LibTone`).
 * - `error` — header tintado en rojo para acciones destructivas.
 */
export type ModalTone = 'default' | 'error';

/**
 * Animación de entrada del panel.
 * - `scale`      — escala desde 0.95 + translateY(8px) (default).
 * - `slide-up`   — sube desde translateY(40px).
 * - `slide-down` — baja desde translateY(-40px).
 */
export type ModalAnimate = 'scale' | 'slide-up' | 'slide-down';

/** Tono de color del ícono del header. */
export type ModalIconTone = 'default' | 'accent' | 'secondary' | 'error' | 'info';

/** Detalle del evento de cierre. */
export interface ModalCloseEventDetail {
  /** Razón del cierre: botón ×, click en backdrop o tecla Escape. */
  reason: 'button' | 'backdrop' | 'escape';
}
