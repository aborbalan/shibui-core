import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-horizontal-scroll-section.component';

export default {
  title: 'Organisms/Horizontal Scroll Section',
  component: 'lib-horizontal-scroll-section',
} as Meta;

export const Gallery: StoryObj = {
  render: () => html`
    <div style="background: var(--color-washi-100);">
      <section style="height: 80vh; display: flex; align-items: center; justify-content: center; font-family: var(--lib-font-display);">
        <h2>Baja para descubrir la colección</h2>
      </section>

      <lib-horizontal-scroll-section style="--_scroll-height: 400vh;">
        <div style="width: 600px; height: 400px; background: var(--color-washi-200); border: 1px solid var(--lib-shibui-ink); display: flex; align-items: center; justify-content: center;">
            <span style="font-family: serif; font-size: 2rem;">PROYECTO 01</span>
        </div>
        <div style="width: 800px; height: 500px; background: var(--lib-shibui-ink); color: white; padding: 40px;">
            <h3 style="font-family: var(--lib-font-display); font-size: 3rem;">FILOSOFÍA SHIBUI</h3>
            <p style="font-family: var(--lib-font-body); max-width: 400px;">La elegancia se encuentra en la simplicidad y en el paso del tiempo.</p>
        </div>
        <div style="width: 500px; height: 700px; background: var(--color-celadon-200); border: 1px solid var(--lib-shibui-ink);"></div>
        <div style="width: 600px; height: 400px; background: var(--color-kaki-200); border: 1px solid var(--lib-shibui-ink);"></div>
      </lib-horizontal-scroll-section>

      <section style="height: 100vh; background: var(--lib-shibui-ink); color: white; display: flex; align-items: center; justify-content: center;">
        <h2>Fin de la experiencia</h2>
      </section>
    </div>
  `
};