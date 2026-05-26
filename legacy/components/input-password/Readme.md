## Legacy InputPassword

React 17-compatible password input for FOS integration.

`InputPassword` composes the shared legacy `InputText` and owns password-specific filtering, validation, and visibility toggling.

### Integration Notes

- Runtime dependencies stay the same as `InputText`: `prop-types` and `classnames`.
- `dataId` is passed through to `InputText` and rendered as `data-id` on the native input.
- The component preserves the shared floating-label field, clear action, helper/error behavior, and imperative `focus()` ref.
- Password filtering and the visibility toggle are implemented in this component, while `InputText` provides only the base field UI.

### Example

```jsx
import React from 'react';
import InputPassword from './index';

export default function Example() {
  const [password, setPassword] = React.useState('');

  return (
    <InputPassword
      dataId="password"
      helperText="Введите пароль"
      label="Пароль"
      onValueChange={setPassword}
      value={password}
    />
  );
}
```
