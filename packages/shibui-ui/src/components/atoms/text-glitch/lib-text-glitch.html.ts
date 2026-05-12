import { html, TemplateResult } from 'lit';
import type { TextGlitchVariant } from './lib-text-glitch.component';

export interface TextGlitchTemplateProps {
  text: string;
  variant: TextGlitchVariant;
}

/**
 * Template de lib-text-glitch.
 *
 * Para `decode`: renderiza un <span class="char"> por cada carácter Unicode
 * (usando spread de string — correcto para emoji y kanji multibyte).
 * El JS del componente manipula estos spans directamente sin pasar por Lit.
 *
 * Para el resto de variantes: texto plano dentro del wrapper con data-text,
 * que los ::before/::after leen con attr(data-text).
 */
export function textGlitchTemplate(props: TextGlitchTemplateProps): TemplateResult {
  if (props.variant === 'decode') {
    return html`
      <span class="tg-inner" data-text="${props.text}">
        ${[...props.text].map(
          ch => html`<span class="char" data-original="${ch}">${ch}</span>`
        )}
      </span>
    `;
  }

  return html`
    <span class="tg-inner" data-text="${props.text}">${props.text}</span>
  `;
}