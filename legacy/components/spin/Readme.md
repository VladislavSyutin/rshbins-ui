## Legacy Spin

React 17-compatible loading indicator for FOS integration.

### Files

- `Spin.jsx` — component implementation
- `styles.css` — spin styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript contract for local Storybook checks
- `legacy/styles/tokens.css` — design tokens (loaded globally in Storybook, not imported per-component)

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- Runtime dependencies are explicit: `prop-types` and `classnames`.
- The graphic imports `icons/spinner.svg` and renders it through a CSS mask so it keeps `currentColor`.
- `dataId` is mapped to the native `data-id` attribute. Existing `data-id` passthrough is also supported, with `dataId` preferred for the public API.
- `size` supports `2xs`, `xs`, `s`, `m`, `l`, and `xl`.
- `Spin.sizes` exposes named public size constants:
  - `Spin.sizes.twoExtraSmall` → `2xs`
  - `Spin.sizes.extraSmall` → `xs`
  - `Spin.sizes.small` → `s`
  - `Spin.sizes.medium` → `m`
  - `Spin.sizes.large` → `l`
  - `Spin.sizes.extraLarge` → `xl`
- Use `label` when the spinner should be announced as a loading status. With `label`, Spin renders `role="status"`, `aria-label={label}`, and `aria-live="polite"`.
- Without `label`, Spin is decorative by default and renders `aria-hidden="true"` unless an explicit `aria-hidden` value is passed.
- `Button` uses this shared Spin for its `loading` state. Do not add a separate local spinner inside Button; tune Spin here instead.

### Example

```jsx
import React from 'react';
import Spin from './index';

export default function Example() {
  return (
    <Spin
      dataId="submit-loader"
      label="Загрузка"
      size={Spin.sizes.small}
    />
  );
}
```

### Button loading

```jsx
import React from 'react';
import Button from '../button';

export default function SubmitButton() {
  return (
    <Button
      dataId="submit-button"
      loading
      name="Отправить"
      size="m"
    />
  );
}
```
