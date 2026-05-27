# Divider как token-driven разделитель контента

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/concepts/design-token-exports]] | [[memory/logs/2026-04-21]]

## Summary

`src/components/divider/` добавляет в UI kit простой горизонтальный разделитель из Figma node `3830:16358` с двумя режимами: `text` и `without-text`. Компонент построен как presentational primitive на `div` со строкой-лейблом между двумя линиями и использует semantic tokens для border, tertiary text и `body-regular` typography.

## Why It Matters

`Divider` закрепляет важный для этого репозитория паттерн: даже самые простые Figma-driven primitives должны входить в библиотеку как переиспользуемые token-driven компоненты со Storybook-покрытием и проверкой обеих тем, а не как разовый фрагмент разметки внутри конкретного экрана.

## Known Patterns

- Для API достаточно `view="text" | "without-text"` и `label`, потому что логика компонента purely presentational.
- Обе линии строятся как flex-items с `border-bottom: 1px solid var(--color-border-default-default)`; текст живёт между ними и получает `padding-inline: 8px`.
- Текст должен наследовать `--color-text-default-tertiary` и полную группу `--typography-body-regular-*`, чтобы parity сохранялась в светлой и тёмной темах.
- Storybook должен показывать как минимум `Playground` и `Overview`, где явно видны оба варианта в `theme-light` и `theme-dark`.
- Для простых разделителей не нужен отдельный icon asset, дополнительная зависимость или runtime token composition в TSX.

## Known Pitfalls

- Не хардкодить цвет линии `rgba(...)` или hex из Figma, если уже есть semantic border token.
- Не превращать `Divider` в декоративный `hr`, если нужен текстовый вариант с предсказуемой центровкой и token typography.
- Не ограничиваться проверкой только в одной теме: в dark theme token `--color-border-default-default` и `--color-text-default-tertiary` меняются заметно.
- Не хранить такой primitive внутри более сложного компонента, если он уже повторяет отдельный Figma component.

## Related Modules Or Files

- `src/components/divider/Divider.tsx`
- `src/components/divider/Divider.scss`
- `src/components/divider/Divider.stories.tsx`
- `src/styles/tokens.css`
- `legacy/components/divider/Divider.jsx` — React 17/plain CSS FOS-поставка
- `legacy/components/divider/styles.css`
- `legacy/components/divider/index.js`
- `legacy/components/divider/index.d.ts`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/design-token-exports]]

## Source Logs

- [[memory/logs/2026-04-21]]
