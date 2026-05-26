import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LegacyInputTextHandle, LegacyInputTextProps } from '../input-text';

export interface LegacyInputLoginProps
  extends Omit<LegacyInputTextProps, 'maskOverlay' | 'prefix' | 'type'> {}

declare const InputLogin: ForwardRefExoticComponent<
  LegacyInputLoginProps & RefAttributes<LegacyInputTextHandle>
>;

export default InputLogin;
