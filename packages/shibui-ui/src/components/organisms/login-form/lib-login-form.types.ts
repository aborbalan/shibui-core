export interface LoginSubmitDetail {
  email: string;
  password: string;
}

export interface LoginFormTemplateProps {
  email: string;
  password: string;
  loading: boolean;
  errorMessage: string;
  emailError: string;
  passwordError: string;
  onEmailInput: (e: Event) => void;
  onPasswordInput: (e: Event) => void;
  onSubmit: () => void;
}
