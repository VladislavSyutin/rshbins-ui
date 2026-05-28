# AuthenticationFirstScreen

Legacy auth template for the first authentication screen in prototype flows.

## Composition

- `Header`
- `SegmentedControl`
- `Button`
- `Divider`
- `Checkbox`
- `InputPhone`
- `InputLogin`
- `InputPassword`

## Notes

- Runtime delivery stays in `legacy/templates/` and does not import from `src/`.
- The template is React 17-compatible and uses plain CSS plus existing legacy tokens.
- `clientType` can be controlled from a prototype page, while field values stay internal to the template.
- `phoneInputProps`, `loginInputProps`, `passwordInputProps`, and `consentCheckboxProps` are passthrough prop bags for the reused primitives.
