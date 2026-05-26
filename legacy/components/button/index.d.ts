import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type LegacyButtonType =
  | 'primary'
  | 'secondary'
  | 'flat-primary'
  | 'flat-secondary';
export type LegacyButtonNativeType = 'button' | 'submit' | 'reset';
export type LegacyButtonCompatibleType = LegacyButtonNativeType | LegacyButtonType;
export type LegacyButtonSize = 'm' | 's';
export type LegacyButtonPreviewState =
  | 'default'
  | 'hover'
  | 'focused'
  | 'pressed'
  | 'disabled'
  | 'loading'
  | 'selection';

export interface LegacyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  buttonType?: LegacyButtonType;
  children?: ReactNode;
  className?: string;
  dataId?: string;
  iconOnly?: boolean;
  leadingIcon?: ReactNode;
  loading?: boolean;
  name?: string;
  previewState?: LegacyButtonPreviewState;
  selected?: boolean;
  size?: LegacyButtonSize;
  trailingIcon?: ReactNode;
  type?: LegacyButtonCompatibleType;
}

declare const Button: {
  (props: LegacyButtonProps): JSX.Element;
  buttonTypes: {
    primary: 'primary';
    secondary: 'secondary';
    flatPrimary: 'flat-primary';
    flatSecondary: 'flat-secondary';
  };
  sizes: {
    medium: 'm';
    small: 's';
  };
  previewStates: Record<LegacyButtonPreviewState, LegacyButtonPreviewState>;
};

export default Button;
