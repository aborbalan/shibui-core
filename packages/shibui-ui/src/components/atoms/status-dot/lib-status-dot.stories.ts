import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-status-dot.component';
import type { LibStatusDot } from './lib-status-dot.component';

type LibStatusDotStoryArgs = Pick<LibStatusDot, 'status' | 'size' | 'bordered' | 'label'>;

const ALL_STATUSES = ['online', 'away', 'busy', 'offline'] as const;
const STATUS_LABELS = { online: 'Online', away: 'Away', busy: 'Busy', offline: 'Offline' };

const preview = (bg: string, content: TemplateResult): TemplateResult => html`
  <div style="background:${bg}; padding:40px; border:1px solid var(--border-subtle); display:flex; flex-wrap:wrap; align-items:center; gap:48px;">
    ${content}
  </div>
`;

const withLabel = (label: string, content: TemplateResult): TemplateResult => html`
  <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    ${content}
    <span style="font-family:monospace; font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.25em;">${label}</span>
  </div>
`;

const meta: Meta<LibStatusDotStoryArgs> = {
  title: 'Components/Atoms/StatusDot',
  component: 'lib-status-dot',
  tags:['autodocs'],
  argTypes: {
    status:   { control: 'select', options: ['online', 'away', 'busy', 'offline'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    bordered: { control: 'boolean' },
    label:    { control: 'boolean' },
  },

  render: (args): TemplateResult => preview('var(--bg-surface)', html`
    <lib-status-dot
      status=${args.status}
      size=${args.size}
      ?bordered=${args.bordered}
      ?label=${args.label}
    ></lib-status-dot>
  `),
};

export default meta;
type Story = StoryObj<LibStatusDotStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: { status: 'online', size: 'md', bordered: false, label: false },
};

/* ── Cuatro estados ── */
export const States: Story = {
  name: 'States — los cuatro estados',
  render: (): TemplateResult => preview('var(--bg-surface)', html`
    ${ALL_STATUSES.map(s => withLabel(STATUS_LABELS[s], html`
      <lib-status-dot status=${s} size="md"></lib-status-dot>
    `))}
  `),
};

/* ── Animaciones documentadas ── */
export const Animations: Story = {
  name: 'Animations — 水 息 速い 間',
  render: (): TemplateResult => html`
    <div style="background:var(--bg-surface); padding:40px; border:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:32px;">
      ${([
        { status: 'online',  kanji: '水', name: 'mizu',  desc: 'Doble onda desfasada · 2.6s cubic-bezier(0,0.55,0.45,1)' },
        { status: 'away',    kanji: '息', name: 'iki',   desc: 'Respiración scale 1→1.18 · 3s ease-in-out' },
        { status: 'busy',    kanji: '速', name: 'hayai', desc: 'Parpadeo asimétrico opacity 1→0.3 (hold) · 1.1s' },
        { status: 'offline', kanji: '間', name: 'ma',    desc: 'Sin animación — quietud total' },
      ] as const).map(({ status, kanji, name, desc }) => html`
        <div style="display:flex; align-items:center; gap:32px; padding:24px; background:var(--bg-elevated); border:1px solid var(--border-subtle);">
          <div style="margin:16px;">
            <lib-status-dot status=${status} size="lg"></lib-status-dot>
          </div>
          <div>
            <p style="font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:300; color:var(--text-primary); margin-bottom:4px;">
              ${kanji} ${name}
            </p>
            <p style="font-family:monospace; font-size:11px; color:var(--text-muted); letter-spacing:0.08em;">${desc}</p>
          </div>
        </div>
      `)}
    </div>
  `,
};

/* ── Tres tamaños ── */
export const Sizes: Story = {
  name: 'Sizes — SM · MD · LG',
  render: (): TemplateResult => html`
    <div style="background:var(--bg-surface); padding:40px; border:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:24px;">
      ${(['sm', 'md', 'lg'] as const).map(size => html`
        <div style="display:flex; align-items:center; gap:32px;">
          <span style="font-family:monospace; font-size:10px; color:var(--text-muted); text-transform:uppercase; width:24px;">${size}</span>
          <div style="display:flex; align-items:center; gap:32px;">
            ${ALL_STATUSES.map(s => html`
              <lib-status-dot status=${s} size=${size}></lib-status-dot>
            `)}
          </div>
        </div>
      `)}
    </div>
  `,
};

/* ── Con label ── */
export const WithLabel: Story = {
  name: 'Label — inline con color de estado',
  render: (): TemplateResult => preview('var(--bg-surface)', html`
    <div style="display:flex; flex-direction:column; align-items:flex-start; gap:20px;">
      ${ALL_STATUSES.map(s => html`
        <lib-status-dot status=${s} size="md" ?label=${true}></lib-status-dot>
      `)}
    </div>
  `),
};

/* ── Bordered ── */
export const Bordered: Story = {
  name: 'Bordered — sobre fondos de color',
  render: (): TemplateResult => html`
    <div style="display:flex; gap:24px; flex-wrap:wrap; padding:32px; background:var(--bg-surface); border:1px solid var(--border-subtle);">
      ${ALL_STATUSES.map(s => html`
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
          <div style="position:relative; width:48px; height:48px; border-radius:9999px; background:var(--color-washi-200); overflow:hidden; border:1px solid var(--border-subtle);">
            <div style="position:absolute; bottom:1px; right:1px;">
              <lib-status-dot status=${s} size="md" ?bordered=${true}></lib-status-dot>
            </div>
          </div>
          <span style="font-family:monospace; font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.25em;">${STATUS_LABELS[s]}</span>
        </div>
      `)}
    </div>
  `,
};

/* ── Context: lista de usuarios ── */
export const ContextUserList: Story = {
  name: 'Context — Lista de usuarios',
  render: (): TemplateResult => html`
    <div style="background:var(--bg-surface); padding:40px; border:1px solid var(--border-subtle);">
      <div style="display:flex; flex-direction:column; width:100%; max-width:420px; border:1px solid var(--border-subtle);">
        ${([
          { name: 'Alejandro Borbalán', role: 'Senior Developer', status: 'online'  },
          { name: 'Marta Ruiz',         role: 'Product Manager',  status: 'away'    },
          { name: 'Carlos Vega',        role: 'Design Lead',      status: 'busy'    },
          { name: 'Yuki Arakawa',       role: 'Backend Engineer', status: 'offline' },
        ] as const).map(({ name, role, status }, i, arr) => html`
          <div style="
            display:flex; align-items:center; gap:16px;
            padding:16px 20px;
            background:var(--bg-elevated);
            ${i < arr.length - 1 ? 'border-bottom:1px solid var(--border-subtle);' : ''}
          ">
            <div style="width:36px; height:36px; border-radius:9999px; background:var(--color-washi-200); border:1px solid var(--border-subtle); flex-shrink:0;"></div>
            <div style="flex:1;">
              <p style="font-size:13px; color:var(--text-primary);">${name}</p>
              <p style="font-family:monospace; font-size:10px; color:var(--text-muted); letter-spacing:0.08em;">${role}</p>
            </div>
            <lib-status-dot status=${status} size="sm" ?label=${true}></lib-status-dot>
          </div>
        `)}
      </div>
    </div>
  `,
};