## Legacy TextLink

React 17-compatible delivery of a text link for FOS integration.

### Files

- `TextLink.jsx` — component implementation
- `styles.css` — shared text-link styles
- `index.js` — default export entry point
- `index.d.ts` — TypeScript type declarations

### Integration Notes

- `size="m"` uses body typography and fits standalone actions like "Забыли логин или пароль?".
- `size="s"` uses footnote typography and fits inline legal/consent copy.
- `as="button"` renders a semantic `<button>` for action links without navigation.
- `href` renders a semantic `<a>` and supports standard anchor attributes like `target` and `rel`.
- `dataId` is mapped to `data-id` on the root element.
- All unrecognised props are forwarded to the rendered anchor or button.
