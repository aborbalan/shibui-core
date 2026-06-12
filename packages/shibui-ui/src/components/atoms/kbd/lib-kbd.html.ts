import { html, TemplateResult } from 'lit';
import type { LibKbdSize, LibKbdVariant, LibKbdSurface, LibKbdTone } from './lib-kbd.component';

export interface KbdTemplateProps {
  size:     LibKbdSize;
  variant:  LibKbdVariant;
  surface:  LibKbdSurface;
  tone:     LibKbdTone;
  pressed:  boolean;
  onDown:   () => void;
  onUp:     () => void;
  onLeave:  () => void;
}

/**
 * Template de lib-kbd.
 *
 * Estructura:
 *   kbd.kbd.kbd-{size}[.kbd-{variant}][.kbd-{surface}][.kbd-{tone}][.is-pressed]
 *     slot
 *
 * El `border-bottom` de 3px simula la pared lateral física.
 * `.is-pressed` reduce ese borde a 1px y añade translateY(1px)
 * — efecto pulsación real.
 */
export function kbdTemplate(props: KbdTemplateProps): TemplateResult {
  const { size, variant, surface, tone, pressed, onDown, onUp, onLeave } = props;

  const variantClass = variant !== 'solid' ? ` kbd-${variant}` : '';
  const surfaceClass = surface !== 'default' ? ` kbd-${surface}` : '';
  const toneClass    = tone    !== 'default' ? ` kbd-${tone}`    : '';
  const pressedClass = pressed ? ' is-pressed' : '';
  const cls          = `kbd kbd-${size}${variantClass}${surfaceClass}${toneClass}${pressedClass}`;

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