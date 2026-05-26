# Legacy Components

This folder stores React 17-compatible component deliveries intended for FOS integration.

Each component folder should be self-contained and easy to copy:

```text
legacy/components/component-name/
  ComponentName.jsx
  styles.css
  index.js
  index.d.ts
  Readme.md
  ComponentName.stories.tsx
```

If a component needs helper files, keep them inside the same component folder unless the helpers are clearly shared across multiple legacy components.

Recommended conventions based on the sample FOS UI repository:

- class component or function component is both acceptable, but keep the implementation React 17-safe
- default export through `index.js` is preferred for copy/paste familiarity
- declare runtime props with `PropTypes`
- use `classnames` instead of local class-name join helpers
- expose `dataId` and map it to `data-id` on the meaningful DOM node
- use plain CSS selectors with stable class names
- keep README examples close to the actual integration shape

Input business variants should start with `Input` in the public component name so they are easy to find in consumers and Storybook, for example `InputPassword`, `InputBirthDate`, `InputSurname`, and `InputName`.
