import { html, nothing, type TemplateResult } from 'lit';
import type { LibAvatarGroup } from './lib-avatar-group.component';

export function renderAvatarGroup(ctx: LibAvatarGroup): TemplateResult {
  return html`
    <div class="ag" part="group">
      <slot @slotchange=${(): void => ctx.onSlotChange()}></slot>
      ${ctx.overflow > 0
        ? html`<span
            class="ag-more"
            part="overflow"
            aria-label="${ctx.overflow} más"
          >+${ctx.overflow}</span>`
        : nothing}
    </div>
  `;
}
