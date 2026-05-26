import type { InputHTMLAttributes, ReactNode } from 'react';

export type LegacySwitchPreviewState = 'default' | 'hover' | 'focused';

export interface LegacySwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'type'> {
  dataId?: string;
  label?: ReactNode;
  previewState?: LegacySwitchPreviewState;
}

declare const Switch: {
  (props: LegacySwitchProps): JSX.Element;
  previewStates: Record<LegacySwitchPreviewState, LegacySwitchPreviewState>;
};

export default Switch;
