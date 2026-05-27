import type { HTMLAttributes, ReactNode } from 'react';

export type LegacyCookiesSize = 's' | 'xs';
export type LegacyCookiesPlacement = 'inline' | 'bottom-center';

export interface LegacyCookiesProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  className?: string;
  closeOnPrimaryAction?: boolean;
  dataId?: string;
  description?: ReactNode;
  heading?: ReactNode;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  placement?: LegacyCookiesPlacement;
  primaryActionLabel?: string | null;
  secondaryActionLabel?: string | null;
  size?: LegacyCookiesSize;
}

export default function Cookies(props: LegacyCookiesProps): JSX.Element;

export namespace Cookies {
  const displayName: string;
  const sizes: Record<LegacyCookiesSize, LegacyCookiesSize>;
  const placements: { inline: 'inline'; bottomCenter: 'bottom-center' };
  const propTypes: object;
}
