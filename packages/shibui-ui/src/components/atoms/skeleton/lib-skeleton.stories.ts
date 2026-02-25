import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-skeleton.component';

const meta: Meta = {
  title: 'Display/Skeleton',
  component: 'lib-skeleton',
};

export default meta;

export const Variants: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div>
        <p>Círculo (Avatar)</p>
        <lib-skeleton variant="circle" width="60px" height="60px"></lib-skeleton>
      </div>
      <div>
        <p>Rectángulo (Botón/Card)</p>
        <lib-skeleton variant="rect" width="150px" height="40px"></lib-skeleton>
      </div>
      <div>
        <p>Texto (Líneas)</p>
        <lib-skeleton variant="text" width="100%"></lib-skeleton>
        <lib-skeleton variant="text" width="80%"></lib-skeleton>
        <lib-skeleton variant="text" width="40%"></lib-skeleton>
      </div>
    </div>
  `,
};

export const ProfileCardLoading: StoryObj = {
  render: () => html`
    <div style="padding: 16px; border: 1px solid #ddd; border-radius: 12px; width: 300px; display: flex; gap: 12px; align-items: center;">
      <lib-skeleton variant="circle" width="50px" height="50px"></lib-skeleton>
      <div style="flex: 1;">
        <lib-skeleton variant="text" width="70%" height="1.2em"></lib-skeleton>
        <lib-skeleton variant="text" width="40%" height="0.8em"></lib-skeleton>
      </div>
    </div>
  `,
};