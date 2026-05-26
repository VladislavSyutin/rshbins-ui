import type { ChangeEvent, HTMLAttributes, ReactNode } from 'react';

export type LegacyGenderValue = 'male' | 'female';

export interface LegacyGenderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  className?: string;
  dataId?: string;
  defaultValue?: LegacyGenderValue;
  femaleLabel?: ReactNode;
  invalid?: boolean;
  maleLabel?: ReactNode;
  name?: string;
  onChange?: (value: LegacyGenderValue, event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  value?: LegacyGenderValue;
}

export interface LegacyGenderComponent {
  (props: LegacyGenderProps): JSX.Element;
  displayName: string;
  values: Record<LegacyGenderValue, LegacyGenderValue>;
  propTypes: object;
}

declare const Gender: LegacyGenderComponent;

export default Gender;
