## Legacy Dialog Modal

Thin React 17-compatible dialog wrapper over `legacy/components/modal`.

### Files

- `DialogModal.jsx` - runtime implementation
- `index.js` - public export entrypoint
- `index.d.ts` - public TypeScript contract for Storybook and consumers
- `DialogModal.stories.tsx` - Storybook review surface

### Notes

- `template` selects one of the business modal messages from the legacy modal dialogs.
- `variant` can be used directly when a consumer already follows the base `Modal` contract.
- `heading`, `description`, action labels, captcha labels, and input props can override the selected template.
- `dataId` maps through to the base modal `data-id`.
- Uses React 17-compatible JSX, PropTypes, and the base legacy `Modal` only.
