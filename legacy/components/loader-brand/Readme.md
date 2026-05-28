## Legacy LoaderBrand

React 17-compatible brand loader for FOS integration.

### Files

- `LoaderBrand.jsx` — component implementation
- `styles.css` — plain CSS styles
- `index.js` — default export entry point
- `index.d.ts` — public TypeScript contract for local checks

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component uses React 17-safe hooks, `PropTypes`, `classnames`, and plain CSS.
- `dataId` maps to `data-id` on the root node.
- Animation timings use the same values as the design tokens: logo `200ms`, text `300ms`, text delay `5000ms`.
- `logoStep` and `textStep` are optional overrides for static preview rendering; omit both for autoplay.
- `autoPlay={false}` with explicit `logoStep` and `textStep` is useful for Storybook matrices.

### Example

```jsx
import React from 'react';
import LoaderBrand from './index';

export default function Example() {
  return <LoaderBrand dataId="page-loader" />;
}
```
