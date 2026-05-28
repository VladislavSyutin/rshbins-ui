# AuthenticationRestoringAccess

Legacy template for restoring a password or login.

```jsx
import AuthenticationRestoringAccess from './index.js';

<AuthenticationRestoringAccess
  defaultRestoringFlow="password"
  onPasswordSubmit={handlePasswordSubmit}
  onRestoringLoginSubmit={handleLoginSubmit}
/>
```

- Uses existing `Header`, `Button`, `SegmentedControl`, `Tabs`, `InputLogin`, `InputInn`, `InputEmail`, `InputPhone`, and `Checkbox`.
- Supports controlled and uncontrolled `restoringFlow` and `loginMethod`.
- The template does not own navigation; `onBack` and submit callbacks are passed from the flow container.
