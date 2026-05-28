import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { LegacyButtonProps } from '../../../components/button';
import type { LegacyInputCodeItemProps } from '../../../components/input-code-item';
import type { LegacyThemeProps } from '../../../components/theme';

export type LegacyAuthenticationEmailConfirmationDevice = 'auto' | 'desktop' | 'mobile';
export type LegacyAuthenticationEmailConfirmationEmailMode = 'visible' | 'hidden';

export interface LegacyAuthenticationEmailConfirmationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  className?: string;
  codeInputProps?: Omit<LegacyInputCodeItemProps, 'className'>;
  dataId?: string;
  device?: LegacyAuthenticationEmailConfirmationDevice;
  email: ReactNode;
  emailMode?: LegacyAuthenticationEmailConfirmationEmailMode;
  hiddenEmail?: ReactNode;
  onChangeEmail?: () => void;
  resendButtonLabel?: ReactNode;
  resendButtonProps?: Omit<LegacyButtonProps, 'children' | 'type'>;
  safetyLabel?: ReactNode;
  themeProps?: Omit<LegacyThemeProps, 'className'>;
  title?: ReactNode;
}

declare const AuthenticationEmailConfirmation: {
  (props: LegacyAuthenticationEmailConfirmationProps): JSX.Element;
  devices: {
    auto: 'auto';
    desktop: 'desktop';
    mobile: 'mobile';
  };
  emailModes: {
    visible: 'visible';
    hidden: 'hidden';
  };
};

export default AuthenticationEmailConfirmation;
