## Legacy InputBirthDate

React 17-compatible birth-date input for FOS integration.

`InputBirthDate` composes the shared legacy `InputText` and owns date-of-birth formatting, validation, and calendar behavior.

Formatting and calendar mechanics are now shared through `InputDate`. `InputBirthDate` remains the age-specific wrapper with the same public props, root class alias, and imperative ref.

### Integration Notes

- Runtime dependencies stay the same as `InputText`: `prop-types` and `classnames`.
- `dataId` is passed through to `InputText` and rendered as `data-id` on the native input.
- The component preserves the shared floating-label field, clear action, helper/error behavior, and imperative `focus()` ref.
- Date formatting, calendar opening, and the 18-100 age range are implemented in this component, while `InputText` provides only the base field UI.

### Example

```jsx
import React from 'react';
import InputBirthDate from './index';

export default function Example() {
  const [birthDate, setBirthDate] = React.useState('');

  return (
    <InputBirthDate
      dataId="birth-date"
      helperText="Вспомогательный текст"
      label="Дата рождения"
      onValueChange={setBirthDate}
      value={birthDate}
    />
  );
}
```
