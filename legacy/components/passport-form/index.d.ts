import type { HTMLAttributes, ReactNode } from 'react';
export interface LegacyPassportValue {
  number: string;
  divisionCode: string;
  issueDate: string;
  issuedBy: string;
}
export interface LegacyPassportFormProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'onChange' | 'title' | 'children'
  > {
  value: LegacyPassportValue;
  onChange: (value: LegacyPassportValue) => void;
  title?: ReactNode;
  description?: ReactNode;
  dataId?: string;
}
declare function PassportForm(props: LegacyPassportFormProps): JSX.Element;
export default PassportForm;
