import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { navigate } from '@open-cells/core';
import { ElementController } from '@open-cells/element-controller';
import { toriiChromeTemplate } from './torii-chrome.html';
import chromeCss from './torii-chrome.css?inline';
import { CH_KATACHI } from '../channels';
import {
  KATACHI_STORAGE_KEY,
  readStoredKatachi,
  type KatachiId,
} from '../data/katachi';

/**
 * torii-chrome — el shell persistente.
 *
 * Vive FUERA de `#app-content`, que es el nodo que el router de Open Cells
 * sustituye en cada navegación: header, footer y switcher sobreviven a los
 * cambios de ruta sin volver a montarse.
 *
 * Es el escritor único del katachi: nadie más toca `data-katachi` ni el
 * localStorage. El resto de la app se entera por el channel `ch-katachi`,
 * que reproduce su último valor, así que una página que se monte más tarde
 * lo recibe igual.
 */
@customElement('torii-chrome')
export class ToriiChrome extends LitElement {
  static override styles = [css`${unsafeCSS(chromeCss)}`];

  private controller = new ElementController(this);

  @state() katachi: KatachiId = readStoredKatachi();

  @state() panelOpen = false;

  @state() activeRoute = 'home';

  override connectedCallback(): void {
    super.connectedCallback();
    // Aplicar y publicar antes de nada: el katachi guardado tiene que estar en
    // el <html> desde el primer frame, no después de la primera interacción.
    this.applyKatachi(this.katachi);
    this.controller.publish(CH_KATACHI, this.katachi);
    this.syncActiveRoute();
    window.addEventListener('hashchange', this.syncActiveRoute);
  }

  override disconnectedCallback(): void {
    window.removeEventListener('hashchange', this.syncActiveRoute);
    super.disconnectedCallback();
  }

  /**
   * `lib-header` hace `preventDefault()` sobre sus links y delega en el evento
   * `ui-lib-header-link`: el `href` que se le pasa es solo para que el enlace
   * tenga destino visible y para abrir en pestaña nueva. **Sin este handler no
   * navega ninguna pestaña** — ni en escritorio ni en el drawer móvil. Los
   * showcases de Angular y Svelte hacen lo mismo con sus routers.
   *
   * Los `id` de los links son los nombres de ruta, que es como se navega en
   * Open Cells. `navigate` actualiza el hash, así que `activeRoute` se pone al
   * día solo por el `hashchange` de abajo.
   */
  goTo(id: string): void {
    navigate(id);
  }

  togglePanel(): void {
    this.panelOpen = !this.panelOpen;
  }

  selectKatachi(id: KatachiId): void {
    this.katachi = id;
    this.panelOpen = false;
    this.applyKatachi(id);
    this.controller.publish(CH_KATACHI, id);
  }

  private applyKatachi(id: KatachiId): void {
    document.documentElement.dataset.katachi = id;
    try {
      localStorage.setItem(KATACHI_STORAGE_KEY, id);
    } catch {
      // Modo privado: se pierde la persistencia, no la sesión.
    }
  }

  /**
   * El nombre de la ruta activa, para marcar el link del header. Se lee del
   * hash y no de `getCurrentRoute()` porque el chrome no es una página: no
   * tiene ciclo de vida de ruta del que colgarse.
   */
  private syncActiveRoute = (): void => {
    const path = window.location.hash.replace(/^#!?\/?/, '').split('?')[0];
    const next = path === '' ? 'home' : path;
    const changed = next !== this.activeRoute;
    this.activeRoute = next;

    // Los nodos de página conviven en el DOM y el navegador se queda donde
    // estaba: sin esto, saltar desde el pie de una página larga aterriza a
    // media altura de la siguiente.
    if (changed) window.scrollTo(0, 0);
  };

  protected override render(): TemplateResult {
    return toriiChromeTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'torii-chrome': ToriiChrome;
  }
}
