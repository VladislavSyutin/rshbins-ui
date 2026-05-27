import type { HTMLAttributes } from 'react';

export type LegacyLogoState = 'default' | 'focused';

export interface LegacyLogoProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
  dataId?: string;
  state?: LegacyLogoState;
}

export default function Logo(props: LegacyLogoProps): JSX.Element;

export namespace Logo {
  const displayName: string;
  const states: Record<LegacyLogoState, LegacyLogoState>;
  const propTypes: object;
}
