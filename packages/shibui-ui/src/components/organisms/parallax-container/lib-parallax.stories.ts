import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-parallax.component';

const meta: Meta = {
  title: 'Components/Organisms/ParallaxContainer',
  component: 'lib-parallax-container',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Aplica desplazamiento parallax a los hijos directos del slot.
El punto neutro (transform = 0) ocurre cuando el centro del elemento
coincide con el centro del viewport — no al llegar al top de la página.

Cada hijo puede sobreescribir el multiplicador con \`data-parallax-factor\`:
- \`data-parallax-factor="0.2"\` → movimiento muy lento (fondo lejano)
- \`data-parallax-factor="1"\`   → velocidad base
- \`data-parallax-factor="2.5"\` → movimiento rápido (primer plano)

Respeta \`prefers-reduced-motion\` — en ese caso los transforms se anulan.
        `,
      },
    },
  },
  argTypes: {
    speed: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    axis:  { control: 'select', options: ['y', 'x', 'xy'] },
    clamp: { control: { type: 'range', min: 0, max: 200, step: 10 } },
  },
};
export default meta;
type Story = StoryObj;

/* ── helpers ── */
const scrollHint = (): TemplateResult => html`
  <div style="height:50vh;display:flex;align-items:center;justify-content:center;
    background:var(--color-washi-950);">
    <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
      letter-spacing:var(--tracking-widest);text-transform:uppercase;
      color:var(--color-washi-700);">↓ scroll ↓</p>
  </div>`;

/* ── Playground ── */
export const Playground: Story = {
  args: { speed: 0.2, axis: 'y', clamp: 0 },
  render: (args): TemplateResult => html`
    <div>
      ${scrollHint()}

      <lib-parallax-container speed="${args.speed}" axis="${args.axis}" clamp="${args.clamp}"
        style="height:600px;background:var(--color-washi-950);">

        <!-- Fondo lento — texto grande desvanecido -->
        <div data-parallax-factor="0.3"
          style="position:absolute;inset:0;display:flex;align-items:center;
            justify-content:center;pointer-events:none;user-select:none;">
          <span style="font-family:var(--lib-font-display);font-size:clamp(4rem,12vw,10rem);
            font-weight:300;color:var(--color-washi-800);letter-spacing:var(--tracking-tight);
            line-height:1;">SHIBUI</span>
        </div>

        <!-- Capa media — card principal -->
        <div data-parallax-factor="1"
          style="position:relative;z-index:2;height:100%;display:flex;
            align-items:center;justify-content:center;">
          <div style="width:360px;padding:var(--lib-space-xl);
            background:var(--bg-elevated);border:1px solid var(--border-subtle);">
            <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
              letter-spacing:var(--tracking-widest);text-transform:uppercase;
              color:var(--text-muted);margin-bottom:var(--lib-space-sm);">
              Design System
            </p>
            <h2 style="font-family:var(--lib-font-display);font-size:var(--text-3xl);
              font-weight:300;letter-spacing:var(--tracking-tight);line-height:1.2;
              color:var(--text-primary);">
              Kintsugi<br><em style="color:var(--color-kaki-500);">digital</em>
            </h2>
          </div>
        </div>

        <!-- Primer plano — elemento rápido -->
        <div data-parallax-factor="2.5"
          style="position:absolute;top:20%;right:15%;z-index:3;">
          <div style="width:80px;height:80px;background:var(--color-kaki-500);
            display:flex;align-items:center;justify-content:center;">
            <span style="font-family:var(--lib-font-mono);font-size:9px;
              letter-spacing:var(--tracking-widest);color:#fff;">漆</span>
          </div>
        </div>

      </lib-parallax-container>

      ${scrollHint()}
      ${scrollHint()}
    </div>
  `,
};

/* ── Capas múltiples con factores distintos ── */
export const MultipleLayers: Story = {
  name: 'Capas múltiples — data-parallax-factor',
  render: (): TemplateResult => html`
    <div>
      ${scrollHint()}

      <lib-parallax-container speed="0.3"
        style="height:700px;background:var(--color-washi-950);overflow:hidden;">

        <!-- Capa 1 — fondo muy lento (0.1) -->
        <div data-parallax-factor="0.1"
          style="position:absolute;inset:0;background:
            radial-gradient(ellipse 60% 40% at 30% 50%,
              rgba(184,90,30,0.08) 0%, transparent 70%);
          pointer-events:none;">
        </div>

        <!-- Capa 2 — grid de líneas lento (0.4) -->
        <div data-parallax-factor="0.4"
          style="position:absolute;inset:-50px;pointer-events:none;
            background-image:
              linear-gradient(var(--color-washi-800) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-washi-800) 1px, transparent 1px);
            background-size:80px 80px;opacity:0.3;">
        </div>

        <!-- Capa 3 — contenido principal (1) -->
        <div data-parallax-factor="1"
          style="position:relative;z-index:2;height:100%;display:flex;
            align-items:center;justify-content:center;flex-direction:column;
            gap:var(--lib-space-lg);text-align:center;padding:0 var(--lib-space-xl);">
          <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
            letter-spacing:var(--tracking-widest);text-transform:uppercase;
            color:var(--color-washi-600);">Factor 1.0 — base</p>
          <h2 style="font-family:var(--lib-font-display);font-size:var(--text-3xl);
            font-weight:300;color:var(--color-washi-100);letter-spacing:var(--tracking-tight);">
            Parallax en capas
          </h2>
        </div>

        <!-- Capa 4 — elemento rápido izquierda (2) -->
        <div data-parallax-factor="2"
          style="position:absolute;left:8%;top:25%;z-index:3;">
          <div style="width:56px;height:56px;border:1px solid var(--color-kaki-500);
            display:flex;align-items:center;justify-content:center;">
            <span style="font-family:var(--lib-font-mono);font-size:9px;
              letter-spacing:.1em;color:var(--color-kaki-400);">2.0</span>
          </div>
        </div>

        <!-- Capa 5 — elemento más rápido derecha (3) -->
        <div data-parallax-factor="3"
          style="position:absolute;right:10%;top:40%;z-index:3;">
          <div style="width:40px;height:40px;background:var(--color-celadon-500);
            display:flex;align-items:center;justify-content:center;">
            <span style="font-family:var(--lib-font-mono);font-size:9px;
              color:#fff;">3.0</span>
          </div>
        </div>

      </lib-parallax-container>

      <!-- Tabla de factores -->
      <div style="padding:var(--lib-space-xl) calc(var(--lib-space-xl)*2);
        background:var(--bg-elevated);border-top:1px solid var(--border-subtle);">
        <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
          letter-spacing:var(--tracking-widest);text-transform:uppercase;
          color:var(--text-muted);margin-bottom:var(--lib-space-md);">
          data-parallax-factor
        </p>
        <div style="display:flex;gap:var(--lib-space-lg);flex-wrap:wrap;">
          ${[
            { f: '0.1', label: 'Fondo muy lejano' },
            { f: '0.4', label: 'Fondo medio' },
            { f: '1',   label: 'Velocidad base' },
            { f: '2',   label: 'Primer plano' },
            { f: '3',   label: 'Elemento flotante' },
          ].map(r => html`
            <div>
              <code style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                color:var(--color-kaki-500);">${r.f}</code>
              <p style="font-family:var(--lib-font-body);font-size:var(--text-xs);
                color:var(--text-muted);margin-top:4px;">${r.label}</p>
            </div>
          `)}
        </div>
      </div>

      ${scrollHint()}
    </div>
  `,
};

/* ── Eje X ── */
export const AxisX: Story = {
  name: 'Eje X — desplazamiento horizontal',
  render: (): TemplateResult => html`
    <div>
      ${scrollHint()}

      <lib-parallax-container speed="0.4" axis="x"
        style="height:500px;background:var(--bg-surface);
          border-top:1px solid var(--border-subtle);
          border-bottom:1px solid var(--border-subtle);">

        <div data-parallax-factor="0.5"
          style="position:absolute;inset:0;display:flex;align-items:center;
            padding:0 var(--lib-space-xl);pointer-events:none;">
          <span style="font-family:var(--lib-font-display);font-size:8rem;
            font-weight:300;color:var(--color-washi-200);white-space:nowrap;">
            水平 · horizontal
          </span>
        </div>

        <div data-parallax-factor="1.5"
          style="position:relative;z-index:2;height:100%;display:flex;
            align-items:center;justify-content:center;">
          <div style="padding:var(--lib-space-lg) calc(var(--lib-space-lg)*2);
            border:1px solid var(--border-default);background:var(--bg-elevated);">
            <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
              letter-spacing:var(--tracking-widest);color:var(--text-muted);">
              axis="x" · speed 0.4 · factor 1.5
            </p>
          </div>
        </div>

      </lib-parallax-container>

      ${scrollHint()}
    </div>
  `,
};

/* ── Con clamp ── */
export const Clamped: Story = {
  name: 'Clamp — límite de desplazamiento',
  render: (): TemplateResult => html`
    <div>
      ${scrollHint()}

      <lib-parallax-container speed="0.5" clamp="60"
        style="height:500px;background:var(--bg-base);
          border:1px solid var(--border-subtle);">

        <div data-parallax-factor="1"
          style="position:relative;height:100%;display:flex;
            align-items:center;justify-content:center;flex-direction:column;
            gap:var(--lib-space-md);">
          <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
            letter-spacing:var(--tracking-widest);text-transform:uppercase;
            color:var(--text-muted);">clamp: 60px · speed: 0.5</p>
          <div style="width:200px;height:200px;background:var(--color-washi-200);
            border:1px solid var(--border-default);display:flex;align-items:center;
            justify-content:center;">
            <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
              color:var(--text-muted);">max ±60px</span>
          </div>
        </div>

      </lib-parallax-container>

      ${scrollHint()}
    </div>
  `,
};