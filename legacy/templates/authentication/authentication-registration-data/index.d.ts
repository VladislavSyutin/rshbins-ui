import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactNode
} from 'react';
import type { LegacyButtonProps } from '../../../components/button';
import type { LegacyCheckboxProps } from '../../../components/checkbox';
import type { LegacyGenderProps, LegacyGenderValue } from '../../../components/gender';
import type { LegacyInputBirthDateProps } from '../../../components/input-birth-date';
import type { LegacyInputEmailProps } from '../../../components/input-email';
import type { LegacyInputMiddleNameProps } from '../../../components/input-middle-name';
import type { LegacyInputNameProps } from '../../../components/input-name';
import type { LegacyInputSurnameProps } from '../../../components/input-surname';
import type { LegacyThemeProps } from '../../../components/theme';

export type LegacyAuthenticationRegistrationDataDevice =
  | 'auto'
  | 'desktop'
  | 'mobile';

export interface LegacyAuthenticationRegistrationDataSubmitPayload {
  birthDate: string;
  consentAccepted: boolean;
  email: string;
  gender: LegacyGenderValue | undefined;
  middleName: string;
  name: string;
  surname: string;
  withoutMiddleName: boolean;
}

export interface LegacyAuthenticationRegistrationDataProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSubmit' | 'title'> {
  birthDateInputProps?: Omit<LegacyInputBirthDateProps, 'label' | 'onValueChange' | 'value'>;
  birthDateLabel?: ReactNode;
  brandButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>;
  className?: string;
  consentCheckboxProps?: Omit<LegacyCheckboxProps, 'checked' | 'label' | 'onChange' | 'size'>;
  consentLabel?: ReactNode;
  dataId?: string;
  defaultBirthDate?: string;
  defaultConsentAccepted?: boolean;
  defaultEmail?: string;
  defaultGender?: LegacyGenderValue;
  defaultMiddleName?: string;
  defaultName?: string;
  defaultSurname?: string;
  defaultWithoutMiddleName?: boolean;
  device?: LegacyAuthenticationRegistrationDataDevice;
  emailInputProps?: Omit<LegacyInputEmailProps, 'label' | 'onValueChange' | 'value'>;
  emailLabel?: ReactNode;
  genderProps?: Omit<LegacyGenderProps, 'className' | 'onChange' | 'value'>;
  middleNameInputProps?: Omit<
    LegacyInputMiddleNameProps,
    'label' | 'onSwitchChange' | 'onValueChange' | 'switchChecked' | 'value'
  >;
  middleNameLabel?: ReactNode;
  nameInputProps?: Omit<LegacyInputNameProps, 'label' | 'onValueChange' | 'value'>;
  nameLabel?: ReactNode;
  onConsentChange?: (checked: boolean) => void;
  onPersonalDataClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onSubmit?: (payload: LegacyAuthenticationRegistrationDataSubmitPayload) => void;
  saveButtonLabel?: ReactNode;
  saveButtonProps?: Omit<LegacyButtonProps, 'children' | 'type'>;
  surnameInputProps?: Omit<LegacyInputSurnameProps, 'label' | 'onValueChange' | 'value'>;
  surnameLabel?: ReactNode;
  themeProps?: Omit<LegacyThemeProps, 'className'>;
  title?: ReactNode;
}

declare const AuthenticationRegistrationData: {
  (props: LegacyAuthenticationRegistrationDataProps): JSX.Element;
  devices: {
    auto: 'auto';
    desktop: 'desktop';
    mobile: 'mobile';
  };
  genderValues: {
    male: 'male';
    female: 'female';
  };
};

export default AuthenticationRegistrationData;
