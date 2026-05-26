# Legacy Switch

React 17-compatible binary switch control for FOS integration.

## Files

- `Switch.jsx` - component implementation
- `styles.css` - switch styles
- `index.js` - default export entry point
- `index.d.ts` - TypeScript contract for local checks and Storybook
- `Switch.stories.tsx` - Storybook review surface

## Integration Notes

- Implemented as native `input[type='checkbox']` with `role='switch'`.
- Supports `checked`/`defaultChecked`, `disabled`, `readOnly`, `label`, `dataId` and Storybook-only `previewState`.
- Maps `dataId` to `data-id` on the root label.
- Uses React 17-compatible JSX, PropTypes, `classnames` and plain CSS only.

## Example

```jsx
import React from 'react';
import Switch from './index';

export default function Example() {
  return <Switch dataId="notifications-switch" label="Уведомления" defaultChecked={false} />;
}
```
