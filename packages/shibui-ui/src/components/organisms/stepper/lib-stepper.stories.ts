import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-stepper.component';
import '../../atoms/step/lib-step.component';
import type { LibStepper } from './lib-stepper.component';

type StepperArgs = Pick<LibStepper, 'current' | 'orientation' | 'variant' | 'size'>;

/* ── Helpers ── */
const wrap = (bg: string, content: TemplateResult, pad = '40px'): TemplateResult => html`
  <div style="padding:${pad}; background:${bg}; border:1px solid var(--border-subtle);">
    ${content}
  </div>
`;

const meta: Meta<StepperArgs> = {
  title: 'Components/Organisms/Stepper',
  tags:['autodocs'],
  component: 'lib-stepper',
  argTypes: {
    current:     { control: { type: 'number', min: 1, max: 4 } },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant:     { control: 'select', options: ['default', 'minimal', 'kintsugi'] },
    size:        { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args): TemplateResult => wrap('var(--bg-surface)', html`
    <lib-stepper
      current=${args.current}
      orientation=${args.orientation}
      variant=${args.variant}
      size=${args.size}
    >
      <lib-step label="Información" sub="Datos personales"></lib-step>
      <lib-step label="Dirección"   sub="Envío y facturación"></lib-step>
      <lib-step label="Pago"        sub="Método de pago"></lib-step>
      <lib-step label="Confirmación" sub="Revisar pedido"></lib-step>
    </lib-stepper>
  `),
};

export default meta;
type Story = StoryObj<StepperArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: { current: 3, orientation: 'horizontal', variant: 'default', size: 'md' },
};

/* ── Horizontal — tamaños ── */
export const HorizontalSizes: Story = {
  name: 'Horizontal — SM · MD · LG',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:40px; padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle);">
      ${(['sm', 'md', 'lg'] as const).map(size => html`
        <div>
          <p style="font-family:monospace; font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.25em; margin-bottom:16px;">${size}</p>
          <lib-stepper current="2" size=${size}>
            <lib-step label="Cuenta"></lib-step>
            <lib-step label="Perfil"></lib-step>
            <lib-step label="Plan"></lib-step>
            <lib-step label="Listo"></lib-step>
          </lib-stepper>
        </div>
      `)}
    </div>
  `,
};

/* ── Horizontal con error ── */
export const HorizontalWithError: Story = {
  name: 'Horizontal — con error en paso 2',
  render: (): TemplateResult => html`
    ${wrap('var(--bg-surface)', html`
      <lib-stepper current="2" size="lg" id="stepper-error">
        <lib-step label="Datos"></lib-step>
        <lib-step label="Verificación" status="error"></lib-step>
        <lib-step label="Pago"></lib-step>
        <lib-step label="Completar"></lib-step>
      </lib-stepper>
      <p style="margin-top:16px; font-family:monospace; font-size:11px; color:var(--color-error); letter-spacing:0.08em;">
        ↑ status="error" asignado externamente en el paso 2
      </p>
    `)}
  `,
};

/* ── Vertical ── */
export const Vertical: Story = {
  name: 'Vertical — con contenido en slot',
  render: (): TemplateResult => wrap('var(--bg-surface)', html`
    <lib-stepper orientation="vertical" current="3" style="max-width:480px;">
      <lib-step label="Crea tu cuenta">
        Registro completado. Tu correo ha sido verificado.
      </lib-step>
      <lib-step label="Completa tu perfil">
        Foto de perfil, nombre y preferencias guardadas correctamente.
      </lib-step>
      <lib-step label="Elige un plan">
        Selecciona el plan que mejor se adapte a tus necesidades. Puedes cambiar en cualquier momento.
      </lib-step>
      <lib-step label="Primer proyecto">
        Crea tu primer proyecto e invita a tu equipo.
      </lib-step>
      <lib-step label="Listo para comenzar"></lib-step>
    </lib-stepper>
  `),
};

/* ── Minimal ── */
export const Minimal: Story = {
  name: 'Variant — Minimal (acento kaki)',
  render: (): TemplateResult => wrap('var(--bg-surface)', html`
    <lib-stepper variant="minimal" current="3">
      <lib-step label="Catálogo"></lib-step>
      <lib-step label="Selección"></lib-step>
      <lib-step label="Detalles"></lib-step>
      <lib-step label="Resumen"></lib-step>
      <lib-step label="Enviar"></lib-step>
    </lib-stepper>
  `),
};

/* ── Kintsugi ── */
export const Kintsugi: Story = {
  name: 'Variant — Kintsugi (superficie oscura)',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="padding:48px 40px; background:var(--color-washi-950); border:none;">
      <lib-stepper variant="kintsugi" current="3">
        <lib-step label="Origen"></lib-step>
        <lib-step label="Proceso"></lib-step>
        <lib-step label="Refinado" sub="En curso"></lib-step>
        <lib-step label="Acabado"></lib-step>
      </lib-stepper>
    </div>
  `,
};

/* ── Interactivo — demo navegación ── */
export const Interactive: Story = {
  name: 'Interactive — navegación entre pasos',
  render: (): TemplateResult => {
    let current = 2;

    const STEPS: { label: string; sub: string; title: string; body: string }[] = [
      { label: 'Cuenta',  sub: 'Email y contraseña',  title: 'Paso 1 · Cuenta',  body: 'Introduce tu correo electrónico y elige una contraseña segura.' },
      { label: 'Empresa', sub: 'Nombre y sector',     title: 'Paso 2 · Empresa', body: 'Indica el nombre de tu organización y el sector al que pertenece.' },
      { label: 'Equipo',  sub: 'Invita miembros',     title: 'Paso 3 · Equipo',  body: 'Invita a los miembros de tu equipo por correo.' },
      { label: 'Listo',   sub: 'Confirmar y empezar', title: 'Paso 4 · Listo',   body: '¡Todo configurado! Revisa el resumen y confirma.' },
    ];

    const getStep = (i: number): { label: string; sub: string; title: string; body: string } =>
      STEPS[Math.max(0, Math.min(i, STEPS.length - 1))]!;

    function render(): TemplateResult {
      const step = getStep(current - 1);
      return html`
        <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:32px;">

          <lib-stepper .current=${current} id="story-stepper">
            ${STEPS.map(s => html`<lib-step label=${s.label} sub=${s.sub}></lib-step>`)}
          </lib-stepper>

          <div style="padding:24px 32px; background:var(--bg-elevated); border:1px solid var(--border-subtle); border-left:2px solid var(--color-washi-900); min-height:80px;">
            <p style="font-family:monospace; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:var(--text-primary); margin-bottom:8px;">${step.title}</p>
            <p style="font-size:13px; color:var(--text-secondary); line-height:1.8;">${step.body}</p>
          </div>

          <div style="display:flex; align-items:center; gap:12px;">
            <button
              style="font-family:monospace; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; padding:10px 24px; background:var(--bg-elevated); color:var(--text-primary); border:1px solid var(--border-default); cursor:pointer; opacity:${current === 1 ? '0.4' : '1'};"
              ?disabled=${current === 1}
              @click=${():void => {
                current = Math.max(1, current - 1);
                (document.getElementById('story-stepper') as LibStepper).current = current;
              }}
            >← Anterior</button>

            <button
              style="font-family:monospace; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; padding:10px 24px; background:var(--color-washi-900); color:var(--color-washi-50); border:none; cursor:pointer; opacity:${current === STEPS.length ? '0.4' : '1'};"
              ?disabled=${current === STEPS.length}
              @click=${():void => {
                current = Math.min(STEPS.length, current + 1);
                (document.getElementById('story-stepper') as LibStepper).current = current;
              }}
            >Siguiente →</button>

            <span style="font-family:monospace; font-size:11px; color:var(--text-muted); letter-spacing:0.15em;">
              Paso ${current} / ${STEPS.length}
            </span>
          </div>
        </div>
      `;
    }

    return render();
  },
};