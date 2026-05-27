import type {
  ChangeEvent,
  ForwardRefExoticComponent,
  InputHTMLAttributes,
  ReactNode,
  RefAttributes
} from 'react';

export interface LegacyInputTextProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'children' | 'defaultValue' | 'onChange' | 'prefix' | 'size' | 'value'
  > {
  changeOnFocus?: (value: string) => void;
  className?: string;
  clearButtonDataId?: string;
  clearable?: boolean;
  clearLabel?: string;
  contentClassName?: string;
  controlClassName?: string;
  customInputStyle?: string;
  dataId?: string;
  defaultValue?: string | number;
  error?: boolean;
  endAdornment?: ReactNode;
  helperText?: ReactNode;
  hideControlValue?: boolean;
  inputClassName?: string;
  invalid?: boolean;
  label?: ReactNode;
  maskOverlay?: ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocusChange?: (focused: boolean) => void;
  onValueChange?: (value: string) => void;
  prefix?: ReactNode;
  startIcon?: ReactNode;
  value?: string | number;
  width?: string | number;
}

export interface LegacyInputTextHandle {
  focus: () => void;
  inputElement: HTMLInputElement | null;
}

declare const InputText: ForwardRefExoticComponent<
  LegacyInputTextProps & RefAttributes<LegacyInputTextHandle>
>;

export default InputText;
