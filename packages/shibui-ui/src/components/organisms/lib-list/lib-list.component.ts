import { unsafeCSS, TemplateResult, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LibListModel } from '../../../../architecture/base-components/lib-list.model';
import { listTemplate } from './lib-list.html';
import cssStyles from './lib-list.css?inline';

@customElement('lib-list')
export class LibList extends LibListModel<unknown> {
  static override styles = unsafeCSS(cssStyles);

  /**
   * Define la disposición: 
   * 'grid' (rejilla responsiva) o 'block' (lista vertical)
   */
  @property({ type: String, reflect: true }) 
  layout: 'grid' | 'block' = 'grid';

  /**
   * Helper para que el archivo .html pueda invocar el render del padre
   */
  renderBase(): TemplateResult {
    return super.render();
  }

  /**
   * En el organismo no iteramos datos visualmente aquí, 
   * dejamos que el slot proyecte las moléculas.
   */
  protected renderItem(): typeof nothing {
    return nothing;
  }

  /**
   * Implementación del esqueleto para el organismo.
   * Usamos el átomo lib-skeleton que ya tenemos creado.
   */
  protected override renderSkeleton(): TemplateResult {
    return html`
      <div class="skeleton-wrapper">
        <lib-skeleton variant="rect" width="100%" height="180px"></lib-skeleton>
      </div>
    `;
  }

  protected override render(): TemplateResult {
    return listTemplate(this);
  }
}