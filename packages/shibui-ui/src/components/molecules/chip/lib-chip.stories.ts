import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import './lib-chip.component';

const meta: Meta = {
  title: 'Atoms/Chip',
  component: 'lib-chip',
  argTypes: {
    label: { control: 'text' },
    active: { control: 'boolean' },
    selectable: { control: 'boolean' },
    removable: { control: 'boolean' },
  },
};

export default meta;

export const Showcase: StoryObj = {
  render: () => html`
    <div style="background: var(--bg-base); padding: 3rem; min-height: 100vh; font-family: var(--lib-font-body);">
      
      <section style="margin-bottom: 4rem;">
        <h3 style="font-family: var(--lib-font-display); color: var(--lib-shibui-ink); border-bottom: 1px solid var(--lib-shibui-ink); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
          01. Selection Chips (Selectables)
        </h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <lib-chip label="Design" selectable active></lib-chip>
          <lib-chip label="Architecture" selectable></lib-chip>
          <lib-chip label="Development" selectable></lib-chip>
          <lib-chip label="Strategy" selectable active></lib-chip>
        </div>
      </section>

      <section style="margin-bottom: 4rem;">
        <h3 style="font-family: var(--lib-font-display); color: var(--lib-shibui-ink); border-bottom: 1px solid var(--lib-shibui-ink); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
          02. Input Chips (Removables)
        </h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <lib-chip label="shibui.css" removable @chip-remove=${(e: any) => console.log('Removido:', e.detail)}></lib-chip>
          <lib-chip label="tokens.json" removable></lib-chip>
          <lib-chip label="index.ts" removable></lib-chip>
        </div>
      </section>

      <section>
        <h3 style="font-family: var(--lib-font-display); color: var(--lib-shibui-ink); border-bottom: 1px solid var(--lib-shibui-ink); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
          03. Brutalist States
        </h3>
        <div style="display: flex; gap: 24px; align-items: center;">
           <div>
             <p style="font-size: var(--text-xs); color: var(--color-washi-500); margin-bottom: 8px;">Default</p>
             <lib-chip label="Washi-100"></lib-chip>
           </div>
           <div>
             <p style="font-size: var(--text-xs); color: var(--color-washi-500); margin-bottom: 8px;">Active (Ink)</p>
             <lib-chip label="Kintsugi" active></lib-chip>
           </div>
        </div>
      </section>

    </div>
  `
};

export const InteractiveField: StoryObj = {
  render: () => {
    const addChip = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const input = e.target as HTMLInputElement;
        console.log('Añadir chip:', input.value);
        input.value = '';
      }
    };

    return html`
      <div style="padding: 4rem; background: var(--bg-base);">
        <div style="max-width: 400px; border-bottom: 1px solid var(--lib-shibui-ink); padding: 8px 0; display: flex; flex-wrap: wrap; gap: 8px;">
          <lib-chip label="Frontend" removable></lib-chip>
          <lib-chip label="Lit" removable></lib-chip>
          <input 
            type="text" 
            placeholder="Añadir tag..." 
            @keydown=${addChip}
            style="border: none; background: transparent; outline: none; font-family: var(--lib-font-body); font-size: var(--text-sm); flex: 1; min-width: 120px;"
          />
        </div>
      </div>
    `;
  }
};