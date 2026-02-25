// Importaciones existentes de Phosphor
import heart from '@phosphor-icons/core/assets/regular/heart.svg?raw';
import userCircle from '@phosphor-icons/core/assets/regular/user-circle.svg?raw';
import check from '@phosphor-icons/core/assets/regular/check.svg?raw';
import trash from '@phosphor-icons/core/assets/regular/trash.svg?raw';
import gear from '@phosphor-icons/core/assets/regular/gear.svg?raw';
import caretDown from '@phosphor-icons/core/assets/regular/caret-down.svg?raw';
import caretUp from '@phosphor-icons/core/assets/regular/caret-up.svg?raw';
import x from '@phosphor-icons/core/assets/regular/x.svg?raw';
import magnifyingGlass from '@phosphor-icons/core/assets/regular/magnifying-glass.svg?raw';
import info from '@phosphor-icons/core/assets/regular/info.svg?raw';
import warning from '@phosphor-icons/core/assets/regular/warning.svg?raw';
import plus from '@phosphor-icons/core/assets/regular/plus.svg?raw';
import eye from '@phosphor-icons/core/assets/regular/eye.svg?raw';
import eyeSlash from '@phosphor-icons/core/assets/regular/eye-slash.svg?raw';
import caretRight from '@phosphor-icons/core/assets/regular/caret-right.svg?raw';

import minus from '@phosphor-icons/core/assets/regular/minus.svg?raw'; // Asegúrate de que esta línea exista

export const ICON_REGISTRY: Record<string, string> = {
  // --- Iconos con Alias (Soportan ambos nombres) ---
  'heart': heart,
  'heart-fill': heart,
  'x': x,
  'close': x,
  'minus': minus,
  'dash': minus,
  'chevron-down': caretDown,
  'caret-down': caretDown,
  'chevron-up': caretUp,
  'caret-up': caretUp,
  'search': magnifyingGlass,
  'magnifying-glass': magnifyingGlass,
  'caret-right':caretRight,

  // --- Iconos Estándar ---
  'user-circle': userCircle,
  'check': check,
  'trash': trash,
  'gear': gear,
  'info': info,
  'warning': warning,
  'plus': plus,
  'eye': eye,
  'eye-slash': eyeSlash,
};