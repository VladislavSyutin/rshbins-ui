import * as React from 'react';

export interface PolicyIssuancePrototypeProps extends React.HTMLAttributes<HTMLDivElement> {
  dataId?: string;
  onProductDetails?: (card: { title: string; accent: string; text?: string; bullets?: string[]; image: string }) => void;
  defaultCategory?: 'property' | 'health' | 'work' | 'travel' | 'animals' | 'kids';
}

declare const PolicyIssuancePrototype: React.FC<PolicyIssuancePrototypeProps>;

export default PolicyIssuancePrototype;
