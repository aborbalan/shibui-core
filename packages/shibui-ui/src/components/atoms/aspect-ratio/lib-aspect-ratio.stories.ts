import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-aspect-ratio.component';

const meta: Meta = {
  title: 'Components/Atoms/AspectRatio',
  component: 'lib-aspect-ratio',
};

export default meta;

export const Ratios: StoryObj = {
  render: (): TemplateResult => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 500px;">
      
      <div>
        <p>Ratio 16:9 (Video HD)</p>
        <lib-aspect-ratio ratio="16/9">
          <img src="https://picsum.photos/800/450" alt="Random" />
        </lib-aspect-ratio>
      </div>

      <div>
        <p>Ratio 1:1 (Cuadrado / Instagram)</p>
        <div style="width: 200px;">
           <lib-aspect-ratio ratio="1/1">
            <div style="background: var(--color-kaki-500); display: flex; align-items: center; justify-content: center; color: white;">
              Caja Cuadrada
            </div>
          </lib-aspect-ratio>
        </div>
      </div>

      <div>
        <p>Ratio 4:3 (Fotografía clásica)</p>
        <lib-aspect-ratio ratio="4/3">
          <img src="https://picsum.photos/800/600" alt="Random" />
        </lib-aspect-ratio>
      </div>

    </div>
  `
};