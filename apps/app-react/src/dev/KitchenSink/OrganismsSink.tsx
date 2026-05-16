import { KitchenItem } from './KitchenItem';

const sectionStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: 'var(--lib-space-md)',
};

const headerStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  borderBottom: '1px solid var(--border-default)',
  paddingBottom: 'var(--lib-space-xs)',
  margin: 0,
};

export const OrganismsSink: React.FC = () => (
  <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-lg)' }}>
    <h2 style={headerStyle}>🔴 Organisms · 16</h2>

    <div style={sectionStyle}>

      <KitchenItem name="lib-accordion">
        <lib-accordion style={{ width: '100%' }}>
          <lib-accordion-item label="Sección 1">Contenido 1</lib-accordion-item>
          <lib-accordion-item label="Sección 2">Contenido 2</lib-accordion-item>
          <lib-accordion-item label="Sección 3">Contenido 3</lib-accordion-item>
        </lib-accordion>
      </KitchenItem>

      <KitchenItem name="lib-stepper">
        <lib-stepper current="2" style={{ width: '100%' }}>
          <lib-step index="1" label="Plan" />
          <lib-step index="2" label="Build" />
          <lib-step index="3" label="Ship" />
        </lib-stepper>
      </KitchenItem>

      <KitchenItem name="lib-timeline">
        <lib-timeline style={{ width: '100%' }}>
          <div data-date="2024">Phase 1 — Tokens</div>
          <div data-date="2025">Phase 2 — Components</div>
          <div data-date="2026">Phase 3 — Katachi</div>
        </lib-timeline>
      </KitchenItem>

      <KitchenItem name="lib-bento-grid">
        <lib-bento-grid columns="3" style={{ width: '100%' }}>
          <lib-bento-item><p style={{ padding: 'var(--lib-space-sm)' }}>A</p></lib-bento-item>
          <lib-bento-item><p style={{ padding: 'var(--lib-space-sm)' }}>B</p></lib-bento-item>
          <lib-bento-item><p style={{ padding: 'var(--lib-space-sm)' }}>C</p></lib-bento-item>
        </lib-bento-grid>
      </KitchenItem>

      <KitchenItem name="lib-data-table">
        <lib-data-table style={{ width: '100%' }}>
          <table>
            <thead>
              <tr><th>Nombre</th><th>Estado</th></tr>
            </thead>
            <tbody>
              <tr><td>Alpha</td><td>OK</td></tr>
              <tr><td>Beta</td><td>WIP</td></tr>
            </tbody>
          </table>
        </lib-data-table>
      </KitchenItem>

      <KitchenItem name="lib-carousel">
        <lib-carousel arrows dots style={{ width: '100%' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: 'var(--lib-space-lg)' }}>Slide 1</div>
          <div style={{ background: 'var(--bg-elevated)', padding: 'var(--lib-space-lg)' }}>Slide 2</div>
          <div style={{ background: 'var(--bg-elevated)', padding: 'var(--lib-space-lg)' }}>Slide 3</div>
        </lib-carousel>
      </KitchenItem>

      <KitchenItem name="lib-dialog" note="declarativo — abre con prop open">
        <lib-dialog>
          <p>Dialog contenido (cerrado por defecto)</p>
        </lib-dialog>
        <small style={{ color: 'var(--text-muted)' }}>open=false por defecto</small>
      </KitchenItem>

      <KitchenItem name="lib-drawer" note="declarativo — abre con prop open">
        <lib-drawer>
          <p>Drawer contenido (cerrado por defecto)</p>
        </lib-drawer>
        <small style={{ color: 'var(--text-muted)' }}>open=false por defecto</small>
      </KitchenItem>

      <KitchenItem name="lib-sidebar" note="estructural — preview altura limitada">
        <div style={{ height: 200, width: '100%', border: '1px dashed var(--border-default)', position: 'relative' }}>
          <lib-sidebar>
            <a slot="item" href="#">Dashboard</a>
            <a slot="item" href="#">Settings</a>
          </lib-sidebar>
        </div>
      </KitchenItem>

      <KitchenItem name="lib-footer">
        <lib-footer style={{ width: '100%' }}>
          <span>© 2026 Shibui</span>
        </lib-footer>
      </KitchenItem>

      <KitchenItem name="lib-toast-manager" note="root listener — emite via API">
        <lib-toast-manager />
        <small style={{ color: 'var(--text-muted)' }}>montado, sin toasts activos</small>
      </KitchenItem>

      <KitchenItem name="lib-stagger" note="effect — anima entrada de hijos">
        <lib-stagger style={{ width: '100%' }}>
          <p style={{ padding: 'var(--lib-space-xs)', background: 'var(--bg-elevated)' }}>uno</p>
          <p style={{ padding: 'var(--lib-space-xs)', background: 'var(--bg-elevated)' }}>dos</p>
          <p style={{ padding: 'var(--lib-space-xs)', background: 'var(--bg-elevated)' }}>tres</p>
        </lib-stagger>
      </KitchenItem>

      <KitchenItem name="lib-parallax-container" note="effect — scroll para parallax">
        <lib-parallax-container style={{ height: 120, width: '100%', border: '1px dashed var(--border-default)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--lib-space-md)' }}>contenido parallax</div>
        </lib-parallax-container>
      </KitchenItem>

      <KitchenItem name="lib-parallax-text" note="effect — scroll-driven text">
        <lib-parallax-text>SHIBUI · SHIBUI · SHIBUI</lib-parallax-text>
      </KitchenItem>

      <KitchenItem name="lib-cursor-follower" note="effect — sigue el cursor (global)">
        <lib-cursor-follower />
        <small style={{ color: 'var(--text-muted)' }}>activo, mueve el cursor</small>
      </KitchenItem>

      <KitchenItem name="lib-horizontal-scroll-section" note="effect — scroll horizontal">
        <lib-horizontal-scroll-section style={{ height: 100, width: '100%' }}>
          <div style={{ background: 'var(--bg-elevated)', padding: 'var(--lib-space-md)', whiteSpace: 'nowrap' }}>
            panel ancho
          </div>
        </lib-horizontal-scroll-section>
      </KitchenItem>

    </div>
  </section>
);
