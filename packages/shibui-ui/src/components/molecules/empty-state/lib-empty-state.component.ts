import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { emptyStateTemplate } from './lib-empty-state.html';
import type { LibEmptyStateTone, LibEmptyStateLayout, LibEmptyStateSize } from './lib-empty-state.html';
import emptyStateCss from './lib-empty-state.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

export type { LibEmptyStateTone, LibEmptyStateLayout, LibEmptyStateSize };

/**
 * @element lib-empty-state
 *
 * Tres zonas: ilustración (icono Phosphor o kanji), copy, acciones.
 * Todas las zonas son opcionales — la mínima expresión es solo `heading`.
 *
 * @slot illustration — Icono Phosphor (o cualquier elemento visual)
 * @slot actions      — Botones de acción (lib-button u otros)
 *
 * @example — default con icono
 * <lib-empty-state heading="Carpeta vacía" description="Sube tu primer archivo.">
 *   <ph-folder-open slot="illustration" weight="regular"></ph-folder-open>
 *   <lib-button slot="actions" variant="primary">Subir</lib-button>
 * </lib-empty-state>
 *
 * @example — kanji como ilustración
 * <lib-empty-state kanji="無" heading="Sin resultados" description="Prueba otros términos.">
 *   <lib-button slot="actions" variant="ghost">Limpiar filtros</lib-button>
 * </lib-empty-state>
 *
 * @example — inline con tone
 * <lib-empty-state layout="inline" tone="kaki" heading="Empieza aquí" size="sm">
 *   <ph-sparkle slot="illustration" weight="regular"></ph-sparkle>
 *   <lib-button slot="actions" variant="accent">Crear</lib-button>
 * </lib-empty-state>
 *
 * @example — bordered (dropzone)
 * <lib-empty-state bordered heading="Arrastra aquí tus archivos">
 *   <ph-plus slot="illustration" weight="regular"></ph-plus>
 * </lib-empty-state>
 */
@customElement('lib-empty-state')
export class LibEmptyState extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(emptyStateCss)}`,
  ];

  /**
   * Título principal del estado vacío.
   * Se usa `heading` en lugar de `title` para evitar colisión con `HTMLElement.title`.
   */
  @property({ type: String })
  heading = '';

  /** Texto descriptivo secundario bajo el título. */
  @property({ type: String })
  description = '';

  /**
   * Carácter kanji como ilustración tipográfica (ej: 無, 空, 迷).
   * Cuando se especifica, sustituye al slot `illustration`.
   */
  @property({ type: String })
  kanji = '';

  /**
   * Tono cromático del icono.
   * - neutral (default): washi
   * - kaki: cálido, primer uso, atención
   * - celadon: completado, éxito
   * - error: fallo, acceso denegado
   */
  @property({ type: String, reflect: true })
  tone: LibEmptyStateTone = 'neutral';

  /**
   * Disposición del componente.
   * - default: columna centrada (pantallas, modales, paneles)
   * - inline: fila con icono a la izquierda (tablas, banners)
   */
  @property({ type: String, reflect: true })
  layout: LibEmptyStateLayout = 'default';

  /**
   * Tamaño del componente.
   * - md (default): padding generoso, icono 72px
   * - sm: compacto para sidebars y paneles secundarios
   */
  @property({ type: String, reflect: true })
  size: LibEmptyStateSize = 'md';

  /** Borde punteado + fondo `bg-surface`. Para zonas drop o sin contenido explícito. */
  @property({ type: Boolean, reflect: true })
  bordered = false;

  /** Elimina el fondo y borde del icono. Para contextos de mínimo ruido visual. */
  @property({ type: Boolean, reflect: true })
  ghost = false;

  override render(): TemplateResult {
    return emptyStateTemplate({
      heading:     this.heading,
      description: this.description,
      kanji:       this.kanji,
      tone:        this.tone,
      layout:      this.layout,
      size:        this.size,
      bordered:    this.bordered,
      ghost:       this.ghost,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-empty-state': LibEmptyState;
  }
}