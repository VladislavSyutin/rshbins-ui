import type { HTMLAttributes, ReactNode } from 'react';
export interface LegacyPhoneCodeFormProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  phone: string;
  code: string;
  resendSeconds: number;
  isSubmittingCode?: boolean;
  hint?: ReactNode;
  dataId?: string;
  onBack: () => void;
  onChangePhone: () => void;
  onCodeChange: (value: string) => void;
  onSubmitCode: () => void;
  onResendCode: () => void;
}
declare function PhoneCodeForm(props: LegacyPhoneCodeFormProps): JSX.Element;
export default PhoneCodeForm;
