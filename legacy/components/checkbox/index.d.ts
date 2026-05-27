import type { InputHTMLAttributes, ReactNode } from 'react';

export type LegacyCheckboxSize = 'm' | 's';

export interface LegacyCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size' | 'type'> {
  className?: string;
  dataId?: string;
  invalid?: boolean;
  label?: ReactNode;
  size?: LegacyCheckboxSize;
}

export default function Checkbox(props: LegacyCheckboxProps): JSX.Element;

export namespace Checkbox {
  const displayName: string;
  const propTypes: object;
}
