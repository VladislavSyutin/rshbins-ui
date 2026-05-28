import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { LegacyButtonProps } from '../../../components/button';
import type { LegacyCheckboxProps } from '../../../components/checkbox';
import type { LegacyInputLoginProps } from '../../../components/input-login';
import type { LegacyInputPasswordProps } from '../../../components/input-password';
import type { LegacyInputPhoneProps } from '../../../components/input-phone';
import type { LegacyThemeProps } from '../../../components/theme';

export type LegacyAuthenticationClientType = 'individual' | 'corporate';
export type LegacyAuthenticationFirstScreenDevice = 'auto' | 'desktop' | 'mobile';

export interface LegacyIndividualSubmitPayload {
  consentAccepted: boolean;
  phone: string;
}

export interface LegacyCorporateSubmitPayload {
  login: string;
  password: string;
}

export interface LegacyAuthenticationFirstScreenProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit'> {
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  className?: string;
  clientType?: LegacyAuthenticationClientType;
  consentCheckboxProps?: Omit<LegacyCheckboxProps, 'checked' | 'label' | 'onChange' | 'size'>;
  consentLabel?: ReactNode;
  corporateClientLabel?: ReactNode;
  corporateClientShortLabel?: ReactNode;
  dataId?: string;
  defaultClientType?: LegacyAuthenticationClientType;
  defaultConsentAccepted?: boolean;
  defaultLogin?: string;
  defaultPassword?: string;
  defaultPhone?: string;
  device?: LegacyAuthenticationFirstScreenDevice;
  forgotCredentialsLabel?: ReactNode;
  gosuslugiButtonLabel?: ReactNode;
  heading?: ReactNode;
  individualClientLabel?: ReactNode;
  individualClientShortLabel?: ReactNode;
  loginButtonLabel?: ReactNode;
  loginButtonProps?: Omit<LegacyButtonProps, 'children' | 'type'>;
  loginInputProps?: Omit<LegacyInputLoginProps, 'label' | 'onValueChange' | 'value'>;
  loginLabel?: ReactNode;
  onClientTypeChange?: (clientType: LegacyAuthenticationClientType) => void;
  onCorporateSubmit?: (payload: LegacyCorporateSubmitPayload) => void;
  onForgotCredentials?: () => void;
  onGosuslugiLogin?: () => void;
  onIndividualSubmit?: (payload: LegacyIndividualSubmitPayload) => void;
  onPersonalDataClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onRegister?: () => void;
  passwordInputProps?: Omit<LegacyInputPasswordProps, 'label' | 'onValueChange' | 'value'>;
  passwordLabel?: ReactNode;
  phoneInputProps?: Omit<LegacyInputPhoneProps, 'label' | 'onValueChange' | 'value'>;
  phoneLabel?: ReactNode;
  registerButtonLabel?: ReactNode;
  themeProps?: Omit<LegacyThemeProps, 'className'>;
}

declare const AuthenticationFirstScreen: {
  (props: LegacyAuthenticationFirstScreenProps): JSX.Element;
  clientTypes: {
    individual: 'individual';
    corporate: 'corporate';
  };
  devices: {
    auto: 'auto';
    desktop: 'desktop';
    mobile: 'mobile';
  };
};

export default AuthenticationFirstScreen;
