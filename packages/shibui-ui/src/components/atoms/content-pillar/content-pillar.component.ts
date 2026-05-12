import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { rendercontentPillar } from './content-pillar.html';
import componentCss from './content-pillar.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * `<lib-content-pillar>` — Pilar filosófico con kanji, label y descripción.
 *
 * Patrón recurrente del sistema Shibui: kanji decorativo a la izquierda +
 * etiqueta en DM Mono + cuerpo de texto en Shippori Mincho.
 *
 * @tag lib-content-pillar
 *
 * @attr {string}           kanji       - Carácter kanji decorativo (ej: "侘", "金", "間").
 * @attr {string}           label       - Etiqueta en mono uppercase (ej: "Wabi · Imperfección").
 * @attr {string}           description - Texto de descripción inline.
 * @attr {'dark'|'light'}   surface     - Superficie sobre la que se muestra. Default: `dark`.
 *
 * @slot - Descripción como rich content (alternativa al atributo `description`).
 *
 * @csspart pillar      - Wrapper flex externo.
 * @csspart kanji       - El carácter kanji.
 * @csspart body        - Columna derecha (label + descripción).
 * @csspart label       - La etiqueta mono.
 * @csspart description - El párrafo de descripción.
 *
 * @example
 * <lib-content-pillar
 *   kanji="金"
 *   label="Kintsugi · Cicatrices de oro"
 *   description="Reparar con oro en lugar de ocultar."
 * ></lib-content-pillar>
 *
 * <!-- Con rich content -->
 * <lib-content-pillar kanji="間" label="Ma · El espacio">
 *   El silencio entre notas. El espacio vacío <em>es</em> presencia.
 * </lib-content-pillar>
 */
@customElement('lib-content-pillar')
export class LibContentPillar extends LitElement {

  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /** Carácter kanji decorativo */
  @property({ type: String })
  kanji = '';

  /** Etiqueta en DM Mono uppercase */
  @property({ type: String })
  label = '';

  /** Descripción inline (alternativa al slot) */
  @property({ type: String })
  description = '';

  /** Superficie de fondo */
  @property({ type: String, reflect: true })
  surface: 'dark' | 'light' = 'dark';

  protected override render(): TemplateResult {
    return rendercontentPillar(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-content-pillar': LibContentPillar;
  }
}