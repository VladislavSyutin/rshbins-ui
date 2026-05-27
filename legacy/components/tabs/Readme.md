## Legacy Tabs

React 17-compatible tabs for FOS integration.

### Files

- `Tabs.jsx` — tablist implementation with private tab button renderer
- `styles.css` — tabs and internal tab button styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations
- `Tabs.stories.tsx` — Storybook review surface

### Integration Notes

- Uses native `<button>` controls with `tablist` / `tab` semantics.
- The tab button is intentionally private because the current legacy delivery needs only a reusable group API.
- Supports controlled and uncontrolled usage through `value` / `defaultValue`.
- `onChange` receives `(value, event)`.
- Maps `dataId` to `data-id` on the root tablist; option-level `dataId` maps to the corresponding tab button.

### Example

```jsx
import React from 'react';
import Tabs from './index';

export default function Example() {
  return (
    <Tabs
      dataId="product-tabs"
      defaultValue="accounts"
      options={[
        { label: 'Счета', value: 'accounts' },
        { label: 'Карты', value: 'cards' },
        { label: 'Платежи', value: 'payments' }
      ]}
      onChange={function (value, event) {
        console.log(value, event.type);
      }}
    />
  );
}
```
