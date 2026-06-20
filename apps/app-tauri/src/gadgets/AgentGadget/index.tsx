import { GadgetFrame } from '../GadgetFrame';
import { LibStatusDot, LibMetricBar, LibChip } from '@shibui-ui/ui/react';
import type { Agent, AgentStatus } from '../../pages/branches/agents.mock';

/** Mapea el estado del agente al `status` de lib-status-dot. */
const STATUS_DOT: Record<AgentStatus, 'online' | 'away' | 'busy' | 'offline'> = {
  idle: 'offline',
  running: 'away',
  done: 'online',
  error: 'busy',
};

/** Mapea el estado al `tone` de la barra de progreso. */
const STATUS_TONE: Record<AgentStatus, 'default' | 'accent' | 'info' | 'error'> = {
  idle: 'default',
  running: 'accent',
  done: 'info',
  error: 'error',
};

const STATUS_LABEL: Record<AgentStatus, string> = {
  idle: 'idle',
  running: 'running',
  done: 'done',
  error: 'error',
};

/**
 * Gadget de un "agente" actuando sobre una rama. Datos mock por ahora
 * (ver `pages/branches/agents.mock.ts`). Compone lib-* sin estilizarlos:
 * solo layout en el wrapper.
 */
export function AgentGadget({ agent }: { agent: Agent }) {
  return (
    <GadgetFrame title={agent.name} icon="dots">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '0.2rem' }}>

        {/* Rama + estado */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <LibChip>{agent.branch}</LibChip>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <LibStatusDot status={STATUS_DOT[agent.status]} />
            <span style={{
              fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
              fontSize: '0.58rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}>
              {STATUS_LABEL[agent.status]}
            </span>
          </div>
        </div>

        {/* Última acción */}
        <span style={{
          fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
          fontSize: '0.62rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          {agent.lastAction}
        </span>

        {/* Progreso */}
        <LibMetricBar
          label="progreso"
          value={agent.progress}
          max={100}
          unit="%"
          tone={STATUS_TONE[agent.status]}
          size="sm"
          show-value=""
        />
      </div>
    </GadgetFrame>
  );
}
