import type { ButtonHTMLAttributes } from 'react';

export type LegacyThemeMode = 'light' | 'dark';

export interface LegacyThemeProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'> {
  applyToDocument?: boolean;
  className?: string;
  dataId?: string;
  defaultMode?: LegacyThemeMode;
  mode?: LegacyThemeMode;
  onModeChange?: (mode: LegacyThemeMode) => void;
  storageKey?: string;
}

export default function Theme(props: LegacyThemeProps): JSX.Element;

export namespace Theme {
  const displayName: string;
  const modes: Record<LegacyThemeMode, LegacyThemeMode>;
  const propTypes: object;
}
