import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-bento-grid.component';
import './../../atoms/bento-item/lib-bento-item.component';

const meta: Meta = {
  title: 'Components/Layout/Bento Grid',
  tags:['autodocs'],
  component: 'lib-bento-grid',
  argTypes: {
    columns:   { control: { type: 'number', min: 1, max: 8 } },
    gap:       { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    rowHeight: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj;

/* ── helper label ── */
const mono = (text: string): TemplateResult => html`
  <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
    letter-spacing:var(--tracking-wide);color:var(--text-muted);">${text}</span>`;

/* ──────────────────────────────────────────────
   Playground
   ────────────────────────────────────────────── */
export const Playground: Story = {
  args: { columns: 4, gap: 'md', rowHeight: '160px' },
  render: (args): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);">
      <lib-bento-grid columns="${args.columns}" gap="${args.gap}" row-height="${args.rowHeight}">

        <lib-bento-item cols="2" rows="2" interactive>
          <div style="background:var(--color-washi-100);height:100%;
            display:flex;flex-direction:column;justify-content:flex-end;padding:var(--lib-space-lg);">
            <div style="font-family:var(--lib-font-display);font-size:var(--text-xl);
              font-weight:300;letter-spacing:var(--tracking-tight);color:var(--text-primary);">
              Shibui DS
            </div>
            ${mono('2 × 2 · destacado')}
          </div>
        </lib-bento-item>

        <lib-bento-item cols="2" rows="1" interactive>
          <div style="display:flex;flex-direction:column;justify-content:space-between;height:100%;">
            <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
              text-transform:uppercase;color:var(--text-muted);">Alargado</div>
            ${mono('2 × 1')}
          </div>
        </lib-bento-item>

        <lib-bento-item cols="1" rows="1" interactive>
          ${mono('1 × 1')}
        </lib-bento-item>

        <lib-bento-item cols="1" rows="1" interactive>
          ${mono('1 × 1')}
        </lib-bento-item>

        <lib-bento-item cols="4" rows="1" interactive>
          <div style="display:flex;align-items:center;justify-content:center;height:100%;">
            ${mono('4 × 1 · full width')}
          </div>
        </lib-bento-item>

      </lib-bento-grid>
    </div>
  `,
};

/* ──────────────────────────────────────────────
   Dashboard — caso de uso real
   ────────────────────────────────────────────── */
export const Dashboard: Story = {
  name: 'Contexto — Dashboard',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--bg-base);">
      <lib-bento-grid columns="4" gap="md" row-height="140px">

        <!-- KPI grande -->
        <lib-bento-item cols="2" rows="2" interactive>
          <div style="display:flex;flex-direction:column;justify-content:space-between;height:100%;">
            <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
              text-transform:uppercase;color:var(--text-muted);">Componentes activos</div>
            <div>
              <div style="font-family:var(--lib-font-display);font-size:var(--text-5xl);
                font-weight:300;letter-spacing:var(--tracking-tight);line-height:1;
                color:var(--text-primary);">63</div>
              <div style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                color:var(--color-celadon-500);margin-top:var(--lib-space-xs);">↑ 8 este sprint</div>
            </div>
          </div>
        </lib-bento-item>

        <!-- KPI mini × 4 -->
        ${[
          { label: 'Tokens',    value: '147', delta: '+12' },
          { label: 'Stories',   value: '284', delta: '+31' },
          { label: 'Cobertura', value: '94%', delta: '+2%' },
          { label: 'Builds',    value: '12',  delta: 'ok'  },
        ].map(k => html`
          <lib-bento-item cols="1" rows="1" interactive>
            <div style="display:flex;flex-direction:column;justify-content:space-between;height:100%;">
              <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
                text-transform:uppercase;color:var(--text-muted);">${k.label}</div>
              <div>
                <div style="font-family:var(--lib-font-display);font-size:var(--text-xl);
                  font-weight:300;color:var(--text-primary);">${k.value}</div>
                <div style="font-family:var(--lib-font-mono);font-size:10px;
                  color:var(--color-celadon-500);">${k.delta}</div>
              </div>
            </div>
          </lib-bento-item>
        `)}

        <!-- Barra ancha — actividad -->
        <lib-bento-item cols="3" rows="1" interactive>
          <div style="display:flex;flex-direction:column;justify-content:space-between;height:100%;">
            <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
              text-transform:uppercase;color:var(--text-muted);">Actividad · últimos 7 días</div>
            <div style="display:flex;align-items:flex-end;gap:var(--lib-space-xs);height:40px;">
              ${[40,65,50,80,70,90,60].map(h => html`
                <div style="flex:1;background:var(--color-kaki-400);opacity:.7;
                  height:${h}%;border-radius:1px;"></div>
              `)}
            </div>
          </div>
        </lib-bento-item>

        <!-- Celda status -->
        <lib-bento-item cols="1" rows="1" interactive>
          <div style="display:flex;flex-direction:column;justify-content:space-between;height:100%;">
            <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
              text-transform:uppercase;color:var(--text-muted);">Estado</div>
            <div style="display:flex;align-items:center;gap:var(--lib-space-xs);">
              <div style="width:6px;height:6px;border-radius:50%;
                background:var(--color-celadon-500);"></div>
              <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                color:var(--color-celadon-500);">Stable</span>
            </div>
          </div>
        </lib-bento-item>

      </lib-bento-grid>
    </div>
  `,
};

/* ──────────────────────────────────────────────
   Feature section — marketing/landing
   ────────────────────────────────────────────── */
export const FeatureSection: Story = {
  name: 'Contexto — Feature section',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--bg-base);">
      <lib-bento-grid columns="3" gap="sm" row-height="180px">

        <lib-bento-item cols="2" rows="2" interactive>
          <div style="background:var(--color-washi-900);height:100%;
            display:flex;flex-direction:column;justify-content:flex-end;
            padding:var(--lib-space-lg);">
            <div style="font-family:var(--lib-font-display);font-size:var(--text-xl);
              font-weight:300;color:var(--color-washi-50);letter-spacing:var(--tracking-tight);">
              Diseño sin decoración innecesaria
            </div>
            <div style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
              color:var(--color-washi-500);letter-spacing:var(--tracking-wide);
              margin-top:var(--lib-space-sm);">渋い · Shibui</div>
          </div>
        </lib-bento-item>

        <lib-bento-item cols="1" rows="1" interactive>
          <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">
            <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
              text-transform:uppercase;color:var(--color-kaki-400);">Tokens</div>
            <div style="font-family:var(--lib-font-body);font-size:var(--text-sm);
              color:var(--text-secondary);line-height:1.6;">
              Sistema de diseño coherente de la tipografía al espacio.
            </div>
          </div>
        </lib-bento-item>

        <lib-bento-item cols="1" rows="1" interactive>
          <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">
            <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
              text-transform:uppercase;color:var(--color-kaki-400);">Web Components</div>
            <div style="font-family:var(--lib-font-body);font-size:var(--text-sm);
              color:var(--text-secondary);line-height:1.6;">
              Framework-agnostic. Funciona con Angular, React o Vanilla.
            </div>
          </div>
        </lib-bento-item>

        <lib-bento-item cols="1" rows="1" interactive>
          <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">
            <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
              text-transform:uppercase;color:var(--color-kaki-400);">Accesibilidad</div>
            <div style="font-family:var(--lib-font-body);font-size:var(--text-sm);
              color:var(--text-secondary);line-height:1.6;">
              ARIA, keyboard nav y focus trap en todos los overlays.
            </div>
          </div>
        </lib-bento-item>

        <lib-bento-item cols="2" rows="1" interactive>
          <div style="display:flex;align-items:center;justify-content:space-between;height:100%;">
            <div style="font-family:var(--lib-font-display);font-size:var(--text-xl);
              font-weight:300;letter-spacing:var(--tracking-tight);color:var(--text-primary);">
              63 componentes
            </div>
            <div style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
              color:var(--text-muted);">v0.1.0 · stable →</div>
          </div>
        </lib-bento-item>

      </lib-bento-grid>
    </div>
  `,
};

/* ──────────────────────────────────────────────
   Flush — celdas a sangre (imágenes, fondos)
   ────────────────────────────────────────────── */
export const FlushCells: Story = {
  name: 'Flush — contenido a sangre',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);">
      <lib-bento-grid columns="3" gap="sm" row-height="200px">

        <lib-bento-item cols="1" rows="2" flush>
          <div style="height:100%;background:var(--color-washi-900);"></div>
        </lib-bento-item>

        <lib-bento-item cols="2" rows="1" flush>
          <div style="height:100%;background:var(--color-kaki-100);
            display:flex;align-items:center;justify-content:center;">
            ${mono('flush · sin padding · 2×1')}
          </div>
        </lib-bento-item>

        <lib-bento-item cols="1" rows="1" flush>
          <div style="height:100%;background:var(--color-celadon-100);"></div>
        </lib-bento-item>

        <lib-bento-item cols="1" rows="1" flush>
          <div style="height:100%;background:var(--color-washi-200);"></div>
        </lib-bento-item>

        <lib-bento-item cols="2" rows="1" flush>
          <div style="height:100%;background:var(--color-washi-800);
            display:flex;align-items:flex-end;padding:var(--lib-space-md);">
            <div style="font-family:var(--lib-font-display);font-size:var(--text-xl);
              font-weight:300;color:var(--color-washi-50);">全</div>
          </div>
        </lib-bento-item>

      </lib-bento-grid>
    </div>
  `,
};