import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type {
  LegacyInputTextHandle,
  LegacyInputTextProps
} from '../input-text';
export interface LegacyInputPassportDivisionCodeProps
  extends Omit<LegacyInputTextProps, 'type' | 'maskOverlay' | 'prefix'> {}
declare const InputPassportDivisionCode: ForwardRefExoticComponent<
  LegacyInputPassportDivisionCodeProps & RefAttributes<LegacyInputTextHandle>
>;
export default InputPassportDivisionCode;
