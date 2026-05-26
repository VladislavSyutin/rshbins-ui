# RSHBINS UI FOS Storybook

This folder is a meeting-ready Storybook copy prepared from `RSHBINS UI Legacy`.
It is intentionally separate from the main `RSHBINS UI` repository and from the
current `RSHBINS UI Legacy` worktree.

The goal is to show FOS developers a narrow, clean delivery slice without
changing the current visual and interaction baseline.

## Scope

- `legacy/components/button`
- `legacy/components/input-text`
- `legacy/components/spin`

No new library components are added here. Bootstrap and FOS sample archives are
used only as compatibility checklists, not as source code.

## Run Storybook

```bash
npm install
npm run storybook
```

Storybook runs on `http://localhost:6008/`.

## What To Show

- `Legacy/Components/Button` - action primitive, visual states, icon-only,
  and loading through shared `Spin`.
- `Legacy/Components/InputText` - floating-label field mechanics, clear action,
  13-state matrix, and one component API with FOS mask presets.
- `Legacy/Components/Spin` - shared loading primitive, sizes, accessible status,
  and usage inside Button loading.

## Legacy Contract

- React 17-compatible component sources in plain `.jsx`.
- Plain CSS, no Sass, CSS Modules, Tailwind, or styled-components.
- `PropTypes` for runtime props.
- `classnames` for class composition.
- `dataId` mapped to `data-id` on the meaningful DOM node.
- Local `index.js`, `Readme.md`, and Storybook story per public component.
- No imports from `src/`, modern templates, prototypes, dialogs, or generated modern app layers.

## Compatibility Boundary

Storybook 10 + Vite is used as a review surface for this meeting. It proves that
the copied component slice renders and typechecks locally, but it does not by
itself prove compatibility with the FOS Webpack 3/Babel build. A separate smoke
integration in the FOS stack is the next validation step.
