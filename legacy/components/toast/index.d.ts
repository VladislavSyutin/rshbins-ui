import type { HTMLAttributes, ReactNode } from 'react';

export type LegacyToastVariant = 'danger' | 'success';
export type LegacyToastPlacement = 'inline' | 'top-center';
export type LegacyToastPreviewState = 'shown' | 'closing';

export interface LegacyToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  autoCloseDuration?: number | null;
  children?: ReactNode;
  className?: string;
  closeLabel?: string;
  closable?: boolean;
  dataId?: string;
  onClose?: () => void;
  placement?: LegacyToastPlacement;
  previewState?: LegacyToastPreviewState;
  role?: string;
  variant?: LegacyToastVariant;
}

export default function Toast(props: LegacyToastProps): JSX.Element | null;

export namespace Toast {
  const displayName: string;
  const variants: Record<LegacyToastVariant, LegacyToastVariant>;
  const placements: { inline: 'inline'; topCenter: 'top-center' };
  const previewStates: Record<LegacyToastPreviewState, LegacyToastPreviewState>;
  const propTypes: object;
}
