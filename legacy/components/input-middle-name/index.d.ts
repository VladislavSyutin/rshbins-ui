import type { ChangeEvent, ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';
import type { LegacyInputTextHandle, LegacyInputTextProps } from '../input-text';

export interface LegacyInputMiddleNameProps
  extends Omit<LegacyInputTextProps, 'maskOverlay' | 'prefix' | 'type'> {
  onSwitchChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  switchChecked?: boolean;
  switchDataId?: string;
  switchDefaultChecked?: boolean;
  switchLabel?: ReactNode;
  switchOnChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

declare const InputMiddleName: ForwardRefExoticComponent<
  LegacyInputMiddleNameProps & RefAttributes<LegacyInputTextHandle>
>;

export default InputMiddleName;
