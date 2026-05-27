## Legacy RadioGroup

React 17-compatible radio group for FOS integration.

### Files

- `RadioGroup.jsx` — component implementation
- `styles.css` — radio group and internal radio option styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations
- `RadioGroup.stories.tsx` — Storybook review surface

### Integration Notes

- Uses native `input[type='radio']` controls and `role='radiogroup'`.
- The individual radio option is intentionally internal because this delivery currently needs only a reusable group API.
- Supports controlled and uncontrolled usage through `value`/`defaultValue`.
- `onChange` receives `(value, event)`.
- Auto-generates a radio `name` when one is not provided.
- Maps `dataId` to `data-id` on the group; option-level `dataId` maps to the corresponding option label.

### Example

```jsx
import React from 'react';
import RadioGroup from './index';

export default function Example() {
  return (
    <RadioGroup
      dataId="payment-method"
      defaultValue="card"
      options={[
        { label: 'Банковская карта', value: 'card' },
        { label: 'Счет в РСХБ', value: 'account' }
      ]}
      onChange={function (value, event) {
        console.log(value, event.target.name);
      }}
    />
  );
}
```
