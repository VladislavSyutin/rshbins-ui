import type { ChangeEvent, HTMLAttributes, ReactNode } from 'react';

export interface LegacySegmentedControlOption {
  dataId?: string;
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  leadingIcon?: ReactNode;
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
  required?: boolean;
  value?: string;
}

export interface LegacySegmentedControlComponent {
  (props: LegacySegmentedControlProps): JSX.Element;
}

declare const SegmentedControl: LegacySegmentedControlComponent;

export default SegmentedControl;
