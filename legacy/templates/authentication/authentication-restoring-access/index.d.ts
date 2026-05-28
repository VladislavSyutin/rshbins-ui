import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactNode
} from 'react';
import type { LegacyButtonProps } from '../../../components/button';
import type { LegacyCheckboxProps } from '../../../components/checkbox';
import type { LegacyInputEmailProps } from '../../../components/input-email';
import type { LegacyInputInnProps } from '../../../components/input-inn';
import type { LegacyInputLoginProps } from '../../../components/input-login';
import type { LegacyInputPhoneProps } from '../../../components/input-phone';
import type { LegacyThemeProps } from '../../../components/theme';

export type LegacyAuthenticationRestoringAccessDevice =
  | 'auto'
  | 'desktop'
  | 'mobile';
export type LegacyAuthenticationRestoringAccessMethod = 'email' | 'phone';
export type LegacyAuthenticationRestoringAccessFlow = 'password' | 'login';

export interface LegacyAuthenticationRestoringPasswordSubmitPayload {
  login: string;
}

export interface LegacyAuthenticationRestoringLoginSubmitPayload {
  consentAccepted: boolean;
  inn: string;
  method: LegacyAuthenticationRestoringAccessMethod;
  value: string;
}

export interface LegacyAuthenticationRestoringAccessProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit' | 'title'> {
  backButtonProps?: Omit<LegacyButtonProps, 'children' | 'type'>;
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  className?: string;
  consentCheckboxProps?: Omit<LegacyCheckboxProps, 'checked' | 'label' | 'onChange' | 'size'>;
  consentLabel?: ReactNode;
  dataId?: string;
  defaultConsentAccepted?: boolean;
  defaultInn?: string;
  defaultLogin?: string;
  defaultLoginMethod?: LegacyAuthenticationRestoringAccessMethod;
  defaultRestoringFlow?: LegacyAuthenticationRestoringAccessFlow;
  defaultRestoringValue?: string;
  device?: LegacyAuthenticationRestoringAccessDevice;
  emailInputProps?: Omit<LegacyInputEmailProps, 'label' | 'onValueChange' | 'value'>;
  emailLabel?: ReactNode;
  emailMethodLabel?: ReactNode;
  innInputProps?: Omit<LegacyInputInnProps, 'label' | 'onValueChange' | 'value'>;
  innLabel?: ReactNode;
  loginButtonLabel?: ReactNode;
  loginEmailDescription?: ReactNode;
  loginFlowLabel?: ReactNode;
  loginFlowMobileLabel?: ReactNode;
  loginInputProps?: Omit<LegacyInputLoginProps, 'label' | 'onValueChange' | 'value'>;
  loginLabel?: ReactNode;
  loginMethod?: LegacyAuthenticationRestoringAccessMethod;
  loginPhoneDescription?: ReactNode;
  onBack?: () => void;
  onConsentChange?: (checked: boolean) => void;
  onLoginMethodChange?: (method: LegacyAuthenticationRestoringAccessMethod) => void;
  onPasswordSubmit?: (payload: LegacyAuthenticationRestoringPasswordSubmitPayload) => void;
  onPersonalDataClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onRestoringFlowChange?: (flow: LegacyAuthenticationRestoringAccessFlow) => void;
  onRestoringLoginSubmit?: (payload: LegacyAuthenticationRestoringLoginSubmitPayload) => void;
  passwordButtonLabel?: ReactNode;
  passwordDescription?: ReactNode;
  passwordFlowLabel?: ReactNode;
  passwordFlowMobileLabel?: ReactNode;
  phoneInputProps?: Omit<LegacyInputPhoneProps, 'label' | 'onValueChange' | 'value'>;
  phoneLabel?: ReactNode;
  phoneMethodLabel?: ReactNode;
  restoringFlow?: LegacyAuthenticationRestoringAccessFlow;
  submitButtonProps?: Omit<LegacyButtonProps, 'children' | 'type'>;
  themeProps?: Omit<LegacyThemeProps, 'className'>;
  title?: ReactNode;
}

declare const AuthenticationRestoringAccess: {
  (props: LegacyAuthenticationRestoringAccessProps): JSX.Element;
  devices: {
    auto: 'auto';
    desktop: 'desktop';
    mobile: 'mobile';
  };
  flows: {
    password: 'password';
    login: 'login';
  };
  methods: {
    email: 'email';
    phone: 'phone';
  };
};

export default AuthenticationRestoringAccess;
