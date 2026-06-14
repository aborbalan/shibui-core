import React from 'react';
import { LibAvatar, LibBadge, LibButton, LibDisplayHeading, LibEyebrow } from '@shibui-ui/ui/react';
import type { ProfileDto } from '../../../data/api/domain/about/api/about.api';

interface ProfileHeroProps {
    profile: ProfileDto;
    openToWork?: boolean;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ profile, openToWork = false }) => {
    return (
        <section
            style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 'clamp(2rem, 4vw, 4rem)',
                alignItems: 'start',
                padding: 'clamp(3rem, 6vh, 5rem) 0',
                borderBottom: '1px solid var(--border-subtle)',
            }}
        >
            {/* ── Avatar col ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--lib-space-md)' }}>
                <div style={{ position: 'relative' }}>
                    <LibAvatar
                        name={profile.name}
                        size="xl"
                        shape="squircle"
                        style={{ '--lib-avatar-size': '96px' } as React.CSSProperties}
                    />
                    {openToWork && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '-4px',
                                right: '-4px',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: 'var(--color-success)',
                                border: '2px solid var(--color-washi-950)',
                                boxShadow: '0 0 8px color-mix(in oklch, var(--color-success), transparent 40%)',
                            }}
                        />
                    )}
                </div>

                {/* Social links */}
                <div style={{ display: 'flex', gap: 'var(--lib-space-sm)' }}>
                    {profile.socials.map((social) => (
                        <LibButton
                            key={social.label}
                            variant="ghost"
                            size="sm"
                            style={{ padding: '0.35rem 0.65rem' } as React.CSSProperties}
                            onUiLibClick={() => window.open(social.url, '_blank')}
                        >
                            <span
                                style={{
                                    fontFamily: 'var(--lib-font-mono)',
                                    fontSize: 'var(--text-xs)',
                                    letterSpacing: 'var(--lib-tracking-elegant)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {social.label}
                            </span>
                        </LibButton>
                    ))}
                </div>
            </div>

            {/* ── Content col ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-lg)' }}>
                {/* Eyebrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lib-space-md)', flexWrap: 'wrap' }}>
                    <LibEyebrow tone="accent" size="sm" style={{ display: 'inline-flex' } as React.CSSProperties}>
                        Perfil · About Me
                    </LibEyebrow>
                    {openToWork && (
                        <LibBadge tone="success" dot>
                            Open to Work
                        </LibBadge>
                    )}
                </div>

                {/* Name + title — reemplaza <h1> y <p> manuales */}
                <LibDisplayHeading
                    tag="h1"
                    size="md"
                    surface="dark"
                    line1={profile.name}
                    accent={profile.title}
                />

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>⌖</span>
                    <span
                        style={{
                            fontFamily: 'var(--lib-font-mono)',
                            fontSize: 'var(--text-xs)',
                            letterSpacing: 'var(--lib-tracking-elegant)',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                        }}
                    >
                        {profile.location}
                    </span>
                </div>

                {/* Bio */}
                <p
                    style={{
                        fontFamily: 'var(--lib-font-body)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        lineHeight: 'var(--leading-relaxed)',
                        maxWidth: '600px',
                        margin: 0,
                    }}
                >
                    {profile.bio}
                </p>

                {/* Email */}
                <a
                    href={`mailto:${profile.email}`}
                    style={{
                        fontFamily: 'var(--lib-font-mono)',
                        fontSize: 'var(--text-xs)',
                        letterSpacing: 'var(--tracking-wide)',
                        color: 'var(--text-link)',
                        textDecoration: 'none',
                        alignSelf: 'flex-start',
                        borderBottom: '1px solid var(--border-default)',
                        paddingBottom: '1px',
                        transition: 'color var(--duration-base) var(--ease-default), border-color var(--duration-base) var(--ease-default)',
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = 'var(--text-link-hover)';
                        (e.target as HTMLElement).style.borderColor = 'var(--border-strong)';
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = 'var(--text-link)';
                        (e.target as HTMLElement).style.borderColor = 'var(--border-default)';
                    }}
                >
                    {profile.email}
                </a>
            </div>
        </section>
    );
};

export default ProfileHero;
