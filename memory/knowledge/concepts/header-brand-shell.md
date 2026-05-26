# Header как брендовый shell-компонент поверх Theme toggle

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/theme-toggle-control]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/logs/2026-04-21]]

## Summary

`src/components/header/` добавляет Figma-driven `Header` для верхней части страницы: слева брендовый логотип РСХБ Страхование, справа существующий `Theme`. Компонент реализован как composition-shell, а не как новый theme switcher или app-specific layout, и поддерживает размеры `l`, `m`, `s`, `xs` и `responsive`. Начиная с сессии 2026-04-21 логотип вынесен в отдельный reusable `src/components/logo/`, а `Header` только встраивает его как brand-trigger.

## Why It Matters

`Header` стал первым явным branded layout-компонентом поверх уже существующих primitives. Он закрепляет паттерн, где составные Figma-компоненты собираются из token-driven Sass, встроенного SVG-логотипа и уже готовых runtime-controls вместо копирования сырого MCP JSX.

## Known Patterns

- Реализовывать `Header` как отдельный reusable component в `src/components/header/`, а не как ad hoc разметку в `App.tsx`.
- Использовать существующий `Theme` через `themeProps`, не дублировать toggle-логику внутри `Header`.
- Логотип реализовывать как отдельный reusable `Logo`, а не как приватный inline SVG внутри `Header`; сам SVG по-прежнему должен сидеть на `--color-logo-text` и `--color-logo-line-*`, чтобы light/dark theme меняли брендовые цвета через токены.
- Для Storybook `Playground` использовать controlled `mode`/`onModeChange` и локальный wrapper `theme-light/theme-dark`, чтобы клик по `Theme` реально переключал оформление в canvas.
- Для `Overview` и фиксированных размеров проверять Figma breakpoints `1280 / 1024 / 744 / 361`.
- Focus-ring бренд-кнопки рисовать только на `:focus-visible` и через `outline` на самом `Logo`, а не через `border` на button: `border` меняет box size и визуально увеличивает высоту `Header`.

## Known Pitfalls

- Не полагаться только на Storybook toolbar для проверки `Header`: интерактивность toggle должна быть видна прямо в story.
- Не использовать краткоживущий Figma asset URL в runtime для логотипа; устойчивее встроить SVG и завязать его на проектные токены.
- Не использовать `:focus` для брендового ring в `Header`, иначе обводка появляется и после mouse click; для parity с клавиатурной навигацией нужен `:focus-visible`.
- Не смешивать `Header` с app-shell spacing в одном компоненте: внешний контейнер страницы и внутренние отступы самого `Header` должны оставаться раздельными.

## Related Modules Or Files

- `src/components/header/Header.tsx`
- `src/components/header/Header.scss`
- `src/components/header/Header.stories.tsx`
- `src/components/logo/Logo.tsx`
- `src/components/logo/Logo.scss`
- `src/components/logo/Logo.stories.tsx`
- `src/components/theme/Theme.tsx`
- `src/App.tsx`
- `src/App.scss`

## Related Concepts

- [[memory/knowledge/concepts/theme-toggle-control]]
- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/ui-kit-from-figma]]

## Source Logs

- [[memory/logs/2026-04-21]]
