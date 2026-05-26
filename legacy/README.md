# Legacy UI Delivery

`legacy/` is the only source layer in this worktree. It contains copy-friendly React 17-compatible components for FOS integration.

## Structure

```text
legacy/
  components/
  styles/
```

## Rules

- Components should stay compatible with React 17.
- Avoid React 18/19-only APIs such as `useId`.
- Prefer plain `.jsx` component sources for the delivered legacy layer.
- Prefer plain `.css` delivery for legacy component styles. Do not depend on Sass in the copied files.
- Keep dependencies explicit and minimal.
- Avoid `.module.css` unless a component genuinely needs local name isolation and the FOS team confirms that pattern is acceptable.
- Keep exports simple and familiar for the FOS stack, ideally through a local `index.js`.
- Add a Storybook story for each public legacy component.
- Treat Storybook as a review surface only. Final compatibility is defined by whether the files can be copied into the Webpack 3 / Babel legacy environment with minimal edits.
