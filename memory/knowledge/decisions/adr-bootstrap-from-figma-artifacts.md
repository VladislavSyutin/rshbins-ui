# ADR: Использовать Figma-артефакты как стартовый baseline UI kit

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/decisions/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/design-token-exports]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/logs/2026-04-17]]

## Status

Accepted

## Context

Пользователь зафиксировал направление проекта: разработка UI kit на основе дизайна в Figma. В репозитории уже есть экспортированные design tokens, каталог SVG-иконок и базовая настройка Storybook с режимами `light/dark`, но каталога `src/` и компонентной реализации пока нет.

## Decision

На старте считать Figma и экспортированные из неё артефакты входным baseline для UI kit.

- Хранить `design-tokens/` и `icons/` как подтверждённые исходные артефакты проекта.
- Развивать UI kit последовательно: foundations -> icons -> primitive components -> composed components -> stories.
- Использовать Storybook как основную локальную поверхность визуальной проверки тем, состояний и вариантов компонентов.

## Alternatives Considered

- Начать писать компоненты сразу, не фиксируя source-of-truth для токенов и тем.
- Ждать полной автоматизации синхронизации с Figma до начала разработки.

## Consequences

- Появляется явная точка опоры для будущей реализации и памяти проекта.
- Проще контролировать соответствие light/dark тем и базовых визуальных правил.
- Понадобится отдельное решение о трансформации raw token export в runtime-слой UI kit, когда появится код компонентов.

## Related Concepts

- [[memory/knowledge/concepts/codex-agent-rules]]
- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/design-token-exports]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
