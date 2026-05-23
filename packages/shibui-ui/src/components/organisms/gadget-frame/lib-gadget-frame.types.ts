export type GadgetFrameVariant = 'glass' | 'card';

export interface GadgetFrameTemplateProps {
  gadgetTitle: string;
  icon:        string;
  minimizable: boolean;
  closable:    boolean;
  minimized:   boolean;
  variant:     GadgetFrameVariant;
  onMinimize:  () => void;
  onClose:     () => void;
}
