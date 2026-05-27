## Legacy SegmentedControl

React 17-compatible segmented control for FOS integration.

### Files

- `SegmentedControl.jsx` — group implementation with private segment item
- `styles.css` — segmented-control and internal segment styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations
- `SegmentedControl.stories.tsx` — Storybook review surface

### Integration Notes

- Uses native `input[type='radio']` controls inside a horizontal `radiogroup`.
- The segment item is intentionally private because the current legacy delivery needs only a reusable group API.
- Supports controlled and uncontrolled usage through `value`/`defaultValue`.
- `onChange` receives `(value, event)`.
- Auto-generates a radio `name` when one is not provided.
- Maps `dataId` to `data-id` on the group; option-level `dataId` maps to the corresponding segment label.

### Example

```jsx
import React from 'react';
import SegmentedControl from './index';

export default function Example() {
  return (
    <SegmentedControl
      dataId="view-mode"
      defaultValue="cards"
      options={[
        { label: 'Плитка', value: 'cards' },
        { label: 'Список', value: 'list' }
      ]}
      onChange={function (value, event) {
        console.log(value, event.target.name);
      }}
    />
  );
}
```
