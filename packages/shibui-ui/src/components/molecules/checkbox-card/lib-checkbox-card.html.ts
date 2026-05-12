import { html, TemplateResult } from 'lit';
import type { LibCheckboxCard } from './lib-checkbox-card.component';

/* SVG checkmark compartido */
const checkSvg: TemplateResult = html`
  <svg viewBox="0 0 12 12">
    <polyline points="2,6 5,9 10,3"/>
  </svg>`;

export function checkboxCardTemplate(ctx: LibCheckboxCard): TemplateResult {
  const checkClass = [
    'cc-check',
    ctx.inputType === 'radio' || ctx.checkShape === 'pill' ? 'cc-check-pill' : '',
  ].filter(Boolean).join(' ');

  return html`
    <label
      class="cc"
      part="label"
      @click="${(e: MouseEvent): void => ctx._handleClick(e)}"
    >
      <!-- Input nativo — hermano directo de .cc-body para :checked ~ -->
      <input
        class="cc-input"
        part="input"
        .type="${ctx.inputType}"
        .name="${ctx.name}"
        .value="${ctx.value}"
        .checked="${ctx.checked}"
        ?disabled="${ctx.disabled}"
        @change="${(e: Event): void => ctx._handleChange(e)}"
      />

      <div class="cc-body" part="body">

        <!-- Checkmark -->
        <div class="${checkClass}" part="check">${checkSvg}</div>

        <!-- Slot: icono -->
        <slot name="icon">
          ${ctx._hasSlot('icon') ? '' : ''}
        </slot>

        <!-- Slot: badge -->
        <slot name="badge"></slot>

        <!-- Slot: título -->
        <slot name="title">
          ${ctx.cardTitle
            ? html`<div class="cc-title" part="title">${ctx.cardTitle}</div>`
            : ''}
        </slot>

        <!-- Slot: descripción -->
        <slot name="desc">
          ${ctx.desc
            ? html`<div class="cc-desc" part="desc">${ctx.desc}</div>`
            : ''}
        </slot>

        <!-- Slot: precio -->
        <slot name="price"></slot>

        <!-- Slot: divider -->
        <slot name="divider"></slot>

        <!-- Slot: features -->
        <slot name="features"></slot>

        <!-- Slot: imagen -->
        <slot name="image"></slot>

        <!-- Slot: contenido libre (default) -->
        <slot></slot>

        <!-- Ripple layer -->
        <div class="cc-ripple" part="ripple"></div>

      </div>
    </label>
  `;
}