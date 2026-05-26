## Legacy Divider

React 17-compatible delivery of the divider component for FOS integration.

### Files

- `Divider.jsx` — component implementation
- `styles.css` — divider styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- `view="text"` (default) renders a horizontal divider with a centered label between two lines.
- `view="without-text"` renders a plain horizontal divider line.
- `label` defaults to `'или'` and accepts any ReactNode.
- `dataId` is mapped to `data-id` on the root `<div>` element.
- All unrecognised props are forwarded to the root `<div>`.

### Example

```jsx
import React from 'react';
import Divider from './index';

export default function Example() {
  return (
    <Divider label="или" />
  );
}
```
