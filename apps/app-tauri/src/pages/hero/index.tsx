import { LibBackground } from '@shibui-ui/ui/react';
import { invoke } from '@tauri-apps/api/core';
import { useState } from 'react';

export function HomePage() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  async function greet() {
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <div style={{ paddingTop: '90px', minHeight: '100vh' }}>
      <LibBackground variant="kaki-glow">
        <main style={{ padding: '4rem 3rem', maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: 'var(--lib-font-display, "Cormorant Garamond", serif)',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 300,
            color: 'rgba(250,247,244,0.9)',
            lineHeight: 1,
            marginBottom: '2rem',
          }}>
            渋い
          </h1>
          <p style={{
            fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(250,247,244,0.3)',
            marginBottom: '3rem',
          }}>
            Shibui · Design System · Desktop App
          </p>

          <form
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
            onSubmit={(e) => { e.preventDefault(); greet(); }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Tu nombre…"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(250,247,244,0.8)',
                padding: '0.5rem 0.875rem',
                fontFamily: 'var(--lib-font-mono)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'rgba(184,90,30,0.2)',
                border: '1px solid rgba(184,90,30,0.4)',
                color: 'rgba(250,247,244,0.8)',
                padding: '0.5rem 1.25rem',
                fontFamily: 'var(--lib-font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              Saludar →
            </button>
          </form>

          {greetMsg && (
            <p style={{
              marginTop: '1.5rem',
              fontFamily: 'var(--lib-font-mono)',
              fontSize: '0.875rem',
              color: 'rgba(184,90,30,0.8)',
            }}>
              {greetMsg}
            </p>
          )}
        </main>
      </LibBackground>
    </div>
  );
}
