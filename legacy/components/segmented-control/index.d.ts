import type { ChangeEvent, HTMLAttributes, ReactNode } from 'react';

export type LegacySegmentedControlPreviewState = 'default' | 'hover' | 'focused';

export interface LegacySegmentedControlOption {
  dataId?: string;
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  leadingIcon?: ReactNode;
  previewState?: LegacySegmentedControlPreviewState;
  trailingIcon?: ReactNode;
  value: string;
}

export interface LegacySegmentedControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  className?: string;
  dataId?: string;
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  options: LegacySegmentedControlOption[];
  previewState?: LegacySegmentedControlPreviewState;
  required?: boolean;
  value?: string;
}

export interface LegacySegmentedControlComponent {
  (props: LegacySegmentedControlProps): JSX.Element;
  previewStates: Record<LegacySegmentedControlPreviewState, LegacySegmentedControlPreviewState>;
}

declare const SegmentedControl: LegacySegmentedControlComponent;

export default SegmentedControl;
