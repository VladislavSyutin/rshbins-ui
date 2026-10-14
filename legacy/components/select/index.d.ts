import type { HTMLAttributes, ReactNode } from 'react';
export interface LegacySelectOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
}
export interface LegacySelectProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'onChange' | 'children' | 'defaultValue'
  > {
  label: ReactNode;
  options: LegacySelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  helperText?: ReactNode;
  dataId?: string;
}
declare function Select(props: LegacySelectProps): JSX.Element;
export default Select;
