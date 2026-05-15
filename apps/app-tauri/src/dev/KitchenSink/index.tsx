import { LibButton, LibBadge } from '@shibui-ui/ui/react';

export function KitchenSink() {
  return (
    <div style={{ padding: '2rem' }}>
      <p style={{
        fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
        fontSize: '0.6rem',
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        color: 'rgba(250,247,244,0.25)',
        marginBottom: '1rem',
      }}>
        Dev · Kitchen Sink
      </p>
      <h2 style={{
        fontFamily: 'var(--lib-font-display, "Cormorant Garamond", serif)',
        fontSize: '2.5rem',
        fontWeight: 300,
        color: 'rgba(250,247,244,0.9)',
        marginBottom: '2rem',
      }}>
        Kitchen Sink
      </h2>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.3)', marginBottom: '0.75rem' }}>
            Buttons
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <LibButton variant="primary">Primary</LibButton>
            <LibButton variant="secondary">Secondary</LibButton>
            <LibButton variant="ghost">Ghost</LibButton>
            <LibButton variant="kintsugi">Kintsugi</LibButton>
            <LibButton variant="glitch">Glitch</LibButton>
          </div>
        </div>

        <div>
          <p style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,247,244,0.3)', marginBottom: '0.75rem' }}>
            Badges
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <LibBadge variant="default">Default</LibBadge>
            <LibBadge variant="success">Success</LibBadge>
            <LibBadge variant="warning">Warning</LibBadge>
            <LibBadge variant="danger">Danger</LibBadge>
          </div>
        </div>
      </section>
    </div>
  );
}
