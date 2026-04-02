import { html, nothing, TemplateResult } from 'lit';
import type { LibRating } from './lib-rating.component';

/* ══════════════════════════════════════════════════════════
   SVGs Phosphor-style — regular (outline) y fill
   ══════════════════════════════════════════════════════════ */

const ICONS: Record<string, { regular: TemplateResult; fill: TemplateResult }> = {
  star: {
    regular: html`<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M239.2,97.4A16.4,16.4,0,0,0,224.6,86l-59.4-4.1-22-55.5A16.4,16.4,0,0,0,128,16h0a16.4,16.4,0,0,0-15.2,10.4L90.8,82,31.4,86A16.5,16.5,0,0,0,16.8,97.4,16.8,16.8,0,0,0,22,115.5l45.4,38.4L52.5,212a16.4,16.4,0,0,0,6.4,17.3,16.7,16.7,0,0,0,18.2.5L128,198.8l51,31.1a16.1,16.1,0,0,0,8.5,2.4,16.5,16.5,0,0,0,9.7-3.1A16.4,16.4,0,0,0,203.5,212l-14.9-58.1L234,115.5A16.8,16.8,0,0,0,239.2,97.4Zm-15.4,5.9-45.4,38.4a8,8,0,0,0-2.6,8.2l14.9,58.1a.6.6,0,0,1-.3.7c-.1.1-.3.2-.5.1l-51-31.2a8,8,0,0,0-8.4,0l-51,31.1-.4-.1a.6.6,0,0,1-.3-.7l14.9-58.1a8,8,0,0,0-2.6-8.2L31.2,103.3l-.1-.4c.1-.3.2-.5.5-.6l59.3-4.1a8,8,0,0,0,6.8-5.1L119.7,38a.8.8,0,0,1,.6-.5h.2a.8.8,0,0,1,.6.5l21.9,55.2a8,8,0,0,0,6.8,5.1l59.3,4.1c.3.1.4.3.5.6A.7.7,0,0,1,223.8,103.3Z"/>
    </svg>`,
    fill: html`<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34l13.49-58.54L21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"/>
    </svg>`,
  },
  heart: {
    regular: html`<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"/>
    </svg>`,
    fill: html`<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c20.65,0,38.73,8.88,50,23.89C139.27,40.88,157.35,32,178,32A62.07,62.07,0,0,1,240,94Z"/>
    </svg>`,
  },
  diamond: {
    regular: html`<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M235.32,104,211.31,56a16,16,0,0,0-14.31-8.05H59A16,16,0,0,0,44.69,56L20.68,104a16,16,0,0,0,2.62,18.51l96,96a16,16,0,0,0,17.4,3.37,15.93,15.93,0,0,0,5.26-3.38l96-96A16,16,0,0,0,235.32,104ZM59,64H197l21.33,42.67L128,213.32,37.67,106.67Z"/>
    </svg>`,
    fill: html`<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M238,106.38,214,58.34A16.09,16.09,0,0,0,199.69,50H56.31A16.09,16.09,0,0,0,42,58.34L18,106.38a16,16,0,0,0,2.69,18.76l96,96a16,16,0,0,0,22.62,0l96-96A16,16,0,0,0,238,106.38Z"/>
    </svg>`,
  },
};

/* ── Fallback al icono estrella si el icon prop no coincide ── */
function getIcon(name: string): { regular: TemplateResult; fill: TemplateResult } | undefined {
  return ICONS[name] ?? ICONS['star'];
}

/* ══════════════════════════════════════════════════════════
   Template principal
   ══════════════════════════════════════════════════════════ */
export function ratingTemplate(ctx: LibRating): TemplateResult {
  const { value, max, icon, readonly, showCount, count } = ctx;
  const icons = getIcon(icon);
  const display = ctx._hoverValue || value;

  /* Secuencia de items */
  const items = Array.from({ length: max }, (_, i) => {
    const pos = i + 1; // 1-indexed

    /* Half-star: solo read-only, cuando value tiene .5 */
    const isHalf = readonly && !Number.isInteger(value) && pos === Math.ceil(value);
    const isFilled = pos <= Math.floor(display);
    const isPreview = !readonly && pos > Math.floor(display) && pos <= ctx._hoverValue;

    if (isHalf) {
      return html`
        <span
          class="rt-item rt-item-half"
          part="item item-half"
          aria-hidden="true"
        >
          ${icons?.regular}
          <span class="rt-half-fill">${icons?.fill}</span>
        </span>
      `;
    }

    return html`
      <span
        class="rt-item ${isFilled ? 'is-filled' : ''} ${isPreview ? 'is-preview' : ''}"
        part="item${isFilled ? ' item-filled' : ''}"
        role="${readonly ? nothing : 'button'}"
        aria-label="${readonly ? nothing : `Valorar ${pos} de ${max}`}"
        tabindex="${readonly ? nothing : '0'}"
        @mouseenter="${(): void => ctx._onEnter(pos)}"
        @click="${(): void => ctx._onClick(pos)}"
        @keydown="${(e: KeyboardEvent): void => ctx._onKeyItem(e, pos)}"
      >
        ${isFilled || isPreview ? icons?.fill : icons?.regular}
      </span>
    `;
  });

  /* Numeric display */
  const numDisplay = showCount
    ? html`
        <span class="rt-num" part="num">
          <strong>${value > 0 ? value.toFixed(1) : '—'}</strong>
          ${count != null ? html`<span style="margin-left:2px;">(${count})</span>` : nothing}
        </span>`
    : nothing;

  return html`
    <div
      class="rt"
      part="root"
      role="${readonly ? 'img' : 'group'}"
      aria-label="${readonly
        ? `Valoración: ${value} de ${max}`
        : `Valorar de 1 a ${max}`}"
      @mouseleave="${(): void => ctx._onLeave()}"
    >
      ${items}
    </div>
    ${numDisplay}
  `;
}