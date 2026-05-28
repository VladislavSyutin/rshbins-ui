import type { HTMLAttributes, ReactNode } from 'react';

export interface LegacyCardProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  dataId?: string;
}

export default function Card(props: LegacyCardProps): JSX.Element;

export namespace Card {
  const displayName: string;
  const propTypes: object;
}
