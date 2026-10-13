import * as React from 'react';

export interface PolicyIssuancePrototypeProps extends React.HTMLAttributes<HTMLDivElement> {
  dataId?: string;
  defaultCategory?: 'property' | 'health' | 'work' | 'travel' | 'animals' | 'kids';
}

declare const PolicyIssuancePrototype: React.FC<PolicyIssuancePrototypeProps>;

export default PolicyIssuancePrototype;
