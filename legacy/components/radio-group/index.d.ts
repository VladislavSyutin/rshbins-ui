import type { ChangeEvent, HTMLAttributes, ReactNode } from 'react';

export type LegacyRadioGroupDirection = 'vertical' | 'horizontal';

export interface LegacyRadioGroupOption {
  dataId?: string;
  disabled?: boolean;
  id?: string;
  label?: ReactNode;
  value: string;
}

export interface LegacyRadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  className?: string;
  dataId?: string;
  defaultValue?: string;
  direction?: LegacyRadioGroupDirection;
  disabled?: boolean;
  name?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  options?: LegacyRadioGroupOption[];
  required?: boolean;
  value?: string;
}

export interface LegacyRadioGroupComponent {
  (props: LegacyRadioGroupProps): JSX.Element;
  directions: Record<LegacyRadioGroupDirection, LegacyRadioGroupDirection>;
}

declare const RadioGroup: LegacyRadioGroupComponent;

export default RadioGroup;
