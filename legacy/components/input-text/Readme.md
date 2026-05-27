## Legacy InputText

React 17-compatible delivery of the shared floating-label text input for FOS integration.

`InputText` is a visual and interaction primitive. Business-specific behavior belongs in named `Input...` components such as `InputPassword`, `InputBirthDate`, `InputSurname`, and `InputName`.

### Files

- `InputText.jsx` — base text input implementation
- `styles.css` — input styles
- `index.js` — default export entry point
- `legacy/styles/tokens.css` — design tokens (loaded globally in Storybook, not imported per-component)

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- Runtime dependencies are explicit: `prop-types` and `classnames`.
- Clear action is rendered through the universal legacy `Button`, not a local native `button`.
- `dataId` is mapped to `data-id` on the native input. The clear button receives `${dataId}-clear`.
- `onChange` receives the native React change event; use `onValueChange(value)` when a value-only handler is needed.
- Controlled mode uses `value` + `onValueChange`; uncontrolled mode uses `defaultValue` and can still observe native `onChange`.
- The component exposes a `focus()` imperative method through `ref`, matching the integration pattern from the FOS examples.
- `onFocusChange(focused)` is available when an integration needs a boolean focus signal.
- `error` is supported as a compatibility alias for `invalid`.
- `customInputStyle` is supported as a compatibility alias for an additional native input class.
- `helperText` is only shown in error states (`invalid` + blur or preview error state).
- `helperText` renders text-only; icon-based helper display is not supported.
- Custom `aria-describedby` values are preserved and combined with the helper text id when helper text is rendered.
- Generic composition points are available through `prefix`, `maskOverlay`, `hideControlValue`, and `endAdornment`; business validation and formatting should live in the composing `Input...` component.

### Example

```jsx
import React from 'react';
import InputText from './index';

export default function Example() {
  const [value, setValue] = React.useState('');

  return (
    <InputText
      dataId="contract-number"
      helperText="Заполните поле"
      invalid={false}
      label="Номер договора"
      onValueChange={setValue}
      value={value}
    />
  );
}
```

### Ref Focus Example

```jsx
import React from 'react';
import InputText from './index';

export default function FocusExample() {
  const inputRef = React.useRef(null);
  const [focused, setFocused] = React.useState(false);

  return (
    <>
      <InputText
        dataId="contract-number"
        label="Номер договора"
        onFocusChange={setFocused}
        ref={inputRef}
      />
      <span>{focused ? 'Focused' : 'Not focused'}</span>
      <button type="button" onClick={() => inputRef.current?.focus()}>
        Focus input
      </button>
    </>
  );
}
```
