import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { LegacyButtonProps } from '../../../components/button';
import type { LegacyInputLoginProps } from '../../../components/input-login';
import type { LegacyInputPasswordProps } from '../../../components/input-password';
import type { LegacyThemeProps } from '../../../components/theme';

export type LegacyAuthenticationCreatingLoginPasswordDevice =
  | 'auto'
  | 'desktop'
  | 'mobile';
export type LegacyAuthenticationCreatingLoginPasswordMode =
  | 'login'
  | 'password'
  | 'login-and-password';

export interface LegacyAuthenticationCreatingLoginPasswordSubmitPayload {
  login?: string;
  password?: string;
  repeatedPassword?: string;
}

export interface LegacyAuthenticationCreatingLoginPasswordProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit' | 'title'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  className?: string;
  dataId?: string;
  defaultLogin?: string;
  defaultPassword?: string;
  defaultRepeatedPassword?: string;
  device?: LegacyAuthenticationCreatingLoginPasswordDevice;
  loginHint?: ReactNode;
  loginInputProps?: Omit<LegacyInputLoginProps, 'label' | 'onValueChange' | 'value'>;
  loginLabel?: ReactNode;
  mode?: LegacyAuthenticationCreatingLoginPasswordMode;
  onSubmit?: (payload: LegacyAuthenticationCreatingLoginPasswordSubmitPayload) => void;
  passwordInputProps?: Omit<LegacyInputPasswordProps, 'label' | 'onValueChange' | 'value'>;
  passwordLabel?: ReactNode;
  repeatedPasswordInputProps?: Omit<
    LegacyInputPasswordProps,
    'label' | 'onValueChange' | 'value'
  >;
  repeatedPasswordLabel?: ReactNode;
  saveButtonProps?: Omit<LegacyButtonProps, 'children' | 'type'>;
  saveButtonLabel?: ReactNode;
  themeProps?: Omit<LegacyThemeProps, 'className'>;
  title?: ReactNode;
}

declare const AuthenticationCreatingLoginPassword: {
  (props: LegacyAuthenticationCreatingLoginPasswordProps): JSX.Element;
  devices: {
    auto: 'auto';
    desktop: 'desktop';
    mobile: 'mobile';
  };
  modes: {
    login: 'login';
    password: 'password';
    loginAndPassword: 'login-and-password';
  };
};

export default AuthenticationCreatingLoginPassword;
