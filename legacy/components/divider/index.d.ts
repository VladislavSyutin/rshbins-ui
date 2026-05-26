import type { HTMLAttributes, ReactNode } from 'react';

export type LegacyDividerView = 'text' | 'without-text';

export interface LegacyDividerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  dataId?: string;
  label?: ReactNode;
  view?: LegacyDividerView;
}

export interface LegacyDividerComponent {
  (props: LegacyDividerProps): JSX.Element;
  displayName?: string;
  views: {
    text: 'text';
    withoutText: 'without-text';
  };
  propTypes: object;
}

declare const Divider: LegacyDividerComponent;

export default Divider;
