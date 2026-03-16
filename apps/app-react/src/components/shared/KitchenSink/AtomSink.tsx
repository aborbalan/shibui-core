import { LibAccordionItem, LibAvatar, LibBackground, LibBadge } from '@shibui/ui/react';
import { LibButton } from '@shibui/ui/react';
import React from 'react';

export const AtomsSink: React.FC = () => (
  <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-lg)' }}>
    <h2 style={{ color: 'var(--color-washi-400)', borderBottom: '1px solid var(--color-washi-800)' }}>🟢 Atoms</h2>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
      <h4>Buttons</h4>
      <div style={{ display: 'flex', gap: 'var(--lib-space-sm)' }}>
        <LibButton variant="default">default</LibButton>
        <LibButton variant="primary">primary</LibButton>
        <LibButton variant="secondary">secondary</LibButton>
        <LibButton variant="ghost">ghost</LibButton>
        <LibButton variant="accent">accent</LibButton>
        <LibButton variant="danger">danger</LibButton>

      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
      <h4>Accordion Item</h4>
        <LibAccordionItem label={'prueba'}>
        <p>{'Contenido a mostrar'}</p>
        </LibAccordionItem>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
    <h4>Aspect Ratio (define Tests)</h4>

    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
    <h4>Avatar (define Tests)</h4>
        <LibAvatar></LibAvatar>
        <LibAvatar name="Alejandro Borbalan"></LibAvatar>
        <LibAvatar shape="squircle" name="Alejandro Borbalan"></LibAvatar>
        <LibAvatar shape="square" name="Alejandro Borbalan"></LibAvatar>


    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
    <h4>Badge (define Tests)</h4>
        <LibBadge variant="default">Badge</LibBadge>
        <LibBadge variant="accent">Badge</LibBadge>
        <LibBadge variant="celadon">Badge</LibBadge>
        <LibBadge variant="dark">Badge</LibBadge>
        <LibBadge variant="error">Badge</LibBadge>
        <LibBadge variant="success">Badge</LibBadge>
        <LibBadge variant="warning">Badge</LibBadge>

    <h5>Dot</h5>
    <LibBadge variant="default" dot>Badge</LibBadge>

    </div>


  </section>
);