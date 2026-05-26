# Figma-артефакты ↔ Storybook preview

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/connections/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/design-token-exports]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/logs/2026-04-17]]

## Relationship

Экспортированные из Figma токены и иконки дают исходный визуальный материал, а Storybook должен стать первым местом, где этот материал превращается в проверяемые light/dark темы, stories и компонентные состояния.

## Why This Connection Matters

Без этой связи `design-tokens/` останется просто архивом JSON-файлов, а Storybook станет витриной без гарантии соответствия исходному дизайну.

## Typical Failure Modes

- Токены лежат в репозитории, но Storybook использует собственные значения.
- Theme switch в Storybook не совпадает с логикой mode-файлов в токенах.
- Иконки и глобальные стили начинают жить по отдельным соглашениям.

## Trade-offs

- Такой старт позволяет быстро собирать foundations и визуально проверять их в изоляции.
- При этом позже почти наверняка понадобится отдельный transformation layer между raw token export и runtime-токенами UI kit.

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/design-token-exports]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
