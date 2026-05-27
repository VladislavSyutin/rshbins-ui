import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode
} from 'react';

export type LegacyTabsActivationMode = 'automatic' | 'manual';
export type LegacyTabsPreviewState = 'default' | 'hover' | 'focused';
export type LegacyTabsChangeEvent =
  | KeyboardEvent<HTMLButtonElement>
  | MouseEvent<HTMLButtonElement>;

export interface LegacyTabsOption {
  dataId?: string;
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  leadingIcon?: ReactNode;
  panelId?: string;
  previewState?: LegacyTabsPreviewState;
  trailingIcon?: ReactNode;
  value: string;
}

export interface LegacyTabsItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled' | 'role'> {
  className?: string;
  dataId?: string;
  previewState?: LegacyTabsPreviewState;
}

export interface LegacyTabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  className?: string;
  dataId?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string, event: LegacyTabsChangeEvent) => void;
  options: LegacyTabsOption[];
  tabProps?: LegacyTabsItemProps;
  value?: string;
}

export interface LegacyTabsComponent {
  (props: LegacyTabsProps): JSX.Element;
  previewStates: Record<LegacyTabsPreviewState, LegacyTabsPreviewState>;
}

declare const Tabs: LegacyTabsComponent;

export default Tabs;
