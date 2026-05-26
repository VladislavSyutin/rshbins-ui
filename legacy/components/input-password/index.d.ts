import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LegacyInputTextHandle, LegacyInputTextProps } from '../input-text';

export interface LegacyInputPasswordProps
  extends Omit<LegacyInputTextProps, 'mask' | 'type'> {}

declare const InputPassword: ForwardRefExoticComponent<
  LegacyInputPasswordProps & RefAttributes<LegacyInputTextHandle>
>;

export default InputPassword;
