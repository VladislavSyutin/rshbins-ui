# Legacy Cookies

React 17-compatible cookie consent banner for FOS integration.

## Files

- `Cookies.jsx` — component implementation
- `styles.css` — banner styles with animation keyframes
- `index.js` — default export entry point
- `index.d.ts` — TypeScript contract for local checks and Storybook
- `Cookies.stories.tsx` — Storybook review surface

## Integration Notes

- Uses `Button` from `../button/index.js` for primary and secondary actions.
- Default copy matches the filled cookie dialog: consent text with the RSHBINS personal data policy link and the primary label `Понятно`.
- Pass `onClose` to enable the animated exit sequence (150 ms slide-down before unmount).
- `closeOnPrimaryAction` (default `true`) triggers `onClose` automatically after the primary button click.
- Use `placement="bottom-center"` to render the banner as a `position: fixed` overlay at the bottom of the viewport.
- `size="xs"` renders the compact stacked variant; `size="s"` (default) renders the wide horizontal variant.
- Maps `dataId` prop to `data-id` on the root `<div>`.
- Uses React 17-compatible JSX, PropTypes, `classnames`, and plain CSS only.
- CSS uses `inset-inline-start` / `inset-block-end` logical properties; verify target browser support in the FOS pipeline.

## FOS Risks

- CSS animations (`@keyframes`) — verify PostCSS handles correctly in Webpack 3.
- `min()` CSS function — may need a PostCSS polyfill for older browser targets.
- Consumer must control the mount/unmount lifecycle; if the element is removed directly without letting `isClosing` flow complete, the exit animation will not play.

## Example

```jsx
import React, { useState } from 'react';
import Cookies from './index';

export default function Example() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Cookies
      dataId="cookies-banner"
      placement="bottom-center"
      onClose={() => setVisible(false)}
    />
  );
}
```
