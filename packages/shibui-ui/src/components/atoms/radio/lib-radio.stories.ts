import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-radio.component';
import type { LibRadio } from './lib-radio.component';

type LibRadioStoryArgs = Pick<
  LibRadio,
  'checked' | 'disabled' | 'label' | 'sublabel' | 'name' | 'value' | 'size' | 'variant'
>;

const meta: Meta<LibRadioStoryArgs> = {
  title: 'Forms/Radio',
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
    variant: {
      control: 'select',
      options: ['default', 'kaki', 'error'],
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
        variant=${args.variant}
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
    variant: 'default',
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
        variant="error"
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
      <lib-radio variant="default" name="v-default" label="Default" sublabel="Fondo washi-900" checked></lib-radio>
      <lib-radio variant="kaki"    name="v-kaki"    label="Kaki"    sublabel="Fondo kaki-500"  checked></lib-radio>
      <lib-radio variant="error"   name="v-error"   label="Error"   sublabel="Borde y label en color-error"></lib-radio>
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
        Variante kaki
      </p>
      <div style="display:flex; flex-direction:column; gap:16px;">
        <lib-radio variant="kaki" name="plan-kaki" value="starter"
          label="Starter"
          sublabel="Hasta 3 proyectos activos">
        </lib-radio>
        <lib-radio variant="kaki" name="plan-kaki" value="pro"
          label="Pro"
          sublabel="Proyectos ilimitados"
          checked>
        </lib-radio>
        <lib-radio variant="kaki" name="plan-kaki" value="enterprise"
          label="Enterprise"
          sublabel="SSO, SLA garantizado">
        </lib-radio>
      </div>
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Contextos estéticos
   ═══════════════════════════════════════════════════════════════ */

const katachiList = [
  { id: 'wabi',     kanji: '侘', label: 'wabi · 侘び' },
  { id: 'kintsugi', kanji: '金', label: 'kintsugi · 金継ぎ' },
  { id: 'sabi',     kanji: '寂', label: 'sabi · 寂び' },
  { id: 'terminal', kanji: '>_', label: 'terminal' },
  { id: 'shizen',   kanji: '自', label: 'shizen · 自然' },
  { id: 'celadon',  kanji: '青', label: 'celadon · 青磁' },
] as const;

export const KatachiContexts: Story = {
  name: 'Katachi · 6 contexts',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--lib-space-lg);padding:var(--lib-space-xl);background:var(--color-washi-100);">
      ${katachiList.map(k => html`
        <section data-katachi="${k.id}" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
          <header style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
            <strong style="font-family:'Shippori Mincho',serif;font-size:1.3rem;color:var(--katachi-accent,inherit);">${k.kanji}</strong>&nbsp;${k.label}
          </header>
          <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">
            <lib-radio name="katachi-${k.id}" value="opcion-a" label="Opción A"></lib-radio>
            <lib-radio name="katachi-${k.id}" value="opcion-b" label="Opción B" checked></lib-radio>
            <lib-radio name="katachi-${k.id}" value="opcion-c" label="Opción C" disabled></lib-radio>
          </div>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};