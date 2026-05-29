import type { HTMLAttributes, ReactNode } from 'react';
import type { LegacyInputCaptchaProps } from '../input-captcha/index.js';
import type { LegacyInputTextProps } from '../input-text/index.js';

export type LegacyModalVariant = 'default' | 'captcha' | 'text-input';
export type LegacyModalPlacement = 'inline' | 'top-center';

export interface LegacyModalActionsRenderContext {
  requestClose: () => void;
}

export interface LegacyModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  actions?: ReactNode | ((context: LegacyModalActionsRenderContext) => ReactNode);
  captchaLabel?: ReactNode;
  captchaRefreshLabel?: string;
  captchaVoiceLabel?: string;
  children?: ReactNode;
  className?: string;
  closeOnPrimaryAction?: boolean;
  closeOnTertiaryAction?: boolean;
  dataId?: string;
  description?: ReactNode;
  heading?: ReactNode;
  inputPlaceholder?: string;
  inputProps?: Omit<LegacyInputTextProps | LegacyInputCaptchaProps, 'label'>;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onRefreshCaptcha?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  onVoiceCaptcha?: () => void;
  placement?: LegacyModalPlacement;
  primaryActionIcon?: ReactNode;
  primaryActionLabel?: string | null;
  primaryActionLoading?: boolean;
  primaryActionDisabled?: boolean;
  secondaryActionIcon?: ReactNode;
  secondaryActionLabel?: string | null;
  secondaryActionLoading?: boolean;
  secondaryActionDisabled?: boolean;
  tertiaryActionIcon?: ReactNode;
  tertiaryActionLabel?: string | null;
  tertiaryActionLoading?: boolean;
  tertiaryActionDisabled?: boolean;
  variant?: LegacyModalVariant;
}

declare const Modal: {
  (props: LegacyModalProps): JSX.Element;
  displayName: string;
  variants: {
    default: 'default';
    captcha: 'captcha';
    textInput: 'text-input';
  };
  placements: {
    inline: 'inline';
    topCenter: 'top-center';
  };
  propTypes: object;
};

export default Modal;
