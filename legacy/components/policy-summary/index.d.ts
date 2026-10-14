import type { HTMLAttributes, ReactNode } from 'react';
export interface LegacyPolicySummaryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  title: ReactNode;
  tariff: ReactNode;
  term: ReactNode;
  sum: ReactNode;
  premium: number;
  oldPremium?: number;
  dataId?: string;
}
declare function PolicySummary(props: LegacyPolicySummaryProps): JSX.Element;
export default PolicySummary;
