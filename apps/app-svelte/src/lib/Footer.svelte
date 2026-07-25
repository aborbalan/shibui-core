<script lang="ts">
  import { libProps } from './lib-props';

  /** Barra inferior compacta, simétrica al header fijo. */
  const LEGAL_LINKS = [
    { label: 'mit.md',  href: 'https://opensource.org/license/mit' },
    { label: 'github',  href: 'https://github.com/aborbalan' },
  ];
</script>

<lib-footer
  theme="sabi"
  compact
  brand-name="shibui"
  brand-kanji="寂"
  brand-sub="Design System · Zaragoza"
  location="Zaragoza"
  version="1.0.0"
  use:libProps={{ legalLinks: LEGAL_LINKS }}
></lib-footer>
