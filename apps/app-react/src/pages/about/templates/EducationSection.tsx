import React from 'react';
import { LibBadge, LibEyebrow } from '@shibui-ui/ui/react';
import type {
    EducationDto,
    LanguageDto,
} from '../../../api/domain/about/api/about.api';

interface EducationSectionProps {
    education: EducationDto[];
    languages: LanguageDto[];
}

const LEVEL_VARIANT: Record<string, 'default' | 'accent' | 'celadon' | 'dark'> = {
    Nativo: 'accent',
    Profesional: 'celadon',
    Intermedio: 'default',
    Básico: 'dark',
};

export const EducationSection: React.FC<EducationSectionProps> = ({ education, languages }) => {
    const sortedEdu = [...education].sort((a, b) => a.order - b.order);
    const sortedLang = [...languages].sort((a, b) => a.order - b.order);

    return (
        <section
            style={{
                padding: 'clamp(2.5rem, 5vh, 4rem) 0',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'clamp(2rem, 5vw, 4rem)',
            }}
        >
            {/* ── Educación ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div>
                    <LibEyebrow color="dark" size="sm" style={{ display: 'inline-flex', marginBottom: '1rem' } as React.CSSProperties}>
                        Educación · Formation
                    </LibEyebrow>
                    <h2
                        style={{
                            fontFamily: 'var(--lib-font-display)',
                            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                            fontWeight: 300,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.15,
                            color: 'rgba(250,247,244,0.65)',
                            margin: 0,
                        }}
                    >
                        Base{' '}
                        <em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400, #D97234)' }}>
                            académica
                        </em>
                    </h2>
                </div>

                {/* Education list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {sortedEdu.map((edu) => (
                        <div
                            key={edu.id}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.35rem',
                                paddingLeft: '1rem',
                                borderLeft: '1px solid rgba(184,90,30,0.25)',
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: 'var(--lib-font-mono)',
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(184,90,30,0.5)',
                                    margin: 0,
                                }}
                            >
                                {edu.startYear} — {edu.endYear}
                            </p>
                            <h4
                                style={{
                                    fontFamily: 'var(--lib-font-display)',
                                    fontSize: '1.15rem',
                                    fontWeight: 400,
                                    color: 'rgba(250,247,244,0.7)',
                                    margin: 0,
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                {edu.degree}
                            </h4>
                            <p
                                style={{
                                    fontFamily: 'var(--lib-font-body)',
                                    fontSize: '0.82rem',
                                    color: 'rgba(250,247,244,0.35)',
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}
                            >
                                {edu.field}
                            </p>
                            <p
                                style={{
                                    fontFamily: 'var(--lib-font-mono)',
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.12em',
                                    color: 'rgba(250,247,244,0.18)',
                                    margin: 0,
                                }}
                            >
                                {edu.institution}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Idiomas ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div>
                    <LibEyebrow color="dark" size="sm" style={{ display: 'inline-flex', marginBottom: '1rem' } as React.CSSProperties}>
                        Idiomas · Languages
                    </LibEyebrow>
                    <h2
                        style={{
                            fontFamily: 'var(--lib-font-display)',
                            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                            fontWeight: 300,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.15,
                            color: 'rgba(250,247,244,0.65)',
                            margin: 0,
                        }}
                    >
                        Comunicación{' '}
                        <em style={{ fontStyle: 'italic', color: 'var(--color-kaki-400, #D97234)' }}>
                            global
                        </em>
                    </h2>
                </div>

                {/* Language list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {sortedLang.map((lang) => {
                        const badgeVariant = LEVEL_VARIANT[lang.level] ?? 'dark';
                        return (
                            <div
                                key={lang.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'var(--lib-font-display)',
                                        fontSize: '1.1rem',
                                        fontWeight: 300,
                                        color: 'rgba(250,247,244,0.6)',
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    {lang.name}
                                </span>
                                <LibBadge variant={badgeVariant}>
                                    {lang.level}
                                </LibBadge>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default EducationSection;