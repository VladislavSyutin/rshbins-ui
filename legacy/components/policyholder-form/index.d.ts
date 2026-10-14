import type { HTMLAttributes, ReactNode } from 'react';
export interface LegacyPolicyholderValue {
  birthDate: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  noMiddleName: boolean;
  gender?: 'male' | 'female';
}
export interface LegacyPolicyholderFormProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'onChange' | 'title' | 'children'
  > {
  value: LegacyPolicyholderValue;
  onChange: (value: LegacyPolicyholderValue) => void;
  title?: ReactNode;
  description?: ReactNode;
  dataId?: string;
}
declare function PolicyholderForm(
  props: LegacyPolicyholderFormProps
): JSX.Element;
export default PolicyholderForm;
