import { Meta, StoryObj }      from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-gadget-frame.component';
import type { LibGadgetFrame }  from './lib-gadget-frame.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

type StoryArgs = Partial<Pick<LibGadgetFrame,
  'gadgetTitle' | 'icon' | 'minimizable' | 'closable' | 'minimized' | 'variant'
>>;

/* ── Meta ─────────────────────────────────────────────────── */
const meta: Meta<StoryArgs> = {
  title:     'Desktop/Layout/Gadget Frame',
  tags:      ['autodocs'],
  component: 'lib-gadget-frame',
  parameters: {
    backgrounds: { default: 'paper' },
  },
  argTypes: {
    variant:     { control: 'select', options: ['glass', 'card'] },
    minimizable: { control: 'boolean' },
    closable:    { control: 'boolean' },
    minimized:   { control: 'boolean' },
    icon:        { control: 'text' },
    gadgetTitle: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<StoryArgs>;

/* ════════════════════════════════════════════════════════════
   PLAYGROUND
   ════════════════════════════════════════════════════════════ */
export const Playground: Story = {
  args: {
    gadgetTitle: 'Monitor de Sistema',
    icon:        'cpu',
    minimizable: true,
    closable:    true,
    minimized:   false,
    variant:     'card',
  },
  render: (args): TemplateResult => html`
    <div style="
      min-height: 100vh;
      background: var(--color-washi-950);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--lib-space-xl);
    ">
      <lib-gadget-frame
        gadget-title="${args.gadgetTitle}"
        icon="${args.icon}"
        ?minimizable="${args.minimizable}"
        ?closable="${args.closable}"
        ?minimized="${args.minimized}"
        variant="${args.variant}"
        style="width: 320px; height: 220px;"
        @ui-lib-gadget-minimize="${(e: CustomEvent): void =>
          console.log('minimize', e.detail)}"
        @ui-lib-gadget-close="${(): void =>
          console.log('close')}"
      >
        <div style="
          padding: var(--lib-space-md);
          display: flex;
          flex-direction: column;
          gap: var(--lib-space-sm);
        ">
          ${(['CPU', 'RAM', 'Disco'] as const).map((label, i) => html`
            <div style="display:flex;align-items:center;gap:var(--lib-space-sm);">
              <span style="
                font-family: var(--lib-font-mono);
                font-size: var(--text-xs);
                color: var(--text-muted);
                width: 3rem;
                text-transform: uppercase;
                letter-spacing: var(--tracking-wide);
              ">${label}</span>
              <div style="
                flex: 1;
                height: 4px;
                background: rgba(255,255,255,.08);
                border-radius: 2px;
                overflow: hidden;
              ">
                <div style="
                  height: 100%;
                  width: ${[42, 67, 23][i]}%;
                  background: var(--color-celadon-400);
                  border-radius: 2px;
                  transition: width .3s;
                "></div>
              </div>
              <span style="
                font-family: var(--lib-font-mono);
                font-size: var(--text-xs);
                color: var(--text-muted);
                width: 2.5rem;
                text-align: right;
              ">${[42, 67, 23][i]}%</span>
            </div>
          `)}
        </div>
      </lib-gadget-frame>
    </div>
  `,
};

/* ════════════════════════════════════════════════════════════
   GLASS — Efecto Agua sobre fondo oscuro
   ════════════════════════════════════════════════════════════ */
export const Glass: Story = {
  name: 'Variant · Glass — Efecto Agua',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="
      min-height: 100vh;
      background:
        radial-gradient(ellipse 60% 40% at 30% 40%, oklch(40% 0.12 210 / .4), transparent),
        radial-gradient(ellipse 50% 35% at 70% 65%, oklch(35% 0.08 45 / .3), transparent),
        var(--color-washi-950);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--lib-space-lg);
      flex-wrap: wrap;
      padding: var(--lib-space-xl);
    ">
      <!-- Con icono y controles completos -->
      <lib-gadget-frame
        gadget-title="CPU Monitor"
        icon="cpu"
        style="width: 280px; height: 200px;"
      >
        <div style="padding:var(--lib-space-md);">
          <div style="font-family:var(--lib-font-mono);font-size:2rem;font-weight:300;
            color:var(--color-celadon-400);line-height:1;">42%</div>
          <div style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
            color:var(--text-muted);margin-top:var(--lib-space-xs);text-transform:uppercase;
            letter-spacing:var(--tracking-wide);">4 cores · 3.2 GHz</div>
        </div>
      </lib-gadget-frame>

      <!-- Sin icono -->
      <lib-gadget-frame
        gadget-title="Notas"
        style="width: 280px; height: 200px;"
      >
        <div style="padding:var(--lib-space-md);font-family:var(--lib-font-mono);
          font-size:var(--text-xs);color:var(--text-muted);line-height:1.8;">
          <div>· Revisar PR #42</div>
          <div>· Deploy a staging 16h</div>
          <div>· Docs katachi</div>
        </div>
      </lib-gadget-frame>

      <!-- Solo minimizar (sin cerrar) -->
      <lib-gadget-frame
        gadget-title="Red"
        icon="wifi-high"
        closable="false"
        style="width: 280px; height: 200px;"
      >
        <div style="padding:var(--lib-space-md);display:flex;flex-direction:column;
          gap:var(--lib-space-xs);">
          ${(['↑ Upload', '↓ Download', '⧖ Latencia'] as const).map((l, i) => html`
            <div style="display:flex;justify-content:space-between;
              font-family:var(--lib-font-mono);font-size:var(--text-xs);color:var(--text-muted);">
              <span>${l}</span>
              <span style="color:var(--text-primary);">${['12 MB/s','87 MB/s','4 ms'][i]}</span>
            </div>
          `)}
        </div>
      </lib-gadget-frame>
    </div>
  `,
};

/* ════════════════════════════════════════════════════════════
   CARD — Superficie semántica
   ════════════════════════════════════════════════════════════ */
export const Card: Story = {
  name: 'Variant · Card — Superficie semántica',
  parameters: { backgrounds: { default: 'paper' } },
  render: (): TemplateResult => html`
    <div style="
      min-height: 100vh;
      background: var(--bg-base);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--lib-space-lg);
      flex-wrap: wrap;
      padding: var(--lib-space-xl);
    ">
      <lib-gadget-frame
        gadget-title="Actividad"
        icon="chart-line"
        variant="card"
        style="width: 280px; height: 200px;"
      >
        <div style="padding:var(--lib-space-md);">
          <div style="display:flex;gap:2px;align-items:flex-end;height:60px;">
            ${[30,55,40,70,50,85,60,45,75,55,90,65].map(h => html`
              <div style="
                flex:1;height:${h}%;
                background:var(--accent-primary);
                border-radius:2px 2px 0 0;
                opacity:.6;
                transition:height .3s;
              "></div>
            `)}
          </div>
          <div style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
            color:var(--text-muted);margin-top:var(--lib-space-sm);
            text-transform:uppercase;letter-spacing:var(--tracking-wide);">
            Últimas 12h
          </div>
        </div>
      </lib-gadget-frame>

      <lib-gadget-frame
        gadget-title="Estado"
        icon="heartbeat"
        variant="card"
        style="width: 280px; height: 200px;"
      >
        <div style="padding:var(--lib-space-md);display:flex;flex-direction:column;
          gap:var(--lib-space-sm);">
          ${([
            { l: 'API',       s: 'Online',  ok: true  },
            { l: 'Base Datos', s: 'Online',  ok: true  },
            { l: 'Workers',   s: '2 de 3',  ok: false },
          ] as const).map(row => html`
            <div style="display:flex;align-items:center;gap:var(--lib-space-sm);
              font-family:var(--lib-font-mono);font-size:var(--text-xs);">
              <div style="
                width:6px;height:6px;border-radius:50%;flex-shrink:0;
                background:${row.ok ? 'var(--color-celadon-400)' : 'var(--color-kaki-400)'};
              "></div>
              <span style="flex:1;color:var(--text-primary);">${row.l}</span>
              <span style="color:var(--text-muted);">${row.s}</span>
            </div>
          `)}
        </div>
      </lib-gadget-frame>
    </div>
  `,
};

/* ════════════════════════════════════════════════════════════
   MINIMIZED — Estado colapsado
   ════════════════════════════════════════════════════════════ */
export const MinimizedState: Story = {
  name: 'State · Minimized',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="
      min-height: 100vh;
      background: var(--color-washi-950);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--lib-space-md);
      padding: var(--lib-space-xl);
    ">
      <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
        color:var(--text-muted);letter-spacing:var(--tracking-wide);text-transform:uppercase;
        margin-bottom:var(--lib-space-md);">
        Minimizado · Expandido · Sin controles
      </p>

      <!-- Minimizado -->
      <lib-gadget-frame
        gadget-title="CPU Monitor"
        icon="cpu"
        minimized
        style="width: 320px;"
      ></lib-gadget-frame>

      <!-- Expandido (referencia) -->
      <lib-gadget-frame
        gadget-title="CPU Monitor"
        icon="cpu"
        style="width: 320px; height: 160px;"
      >
        <div style="padding:var(--lib-space-md);font-family:var(--lib-font-mono);
          font-size:var(--text-xs);color:var(--text-muted);">Contenido visible</div>
      </lib-gadget-frame>

      <!-- Sin controles -->
      <lib-gadget-frame
        gadget-title="Gadget fijo"
        icon="lock"
        minimizable="false"
        closable="false"
        style="width: 320px; height: 100px;"
      >
        <div style="padding:var(--lib-space-md);font-family:var(--lib-font-mono);
          font-size:var(--text-xs);color:var(--text-muted);">No se puede cerrar ni minimizar</div>
      </lib-gadget-frame>
    </div>
  `,
};

/* ════════════════════════════════════════════════════════════
   DASHBOARD — Grid de gadgets
   ════════════════════════════════════════════════════════════ */
export const DashboardGrid: Story = {
  name: 'Dashboard · Grid de gadgets',
  parameters: { backgrounds: { default: 'dark' }, layout: 'fullscreen' },
  render: (): TemplateResult => html`
    <div style="
      min-height: 100vh;
      background:
        radial-gradient(ellipse 70% 50% at 20% 30%, oklch(38% 0.1 210 / .35), transparent),
        radial-gradient(ellipse 60% 40% at 80% 70%, oklch(33% 0.07 45 / .25), transparent),
        var(--color-washi-950);
      padding: var(--lib-space-xl);
    ">
      <!-- Topbar minimal -->
      <div style="
        display: flex;
        align-items: center;
        margin-bottom: var(--lib-space-lg);
        gap: var(--lib-space-md);
      ">
        <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
          text-transform:uppercase;color:rgba(250,247,244,.2);">渋 Dashboard</span>
        <span style="margin-left:auto;font-family:var(--lib-font-mono);font-size:8px;
          color:rgba(250,247,244,.15);letter-spacing:.1em;">2026-05-23 · 14:32</span>
      </div>

      <!-- Grid 3 columnas -->
      <div style="
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 180px 220px;
        gap: var(--lib-space-md);
      ">
        <!-- CPU -->
        <lib-gadget-frame gadget-title="CPU" icon="cpu">
          <div style="padding:var(--lib-space-md);">
            <div style="font-family:var(--lib-font-mono);font-size:2.4rem;font-weight:300;
              color:var(--color-celadon-400);line-height:1;">42%</div>
            <div style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
              color:var(--text-muted);margin-top:4px;letter-spacing:var(--tracking-wide);
              text-transform:uppercase;">4 cores · 3.2 GHz</div>
          </div>
        </lib-gadget-frame>

        <!-- RAM -->
        <lib-gadget-frame gadget-title="Memoria" icon="memory">
          <div style="padding:var(--lib-space-md);">
            <div style="font-family:var(--lib-font-mono);font-size:2.4rem;font-weight:300;
              color:var(--color-kaki-400);line-height:1;">6.2<span style="font-size:1rem;"> GB</span></div>
            <div style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
              color:var(--text-muted);margin-top:4px;letter-spacing:var(--tracking-wide);
              text-transform:uppercase;">de 16 GB · 38%</div>
          </div>
        </lib-gadget-frame>

        <!-- Red -->
        <lib-gadget-frame gadget-title="Red" icon="wifi-high" closable="false">
          <div style="padding:var(--lib-space-md);display:flex;flex-direction:column;
            gap:var(--lib-space-xs);">
            ${(['↑ 12 MB/s','↓ 87 MB/s','⧖ 4 ms'] as const).map(l => html`
              <div style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                color:var(--text-muted);">${l}</div>
            `)}
          </div>
        </lib-gadget-frame>

        <!-- Actividad — ocupa 2 columnas -->
        <lib-gadget-frame
          gadget-title="Actividad de disco"
          icon="hard-drive"
          style="grid-column: span 2;"
        >
          <div style="padding:var(--lib-space-md);">
            <div style="display:flex;gap:3px;align-items:flex-end;height:80px;">
              ${[20,45,30,65,50,80,55,40,70,50,85,60,45,75,55,90,65,40,55,70].map(h => html`
                <div style="flex:1;height:${h}%;background:var(--color-celadon-400);
                  border-radius:2px 2px 0 0;opacity:.5;"></div>
              `)}
            </div>
            <div style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
              color:var(--text-muted);margin-top:var(--lib-space-xs);
              text-transform:uppercase;letter-spacing:var(--tracking-wide);">I/O · últimos 20s</div>
          </div>
        </lib-gadget-frame>

        <!-- Temperatura -->
        <lib-gadget-frame gadget-title="Temperatura" icon="thermometer">
          <div style="padding:var(--lib-space-md);">
            <div style="font-family:var(--lib-font-mono);font-size:2.4rem;font-weight:300;
              color:rgba(250,247,244,.7);line-height:1;">54°<span style="font-size:1rem;">C</span></div>
            <div style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
              color:var(--text-muted);margin-top:4px;letter-spacing:var(--tracking-wide);
              text-transform:uppercase;">Normal · Ventilador 42%</div>
          </div>
        </lib-gadget-frame>
      </div>
    </div>
  `,
};

/* ════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-gadget-frame usa tokens semánticos (--bg-elevated,
   --border-subtle, --text-primary, --text-muted) en card,
   y --lib-glass-* en glass — adapta en los 6 contextos.
   ════════════════════════════════════════════════════════════ */
const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;gap:var(--lib-space-md);flex-wrap:wrap;align-items:flex-start;padding:var(--lib-space-md);background:var(--bg-base);">

    <!-- Card — status metrics -->
    <lib-gadget-frame
      gadget-title="Estado"
      icon="heartbeat"
      variant="card"
      style="width:220px;height:160px;"
    >
      <div style="padding:var(--lib-space-md);display:flex;flex-direction:column;gap:var(--lib-space-sm);">
        ${([
          { l: 'API',       s: 'Online',  ok: true  },
          { l: 'Base Datos', s: 'Online', ok: true  },
          { l: 'Workers',   s: '2/3',     ok: false },
        ]).map(row => html`
          <div style="display:flex;align-items:center;gap:var(--lib-space-sm);font-family:var(--lib-font-mono);font-size:var(--text-xs);">
            <div style="width:5px;height:5px;border-radius:50%;flex-shrink:0;background:${row.ok ? 'var(--color-celadon-400)' : 'var(--color-kaki-400)'};"></div>
            <span style="flex:1;color:var(--text-primary);">${row.l}</span>
            <span style="color:var(--text-muted);">${row.s}</span>
          </div>
        `)}
      </div>
    </lib-gadget-frame>

    <!-- Card — minimized state -->
    <lib-gadget-frame
      gadget-title="CPU Monitor"
      icon="cpu"
      variant="card"
      minimized
      style="width:220px;"
    ></lib-gadget-frame>

    <!-- Card — progress bars -->
    <lib-gadget-frame
      gadget-title="Recursos"
      icon="chart-line"
      variant="card"
      ?minimizable="${true}"
      ?closable="${true}"
      style="width:220px;height:160px;"
    >
      <div style="padding:var(--lib-space-md);display:flex;flex-direction:column;gap:var(--lib-space-sm);">
        ${(['CPU', 'RAM', 'Disco'] as const).map((label, i) => html`
          <div style="display:flex;align-items:center;gap:var(--lib-space-sm);">
            <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);color:var(--text-muted);width:2.5rem;text-transform:uppercase;letter-spacing:var(--tracking-wide);">${label}</span>
            <div style="flex:1;height:4px;background:var(--border-subtle);border-radius:2px;overflow:hidden;">
              <div style="height:100%;width:${[42, 67, 23][i]}%;background:var(--accent-primary);border-radius:2px;"></div>
            </div>
            <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);color:var(--text-muted);width:2rem;text-align:right;">${[42, 67, 23][i]}%</span>
          </div>
        `)}
      </div>
    </lib-gadget-frame>

    <!-- Card — no controls -->
    <lib-gadget-frame
      gadget-title="Gadget fijo"
      icon="lock"
      variant="card"
      minimizable="false"
      closable="false"
      style="width:220px;height:100px;"
    >
      <div style="padding:var(--lib-space-md);font-family:var(--lib-font-mono);font-size:var(--text-xs);color:var(--text-muted);">Sin minimizar · Sin cerrar</div>
    </lib-gadget-frame>

  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
