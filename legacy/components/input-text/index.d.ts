import type {
  ChangeEvent,
  ForwardRefExoticComponent,
  InputHTMLAttributes,
  ReactNode,
  RefAttributes
} from 'react';

export type LegacyInputTextPreviewState =
  | 'default'
  | 'hover'
  | 'focused'
  | 'typing'
  | 'entered'
  | 'entered-hover'
  | 'error'
  | 'error-hover'
  | 'error-entered'
  | 'error-entered-hover'
  | 'disabled'
  | 'disabled-entered'
  | 'keyboard-focused';

export interface LegacyInputTextProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'children' | 'defaultValue' | 'onChange' | 'prefix' | 'size' | 'value'
  > {
  changeOnFocus?: (value: string) => void;
  className?: string;
  clearButtonDataId?: string;
  clearable?: boolean;
  contentClassName?: string;
  controlClassName?: string;
  customInputStyle?: string;
  dataId?: string;
  defaultValue?: string | number;
  error?: boolean;
  endAdornment?: ReactNode;
  helperIcon?: ReactNode;
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
  previewState?: LegacyInputTextPreviewState;
  showHelperIcon?: boolean;
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
> & {
  previewStates: Record<LegacyInputTextPreviewState, LegacyInputTextPreviewState>;
};

export default InputText;
