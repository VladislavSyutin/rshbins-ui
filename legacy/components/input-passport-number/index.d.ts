import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type {
  LegacyInputTextHandle,
  LegacyInputTextProps
} from '../input-text';
export interface LegacyInputPassportNumberProps
  extends Omit<LegacyInputTextProps, 'type' | 'maskOverlay' | 'prefix'> {}
declare const InputPassportNumber: ForwardRefExoticComponent<
  LegacyInputPassportNumberProps & RefAttributes<LegacyInputTextHandle>
>;
export default InputPassportNumber;
