
export interface BaseStoryArgs {
  disabled?: boolean;
  className?: string;
}

export interface ButtonStoryArgs extends BaseStoryArgs {
  variant: string;
  size: string;
  label: string;
}