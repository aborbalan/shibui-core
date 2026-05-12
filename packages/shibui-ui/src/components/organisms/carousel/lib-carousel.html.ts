import { html, nothing, svg, TemplateResult } from 'lit';

export type LibCarouselMode = 'slide' | 'fade';

export interface CarouselTemplateProps {
  mode:          LibCarouselMode;
  current:       number;
  total:         number;
  peek:          number;
  arrows:        boolean;
  dots:          boolean;
  counter:       boolean;
  loop:          boolean;
  handlePrev:    () => void;
  handleNext:    () => void;
  handleDot:     (i: number) => void;
  handleSlot:    (e: Event) => void;
  handleThumb:   (e: Event) => void;
  handleKey:     (e: KeyboardEvent) => void;
}

/** SVG chevron left */
const iconPrev = svg`
  <svg viewBox="0 0 16 16" fill="none"
       stroke="currentColor" stroke-width="1.5"
       stroke-linecap="round" stroke-linejoin="round">
    <polyline points="10,3 5,8 10,13"/>
  </svg>`;

/** SVG chevron right */
const iconNext = svg`
  <svg viewBox="0 0 16 16" fill="none"
       stroke="currentColor" stroke-width="1.5"
       stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6,3 11,8 6,13"/>
  </svg>`;

/**
 * Template para lib-carousel.
 *
 * Estructura:
 *   div.cr                      ← raíz, maneja keydown
 *     div.cr-track              ← contenedor deslizante
 *       slot                    ← slides del consumer
 *   button.cr-arrow-prev        ← (condicional)
 *   button.cr-arrow-next        ← (condicional)
 *   div.cr-dots                 ← (condicional)
 *   p.cr-counter                ← (condicional)
 *   slot[name="thumbnail"]      ← tira de miniaturas (condicional)
 */
export function carouselTemplate(props: CarouselTemplateProps): TemplateResult {
  const {
    mode, current, total, peek, arrows, dots, counter, loop,
    handlePrev, handleNext, handleDot, handleSlot, handleThumb, handleKey,
  } = props;

  const prevDisabled = !loop && current === 0;
  const nextDisabled = !loop && current === total - 1;

  // Counter text: "2 / 6" para peek=1, "1 – 3 / 6" para peek>1
  const counterHtml = peek > 1
    ? html`<span>${current + 1}</span>&thinsp;–&thinsp;<span>${Math.min(current + peek, total)}</span> / ${total}`
    : html`<span>${current + 1}</span> / ${total}`;

  return html`
    <div
      class="cr"
      tabindex="0"
      role="region"
      aria-label="Carousel"
      @keydown=${handleKey}
    >
      <div class="cr-track" part="track">
        <slot @slotchange=${handleSlot}></slot>
      </div>

      ${arrows && mode === 'slide' ? html`
        <button
          class="cr-arrow cr-arrow-prev ${prevDisabled ? 'is-disabled' : ''}"
          ?disabled=${prevDisabled}
          aria-label="Anterior"
          @click=${handlePrev}
        >${iconPrev}</button>

        <button
          class="cr-arrow cr-arrow-next ${nextDisabled ? 'is-disabled' : ''}"
          ?disabled=${nextDisabled}
          aria-label="Siguiente"
          @click=${handleNext}
        >${iconNext}</button>
      ` : nothing}
    </div>

    ${dots && total > 1 ? html`
      <div class="cr-dots" role="tablist" aria-label="Navegación por slides">
        ${Array.from({ length: total }, (_, i) => html`
          <button
            class="cr-dot ${i === current ? 'is-active' : ''}"
            role="tab"
            aria-selected=${i === current ? 'true' : 'false'}
            aria-label="Ir a slide ${i + 1}"
            @click=${():void => handleDot(i)}
          ></button>
        `)}
      </div>
    ` : nothing}

    ${counter && total > 1 ? html`
      <p class="cr-counter">${counterHtml}</p>
    ` : nothing}

    <slot name="thumbnail" @slotchange=${handleThumb}></slot>
  `;
}