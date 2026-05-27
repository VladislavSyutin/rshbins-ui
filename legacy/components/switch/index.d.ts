import type { InputHTMLAttributes, ReactNode } from 'react';

export interface LegacySwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'type'> {
  dataId?: string;
  label?: ReactNode;
}

declare const Switch: {
  (props: LegacySwitchProps): JSX.Element;
};

export default Switch;
