export type KatachiId = 'wabi' | 'kintsugi' | 'sabi' | 'terminal' | 'shizen' | 'celadon';
export type Coverage = 'semantic' | 'marker' | 'effect';

export const KATACHI_IDS: KatachiId[] = ['wabi', 'kintsugi', 'sabi', 'terminal', 'shizen', 'celadon'];

export const KATACHI_KANJI: Record<KatachiId, string> = {
  wabi: '侘び',
  kintsugi: '金継ぎ',
  sabi: '寂び',
  terminal: '端末',
  shizen: '自然',
  celadon: '青磁',
};

/**
 * Tipo de cobertura Katachi por componente.
 *  - semantic: cambia visualmente con data-katachi (consume tokens semánticos)
 *  - marker  : tiene bloque KATACHI documentado pero superficialmente neutro
 *  - effect  : efecto/superficie productor — no cambia con el contexto
 */
export const COVERAGE: Record<string, Coverage> = {
  // ── Atoms (44)
  'lib-accordion-item': 'marker',
  'lib-aspect-ratio': 'marker',
  'lib-avatar': 'semantic',
  'lib-background': 'effect',
  'lib-badge': 'semantic',
  'lib-bento-item': 'marker',
  'lib-burger': 'semantic',
  'lib-button': 'semantic',
  'lib-canvas': 'semantic',
  'lib-card': 'semantic',
  'lib-checkbox': 'semantic',
  'lib-close-button': 'semantic',
  'lib-code-block': 'marker',
  'lib-color-scale': 'marker',
  'lib-content-pillar': 'marker',
  'lib-copy-button': 'semantic',
  'lib-display-heading': 'semantic',
  'lib-divider': 'marker',
  'lib-eyebrow': 'semantic',
  'lib-icon': 'marker',
  'lib-kbd': 'semantic',
  'lib-label': 'marker',
  'lib-counter': 'marker',
  'lib-button-liquid': 'semantic',
  'lib-magnetic': 'effect',
  'lib-progress': 'semantic',
  'lib-progress-circle': 'marker',
  'lib-quote': 'semantic',
  'lib-radio': 'semantic',
  'lib-rating': 'semantic',
  'lib-reading-progress': 'effect',
  'lib-ripple': 'effect',
  'lib-select-option': 'marker',
  'lib-skeleton': 'marker',
  'lib-spacer': 'marker',
  'lib-spinner': 'marker',
  'lib-status-dot': 'semantic',
  'lib-step': 'semantic',
  'lib-switch': 'semantic',
  'lib-text-glitch': 'effect',
  'lib-text-list': 'semantic',
  'lib-tooltip': 'semantic',
  'lib-visually-hidden': 'marker',
  // ── Molecules (18)
  'lib-breadcrumb': 'semantic',
  'lib-button-group': 'semantic',
  'lib-checkbox-card': 'marker',
  'lib-chip': 'semantic',
  'lib-color-picker': 'semantic',
  'lib-dropdown': 'semantic',
  'lib-empty-state': 'semantic',
  'lib-file-uploader': 'semantic',
  'lib-header': 'semantic',
  'lib-input': 'semantic',
  'lib-alert': 'semantic',
  'lib-modal': 'semantic',
  'lib-pagination': 'semantic',
  'lib-range-slider': 'semantic',
  'lib-segmented-control': 'semantic',
  'lib-select': 'semantic',
  'lib-tabs': 'semantic',
  'lib-tree-select': 'semantic',
  // ── Organisms (16)
  'lib-accordion': 'semantic',
  'lib-bento-grid': 'marker',
  'lib-carousel': 'marker',
  'lib-cursor-follower': 'effect',
  'lib-data-table': 'semantic',
  'lib-dialog': 'semantic',
  'lib-drawer': 'semantic',
  'lib-footer': 'semantic',
  'lib-horizontal-scroll-section': 'effect',
  'lib-parallax-container': 'effect',
  'lib-parallax-text': 'effect',
  'lib-sidebar': 'semantic',
  'lib-stagger': 'effect',
  'lib-stepper': 'semantic',
  'lib-timeline': 'semantic',
  'lib-toast-manager': 'semantic',
};

export function coverageOf(slug: string): Coverage {
  return COVERAGE[slug] ?? 'marker';
}
