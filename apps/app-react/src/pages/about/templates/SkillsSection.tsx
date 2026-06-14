import React from 'react';
import { LibBadge, LibDisplayHeading, LibEyebrow } from '@shibui-ui/ui/react';
import type { SkillGroupDto } from '../../../data/api/domain/about/api/about.api';

interface SkillsSectionProps {
    skillGroups: SkillGroupDto[];
}

/** Mapeo de categoría a variante de badge */
const CATEGORY_VARIANT: Record<string, 'default' | 'accent' | 'info' | 'strong' | 'warning'> = {
    frontend: 'accent',
    expanding: 'warning',
    backend: 'info',
    architecture: 'default',
    testing: 'strong',
};

/** Mapeo de categoría a kanji decorativo */
const CATEGORY_KANJI: Record<string, string> = {
    frontend: '前',
    expanding: '拡',
    backend: '後',
    architecture: '構',
    testing: '試',
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillGroups }) => {
    return (
        <section
            style={{
                padding: 'clamp(2.5rem, 5vh, 4rem) 0',
                borderTop: '1px solid var(--border-subtle)',
            }}
        >
            {/* Header */}
            <div style={{ marginBottom: 'var(--lib-space-2xl)' }}>
                <LibEyebrow tone="accent" size="sm" style={{ display: 'inline-flex', marginBottom: 'var(--lib-space-md)' } as React.CSSProperties}>
                    Skills · Stack técnico
                </LibEyebrow>
                <LibDisplayHeading
                    tag="h2"
                    size="sm"
                    surface="dark"
                    line1="Herramientas"
                    accent="del oficio"
                />
            </div>

            {/* Grid de grupos */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1px',
                    background: 'var(--border-subtle)',
                }}
            >
                {skillGroups.map((group) => {
                    const variant = CATEGORY_VARIANT[group.category] ?? 'strong';
                    const kanji = CATEGORY_KANJI[group.category] ?? '技';

                    return (
                        <div
                            key={group.category}
                            style={{
                                background: 'var(--color-washi-950)',
                                padding: 'var(--lib-space-lg) var(--lib-space-xl)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--lib-space-md)',
                            }}
                        >
                            {/* Category header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lib-space-md)' }}>
                                <span
                                    style={{
                                        fontFamily: 'var(--lib-font-display)',
                                        fontSize: 'var(--text-2xl)',
                                        fontWeight: 'var(--weight-light)' as React.CSSProperties['fontWeight'],
                                        color: 'color-mix(in oklch, var(--color-kaki-500), transparent 75%)',
                                        lineHeight: 1,
                                        flexShrink: 0,
                                    }}
                                >
                                    {kanji}
                                </span>
                                <span
                                    style={{
                                        fontFamily: 'var(--lib-font-mono)',
                                        fontSize: 'var(--text-xs)',
                                        letterSpacing: 'var(--lib-tracking-elegant)',
                                        textTransform: 'uppercase',
                                        color: 'color-mix(in oklch, var(--color-kaki-500), transparent 50%)',
                                    }}
                                >
                                    {group.label}
                                </span>
                            </div>

                            {/* Skill badges */}
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                {[...group.skills]
                                    .sort((a, b) => a.order - b.order)
                                    .map((skill) => (
                                        <LibBadge key={skill.id} tone={variant}>
                                            {skill.name}
                                        </LibBadge>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default SkillsSection;
