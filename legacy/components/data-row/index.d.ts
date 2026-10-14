import type { HTMLAttributes, ReactNode } from 'react';
export interface LegacyDataRowProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: ReactNode;
  value?: ReactNode;
  emptyValue?: ReactNode;
  dataId?: string;
}
declare function DataRow(props: LegacyDataRowProps): JSX.Element;
export default DataRow;
