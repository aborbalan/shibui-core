/** Estética/skin del marco (eje `theme`). `default` = superficie card. */
export type GadgetFrameTheme = 'default' | 'glass';

export interface GadgetFrameTemplateProps {
  gadgetTitle: string;
  icon:        string;
  minimizable: boolean;
  closable:    boolean;
  minimized:   boolean;
  theme:       GadgetFrameTheme;
  onMinimize:  () => void;
  onClose:     () => void;
}
