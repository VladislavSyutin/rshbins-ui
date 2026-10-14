## Legacy Checkbox

React 17-compatible delivery of the checkbox component for FOS integration.

### Files

- `Checkbox.jsx` — component implementation
- `styles.css` — checkbox styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations
- `src/styles/tokens.css` — design tokens (loaded globally, not imported per-component)

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- `invalid` and `size` mirror the modern checkbox behavior.
- `dataId` is mapped to `data-id` on the root `<label>` element.
- Controlled usage: pass `checked` + `onChange`. Uncontrolled usage: pass `defaultChecked`.
- `disabled` blocks the native input. The label uses `--color-text-default-tertiary`; only the checkbox control is dimmed, including its checked state. Hover and focus styles do not activate when disabled.

### Example

```jsx
import React from 'react';
import Checkbox from './index';

export default function Example() {
  return (
    <Checkbox label="Согласен с условиями" defaultChecked={false} />
  );
}
```
