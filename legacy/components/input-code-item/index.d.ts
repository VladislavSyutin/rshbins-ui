import type { HTMLAttributes, ReactNode } from 'react';

export type LegacyInputCodeItemPreviewState = 'default' | 'typing' | 'loading' | 'error';
export type LegacyInputCodeItemCompletionBehavior = 'error' | 'reset';

export interface LegacyInputCodeItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  autoFocus?: boolean;
  className?: string;
  completionBehavior?: LegacyInputCodeItemCompletionBehavior;
  complementaryIcon?: ReactNode;
  complementaryText?: ReactNode;
  dataId?: string;
  loadingDuration?: number;
  onComplete?: (code: string) => void;
  onValueChange?: (code: string) => void;
  previewState?: LegacyInputCodeItemPreviewState;
  showComplementaryIcon?: boolean;
  showComplementaryText?: boolean;
}

export interface LegacyInputCodeItemComponent {
  (props: LegacyInputCodeItemProps): JSX.Element;
  displayName: string;
  propTypes: object;
}

declare const InputCodeItem: LegacyInputCodeItemComponent;

export default InputCodeItem;
