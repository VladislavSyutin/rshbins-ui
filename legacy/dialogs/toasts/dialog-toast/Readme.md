## Legacy Dialog Toast

Thin React 17-compatible dialog wrapper over `legacy/components/toast`.

### Files

- `DialogToast.jsx` - runtime implementation
- `index.js` - public export entrypoint
- `index.d.ts` - public TypeScript contract for Storybook and consumers
- `DialogToast.stories.tsx` - Storybook review surface

### Notes

- `template` selects one of the business toast messages.
- `state="success"` maps to the success toast variant and overrides the template state.
- `state="failure"` maps to the danger toast variant and overrides the template state.
- `variant` can be used directly when a consumer already follows the base `Toast` contract.
- `dataId` maps through to the base toast `data-id`.
- `autoCloseDuration` defaults in the base `Toast` to `5000`; pass `null` to disable auto-close in static previews.
