# AuthenticationEmailConfirmation

Legacy auth template for email code confirmation flows.

## Composition

- `Header`
- `InputCodeItem`
- `Button`
- `DialogToast` with `template="new-code-sent"`

## Notes

- `email` comes from the previous step; demo values belong in stories or prototype orchestration, not in runtime defaults.
- `emailMode` toggles between visible and masked address rendering.
- Resend feedback is rendered through a portal to `document.body` so the toast keeps viewport-based placement.
