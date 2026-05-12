import React from 'react';
import { LibBadge, LibEyebrow, LibTimeline, LibTimelineItem } from '@shibui-ui/ui/react';
import type { WorkExperienceDto } from '../../../data/api/domain/about/api/about.api';

interface ExperienceSectionProps {
    experience: WorkExperienceDto[];
}

/** "2021-11" → "nov. 2021" */
function formatDate(ym: string): string {
    const [year, month] = ym.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
}

function formatDuration(startDate: string, endDate: string | null): string {
    const start = new Date(startDate.replace('-', '/') + '/01');
    const end = endDate ? new Date(endDate.replace('-', '/') + '/01') : new Date();
    const months =
        (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const rem = months % 12;
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} año${years > 1 ? 's' : ''}`);
    if (rem > 0) parts.push(`${rem} mes${rem > 1 ? 'es' : ''}`);
    return parts.join(' ');
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
    const sorted = [...experience].sort((a, b) => a.order - b.order);

    return (
        <section style={{ padding: 'clamp(2.5rem, 5vh, 4rem) 0' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <LibEyebrow color="dark" size="sm" style={{ display: 'inline-flex', marginBottom: '1rem' } as React.CSSProperties}>
                    Experiencia · Work History
                </LibEyebrow>
                <h2
                    style={{
                        fontFamily: 'var(--lib-font-display, "Cormorant Garamond", serif)',
                        fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                        fontWeight: 300,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        color: 'rgba(250,247,244,0.65)',
                        margin: 0,
                    }}
                >
                    Trayectoria{' '}
                    <em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400, #D97234)' }}>
                        profesional
                    </em>
                </h2>
            </div>

            {/* Timeline */}
            <LibTimeline>
                {sorted.map((item) => (
                    <LibTimelineItem
                        key={item.id}
                        status={item.endDate === null ? 'current' : 'done'}
                    >
                        {/* Contenido del item */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                paddingBottom: '2rem',
                            }}
                        >
                            {/* Company + dates row */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: '1rem',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div>
                                    <p
                                        style={{
                                            fontFamily: 'var(--lib-font-mono)',
                                            fontSize: '0.6rem',
                                            letterSpacing: '0.22em',
                                            textTransform: 'uppercase',
                                            color: 'rgba(184,90,30,0.55)',
                                            margin: '0 0 0.2rem 0',
                                        }}
                                    >
                                        {item.company}
                                    </p>
                                    <h3
                                        style={{
                                            fontFamily: 'var(--lib-font-display)',
                                            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                                            fontWeight: 400,
                                            letterSpacing: '-0.01em',
                                            color: 'rgba(250,247,244,0.75)',
                                            margin: 0,
                                        }}
                                    >
                                        {item.role}
                                    </h3>
                                    <p
                                        style={{
                                            fontFamily: 'var(--lib-font-mono)',
                                            fontSize: '0.6rem',
                                            letterSpacing: '0.12em',
                                            color: 'rgba(250,247,244,0.2)',
                                            margin: '0.25rem 0 0 0',
                                        }}
                                    >
                                        ⌖ {item.location}
                                    </p>
                                </div>

                                {/* Date range */}
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p
                                        style={{
                                            fontFamily: 'var(--lib-font-mono)',
                                            fontSize: '0.65rem',
                                            letterSpacing: '0.1em',
                                            color: 'rgba(250,247,244,0.3)',
                                            margin: 0,
                                        }}
                                    >
                                        {formatDate(item.startDate)} — {item.endDate ? formatDate(item.endDate) : 'Actualidad'}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: 'var(--lib-font-mono)',
                                            fontSize: '0.6rem',
                                            letterSpacing: '0.08em',
                                            color: 'rgba(250,247,244,0.15)',
                                            margin: '0.2rem 0 0 0',
                                        }}
                                    >
                                        {formatDuration(item.startDate, item.endDate)}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            {item.description && (
                                <p
                                    style={{
                                        fontFamily: 'var(--lib-font-body)',
                                        fontSize: '0.875rem',
                                        color: 'rgba(250,247,244,0.35)',
                                        lineHeight: 1.8,
                                        margin: 0,
                                        maxWidth: '560px',
                                    }}
                                >
                                    {item.description}
                                </p>
                            )}

                            {/* Tech tags */}
                            {item.tags.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    {item.tags.map((tag) => (
                                        <LibBadge key={tag} variant="dark">
                                            {tag}
                                        </LibBadge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </LibTimelineItem>
                ))}
            </LibTimeline>
        </section>
    );
};

export default ExperienceSection;