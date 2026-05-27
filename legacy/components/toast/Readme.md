## Legacy Toast

React 17-compatible toast for the FOS legacy stack.

### Files

- `Toast.jsx` - runtime implementation
- `styles.css` - plain CSS delivery styles
- `index.js` - public export entrypoint
- `index.d.ts` - public TypeScript contract for Storybook and consumers

### Notes

- `dataId` maps to `data-id`.
- `variant` supports `danger` and `success`.
- `placement="top-center"` uses fixed positioning relative to the browser viewport, so the consuming app should render it through a portal when needed.
- `autoCloseDuration` defaults to `5000`; pass `null` to disable auto-close.
- Close flow waits for the exit motion before calling `onClose`.
