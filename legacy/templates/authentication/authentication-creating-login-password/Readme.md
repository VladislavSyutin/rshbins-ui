# AuthenticationCreatingLoginPassword

Legacy auth template for creating a login, a password, or both credentials.

## Modes

- `login`
- `password`
- `login-and-password`

## Composition

- `Header`
- `InputLogin`
- `InputPassword`
- `Button`

## Notes

- Password rules are derived from the first password field and rendered as part of the template surface.
- The template stays form-level and presentational: it validates local input and returns entered values through `onSubmit`.
- Runtime delivery stays in `legacy/templates/` and does not import from `src/`.
