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
import type { LegacyInputPhoneProps } from '../../../components/input-phone';
import type { LegacyThemeProps } from '../../../components/theme';

export type LegacyAuthenticationRegistrationMethod = 'email' | 'phone';
export type LegacyAuthenticationRegistrationDevice = 'auto' | 'desktop' | 'mobile';

export interface LegacyAuthenticationRegistrationSubmitPayload {
  consentAccepted: boolean;
  inn: string;
  method: LegacyAuthenticationRegistrationMethod;
  value: string;
}

export interface LegacyAuthenticationRegistrationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit' | 'title'> {
  backButtonProps?: Omit<LegacyButtonProps, 'children' | 'type'>;
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  className?: string;
  consentCheckboxProps?: Omit<LegacyCheckboxProps, 'checked' | 'label' | 'onChange' | 'size'>;
  consentLabel?: ReactNode;
  dataId?: string;
  defaultConsentAccepted?: boolean;
  defaultInn?: string;
  defaultMethod?: LegacyAuthenticationRegistrationMethod;
  defaultValue?: string;
  device?: LegacyAuthenticationRegistrationDevice;
  emailDescription?: ReactNode;
  emailInputProps?: Omit<LegacyInputEmailProps, 'label' | 'onValueChange' | 'value'>;
  emailLabel?: ReactNode;
  emailMethodLabel?: ReactNode;
  innInputProps?: Omit<LegacyInputInnProps, 'label' | 'onValueChange' | 'value'>;
  innLabel?: ReactNode;
  method?: LegacyAuthenticationRegistrationMethod;
  onBack?: () => void;
  onConsentChange?: (checked: boolean) => void;
  onMethodChange?: (method: LegacyAuthenticationRegistrationMethod) => void;
  onPersonalDataClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onSubmit?: (payload: LegacyAuthenticationRegistrationSubmitPayload) => void;
  phoneDescription?: ReactNode;
  phoneInputProps?: Omit<LegacyInputPhoneProps, 'label' | 'onValueChange' | 'value'>;
  phoneLabel?: ReactNode;
  phoneMethodLabel?: ReactNode;
  registerButtonLabel?: ReactNode;
  registerButtonProps?: Omit<LegacyButtonProps, 'children' | 'type'>;
  themeProps?: Omit<LegacyThemeProps, 'className'>;
  title?: ReactNode;
}

declare const AuthenticationRegistration: {
  (props: LegacyAuthenticationRegistrationProps): JSX.Element;
  devices: {
    auto: 'auto';
    desktop: 'desktop';
    mobile: 'mobile';
  };
  methods: {
    email: 'email';
    phone: 'phone';
  };
};

export default AuthenticationRegistration;
