## Legacy Theme

React 17-compatible theme toggle button for FOS integration. Moon/Sun icons are inlined as JSX.

### Files

- `Theme.jsx` — component implementation
- `styles.css` — button styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `applyToDocument` | `boolean` | `true` | Toggle `theme-light`/`theme-dark` on `<html>` and persist to localStorage |
| `mode` | `'light' \| 'dark'` | — | Controlled mode |
| `defaultMode` | `'light' \| 'dark'` | — | Initial uncontrolled mode |
| `onModeChange` | `(mode) => void` | — | Called when user toggles |
| `previewState` | `'default' \| 'hover' \| 'pressed' \| 'focused'` | `'default'` | Visual state for Storybook |
| `storageKey` | `string` | `'rshbins-ui-theme'` | localStorage key |
| `dataId` | `string` | — | Maps to `data-id` attribute |

### Integration Notes

- `applyToDocument` (default `true`) toggles `theme-light` / `theme-dark` classes on `<html>` and writes to `localStorage`.
- Set `applyToDocument={false}` inside Storybook or sandbox environments.
- Controlled usage: pass `mode` + `onModeChange`. Uncontrolled: use `defaultMode`.

### Example

```jsx
import React, { useState } from 'react';
import Theme from './index';

export default function Example() {
  const [mode, setMode] = useState('light');

  return (
    <Theme
      applyToDocument={false}
      mode={mode}
      onModeChange={setMode}
    />
  );
}
```
