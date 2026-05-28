# AuthenticationRegistrationData

Legacy template for collecting personal data during registration.

```jsx
import AuthenticationRegistrationData from './index.js';

<AuthenticationRegistrationData onSubmit={handleSubmit} />
```

- Uses existing `Header`, person-name inputs, `InputBirthDate`, `Gender`, `InputEmail`, `Checkbox`, and `Button`.
- Middle name is wired through the current `InputMiddleName` switch API.
- The template owns form-level validation only and returns a submit payload to the flow container.
