import { html, nothing, type TemplateResult } from 'lit';
import type { LibQuote } from './lib-quote.component';

export function renderQuote(ctx: LibQuote): TemplateResult {
  return html`
    <blockquote part="blockquote">

      <p class="quote-text" part="text">
        <!-- Línea 1: prop o slot -->
        ${ctx.text
          ? html`${ctx.text}`
          : html`<slot></slot>`
        }
        <!-- Línea 2: acento itálico -->
        ${ctx.accent
          ? html`<em class="quote-accent" part="accent">${ctx.accent}</em>`
          : nothing
        }
      </p>

      ${ctx.cite
        ? html`<cite part="cite">${ctx.cite}</cite>`
        : nothing
      }

    </blockquote>
  `;
}