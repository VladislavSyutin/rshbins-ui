import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LegacyInputTextHandle, LegacyInputTextProps } from '../input-text';

export interface LegacyInputSurnameProps
  extends Omit<LegacyInputTextProps, 'maskOverlay' | 'prefix' | 'type'> {}

declare const InputSurname: ForwardRefExoticComponent<
  LegacyInputSurnameProps & RefAttributes<LegacyInputTextHandle>
>;

export default InputSurname;
