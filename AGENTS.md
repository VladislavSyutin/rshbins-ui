# RSHBINS Legacy Foundations Agent Rules

## Purpose

This worktree is for reusable legacy components that can be copied into the FOS legacy stack with minimal edits.

## Stack

- React 17-compatible JSX components.
- Plain CSS.
- Storybook is allowed only as a local review surface.
- TypeScript is allowed only for Storybook and `.d.ts` checks.

## Component Rules

- Public component implementations live in `legacy/components/`.
- `src/` may exist as a thin package entrypoint that re-exports the legacy delivery layer. Do not place modern component implementations there.
- Each public component should keep this shape:

```text
legacy/components/component-name/
  ComponentName.jsx
  styles.css
  index.js
  index.d.ts
  Readme.md
  ComponentName.stories.tsx
```

- Use `PropTypes` for runtime prop documentation.
- Use `classnames` for class composition.
- Expose `dataId` and map it to `data-id`.
- Prefer universal components over local native controls in composed components.
- Keep components reusable and scenario-neutral.

## What To Avoid

- Legacy runtime components must not import from `src/`.
- Do not add modern templates, prototypes, dialogs, or app shell code.
- Do not bring back old one-off legacy components unless they are rewritten to this contract.
- Do not use React 18/19-only APIs such as `useId`.
- Do not use Sass, CSS Modules, Tailwind, styled-components, or Vite app code.
