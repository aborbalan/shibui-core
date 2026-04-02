import React from 'react';
import { LibCounter, LibDivider } from '@shibui/ui/react';

interface StatItem {
  value:   number;
  suffix?: string;
  prefix?: string;
  /** Texto decorativo no numérico — ej: 'MIT'. Si se pasa, omite LibCounter */
  text?:   string;
  label:   string;
}

interface HeroStatsProps {
  stats?: StatItem[];
  style?: React.CSSProperties;
}

const DEFAULT_STATS: StatItem[] = [
  { value: 66, suffix: '+',  label: 'Componentes'        },
  { value: 0,               label: 'Dependencias'        },
  { value: 4,  suffix: '×', label: 'Variantes cada uno' },
  { text: 'MIT',            label: 'Licencia', value: 0  },
];

const EASE = 'cubic-bezier(0,0,0.2,1)';

export const HeroStats: React.FC<HeroStatsProps> = ({
  stats = DEFAULT_STATS,
  style,
}) => {
  return (
    <div style={{
      display:       'flex',
      alignItems:    'stretch',
      gap:           0,
      borderTop:     '1px solid rgba(255,255,255,0.06)',
      paddingTop:    '2.5rem',
      opacity:       0,
      animation:     `fadeUp 0.9s 0.6s ${EASE} forwards`,
      flexWrap:      'wrap',
      height:     '70px',
      ...style,
    }}>
      {stats.map((stat, i) => (
        <React.Fragment key={stat.label}>
          {/* Divider vertical entre stats */}
          {i > 0 && (
            <LibDivider
              orientation="vertical"
              style-variant="hairline"
              style={{
                height:    '100%',
                alignSelf: 'stretch',
                margin:    '0 2.5rem',
                opacity:   0.3,
              } as React.CSSProperties}
            />
          )}

          <div style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '0.25rem',
          }}>
            {/* Valor numérico o texto estático */}
            {stat.text ? (
              <span style={{
                fontFamily:    'var(--lib-font-display)',
                fontSize:      '2.8rem',
                fontWeight:    300,
                letterSpacing: '-0.02em',
                lineHeight:    1,
                color:         'rgba(250,247,244,0.65)',
              }}>
                {stat.text}
              </span>
            ) : (
              <LibCounter
                value={stat.value}
                suffix={stat.suffix ?? ''}
                prefix={stat.prefix ?? ''}
                thousands=""
                size="md"
                tone="on-dark"
                play-on-visible
                style={{
                  fontFamily:    'var(--lib-font-display)',
                  fontSize:      '2.8rem',
                  fontWeight:    300,
                  letterSpacing: '-0.02em',
                  lineHeight:    1,
                  color:         'rgba(250,247,244,0.65)',
                } as React.CSSProperties}
              />
            )}

            {/* Label */}
            <span style={{
              fontFamily:    'var(--lib-font-mono)',
              fontSize:      '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         'rgba(250,247,244,0.18)',
            }}>
              {stat.label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default HeroStats;