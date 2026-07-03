import React from 'react';
import { LibCodeBlock, LibEyebrow } from '@shibui-ui/ui/react';

const STEPS = [
  {
    step: '01',
    code: 'pnpm add @shibui-ui/ui',
    language: 'bash' as const,
    filename: '',
  },
  {
    step: '02',
    code: "import '@shibui-ui/ui';",
    language: 'ts' as const,
    filename: 'main.ts',
  },
  {
    step: '03',
    code: '<lib-button variant="accent">Empezar</lib-button>',
    language: 'html' as const,
    filename: '',
  },
];

export const InstallSection: React.FC = () => (
  <section style={{
    maxWidth: '720px',
    margin: '0 auto',
    padding: 'var(--lib-space-3xl) var(--lib-space-xl)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--lib-space-2xl)',
  }}>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-sm)' }}>
      <LibEyebrow surface="inverse" size="sm">
        INICIO RÁPIDO
      </LibEyebrow>
      <h2 style={{
        fontFamily: 'var(--lib-font-display)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 300,
        letterSpacing: 'var(--tracking-tight)',
        lineHeight: 'var(--leading-tight)',
        margin: 0,
        color: 'color-mix(in oklch, var(--color-washi-50), transparent 10%)',
      }}>
        De npm a componente{' '}
        <em style={{ fontStyle: 'normal', color: 'var(--color-kaki-400)' }}>
          en tres pasos
        </em>
      </h2>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-md)' }}>
      {STEPS.map(({ step, code, language, filename }) => (
        <div
          key={step}
          style={{
            display: 'grid',
            gridTemplateColumns: '2.5rem 1fr',
            gap: 'var(--lib-space-md)',
            alignItems: 'start',
          }}
        >
          <span style={{
            fontFamily: 'var(--lib-font-mono)',
            fontSize: '0.625rem',
            letterSpacing: 'var(--tracking-wider)',
            color: 'color-mix(in oklch, var(--color-washi-50), transparent 80%)',
            paddingTop: 'var(--lib-space-md)',
            textAlign: 'right',
          }}>
            {step}
          </span>
          <LibCodeBlock
            code={code}
            language={language}
            filename={filename}
            copyable
            variant="solid"
          />
        </div>
      ))}
    </div>

  </section>
);

export default InstallSection;
