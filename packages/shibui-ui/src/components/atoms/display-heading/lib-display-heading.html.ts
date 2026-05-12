import { html, nothing, type TemplateResult } from 'lit';
import type { LibDisplayHeading } from './lib-display-heading.component';

export function renderDisplayHeading(ctx: LibDisplayHeading): TemplateResult {
  /* Decide el tag semántico del heading */
  const headingContent = html`
    <!-- Línea 1 -->
    ${ctx.line1}
    <!-- Línea 2: prefix + acento itálico -->
    ${ctx.line2Prefix || ctx.accent
      ? html`
          <br>
          ${ctx.line2Prefix ? html`${ctx.line2Prefix} ` : nothing}
          ${ctx.accent
            ? html`<em class="dh-accent">${ctx.accent}</em>`
            : nothing
          }
        `
      : nothing
    }
  `;

  return html`
    <div class="dh-wrapper" part="wrapper">

      <!-- Slot eyebrow: permite pasar un <lib-eyebrow> desde fuera -->
      <slot name="eyebrow"></slot>

      <!-- Heading con tag dinámico -->
      ${ctx.tag === 'h1' ? html`<h1 class="dh-heading" part="heading">${headingContent}</h1>` : nothing}
      ${ctx.tag === 'h2' ? html`<h2 class="dh-heading" part="heading">${headingContent}</h2>` : nothing}
      ${ctx.tag === 'h3' ? html`<h3 class="dh-heading" part="heading">${headingContent}</h3>` : nothing}
      ${ctx.tag === 'h4' ? html`<h4 class="dh-heading" part="heading">${headingContent}</h4>` : nothing}

      <!-- Descripción como prop -->
      ${ctx.description
        ? html`<p class="dh-desc" part="description">${ctx.description}</p>`
        : nothing
      }

      <!-- Descripción como slot (rich content) -->
      <slot name="description"></slot>

    </div>
  `;
}