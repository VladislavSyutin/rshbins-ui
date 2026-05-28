# AuthenticationRegistration

Legacy registration template for choosing a contact method and submitting policy registration data.

```jsx
import AuthenticationRegistration from './index.js';

<AuthenticationRegistration
  defaultMethod="email"
  onBack={handleBack}
  onSubmit={handleSubmit}
/>
```

- Uses existing `Header`, `Button`, `Tabs`, `InputInn`, `InputEmail`, `InputPhone`, and `Checkbox`.
- Supports controlled `method` and uncontrolled `defaultMethod`.
- The template owns only form-level state and validation; routing stays in the flow container.
