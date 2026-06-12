import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-radio.component';
import type { LibRadio } from './lib-radio.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

type LibRadioStoryArgs = Pick<
  LibRadio,
  'checked' | 'disabled' | 'label' | 'sublabel' | 'name' | 'value' | 'size' | 'tone'
>;

const meta: Meta<LibRadioStoryArgs> = {
  title: 'Universal/Forms/Radio',
  tags:['autodocs'],
  component: 'lib-radio',

  argTypes: {
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
    sublabel: { control: 'text', description: 'Texto secundario bajo el label' },
    name:     { control: 'text' },
    value:    { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    tone: {
      control: 'select',
      options: ['default', 'accent', 'error'],
    },
  },

  render: (args): TemplateResult => html`
    <div style="padding:24px;">
      <lib-radio
        label=${args.label}
        sublabel=${args.sublabel}
        name=${args.name}
        value=${args.value}
        size=${args.size}
        tone=${args.tone}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
      ></lib-radio>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibRadioStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    label: 'Opcion seleccionable',
    sublabel: '',
    name: 'playground',
    value: 'option',
    size: 'md',
    tone: 'default',
    checked: false,
    disabled: false,
  },
};

/* ── States ── */
export const States: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:20px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <lib-radio
        name="states"
        label="Unselected"
        sublabel="Estado por defecto"
      ></lib-radio>
      <lib-radio
        name="states"
        label="Selected"
        sublabel="Punto interior con ease-bounce"
        checked
      ></lib-radio>
      <lib-radio
        name="states-dis"
        label="Disabled"
        sublabel="No interactuable — opacidad 40%"
        disabled
      ></lib-radio>
      <lib-radio
        name="states-dis"
        label="Disabled selected"
        sublabel="Seleccionado pero bloqueado"
        checked
        disabled
      ></lib-radio>
      <lib-radio
        name="states-err"
        label="Error"
        sublabel="Campo requerido"
        tone="error"
      ></lib-radio>
    </div>
  `,
};

/* ── Sizes ── */
export const Sizes: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:20px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <lib-radio size="sm" name="sizes" label="Small"           sublabel="14px circle" checked></lib-radio>
      <lib-radio size="md" name="sizes" label="Medium (default)" sublabel="18px circle"></lib-radio>
      <lib-radio size="lg" name="sizes" label="Large"           sublabel="22px circle"></lib-radio>
    </div>
  `,
};

/* ── Variants ── */
export const Variants: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:20px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <lib-radio tone="default" name="v-default" label="Default" sublabel="Fondo washi-900" checked></lib-radio>
      <lib-radio tone="accent"    name="v-accent"  label="Accent"  sublabel="Fondo kaki-500"  checked></lib-radio>
      <lib-radio tone="error"   name="v-error"   label="Error"   sublabel="Borde y label en color-error"></lib-radio>
    </div>
  `,
};

/* ── Group horizontal ── */
export const GroupInline: Story = {
  name: 'Group — Inline',
  render: (): TemplateResult => html`
    <div style="padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <p style="font-family:monospace; font-size:11px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:16px;">
        Grupo inline — seleccion unica via name
      </p>
      <div style="display:flex; flex-wrap:wrap; gap:24px;">
        <lib-radio name="inline" value="shibui"   label="Shibui"    checked></lib-radio>
        <lib-radio name="inline" value="wabi"     label="Wabi-sabi"></lib-radio>
        <lib-radio name="inline" value="kintsugi" label="Kintsugi"></lib-radio>
      </div>
    </div>
  `,
};

/* ── Group vertical with sublabel ── */
export const GroupVertical: Story = {
  name: 'Group — Vertical',
  render: (): TemplateResult => html`
    <div style="padding:24px; background:#FFFFFF; border:1px solid #E5DDD3; max-width:400px;">
      <p style="font-family:monospace; font-size:11px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:16px;">
        Grupo vertical con sublabel
      </p>
      <div style="display:flex; flex-direction:column; gap:16px;">
        <lib-radio name="role" value="design"
          label="Disenador UX/UI"
          sublabel="Prototipado, sistemas de diseno, research">
        </lib-radio>
        <lib-radio name="role" value="frontend"
          label="Desarrollador Front-End"
          sublabel="HTML, CSS, JavaScript, frameworks"
          checked>
        </lib-radio>
        <lib-radio name="role" value="pm"
          label="Product Manager"
          sublabel="Roadmap, priorizacion, metricas">
        </lib-radio>
        <lib-radio name="role" value="devops"
          label="DevOps"
          sublabel="Posicion cubierta"
          disabled>
        </lib-radio>
      </div>
    </div>
  `,
};

/* ── Kaki group ── */
export const GroupKaki: Story = {
  name: 'Group — Kaki Variant',
  render: (): TemplateResult => html`
    <div style="padding:24px; background:#FFFFFF; border:1px solid #E5DDD3; max-width:400px;">
      <p style="font-family:monospace; font-size:11px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:16px;">
        Variante accent
      </p>
      <div style="display:flex; flex-direction:column; gap:16px;">
        <lib-radio tone="accent" name="plan-kaki" value="starter"
          label="Starter"
          sublabel="Hasta 3 proyectos activos">
        </lib-radio>
        <lib-radio tone="accent" name="plan-kaki" value="pro"
          label="Pro"
          sublabel="Proyectos ilimitados"
          checked>
        </lib-radio>
        <lib-radio tone="accent" name="plan-kaki" value="enterprise"
          label="Enterprise"
          sublabel="SSO, SLA garantizado">
        </lib-radio>
      </div>
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-radio usa tokens semánticos de borde y texto
   (border-subtle, bg-elevated, text-primary) — adapta al katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-xl);padding:var(--lib-space-lg);background:var(--bg-elevated);border:1px solid var(--border-subtle);">
    <!-- Sizes -->
    <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">
      <span style="font-family:monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.15em;">sizes</span>
      <lib-radio name="kt-size" value="sm" size="sm" label="Small" sublabel="sm"></lib-radio>
      <lib-radio name="kt-size" value="md" size="md" label="Medium" sublabel="md" checked></lib-radio>
      <lib-radio name="kt-size" value="lg" size="lg" label="Large" sublabel="lg"></lib-radio>
    </div>
    <!-- States -->
    <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">
      <span style="font-family:monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.15em;">states</span>
      <lib-radio name="kt-state" value="a" label="Unselected"></lib-radio>
      <lib-radio name="kt-state2" value="b" label="Selected" checked></lib-radio>
      <lib-radio name="kt-state3" value="c" label="Disabled" disabled></lib-radio>
      <lib-radio name="kt-state4" value="d" label="Error" tone="error"></lib-radio>
    </div>
    <!-- Variants -->
    <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">
      <span style="font-family:monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.15em;">variants</span>
      <lib-radio name="kt-var1" value="d" tone="default" label="Default" checked></lib-radio>
      <lib-radio name="kt-var2" value="k" tone="accent" label="Accent" checked></lib-radio>
    </div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;