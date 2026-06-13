import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LibBackground, LibButton, LibGlassCard, LibInput } from '@shibui-ui/ui/react';
import { useAuth } from '../../core/hooks/useAuth';

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);

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

    return (
        <LibBackground variant="ash-grid">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}>
                <LibGlassCard
                    variant="warm"
                    intensity="high"
                    style={{
                        width: '100%',
                        maxWidth: '380px',
                        animation: shake ? 'shake 0.4s ease' : undefined,
                    } as React.CSSProperties}
                >
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                        style={{
                            padding: 'var(--lib-space-2xl)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--lib-space-xl)',
                        }}
                    >
                        {/* Marca */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lib-space-xs)' }}>
                            <span style={{
                                fontFamily: 'var(--lib-font-display)',
                                fontSize: 'var(--text-3xl)',
                                fontWeight: 'var(--weight-light)' as React.CSSProperties['fontWeight'],
                                color: 'color-mix(in oklch, var(--color-kaki-500), transparent 40%)',
                                lineHeight: 1,
                            }}>
                                渋
                            </span>
                            <span style={{
                                fontFamily: 'var(--lib-font-mono)',
                                fontSize: 'var(--text-xs)',
                                letterSpacing: 'var(--tracking-widest)',
                                textTransform: 'uppercase',
                                color: 'var(--text-muted)',
                            }}>
                                admin · acceso restringido
                            </span>
                        </div>

                        {/* Campo de contraseña — reemplaza <label> + <input> + error span */}
                        <LibInput
                            type="password"
                            label="Contraseña"
                            placeholder="••••••••••"
                            value={password}
                            error={error}
                            errorMessage="Contraseña incorrecta"
                            onUiLibInput={(e: CustomEvent) => {
                                setPassword(e.detail.value);
                                setError(false);
                            }}
                        />

                        <LibButton variant="solid" onUiLibClick={handleSubmit}>
                            Entrar
                        </LibButton>
                    </form>
                </LibGlassCard>
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
