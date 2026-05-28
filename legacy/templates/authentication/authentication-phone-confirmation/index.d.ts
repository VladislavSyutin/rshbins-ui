import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { LegacyButtonProps } from '../../../components/button';
import type { LegacyInputCodeItemProps } from '../../../components/input-code-item';
import type { LegacyThemeProps } from '../../../components/theme';

export type LegacyAuthenticationPhoneConfirmationDevice =
  | 'auto'
  | 'desktop'
  | 'mobile';
export type LegacyAuthenticationPhoneConfirmationPhoneMode = 'visible' | 'hidden';

export interface LegacyAuthenticationPhoneConfirmationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  className?: string;
  codeInputProps?: Omit<LegacyInputCodeItemProps, 'className'>;
  dataId?: string;
  device?: LegacyAuthenticationPhoneConfirmationDevice;
  emailButtonLabel?: ReactNode;
  emailButtonProps?: Omit<LegacyButtonProps, 'children' | 'type'>;
  hiddenPhoneNumber?: ReactNode;
  onChangePhone?: () => void;
  onRequestEmailCode?: () => void;
  phoneMode?: LegacyAuthenticationPhoneConfirmationPhoneMode;
  phoneNumber: ReactNode;
  resendButtonLabel?: ReactNode;
  resendButtonProps?: Omit<LegacyButtonProps, 'children' | 'type'>;
  safetyLabel?: ReactNode;
  showEmailButton?: boolean;
  themeProps?: Omit<LegacyThemeProps, 'className'>;
  title?: ReactNode;
}

declare const AuthenticationPhoneConfirmation: {
  (props: LegacyAuthenticationPhoneConfirmationProps): JSX.Element;
  devices: {
    auto: 'auto';
    desktop: 'desktop';
    mobile: 'mobile';
  };
  phoneModes: {
    visible: 'visible';
    hidden: 'hidden';
  };
};

export default AuthenticationPhoneConfirmation;
