import { html, type TemplateResult } from 'lit';
import type { ToriiNotFound } from './torii-not-found.component';

export function toriiNotFoundTemplate(host: ToriiNotFound): TemplateResult {
  return html`
    <p class="kanji">迷</p>
    <lib-display-heading
      size="sm"
      tag="h1"
      centered
      line1="Esta puerta"
      accent="no lleva a ningún sitio"
      description="La ruta que has pedido no existe en el hub."
    ></lib-display-heading>
    <lib-button variant="solid" tone="accent" @click=${() => host.goHome()}>
      Volver a la entrada
    </lib-button>
  `;
}
