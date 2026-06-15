import React from 'react';
import { LibBadge, LibDisplayHeading, LibEyebrow, LibTimeline, LibTimelineItem } from '@shibui-ui/ui/react';
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
            <div style={{ marginBottom: 'var(--lib-space-2xl)' }}>
                <LibEyebrow tone="accent" size="sm" style={{ display: 'inline-flex', marginBottom: 'var(--lib-space-md)' } as React.CSSProperties}>
                    Experiencia · Work History
                </LibEyebrow>
                <LibDisplayHeading
                    tag="h2"
                    size="sm"
                    surface="dark"
                    line1="Trayectoria"
                    accent="profesional"
                />
            </div>

            {/* Timeline */}
            <LibTimeline>
                {sorted.map((item) => (
                    <LibTimelineItem
                        key={item.id}
                        status={item.endDate === null ? 'current' : 'done'}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--lib-space-md)',
                                paddingBottom: 'var(--lib-space-2xl)',
                            }}
                        >
                            {/* Company + dates row */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: 'var(--lib-space-md)',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div>
                                    <p
                                        style={{
                                            fontFamily: 'var(--lib-font-mono)',
                                            fontSize: 'var(--text-xs)',
                                            letterSpacing: 'var(--lib-tracking-elegant)',
                                            textTransform: 'uppercase',
                                            color: 'color-mix(in oklch, var(--text-accent), transparent 45%)',
                                            margin: '0 0 0.2rem 0',
                                        }}
                                    >
                                        {item.company}
                                    </p>
                                    <h3
                                        style={{
                                            fontFamily: 'var(--lib-font-display)',
                                            fontSize: 'var(--text-xl)',
                                            fontWeight: 'var(--weight-regular)' as React.CSSProperties['fontWeight'],
                                            letterSpacing: 'var(--tracking-tight)',
                                            color: 'var(--text-primary)',
                                            margin: 0,
                                        }}
                                    >
                                        {item.role}
                                    </h3>
                                    <p
                                        style={{
                                            fontFamily: 'var(--lib-font-mono)',
                                            fontSize: 'var(--text-xs)',
                                            letterSpacing: 'var(--tracking-wide)',
                                            color: 'var(--text-muted)',
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
                                            fontSize: 'var(--text-xs)',
                                            letterSpacing: 'var(--tracking-wide)',
                                            color: 'var(--text-secondary)',
                                            margin: 0,
                                        }}
                                    >
                                        {formatDate(item.startDate)} — {item.endDate ? formatDate(item.endDate) : 'Actualidad'}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: 'var(--lib-font-mono)',
                                            fontSize: 'var(--text-xs)',
                                            letterSpacing: 'var(--tracking-normal)',
                                            color: 'var(--text-muted)',
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
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text-secondary)',
                                        lineHeight: 'var(--leading-relaxed)',
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
                                        <LibBadge key={tag} tone="strong">
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
