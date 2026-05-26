import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LegacyInputTextHandle, LegacyInputTextProps } from '../input-text';

export interface LegacyInputInnProps
  extends Omit<LegacyInputTextProps, 'maskOverlay' | 'prefix' | 'type'> {}

declare const InputInn: ForwardRefExoticComponent<
  LegacyInputInnProps & RefAttributes<LegacyInputTextHandle>
>;

export default InputInn;
