## Legacy InputText

React 17-compatible delivery of the floating-label text input for FOS integration.

### Files

- `InputText.jsx` — component implementation
- `styles.css` — input styles
- `index.js` — default export entry point
- `legacy/styles/tokens.css` — design tokens (loaded globally in Storybook, not imported per-component)

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- Runtime dependencies are explicit: `prop-types` and `classnames`.
- The date-of-birth mask depends on the neighboring legacy `Calendar` component and does not import from `src/`.
- Clear, calendar, and password visibility controls import SVG assets from the root `icons/` folder and render them through CSS masks for `currentColor` support.
- Clear action is rendered through the universal legacy `Button`, not a local native `button`.
- `dataId` is mapped to `data-id` on the native input. The clear button receives `${dataId}-clear`; the birth-date calendar button and flyout receive derived ids.
- `variant="switch"` renders the universal legacy `Switch` below the field. The switch receives `switchDataId` or `${dataId}-switch` and disables the input while checked.
- `onChange` receives the native React change event; use `onValueChange(value)` when a value-only handler is needed.
- Controlled mode uses `value` + `onValueChange`; uncontrolled mode uses `defaultValue` and can still observe native `onChange`.
- The component exposes a `focus()` imperative method through `ref`, matching the integration pattern from the FOS examples.
- `onFocusChange(focused)` is available when an integration needs a boolean focus signal.
- `error` is supported as a compatibility alias for `invalid`.
- `customInputStyle` is supported as a compatibility alias for an additional native input class.
- `helperText` is only shown in error states (`invalid` + blur).
- Legacy `helperIcon` and `showHelperIcon` props are accepted for compatibility, but helper text renders text-only in this review slice.
- `previewState` overrides the computed interactive state for Storybook/Figma matrix use.
- Custom `aria-describedby` values are preserved and combined with the helper text id when helper text is rendered.
- `mask` selects the field purpose without replacing the component: `phone`, `surname`, `name`, `code`, `password`, `login`, `inn`, `email`, `captcha`, `birthDate`.
- `phone`, `code`, and `inn` keep numeric-only entry. Phone formatting follows the current UI legacy behavior: `+7` is visual prefix, value is formatted as `(999) 999-99-99`.
- `birthDate` keeps the value as `дд.мм.гггг`, opens the shared legacy `Calendar`, and validates the built-in birth-date age range from 18 to 100 years.
- `surname` and `name` use the current Cyrillic filtering and paired-brackets validation from the UI legacy inputs. Middle-name flows should use `variant="switch"` with `label="Отчество"` and `switchLabel="Нет отчества"` instead of a separate public component.
- `password` uses the current allowed-character filtering and exposes an inline visibility toggle while preserving the same floating-label field.

### Masked Input Compatibility

`InputText` now covers the project-local mask presets needed for the FOS review slice.
It is still not a drop-in replacement for the old generic masked `Input` that used `react-text-mask`.
If a FOS integration expects `react-text-mask` helpers, pipe callbacks, mask-specific value transforms, or the old masked callback signatures, add a thin compatibility facade later instead of wiring that dependency into this base component.

### Example

```jsx
import React from 'react';
import InputText from './index';

export default function Example() {
  const [value, setValue] = React.useState('');

  return (
      <InputText
        dataId="email-input"
        helperText="Неверный формат"
        invalid={false}
        label="Email"
        mask="email"
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
