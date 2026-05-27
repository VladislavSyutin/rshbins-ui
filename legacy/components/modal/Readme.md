# Legacy Modal

React 17-compatible modal dialog for FOS integration.

## Files

- `Modal.jsx` — component implementation
- `styles.css` — modal surface, overlay, and token-driven motion
- `index.js` — default export entry point
- `index.d.ts` — TypeScript contract for local checks and Storybook
- `Modal.stories.tsx` — Storybook review surface

## Integration Notes

- Uses `Button` from `../button/index.js` for all built-in actions and captcha icon controls.
- Uses `InputText` from `../input-text/index.js` for `captcha` and `text-input` variants.
- Maps `dataId` prop to `data-id` on the dialog root.
- `placement="top-center"` wraps the dialog in a fullscreen overlay layer. Render it in a portal in the consuming app.
- `actions` accepts either a React node or a render function `({ requestClose }) => ReactNode` for custom action layouts.
- Built-in close flows wait for the CSS motion token `--motion-move-in-up-duration` before calling `onClose`.
- Uses React 17-compatible JSX, PropTypes, `classnames`, and plain CSS only.

## FOS Risks

- CSS animations (`@keyframes`) and `min()` should be verified in the target Webpack 3 / PostCSS pipeline.
- Consumer must control mount/unmount. If the component is removed directly without calling a built-in close action or `requestClose`, exit motion will not play.

## Example

```jsx
import React, { useState } from 'react';
import Modal from './index';
import Button from '../button';

export default function Example() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setVisible(true)} type="button">
        Открыть
      </Button>
      {visible ? (
        <Modal
          dataId="confirm-modal"
          heading="Подтверждение"
          description="Вы уверены, что хотите продолжить?"
          placement="top-center"
          onClose={() => setVisible(false)}
        />
      ) : null}
    </>
  );
}
```
