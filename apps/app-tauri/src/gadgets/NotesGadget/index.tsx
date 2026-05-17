import { useState, useEffect, useRef } from 'react';
import { GadgetFrame } from '../GadgetFrame';

const NOTES_KEY = 'shibui-notes';

export function NotesGadget() {
  const [text, setText] = useState(() => localStorage.getItem(NOTES_KEY) ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem(NOTES_KEY, value);
    }, 500);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <GadgetFrame title="Notas" icon="note-pencil">
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Escribe aquí..."
        style={{
          width: '100%',
          height: '100%',
          minHeight: '120px',
          resize: 'none',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'rgba(250,247,244,0.75)',
          fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
          fontSize: '0.8rem',
          lineHeight: 1.7,
          letterSpacing: '0.02em',
          boxSizing: 'border-box',
        }}
      />
    </GadgetFrame>
  );
}
