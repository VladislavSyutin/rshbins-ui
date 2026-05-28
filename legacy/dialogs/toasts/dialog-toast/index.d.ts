import type { HTMLAttributes } from 'react';
import type {
  LegacyToastPlacement,
  LegacyToastVariant
} from '../../../components/toast/index.js';

export type LegacyDialogToastState = 'success' | 'failure';
export type LegacyDialogToastTemplate =
  | 'system-error'
  | 'link-expired'
  | 'user-not-found'
  | 'user-registered'
  | 'password-already-used'
  | 'password-change-available-once-every-x-hours'
  | 'password-expired'
  | 'successful-authentication'
  | 'new-code-sent'
  | 'new-instructions-sent'
  | 'email-confirmed';

export interface LegacyDialogToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  autoCloseDuration?: number | null;
  className?: string;
  closeLabel?: string;
  dataId?: string;
  onClose?: () => void;
  placement?: LegacyToastPlacement;
  role?: string;
  state?: LegacyDialogToastState;
  template?: LegacyDialogToastTemplate;
  variant?: LegacyToastVariant;
}

export default function DialogToast(props: LegacyDialogToastProps): JSX.Element | null;

export namespace DialogToast {
  const displayName: string;
  const states: Record<LegacyDialogToastState, LegacyDialogToastState>;
  const templates: Record<string, LegacyDialogToastTemplate>;
  const variants: Record<LegacyToastVariant, LegacyToastVariant>;
  const propTypes: object;
}
