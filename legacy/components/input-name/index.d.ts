import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LegacyInputTextHandle, LegacyInputTextProps } from '../input-text';

export interface LegacyInputNameProps
  extends Omit<LegacyInputTextProps, 'maskOverlay' | 'prefix' | 'type'> {}

declare const InputName: ForwardRefExoticComponent<
  LegacyInputNameProps & RefAttributes<LegacyInputTextHandle>
>;

export default InputName;
