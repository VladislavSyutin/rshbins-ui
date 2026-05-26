import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LegacyInputTextHandle, LegacyInputTextProps } from '../input-text';

export interface LegacyInputPhoneProps
  extends Omit<LegacyInputTextProps, 'maskOverlay' | 'prefix' | 'type'> {}

declare const InputPhone: ForwardRefExoticComponent<
  LegacyInputPhoneProps & RefAttributes<LegacyInputTextHandle>
>;

export default InputPhone;
