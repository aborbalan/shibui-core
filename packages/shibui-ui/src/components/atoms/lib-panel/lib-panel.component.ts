import {  css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LibCard } from './../card/lib-card.component'; // Importamos la clase base
import glassStyles from '../../../styles/shared/glass.css?inline';
import panelStyles from './lib-panel.css?inline';

@customElement('lib-panel')
export class LibPanel extends LibCard {
  // Combinamos los estilos de la Card con los del Panel y el Glass
  static override styles = [
    ...LibCard.styles, 
    css`${unsafeCSS(glassStyles)}`,
    css`${unsafeCSS(panelStyles)}`
  ];

  @property({ type: Boolean, reflect: true }) glass = false;


}