import type { HTMLAttributes } from 'react';

export type LegacySpinSize = '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl';

export interface LegacySpinProps extends HTMLAttributes<HTMLSpanElement> {
  dataId?: string;
  label?: string;
  size?: LegacySpinSize;
}

export interface LegacySpinComponent {
  (props: LegacySpinProps): JSX.Element;
  displayName?: string;
  sizes: {
    twoExtraSmall: '2xs';
    extraSmall: 'xs';
    small: 's';
    medium: 'm';
    large: 'l';
    extraLarge: 'xl';
  };
}

declare const Spin: LegacySpinComponent;

export default Spin;
