import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseAdminShortcutOptions {
  /** Tecla principal. Default: 'a' */
  key?: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export function useAdminShortcut({
  key   = 'a',
  ctrl  = true,
  shift = true,
  alt   = false,
}: UseAdminShortcutOptions = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignoramos si el foco está en un input/textarea para no interferir
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const match =
        e.key.toLowerCase() === key.toLowerCase() &&
        e.ctrlKey  === ctrl  &&
        e.shiftKey === shift &&
        e.altKey   === alt;

      if (match) {
        e.preventDefault();
        navigate('/admin/login');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, ctrl, shift, alt, navigate]);
}