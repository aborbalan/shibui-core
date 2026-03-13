import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-stagger-container.component';

const meta: Meta = {
  title: 'Components/Organisms/StaggerContainer',
  component: 'lib-stagger-container',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Anima los hijos directos en cascada al entrar en el viewport.
Configurable: dirección, delay entre items, duración, easing y threshold.
Respeta \`prefers-reduced-motion\` — en ese caso los items aparecen directamente sin animación.
        `,
      },
    },
  },
  argTypes: {
    delay:     { control: { type: 'range', min: 0, max: 400, step: 25 } },
    duration:  { control: { type: 'range', min: 100, max: 1200, step: 50 } },
    direction: { control: 'select', options: ['up', 'down', 'left', 'right', 'fade'] },
    easing:    { control: 'select', options: ['default', 'out', 'bounce'] },
    threshold: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    once:      { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj;

/* ── helpers ── */
const spacer = (h = '40vh'): TemplateResult => html`
  <div style="height:${h};background:var(--bg-surface);display:flex;align-items:center;
    justify-content:center;border-bottom:1px solid var(--border-subtle);">
    <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
      letter-spacing:var(--tracking-widest);text-transform:uppercase;color:var(--text-muted);">
      ↓ scroll ↓
    </p>
  </div>`;

/* ── Playground ── */
export const Playground: Story = {
  args: { delay: 100, duration: 600, direction: 'up', easing: 'out', threshold: 0.15, once: true },
  render: (args): TemplateResult => html`
    <div>
      ${spacer()}

      <div style="padding:var(--lib-space-xl) calc(var(--lib-space-xl) * 2);
        background:var(--bg-elevated);">
        <lib-stagger-container
          delay="${args.delay}"
          duration="${args.duration}"
          direction="${args.direction}"
          easing="${args.easing}"
          threshold="${args.threshold}"
          ?once="${args.once}"
          @ui-lib-stagger-visible="${(): void => console.log('visible')}"
        >
          ${[1,2,3,4].map(n => html`
            <div style="height:80px;margin-bottom:var(--lib-space-md);
              background:var(--color-washi-${n * 100 + 100});
              border:1px solid var(--border-subtle);
              display:flex;align-items:center;padding:0 var(--lib-space-md);">
              <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                letter-spacing:var(--tracking-widest);text-transform:uppercase;
                color:var(--text-muted);">Item 0${n}</span>
            </div>
          `)}
        </lib-stagger-container>
      </div>

      ${spacer('20vh')}
    </div>
  `,
};

/* ── Direcciones ── */
export const Directions: Story = {
  name: 'Direcciones — up · down · left · right · fade',
  render: (): TemplateResult => html`
    <div>
      ${spacer()}

      ${(['up','down','left','right','fade'] as const).map(dir => html`
        <div style="padding:var(--lib-space-xl) calc(var(--lib-space-xl) * 2);
          border-bottom:1px solid var(--border-subtle);">
          <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
            letter-spacing:var(--tracking-widest);text-transform:uppercase;
            color:var(--text-muted);margin-bottom:var(--lib-space-md);">${dir}</p>

          <lib-stagger-container direction="${dir}" delay="80" easing="bounce">
            <div style="display:flex;gap:var(--lib-space-md);">
              ${[1,2,3,4,5].map(n => html`
                <div style="flex:1;height:64px;background:var(--color-washi-${n*100+100});
                  border:1px solid var(--border-subtle);">
                </div>
              `)}
            </div>
          </lib-stagger-container>
        </div>

        ${spacer('20vh')}
      `)}
    </div>
  `,
};

/* ── Cards reales Shibui ── */
export const ShibuiCards: Story = {
  name: 'Cards Shibui — caso real',
  render: (): TemplateResult => html`
    <div>
      ${spacer()}

      <section style="padding:calc(var(--lib-space-xl)*3) calc(var(--lib-space-xl)*2);
        background:var(--bg-elevated);">

        <div style="margin-bottom:calc(var(--lib-space-xl)*2);">
          <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
            letter-spacing:var(--tracking-widest);text-transform:uppercase;
            color:var(--text-muted);margin-bottom:var(--lib-space-sm);">
            Design System · Shibui
          </p>
          <h2 style="font-family:var(--lib-font-display);font-size:var(--text-3xl);
            font-weight:300;letter-spacing:var(--tracking-tight);line-height:1.2;">
            Colección de<br><em style="color:var(--color-kaki-500);">componentes</em>
          </h2>
        </div>

        <lib-stagger-container delay="120" duration="700" direction="up" easing="bounce">

          <div style="display:grid;grid-template-columns:repeat(3,1fr);
            gap:var(--lib-space-lg);">

            ${[
              { num:'01', title:'Button',    color:'kaki',    desc:'5 variants + liquid' },
              { num:'02', title:'Dropdown',  color:'celadon', desc:'4 trigger styles' },
              { num:'03', title:'Chip',      color:'default', desc:'Static · Toggle · Input' },
              { num:'04', title:'Tabs',      color:'kaki',    desc:'5 variants, keyboard nav' },
              { num:'05', title:'Dialog',    color:'celadon', desc:'Modal · Sheet · Popover' },
              { num:'06', title:'Sidebar',   color:'default', desc:'Collapsible navigation' },
            ].map(c => html`
              <div style="padding:var(--lib-space-lg);border:1px solid var(--border-subtle);
                background:var(--bg-base);">
                <p style="font-family:var(--lib-font-mono);font-size:9px;
                  letter-spacing:var(--tracking-widest);text-transform:uppercase;
                  color:var(--text-muted);margin-bottom:var(--lib-space-sm);">${c.num}</p>
                <h3 style="font-family:var(--lib-font-display);font-size:var(--text-xl);
                  font-weight:300;margin-bottom:var(--lib-space-xs);
                  color:${c.color === 'kaki' ? 'var(--color-kaki-600)' :
                           c.color === 'celadon' ? 'var(--color-celadon-600)' :
                           'var(--text-primary)'};">
                  ${c.title}
                </h3>
                <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                  color:var(--text-muted);letter-spacing:var(--tracking-wide);">${c.desc}</p>
              </div>
            `)}

          </div>

        </lib-stagger-container>

      </section>

      ${spacer('20vh')}
    </div>
  `,
};

/* ── Repeat (once=false) ── */
export const Repeat: Story = {
  name: 'Repeat — once=false, se re-anima al volver',
  render: (): TemplateResult => html`
    <div>
      ${spacer()}

      <div style="padding:var(--lib-space-xl) calc(var(--lib-space-xl)*2);">
        <lib-stagger-container delay="150" direction="left" easing="bounce" ?once="${false}">
          ${[1,2,3].map(n => html`
            <div style="height:100px;margin-bottom:var(--lib-space-md);
              padding:0 var(--lib-space-md);
              background:var(--color-washi-${n*200});
              border:1px solid var(--border-subtle);
              display:flex;align-items:center;">
              <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                letter-spacing:var(--tracking-widest);color:var(--text-muted);">
                Item ${n} — re-anima al salir y volver
              </span>
            </div>
          `)}
        </lib-stagger-container>
      </div>

      ${spacer()}
    </div>
  `,
};