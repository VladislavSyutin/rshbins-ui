import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LegacyInputTextHandle, LegacyInputTextProps } from '../input-text';

export interface LegacyInputEmailProps
  extends Omit<LegacyInputTextProps, 'maskOverlay' | 'prefix' | 'type'> {}

declare const InputEmail: ForwardRefExoticComponent<
  LegacyInputEmailProps & RefAttributes<LegacyInputTextHandle>
>;

export default InputEmail;
