import type { HTMLAttributes, ReactNode } from 'react';
export interface LegacyProductCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  title: ReactNode;
  accent?: ReactNode;
  text?: ReactNode;
  bullets?: ReactNode[];
  imageSrc: string;
  imageAlt?: string;
  onCalculate?: () => void;
  onDetails?: () => void;
  calculateLabel?: ReactNode;
  detailsLabel?: ReactNode;
  dataId?: string;
}
declare function ProductCard(props: LegacyProductCardProps): JSX.Element;
export default ProductCard;
