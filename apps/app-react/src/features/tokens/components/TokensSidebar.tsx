import React, { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'colores',     label: 'Color',      tag: 'color-primitive · color-semantic' },
  { id: 'tipografia',  label: 'Tipografía', tag: 'typography' },
  { id: 'espaciado',   label: 'Espaciado',  tag: 'spacing' },
  { id: 'radio',       label: 'Radio',      tag: 'radius' },
  { id: 'sombras',     label: 'Sombras',    tag: 'shadow' },
  { id: 'motion',      label: 'Motion',     tag: 'animation' },
  { id: 'z-index',     label: 'Z-Index',    tag: 'z-index' },
  { id: 'glass',       label: 'Glass',      tag: 'glass' },
  { id: 'spotlight',   label: 'Spotlight',  tag: 'spotlight' },
] as const;

export const TokensSidebar: React.FC = () => {
  const [active, setActive] = useState<string>('colores');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
  };

  return (
    <nav
      style={{
        width: '200px',
        flexShrink: 0,
        borderRight: '1px solid var(--border-subtle, var(--color-washi-800))',
        padding: '1.5rem 0',
        position: 'sticky',
        top: '56px',
        height: 'calc(100vh - 56px)',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '0 1rem 1rem' }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--lib-font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '0.75rem',
          }}
        >
          Categorías
        </span>

        {SECTIONS.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.3rem 0.4rem',
                background: 'transparent',
                border: 'none',
                borderLeft: `2px solid ${isActive ? 'var(--text-accent)' : 'transparent'}`,
                cursor: 'pointer',
                fontFamily: 'var(--lib-font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                textAlign: 'left',
                transition: 'all var(--duration-base)',
                backgroundColor: isActive
                  ? 'color-mix(in oklch, var(--text-accent) 6%, transparent)'
                  : 'transparent',
              }}
            >
              <span
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: isActive ? 'var(--text-accent)' : 'var(--border-default)',
                  transition: 'background var(--duration-base)',
                }}
              />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TokensSidebar;
