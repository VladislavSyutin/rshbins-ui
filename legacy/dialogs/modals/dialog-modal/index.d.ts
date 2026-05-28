import type { HTMLAttributes, ReactNode } from 'react';
import type {
  LegacyModalPlacement,
  LegacyModalProps,
  LegacyModalVariant
} from '../../../components/modal/index.js';

export type LegacyDialogModalTemplate =
  | 'captcha'
  | 'timeout'
  | 'proof-of-identity'
  | 'log-in-through-the-gosuslugi';

export interface LegacyDialogModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  captchaLabel?: ReactNode;
  captchaRefreshLabel?: string;
  captchaVoiceLabel?: string;
  children?: ReactNode;
  className?: string;
  closeOnPrimaryAction?: boolean;
  closeOnTertiaryAction?: boolean;
  countdownDurationSeconds?: number;
  dataId?: string;
  description?: ReactNode;
  heading?: ReactNode;
  inputPlaceholder?: string;
  inputProps?: LegacyModalProps['inputProps'];
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onRefreshCaptcha?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  onVoiceCaptcha?: () => void;
  placement?: LegacyModalPlacement;
  primaryActionIcon?: ReactNode;
  primaryActionLabel?: string | null;
  role?: string;
  secondaryActionIcon?: ReactNode;
  secondaryActionLabel?: string | null;
  template?: LegacyDialogModalTemplate;
  tertiaryActionLabel?: string | null;
  variant?: LegacyModalVariant;
}

declare const DialogModal: {
  (props: LegacyDialogModalProps): JSX.Element;
  displayName: string;
  templates: Record<string, LegacyDialogModalTemplate>;
  variants: Record<LegacyModalVariant, LegacyModalVariant>;
  placements: Record<LegacyModalPlacement, LegacyModalPlacement>;
  propTypes: object;
};

export default DialogModal;
