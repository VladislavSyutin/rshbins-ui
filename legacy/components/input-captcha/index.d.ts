import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LegacyInputTextHandle, LegacyInputTextProps } from '../input-text';

export interface LegacyInputCaptchaProps
  extends Omit<LegacyInputTextProps, 'maskOverlay' | 'prefix' | 'type'> {}

declare const InputCaptcha: ForwardRefExoticComponent<
  LegacyInputCaptchaProps & RefAttributes<LegacyInputTextHandle>
>;

export default InputCaptcha;
