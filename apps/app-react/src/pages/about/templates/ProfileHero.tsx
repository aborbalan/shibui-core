import React from 'react';
import { LibAvatar, LibBadge, LibButton, LibEyebrow } from '@shibui-ui/ui/react';
import type { ProfileDto } from '../../../api/domain/about/api/about.api';

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
                borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
        >
            {/* ── Avatar col ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
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
                                background: 'oklch(65% 0.18 145)',
                                border: '2px solid var(--color-washi-950, #120E0A)',
                                boxShadow: '0 0 8px oklch(65% 0.18 145 / 0.6)',
                            }}
                        />
                    )}
                </div>

                {/* Social links */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {profile.socials.map((social) => (
                        <LibButton
                            key={social.label}
                            variant="ghost"
                            size="sm"
                            style={{ padding: '0.35rem 0.65rem' } as React.CSSProperties}
                            onClick={() => window.open(social.url, '_blank')}
                        >
                            <span
                                style={{
                                    fontFamily: 'var(--lib-font-mono)',
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.16em',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Eyebrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <LibEyebrow color="dark" size="sm" style={{ display: 'inline-flex' } as React.CSSProperties}>
                        Perfil · About Me
                    </LibEyebrow>
                    {openToWork && (
                        <LibBadge variant="success" dot>
                            Open to Work
                        </LibBadge>
                    )}
                </div>

                {/* Name */}
                <div>
                    <h1
                        style={{
                            fontFamily: 'var(--lib-font-display, "Cormorant Garamond", serif)',
                            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                            fontWeight: 300,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.1,
                            color: 'rgba(250,247,244,0.85)',
                            margin: 0,
                        }}
                    >
                        {profile.name}
                    </h1>
                    <p
                        style={{
                            fontFamily: 'var(--lib-font-mono)',
                            fontSize: '0.72rem',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: 'rgba(184,90,30,0.6)',
                            margin: '0.5rem 0 0 0',
                        }}
                    >
                        {profile.title}
                    </p>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: 'rgba(250,247,244,0.2)', fontSize: '0.75rem' }}>⌖</span>
                    <span
                        style={{
                            fontFamily: 'var(--lib-font-mono)',
                            fontSize: '0.65rem',
                            letterSpacing: '0.14em',
                            color: 'rgba(250,247,244,0.25)',
                            textTransform: 'uppercase',
                        }}
                    >
                        {profile.location}
                    </span>
                </div>

                {/* Bio */}
                <p
                    style={{
                        fontFamily: 'var(--lib-font-body, "Shippori Mincho", serif)',
                        fontSize: 'clamp(0.875rem, 1.4vw, 1rem)',
                        color: 'rgba(250,247,244,0.45)',
                        lineHeight: 1.85,
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
                        fontSize: '0.72rem',
                        letterSpacing: '0.1em',
                        color: 'rgba(184,90,30,0.5)',
                        textDecoration: 'none',
                        alignSelf: 'flex-start',
                        borderBottom: '1px solid rgba(184,90,30,0.2)',
                        paddingBottom: '1px',
                        transition: 'color 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = 'rgba(184,90,30,0.9)';
                        (e.target as HTMLElement).style.borderColor = 'rgba(184,90,30,0.6)';
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = 'rgba(184,90,30,0.5)';
                        (e.target as HTMLElement).style.borderColor = 'rgba(184,90,30,0.2)';
                    }}
                >
                    {profile.email}
                </a>
            </div>
        </section>
    );
};

export default ProfileHero;