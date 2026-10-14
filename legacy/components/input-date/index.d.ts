import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type {
  LegacyInputTextHandle,
  LegacyInputTextProps
} from '../input-text';
export interface LegacyInputDateProps
  extends Omit<LegacyInputTextProps, 'type' | 'min' | 'max'> {
  calendarOpenLabel?: string;
  minDate?: Date;
  maxDate?: Date;
  incompleteError?: string;
  rangeError?: string;
}
declare const InputDate: ForwardRefExoticComponent<
  LegacyInputDateProps & RefAttributes<LegacyInputTextHandle>
>;
export default InputDate;
