## Legacy Button

React 17-compatible delivery of the button component for FOS integration.

### Files

- `Button.jsx` — component implementation
- `styles.css` — button styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript contract for FOS examples and consumers
- `legacy/styles/tokens.css` — design tokens (loaded globally in Storybook, not imported per-component)

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- Runtime dependencies are explicit: `prop-types` and `classnames`.
- `dataId` is mapped to the native `data-id` attribute.
- `name` can be used as the visible label, matching the legacy FOS examples.
- `buttonType` is the FOS-facing API: `Button.buttonTypes.primary`, `secondary`, `flatPrimary`, `flatSecondary`.
- `buttonType` controls the visual style and has priority over visual `type` aliases.
- `type` keeps native button behavior for `button`, `submit`, and `reset`.
- For FOS/example compatibility, `type` also accepts visual aliases: `primary`, `secondary`, `flat-primary`, and `flat-secondary`. In that case the native HTML type is rendered as `button`.
- `loading`, `selected`, `iconOnly`, `leadingIcon`, and `trailingIcon` mirror the modern button behavior.

### Copy Checklist

Copy these Button files together:

- `legacy/components/button/Button.jsx`
- `legacy/components/button/styles.css`
- `legacy/components/button/index.js`
- `legacy/components/button/index.d.ts`

Also copy/load `legacy/styles/tokens.css` globally. The loading state renders `Spin`, so keep `legacy/components/spin/` available if `loading` is used.

### Example

```jsx
import React from 'react';
import Button from './index';

export default function Example() {
  return (
    <Button
      buttonType={Button.buttonTypes.primary}
      dataId="continue-button"
      name="Продолжить"
      onClick={handleContinue}
      size="m"
    />
  );
}
```
