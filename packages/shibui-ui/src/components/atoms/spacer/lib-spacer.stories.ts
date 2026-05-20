import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-spacer.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

export default {
  title: 'Foundations/Spacing/Spacer',
  tags:['autodocs'],
  component: 'lib-spacer',
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    horizontal: { control: 'boolean' }
  }
} as Meta;

// Caja de ayuda para visualizar el efecto
const Box = (color: string):TemplateResult => html`
  <div style="background: ${color}; padding: 1rem; border-radius: 4px; color: white; font-family: sans-serif;">
    Elemento
  </div>
`;

export const VerticalStack: StoryObj = {
  render: (args) => html`
    <div style="display: flex; flex-direction: column; background: #f5f5f5; padding: 20px;">
      ${Box('#2c3e50')}
      <lib-spacer .size=${args.size} ?horizontal=${args.horizontal}></lib-spacer>
      ${Box('#e67e22')}
      <lib-spacer size="xl"></lib-spacer>
      ${Box('#27ae60')}
    </div>
  `,
};

export const HorizontalRow: StoryObj = {
  args: { horizontal: true, size: 'lg' },
  render: (args) => html`
    <div style="display: flex; align-items: center; background: #f5f5f5; padding: 20px;">
      ${Box('#8e44ad')}
      <lib-spacer .size=${args.size} ?horizontal=${args.horizontal}></lib-spacer>
      ${Box('#c0392b')}
      <lib-spacer size="xs" horizontal></lib-spacer>
      ${Box('#2980b9')}
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   El spacer es puramente estructural — sin colores que adaptar.
   Las historias muestran el espaciado sobre el fondo del katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-direction:column;width:100%;max-width:320px;">
    <div style="padding:10px 12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);font-family:var(--lib-font-mono);font-size:11px;color:var(--text-primary);">A</div>
    <lib-spacer size="xs"></lib-spacer>
    <div style="padding:10px 12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);font-family:var(--lib-font-mono);font-size:11px;color:var(--text-secondary);">B · xs</div>
    <lib-spacer size="sm"></lib-spacer>
    <div style="padding:10px 12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);font-family:var(--lib-font-mono);font-size:11px;color:var(--text-secondary);">C · sm</div>
    <lib-spacer size="md"></lib-spacer>
    <div style="padding:10px 12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);font-family:var(--lib-font-mono);font-size:11px;color:var(--text-secondary);">D · md</div>
    <lib-spacer size="lg"></lib-spacer>
    <div style="padding:10px 12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);font-family:var(--lib-font-mono);font-size:11px;color:var(--text-muted);">E · lg</div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;