import { LibAccordionItem, LibAvatar, LibBadge, LibBurger, LibCheckbox, LibCloseButton } from '@shibui/ui/react';
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
    <h5>Pill</h5>
    <LibBadge variant="default" pill>Badge</LibBadge>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
    <h4>Burger (define Tests)</h4>
        <LibBurger variant="ink"></LibBurger>
        <LibBurger variant="kanji"> </LibBurger>
        <LibBurger variant="washi"></LibBurger>
        <LibBurger variant="framed"></LibBurger>
        <LibBurger variant="kintsugi"></LibBurger>
        <LibBurger variant="glitch"></LibBurger>

    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
    <h4>Checkbox (define Tests)</h4>
        <LibCheckbox variant="default"></LibCheckbox>
        <LibCheckbox variant="kaki"></LibCheckbox>
        <LibCheckbox variant="error"></LibCheckbox>
        <hr />
        <LibCheckbox variant="default" indeterminate="true"></LibCheckbox>
        <LibCheckbox variant="default" disabled="true"></LibCheckbox>
        <LibCheckbox variant="default" label="labeltry" sublabel="sublabeltry"></LibCheckbox>

    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
    <h4>Close Button (define Tests)</h4>
        <LibCloseButton></LibCloseButton>

    </div>


  </section>
);