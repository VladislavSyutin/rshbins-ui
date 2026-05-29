# AuthenticationPrototype

FOS-ready legacy authentication prototype assembled from the current `legacy/templates/authentication/*` delivery layer.

```jsx
import AuthenticationPrototype from './index.js';

<AuthenticationPrototype />
```

## Scenario Triggers

- Any ordinary individual phone number opens the SMS code step and then policyholder details.
- `79999999990` opens SMS code and then final success loading.
- `79999999991` opens proof-of-identity modal before SMS code.
- `79999999992` opens captcha; entering `timeout` opens the timeout modal.
- Corporate `login` / `password` succeeds; any other credentials show the user-not-found toast.
- Registration supports email and phone branches, then code confirmation and creating login/password.
- Restoring access supports password and login branches, with email and phone confirmation.
- Policyholder email `info@rshbins.ru` opens the Госуслуги modal.

## Notes

- Runtime stays in `legacy/prototypes/` and imports only legacy templates, dialogs, and components.
- Visible confirmation links labelled `Изм.` return to the previous form with the submitted draft values restored.
- Async demos keep loading feedback on the relevant action/code step without globally disabling all controls.
- Styles are plain CSS and reuse the token layer from `legacy/styles/preview.css`.
- Storybook is the review surface; FOS runtime proof still requires copying into the host stack.
