import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type {
  LegacyInputTextHandle,
  LegacyInputTextProps
} from '../input-text';
export interface LegacyInputPromoCodeProps
  extends Omit<LegacyInputTextProps, 'type' | 'maskOverlay' | 'prefix'> {}
declare const InputPromoCode: ForwardRefExoticComponent<
  LegacyInputPromoCodeProps & RefAttributes<LegacyInputTextHandle>
>;
export default InputPromoCode;
