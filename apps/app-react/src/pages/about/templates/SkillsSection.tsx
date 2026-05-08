import React from 'react';
import { LibBadge, LibEyebrow } from '@shibui-ui/ui/react';
import type { SkillGroupDto } from '../../../api/domain/about/api/about.api';

interface SkillsSectionProps {
    skillGroups: SkillGroupDto[];
}

/** Mapeo de categoría a variante de badge */
const CATEGORY_VARIANT: Record<string, 'default' | 'accent' | 'celadon' | 'dark' | 'warning'> = {
    frontend: 'accent',
    expanding: 'warning',
    backend: 'celadon',
    architecture: 'default',
    testing: 'dark',
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
                borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
        >
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <LibEyebrow color="dark" size="sm" style={{ display: 'inline-flex', marginBottom: '1rem' } as React.CSSProperties}>
                    Skills · Stack técnico
                </LibEyebrow>
                <h2
                    style={{
                        fontFamily: 'var(--lib-font-display)',
                        fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                        fontWeight: 300,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        color: 'rgba(250,247,244,0.65)',
                        margin: 0,
                    }}
                >
                    Herramientas{' '}
                    <em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400, #D97234)' }}>
                        del oficio
                    </em>
                </h2>
            </div>

            {/* Grid de grupos */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1px',
                    background: 'rgba(255,255,255,0.04)',
                }}
            >
                {skillGroups.map((group) => {
                    const variant = CATEGORY_VARIANT[group.category] ?? 'dark';
                    const kanji = CATEGORY_KANJI[group.category] ?? '技';

                    return (
                        <div
                            key={group.category}
                            style={{
                                background: 'var(--color-washi-950, #120E0A)',
                                padding: '1.5rem 1.75rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                            }}
                        >
                            {/* Category header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span
                                    style={{
                                        fontFamily: 'var(--lib-font-display)',
                                        fontSize: '1.8rem',
                                        fontWeight: 300,
                                        color: 'rgba(184,90,30,0.25)',
                                        lineHeight: 1,
                                        flexShrink: 0,
                                    }}
                                >
                                    {kanji}
                                </span>
                                <span
                                    style={{
                                        fontFamily: 'var(--lib-font-mono)',
                                        fontSize: '0.6rem',
                                        letterSpacing: '0.22em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(184,90,30,0.5)',
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
                                        <LibBadge key={skill.id} variant={variant}>
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