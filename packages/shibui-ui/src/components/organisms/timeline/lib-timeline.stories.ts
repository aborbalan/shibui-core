import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-timeline.component';
import './lib-timeline-item.component';
import '../../atoms/badge/lib-badge.component';

const meta: Meta = {
  title: 'Display/Timeline',
};

export default meta;

export const Default: StoryObj = {
  render: () => html`
    <div style="max-width: 500px; padding: 40px;">
      <lib-timeline>
        <lib-timeline-item 
          icon="check" 
          variant="success" 
          timestamp="Hoy - 10:30 AM"
        >
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong>Pedido Entregado</strong>
            <lib-badge variant="success">Finalizado</lib-badge>
          </div>
          <p>El cliente ha recibido el paquete satisfactoriamente.</p>
        </lib-timeline-item>

        <lib-timeline-item 
          icon="truck" 
          variant="primary" 
          timestamp="Ayer - 14:00 PM"
        >
          <strong>En Tránsito</strong>
          <p>El envío ha salido de la delegación de Madrid hacia el destino final.</p>
        </lib-timeline-item>

        <lib-timeline-item 
          icon="info" 
          variant="neutral" 
          timestamp="12 Feb 2024"
          ?last=${true}
        >
          <strong>Pedido Registrado</strong>
          <p>Hemos recibido la solicitud y estamos procesando el pago.</p>
        </lib-timeline-item>
      </lib-timeline>
    </div>
  `
};