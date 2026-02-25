import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { glassCardTemplate } from './lib-glass-card.html';
import cssStyles from './lib-glass-card.css?inline';

@customElement('lib-glass-card')
export class LibGlassCard extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String }) intensity: 'low' | 'md' | 'high' = 'md';

  protected override render(): TemplateResult {
    return glassCardTemplate(this);
  }

  handleMouseMove(e: MouseEvent):void {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
  
    const multiplier = 15;
    
    card.style.transform = `
      rotateX(${-y * multiplier}deg) 
      rotateY(${x * multiplier}deg) 
      scale3d(1.02, 1.02, 1.02)
    `;
  }
  
  handleMouseLeave(e: MouseEvent):void {
    const card = e.currentTarget as HTMLElement;
    // Resetear la posición suavemente
    card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }
}