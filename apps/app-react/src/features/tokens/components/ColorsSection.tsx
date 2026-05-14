import React from 'react';
import { LibColorScale } from '@shibui-ui/ui/react';
import { TokenSection } from './_TokenSection';
import { TokenRow, SubHeader, LoadingText, ErrorText } from './_TokenRow';
import { useTokensByCategory } from '../../../data/api/domain/tokens/hooks/useTokens';
import type { DesignTokenDto } from '../../../data/api/domain/tokens/api/tokens.api';

const PALETTES = ['washi', 'kaki', 'celadon', 'ink'] as const;
type PaletteName = (typeof PALETTES)[number];

function getPalette(name: string): PaletteName | null {
  for (const p of PALETTES) {
    if (name.startsWith(`color-${p}`)) return p;
  }
  return null;
}

function groupByPalette(tokens: DesignTokenDto[]) {
  const groups: Record<PaletteName, DesignTokenDto[]> = { washi: [], kaki: [], celadon: [], ink: [] };
  tokens.forEach(t => {
    const p = getPalette(t.name);
    if (p) groups[p].push(t);
  });
  return groups;
}

const SEMANTIC_GROUPS = ['Marca', 'Alias componentes', 'Estados', 'Fondos', 'Texto', 'Bordes'] as const;

function getSemanticGroup(name: string): string {
  if (name.startsWith('lib-shibui-')) return 'Marca';
  if (name.startsWith('lib-color-')) return 'Alias componentes';
  if (name.startsWith('color-error') || name.startsWith('color-warning') ||
      name.startsWith('color-success') || name.startsWith('color-info') ||
      name === 'color-white') return 'Estados';
  if (name.startsWith('bg-')) return 'Fondos';
  if (name.startsWith('text-')) return 'Texto';
  if (name.startsWith('border-')) return 'Bordes';
  return 'Otros';
}

function groupSemantic(tokens: DesignTokenDto[]) {
  const groups: Record<string, DesignTokenDto[]> = {};
  SEMANTIC_GROUPS.forEach(g => { groups[g] = []; });
  tokens.forEach(t => {
    const g = getSemanticGroup(t.name);
    (groups[g] ??= []).push(t);
  });
  return groups;
}


const ColorsSection: React.FC = () => {
  const primitives = useTokensByCategory('color-primitive');
  const semantic = useTokensByCategory('color-semantic');

  const paletteGroups = primitives.data ? groupByPalette(primitives.data) : null;
  const semanticGroups = semantic.data ? groupSemantic(semantic.data) : null;

  return (
    <TokenSection
      id="colores"
      eyebrow="color-primitive · color-semantic"
      title={<>Paletas & <em>semántica</em></>}
      description="Primitivos OKLCH (washi, kaki, celadon, ink) y alias semánticos de fondo, texto y borde con soporte dark mode."
    >
      <SubHeader label="Color Primitive" first />
      {primitives.isPending && <LoadingText label="color-primitive" />}
      {primitives.isError && <ErrorText error={primitives.error} />}
      {paletteGroups && PALETTES.map(palette => (
        <div key={palette} style={{ marginBottom: '1.5rem' }}>
          <LibColorScale
            name={palette}
            steps={paletteGroups[palette].map(t => ({
              step: parseInt(t.name.split('-').pop() ?? '0'),
              hex: `var(${t.cssVar})`,
              oklch: t.value,
            }))}
          />
        </div>
      ))}

      <SubHeader label="Color Semantic" />
      {semantic.isPending && <LoadingText label="color-semantic" />}
      {semantic.isError && <ErrorText error={semantic.error} />}
      {semanticGroups && SEMANTIC_GROUPS.filter(g => semanticGroups[g]?.length > 0).map((group, i) => (
        <div key={group}>
          <div style={{
            fontFamily: 'var(--lib-font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            padding: '0.75rem 0 0.5rem',
            borderTop: i > 0 ? '1px solid color-mix(in oklch, var(--color-washi-700) 15%, transparent)' : 'none',
          }}>
            {group}
          </div>
          {semanticGroups[group].map(t => (
            <TokenRow
              key={t.id}
              token={t}
              preview={
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '2px',
                  background: `var(${t.cssVar})`,
                  border: '1px solid color-mix(in oklch, var(--color-washi-700) 25%, transparent)',
                  flexShrink: 0,
                }} />
              }
            />
          ))}
        </div>
      ))}
    </TokenSection>
  );
};

export default ColorsSection;
