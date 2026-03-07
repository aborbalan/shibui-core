import { html, TemplateResult } from 'lit';
import type { LibKbdSize, LibKbdVariant } from './lib-kbd.component';

export interface KbdTemplateProps {
  size:     LibKbdSize;
  variant:  LibKbdVariant;
  pressed:  boolean;
  onDown:   () => void;
  onUp:     () => void;
  onLeave:  () => void;
}

/**
 * Template de lib-kbd.
 *
 * Estructura:
 *   kbd.kbd.kbd-{size}[.kbd-{variant}][.is-pressed]
 *     slot
 *
 * El `border-bottom` de 3px simula la pared lateral física.
 * `.is-pressed` reduce ese borde a 1px y añade translateY(1px)
 * — efecto pulsación real.
 */
export function kbdTemplate(props: KbdTemplateProps): TemplateResult {
  const { size, variant, pressed, onDown, onUp, onLeave } = props;

  const variantClass = variant !== 'default' ? ` kbd-${variant}` : '';
  const pressedClass = pressed ? ' is-pressed' : '';
  const cls          = `kbd kbd-${size}${variantClass}${pressedClass}`;

  return html`
    <kbd
      class=${cls}
      role="img"
      @mousedown=${onDown}
      @mouseup=${onUp}
      @mouseleave=${onLeave}
    >
      <slot></slot>
    </kbd>
  `;
}