import { html, nothing, type TemplateResult } from 'lit';
import type { LibContentPillar } from './content-pillar.component';

export function rendercontentPillar(ctx: LibContentPillar): TemplateResult {
  return html`
    <div class="pillar" part="pillar">

      ${ctx.kanji
        ? html`<div class="pillar-kanji" part="kanji" aria-hidden="true">${ctx.kanji}</div>`
        : nothing
      }

      <div class="pillar-body" part="body">
        ${ctx.label
          ? html`<p class="pillar-label" part="label">${ctx.label}</p>`
          : nothing
        }

        ${ctx.description
          ? html`<p class="pillar-desc" part="description">${ctx.description}</p>`
          : html`<slot></slot>`
        }
      </div>

    </div>
  `;
}