import React from 'react';
import { TokenSection } from './_TokenSection';
import { TokenRow, SubHeader, LoadingText, ErrorText } from './_TokenRow';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';

const TypographySection: React.FC = () => {
  const { isPending, isError, error, data } = useTokensByCategory('typography');

  const fontFamilies = data?.filter(t => t.name.startsWith('lib-font-') && !t.name.includes('family-base') && !t.name.includes('size-base')) ?? [];
  const fontSizes    = data?.filter(t => t.name.startsWith('text-')) ?? [];
  const weights      = data?.filter(t => t.name.startsWith('weight-')) ?? [];
  const leading      = data?.filter(t => t.name.startsWith('leading-')) ?? [];
  const tracking     = data?.filter(t => t.name.startsWith('tracking-')) ?? [];
  const libTokens    = data?.filter(t => t.name.startsWith('lib-') && !t.name.startsWith('lib-font-')) ?? [];

  return (
    <TokenSection
      id="tipografia"
      eyebrow="typography"
      title={<>Escala <em>tipográfica</em></>}
      description="Familias (display, body, mono), escala de tamaños, pesos, tracking y leading."
    >
      {isPending && <LoadingText />}
      {isError && <ErrorText error={error} />}

      {data && (
        <>
          <SubHeader label="Familias tipográficas" first />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '0.5rem' }}>
            {fontFamilies.map(t => (
              <div
                key={t.id}
                style={{
                  padding: '1.25rem',
                  border: '1px solid color-mix(in oklch, var(--color-washi-700) 30%, transparent)',
                  borderRadius: '2px',
                  background: 'color-mix(in oklch, var(--color-washi-900) 40%, transparent)',
                }}
              >
                <div style={{ fontFamily: t.value, fontSize: '1.4rem', fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '0.5rem' }}>
                  El zorro ágil
                </div>
                <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.6rem', color: 'var(--text-accent)' }}>
                  {t.cssVar}
                </code>
                <div style={{ fontFamily: 'var(--lib-font-body)', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {t.description}
                </div>
              </div>
            ))}
          </div>

          <SubHeader label="Escala de tamaños" />
          {fontSizes.map(t => (
            <div
              key={t.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '130px 80px 1fr',
                gap: '1rem',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid color-mix(in oklch, var(--color-washi-700) 20%, transparent)',
              }}
            >
              <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.68rem', color: 'var(--text-accent)' }}>
                {t.cssVar}
              </code>
              <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                {t.value}
              </code>
              <span style={{ fontFamily: 'var(--lib-font-display)', fontSize: t.value, fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1, overflow: 'hidden', maxHeight: '2.5em' }}>
                Texto
              </span>
            </div>
          ))}

          <SubHeader label="Pesos tipográficos" />
          {weights.map(t => (
            <div
              key={t.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 60px 1fr',
                gap: '1rem',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid color-mix(in oklch, var(--color-washi-700) 20%, transparent)',
              }}
            >
              <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.68rem', color: 'var(--text-accent)' }}>
                {t.cssVar}
              </code>
              <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                {t.value}
              </code>
              <span style={{ fontFamily: 'var(--lib-font-body)', fontSize: '1rem', fontWeight: Number(t.value), color: 'var(--text-primary)', lineHeight: 1 }}>
                El zorro ágil salta sobre el muro
              </span>
            </div>
          ))}

          <SubHeader label="Interlineado (leading)" />
          {leading.map(t => (
            <div
              key={t.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 60px 1fr',
                gap: '1rem',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid color-mix(in oklch, var(--color-washi-700) 20%, transparent)',
              }}
            >
              <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.68rem', color: 'var(--text-accent)' }}>
                {t.cssVar}
              </code>
              <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                {t.value}
              </code>
              <div style={{ fontFamily: 'var(--lib-font-body)', fontSize: '0.75rem', lineHeight: t.value, color: 'var(--text-secondary)', maxWidth: '320px' }}>
                {t.description}. Texto de muestra para visualizar el interlineado aplicado a un párrafo corto.
              </div>
            </div>
          ))}

          <SubHeader label="Espaciado de letras (tracking)" />
          {tracking.map(t => (
            <div
              key={t.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 80px 1fr',
                gap: '1rem',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid color-mix(in oklch, var(--color-washi-700) 20%, transparent)',
              }}
            >
              <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.68rem', color: 'var(--text-accent)' }}>
                {t.cssVar}
              </code>
              <code style={{ fontFamily: 'var(--lib-font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                {t.value}
              </code>
              <span style={{ fontFamily: 'var(--lib-font-body)', fontSize: '0.85rem', letterSpacing: t.value, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                SHIBUI
              </span>
            </div>
          ))}

          <SubHeader label="Tokens de componentes (lib)" />
          {libTokens.map(t => <TokenRow key={t.id} token={t} />)}
        </>
      )}
    </TokenSection>
  );
};

export default TypographySection;
