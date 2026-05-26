# Theme как переключатель светлой и тёмной темы приложения

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/design-token-exports]] | [[memory/logs/2026-04-21]]

## Summary

`src/components/theme/` добавляет Figma-driven переключатель темы приложения. Компонент `Theme` реализует node `3635:38635`: квадратная icon button около 40px, состояния default/hover/pressed/focused, `Moon` в светлой теме и `Sun` в тёмной теме. В обычной Vite-странице компонент применяется в `src/App.tsx` и переключает тему всех элементов через классы `.theme-light` и `.theme-dark` на `document.documentElement`, а не через Storybook toolbar.

## Why It Matters

До этого тема проверялась в основном через Storybook decorator. `Theme` делает тот же semantic token слой доступным в runtime-приложении: все компоненты, которые используют `src/styles/tokens.css` и semantic CSS variables, меняют оформление без дополнительной логики в каждом компоненте.

## Known Patterns

- `Theme` строить на `<button type="button">` с `aria-pressed`, чтобы переключатель был доступным и активировался click/Enter/Space.
- По умолчанию компонент сам применяет тему к `document.documentElement`; для Storybook/preview matrix использовать `applyToDocument={false}`.
- Поддерживать controlled/uncontrolled API через `mode`/`defaultMode` и `onModeChange`.
- Начальное значение брать из `localStorage`, затем из уже выставленных document classes, затем из `prefers-color-scheme`.
- Иконки брать из постоянных root `icons/moon.svg` и `icons/sun.svg`; не использовать краткоживущие Figma MCP asset URLs в runtime.
- Состояния выражать через semantic tokens: `--color-background-default-generic-hover`, `--color-background-default-generic-focus`, `--color-border-default-default-focus`, `--motion-hover-*`, `--motion-pressed-*`, `--motion-theme-*`.

## Known Pitfalls

- Не ограничивать переключение тем Storybook decorator-ом: для обычного приложения нужен класс на `document.documentElement`, иначе страница вне Storybook не сменит tokens.
- Не добавлять новый icon package для Theme; в проекте уже есть shared SVG assets в `icons/`.
- Не хардкодить light/dark цвета в компоненте: различия должны приходить из generated semantic variables в `src/styles/tokens.css`.
- Не считать Figma MCP Tailwind output production-ready; его нужно переводить в colocated Sass и project tokens.

## Related Modules Or Files

- `src/components/theme/Theme.tsx`
- `src/components/theme/Theme.scss`
- `src/components/theme/Theme.stories.tsx`
- `src/App.tsx`
- `src/App.scss`
- `src/main.tsx`
- `index.html`
- `icons/moon.svg`
- `icons/sun.svg`

## Related Concepts

- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/design-token-exports]]

## Source Logs

- [[memory/logs/2026-04-21]]
