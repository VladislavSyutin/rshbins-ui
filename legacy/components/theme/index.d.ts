import type { ButtonHTMLAttributes } from 'react';

export type LegacyThemeMode = 'light' | 'dark';
export type LegacyThemePreviewState = 'default' | 'hover' | 'pressed' | 'focused';

export interface LegacyThemeProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'> {
  applyToDocument?: boolean;
  className?: string;
  dataId?: string;
  defaultMode?: LegacyThemeMode;
  mode?: LegacyThemeMode;
  onModeChange?: (mode: LegacyThemeMode) => void;
  previewState?: LegacyThemePreviewState;
  storageKey?: string;
}

export default function Theme(props: LegacyThemeProps): JSX.Element;

export namespace Theme {
  const displayName: string;
  const modes: Record<LegacyThemeMode, LegacyThemeMode>;
  const previewStates: Record<LegacyThemePreviewState, LegacyThemePreviewState>;
  const propTypes: object;
}
