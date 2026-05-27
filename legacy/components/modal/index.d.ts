import type { HTMLAttributes, ReactNode } from 'react';
import type { LegacyInputTextProps } from '../input-text/index.js';

export type LegacyModalVariant = 'default' | 'captcha' | 'text-input';
export type LegacyModalPlacement = 'inline' | 'top-center';
export type LegacyModalPreviewState = 'shown' | 'closing';

export interface LegacyModalActionsRenderContext {
  requestClose: () => void;
}

export interface LegacyModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  actions?: ReactNode | ((context: LegacyModalActionsRenderContext) => ReactNode);
  captchaLabel?: ReactNode;
  children?: ReactNode;
  className?: string;
  closeOnPrimaryAction?: boolean;
  closeOnTertiaryAction?: boolean;
  dataId?: string;
  description?: ReactNode;
  heading?: ReactNode;
  inputPlaceholder?: string;
  inputProps?: Omit<LegacyInputTextProps, 'label'>;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onRefreshCaptcha?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  onVoiceCaptcha?: () => void;
  placement?: LegacyModalPlacement;
  previewState?: LegacyModalPreviewState;
  primaryActionLabel?: string | null;
  secondaryActionLabel?: string | null;
  tertiaryActionLabel?: string | null;
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
  previewStates: Record<LegacyModalPreviewState, LegacyModalPreviewState>;
  propTypes: object;
};

export default Modal;
