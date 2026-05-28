# AuthenticationPhoneConfirmation

Legacy authentication template for confirming a phone number with a four-digit code.

```jsx
import AuthenticationPhoneConfirmation from './index.js';

<AuthenticationPhoneConfirmation
  phoneNumber="+7 (952) 999-99-99"
  onChangePhone={handleChangePhone}
  onRequestEmailCode={handleRequestEmailCode}
/>
```

- Uses existing `Header`, `InputCodeItem`, `Button`, and `DialogToast`.
- Resend feedback is rendered through `DialogToast` with `template="new-code-sent"`.
- The template does not own routing; pass `onChangePhone` and `onRequestEmailCode` from the flow container.
