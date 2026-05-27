import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LegacyInputTextHandle, LegacyInputTextProps } from '../input-text';

export interface LegacyInputBirthDateProps
  extends Omit<LegacyInputTextProps, 'mask' | 'type'> {
  calendarOpenLabel?: string;
}

declare const InputBirthDate: ForwardRefExoticComponent<
  LegacyInputBirthDateProps & RefAttributes<LegacyInputTextHandle>
>;

export default InputBirthDate;
