import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import sliderStyles from './lib-range-slider.css?inline';

@customElement('lib-range-slider')
export class LibRangeSlider extends LitElement {
  static override styles = [css`${unsafeCSS(sliderStyles)}` || []];

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Number }) minValue = 25;
  @property({ type: Number }) maxValue = 75;
  @property({ type: String }) label = 'Rango de precio';

  private _handleMinInput(e: Event):void {
    const val = parseInt((e.target as HTMLInputElement).value);
    if (val > this.maxValue - this.step) {
      this.minValue = this.maxValue - this.step;
    } else {
      this.minValue = val;
    }
    this._dispatchChange();
  }

  private _handleMaxInput(e: Event):void {
    const val = parseInt((e.target as HTMLInputElement).value);
    if (val < this.minValue + this.step) {
      this.maxValue = this.minValue + this.step;
    } else {
      this.maxValue = val;
    }
    this._dispatchChange();
  }

  private _dispatchChange():void {
    this.dispatchEvent(new CustomEvent('ui-lib-change', {
      detail: { min: this.minValue, max: this.maxValue },
      bubbles: true,
      composed: true
    }));
  }

  override render(): TemplateResult {
    const minPos = ((this.minValue - this.min) / (this.max - this.min)) * 100;
    const maxPos = ((this.maxValue - this.min) / (this.max - this.min)) * 100;

    return html`
      <div class="range-container">
        <div class="header">
          <span class="label">${this.label}</span>
          <span class="values">${this.minValue} - ${this.maxValue}</span>
        </div>
        
        <div class="slider-wrapper">
          <div class="track"></div>
          <div 
            class="progress" 
            style="left: ${minPos}%; right: ${100 - maxPos}%"
          ></div>
          
          <input 
            type="range" 
            class="range-input" 
            .min=${this.min.toString()} 
            .max=${this.max.toString()} 
            .step=${this.step.toString()} 
            .value=${this.minValue.toString()}
            @input=${this._handleMinInput}
          >
          <input 
            type="range" 
            class="range-input" 
            .min=${this.min.toString()} 
            .max=${this.max.toString()} 
            .step=${this.step.toString()} 
            .value=${this.maxValue.toString()}
            @input=${this._handleMaxInput}
          >
        </div>
      </div>
    `;
  }
}