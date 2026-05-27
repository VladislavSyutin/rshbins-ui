## Legacy Header

React 17-compatible page header with the RSHB Insurance logo and theme toggle for FOS integration.

### Files

- `Header.jsx` — component implementation
- `styles.css` — header styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations

### Dependencies

- `../logo/` — inline SVG logo
- `../theme/` — theme toggle button

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'l' \| 'm' \| 's' \| 'xs' \| 'responsive'` | `'responsive'` | Layout size variant |
| `brandLabel` | `string` | `'РСХБ Страхование'` | aria-label for the logo button |
| `brandButtonProps` | `object` | — | Extra props for the logo `<button>` |
| `themeProps` | `object` | — | Props forwarded to `<Theme>` |
| `dataId` | `string` | — | Maps to `data-id` attribute |

### Integration Notes

- `size="responsive"` (default) adapts padding at 1024px and 743px breakpoints.
- Fixed sizes: `l` (6xl margin), `m` / `s` (62px padding), `xs` (no padding, transparent background).
- Pass `themeProps` to configure the theme toggle, including `applyToDocument` and `onModeChange`.
- Pass `brandButtonProps` to attach click handlers or aria attributes to the logo button.

### Example

```jsx
import React, { useState } from 'react';
import Header from './index';

export default function Example() {
  const [mode, setMode] = useState('light');

  return (
    <Header
      themeProps={{
        applyToDocument: true,
        mode,
        onModeChange: setMode
      }}
    />
  );
}
```
