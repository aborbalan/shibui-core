import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LibBackground, LibButton } from '@shibui-ui/ui/react';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);

    // Redirige a donde intentaba ir, o al dashboard por defecto
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/admin';

    const handleSubmit = () => {
        const ok = login(password);
        if (ok) {
            navigate(from, { replace: true });
        } else {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <LibBackground variant="ash-grid">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}>
                <div
                    style={{
                        width: '100%',
                        maxWidth: '380px',
                        padding: '2.5rem',
                        background: 'rgba(18, 14, 10, 0.85)',
                        border: `1px solid ${error ? 'rgba(220, 60, 60, 0.4)' : 'rgba(255,255,255,0.07)'}`,
                        backdropFilter: 'blur(12px)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.75rem',
                        animation: shake ? 'shake 0.4s ease' : undefined,
                    }}
                >
                    {/* Marca */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{
                            fontFamily: 'var(--lib-font-display, "Cormorant Garamond", serif)',
                            fontSize: '2rem',
                            fontWeight: 300,
                            color: 'rgba(184, 90, 30, 0.6)',
                            lineHeight: 1,
                        }}>
                            渋
                        </span>
                        <span style={{
                            fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                            fontSize: '0.6rem',
                            letterSpacing: '0.24em',
                            textTransform: 'uppercase',
                            color: 'rgba(250,247,244,0.2)',
                        }}>
                            admin · acceso restringido
                        </span>
                    </div>

                    {/* Campo de contraseña */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{
                            fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                            fontSize: '0.6rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(250,247,244,0.25)',
                        }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(false); }}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: `1px solid ${error ? 'rgba(220,60,60,0.5)' : 'rgba(255,255,255,0.08)'}`,
                                color: 'rgba(250,247,244,0.75)',
                                padding: '0.625rem 0.875rem',
                                fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                                fontSize: '0.875rem',
                                letterSpacing: '0.08em',
                                outline: 'none',
                                width: '100%',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s',
                            }}
                            placeholder="••••••••••"
                        />
                        {error && (
                            <span style={{
                                fontFamily: 'var(--lib-font-mono)',
                                fontSize: '0.6rem',
                                letterSpacing: '0.14em',
                                color: 'rgba(220,60,60,0.7)',
                                textTransform: 'uppercase',
                            }}>
                                Contraseña incorrecta
                            </span>
                        )}
                    </div>

                    <LibButton variant="primary" onUiLibClick={handleSubmit}>
                        Entrar
                    </LibButton>
                </div>
            </div>

            {/* Keyframe de shake local */}
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
      `}</style>
        </LibBackground>
    );
}