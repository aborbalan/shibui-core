import { html, TemplateResult } from 'lit';
import { LibGlassCard } from './lib-glass-card.component';

export const glassCardTemplate = (context: LibGlassCard): TemplateResult => {
    return html`
      <div class="glass-container ${context.intensity}" 
           @mousemove=${context.handleMouseMove}
           @mouseleave=${context.handleMouseLeave}>
        <div class="glass-outline"></div>
        <div class="glass-content">
          <slot></slot>
        </div>
      </div>
    `;
  };