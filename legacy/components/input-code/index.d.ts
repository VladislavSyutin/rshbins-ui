import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LegacyInputTextHandle, LegacyInputTextProps } from '../input-text';

export interface LegacyInputCodeProps
  extends Omit<LegacyInputTextProps, 'maskOverlay' | 'prefix' | 'type'> {}

declare const InputCode: ForwardRefExoticComponent<
  LegacyInputCodeProps & RefAttributes<LegacyInputTextHandle>
>;

export default InputCode;
