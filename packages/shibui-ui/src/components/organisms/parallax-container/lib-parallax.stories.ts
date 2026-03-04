import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-parallax.component';
// Asegúrate de importar también el item o lo que metas dentro si son componentes
import '../../atoms/card/lib-card.component'; 

const meta: Meta = {
  title: 'Organisms/Parallax Container',
  component: 'lib-parallax-container',
  tags: ['autodocs'],
};

export default meta;

export const Showcase: StoryObj = {
    render: () => html`
    <div style="height: 300vh; background: #1a1a1a; padding-top: 100vh;">
      <lib-parallax-container speed="0.5">
        
        <div data-parallax-factor="0.2" style="position: absolute; width: 100%; text-align: center; opacity: 0.2;">
          <h1 style="font-size: 15rem; color: white; margin: 0;">SHIBUI</h1>
        </div>
  
        <div data-parallax-factor="1" style="position: relative; z-index: 2; display: flex; justify-content: center;">
          <div style="width: 400px; height: 250px; background: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <h2 style="color: black;">Capa de Contenido</h2>
          </div>
        </div>
  
        <div data-parallax-factor="3" style="position: absolute; top: -100px; right: 20%; z-index: 3;">
          <div style="width: 150px; height: 150px; background: var(--color-kintsugi); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
            ¡VUELO!
          </div>
        </div>
  
      </lib-parallax-container>
    </div>
  `
};