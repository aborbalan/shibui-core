import { LitElement, TemplateResult, css, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { rippleTemplate } from './lib-ripple.html';
import styles from './lib-ripple.css?inline';

export interface RippleEffect {
  id: number;
  x: number;
  y: number;
  size: number;
}

@customElement('lib-ripple')
export class LibRipple extends LitElement {
  // Importante: usamos unsafeCSS para el string del CSS inyectado
  static override styles = [css`${unsafeCSS(styles)}`];

  @state() private ripples: RippleEffect[] = [];
  private count: number = 0;

  // 1. Aseguramos la conexión al padre cuando el componente entra al DOM
  override firstUpdated(): void {
    console.log('LibRipple: ¡Estoy vivo y montado!');
    
    if (this.parentElement) {
      console.log('LibRipple: Padre detectado ->', this.parentElement.tagName);
      
      // Forzamos que el padre sea relativo si no lo es
      const parentStyle = window.getComputedStyle(this.parentElement);
      if (parentStyle.position === 'static') {
        this.parentElement.style.position = 'relative';
      }

      this.parentElement.addEventListener('mousedown', this.createRipple);
    } else {
      console.error('LibRipple: No se encontró parentElement. ¿Está el componente dentro de un contenedor?');
    }
  }

  override disconnectedCallback(): void {
    this.parentElement?.removeEventListener('mousedown', this.createRipple);
    super.disconnectedCallback();
  }

  private createRipple = (event: MouseEvent): void => {
    console.log('LibRipple: Click detectado en coordenadas:', event.clientX, event.clientY);
    
    if (!this.parentElement) return;

    const rect: DOMRect = this.parentElement.getBoundingClientRect();
    
    // Calculamos el tamaño para cubrir todo el contenedor (Pitágoras pro)
    const size: number = Math.sqrt(rect.width ** 2 + rect.height ** 2) * 2;
    
    const x: number = event.clientX - rect.left - size / 2;
    const y: number = event.clientY - rect.top - size / 2;

    const id: number = this.count++;
    const newRipple: RippleEffect = { id, x, y, size };
    
    this.ripples = [...this.ripples, newRipple];

    // Limpiamos después de la animación (600ms según tus tokens)
    setTimeout(() => {
      this.ripples = this.ripples.filter(r => r.id !== id);
    }, 600);
  };

  protected override render(): TemplateResult {
    return rippleTemplate(this.ripples);
  }
}