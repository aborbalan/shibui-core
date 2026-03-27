import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { renderDisplayHeading } from './lib-display-heading.html';
import type {
  DisplayHeadingSurface,
  DisplayHeadingSize,
  DisplayHeadingTag,
} from './lib-display-heading.types';
import componentCss from './lib-display-heading.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * `<lib-display-heading>` — Titular de display editorial.
 *
 * Heading en Cormorant Garamond con peso 300 y acento itálico en kaki.
 * Patrón recurrente del sistema: primera línea normal + segunda línea con
 * texto itálico en `--color-kaki-400`. Acepta un `<lib-eyebrow>` por slot.
 *
 * @tag lib-display-heading
 *
 * @attr {string} line1         - Primera línea del titular.
 * @attr {string} line2-prefix  - Texto antes del acento en la segunda línea.
 * @attr {string} accent        - Texto en itálica kaki (acento).
 * @attr {string} description   - Párrafo de descripción (alternativa al slot).
 * @attr {'dark'|'light'|'washi'} surface - Superficie sobre la que se muestra.
 * @attr {'sm'|'md'|'lg'}       size    - Tamaño tipográfico fluido.
 * @attr {'h1'|'h2'|'h3'|'h4'} tag     - Tag semántico del heading.
 * @attr {boolean}              centered - Centra el bloque.
 * @attr {boolean}              animate  - Activa la animación de entrada fade-up.
 *
 * @slot eyebrow     - Acepta un `<lib-eyebrow>` como prefijo.
 * @slot description - Descripción como rich content (alternativa a `description`).
 *
 * @csspart wrapper     - Div contenedor externo.
 * @csspart heading     - El elemento h1–h4.
 * @csspart description - El párrafo de descripción.
 *
 * @example
 * <!-- Básico -->
 * <lib-display-heading
 *   line1="Todo lo que"
 *   line2-prefix="necesitas,"
 *   accent="nada más"
 *   surface="dark"
 * ></lib-display-heading>
 *
 * <!-- Con eyebrow y descripción -->
 * <lib-display-heading
 *   line1="La belleza"
 *   line2-prefix="de lo"
 *   accent="austero"
 *   surface="dark"
 *   size="lg"
 *   description="66 componentes sin dependencias."
 * >
 *   <lib-eyebrow slot="eyebrow" effect="kintsugi" size="lg">
 *     Design System · v0.1.0
 *   </lib-eyebrow>
 * </lib-display-heading>
 */
@customElement('lib-display-heading')
export class LibDisplayHeading extends LitElement {

  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /** Primera línea del titular */
  @property({ type: String })
  line1 = '';

  /** Texto antes del acento en la segunda línea */
  @property({ type: String, attribute: 'line2-prefix' })
  line2Prefix = '';

  /** Texto en itálica kaki */
  @property({ type: String })
  accent = '';

  /** Párrafo de descripción inline */
  @property({ type: String })
  description = '';

  /** Superficie sobre la que aparece */
  @property({ type: String, reflect: true })
  surface: DisplayHeadingSurface = 'light';

  /** Tamaño tipográfico fluido */
  @property({ type: String, reflect: true })
  size: DisplayHeadingSize = 'md';

  /** Tag semántico del heading */
  @property({ type: String, reflect: true })
  tag: DisplayHeadingTag = 'h2';

  /** Centra el bloque */
  @property({ type: Boolean, reflect: true })
  centered = false;

  /** Activa animación de entrada */
  @property({ type: Boolean, reflect: true })
  _animate = false;

  protected override render(): TemplateResult {
    return renderDisplayHeading(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-display-heading': LibDisplayHeading;
  }
}