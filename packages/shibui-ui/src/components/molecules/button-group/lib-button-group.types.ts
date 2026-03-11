export type ButtonGroupShape       = 'flat' | 'rounded' | 'pill';
export type ButtonGroupOrientation = 'horizontal' | 'vertical';

export interface SplitMenuItem {
  label:    string;
  value:    string;
  disabled?: boolean;
}