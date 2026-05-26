# ADR: Зафиксировать Figma-to-code workflow в AGENTS.md

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/decisions/index]] | [[memory/knowledge/concepts/codex-agent-rules]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/logs/2026-04-17]]

## Status

Accepted

## Context

К середине bootstrap-этапа в репозитории уже подтверждены ключевые соглашения: UI kit строится из Figma, tokens проходят через raw export -> normalized runtime layer -> generated CSS variables, Storybook служит основной визуальной поверхностью проверки, а компоненты пишутся на React + TypeScript + Sass. Без явного project-level rule file агент может снова предлагать общие решения вроде Tailwind, инлайн-стилей или произвольной структуры файлов.

## Decision

Зафиксировать рабочий Figma-to-code процесс и соглашения репозитория в корневом `AGENTS.md`.

- Считать `AGENTS.md` главным operational source для Codex-задач в этом репозитории.
- Описать в нём обязательный MCP flow: `get_design_context` -> `get_screenshot` -> адаптация под проект -> визуальная проверка в Storybook.
- Зафиксировать проектные ограничения по styling approach, token usage, component layout, icon handling и validation checklist.
- Не переносить в `AGENTS.md` неподтверждённые архитектурные идеи; правила должны опираться на текущий код и структуру проекта.

## Alternatives Considered

- Держать соглашения только в памяти проекта и каждый раз пересказывать их в чате.
- Вообще не фиксировать правила агента до появления первых production-компонентов.

## Consequences

- Будущие Figma-задачи получают единый набор project-native ограничений и меньше склонны дрейфовать к шаблонным решениям.
- Память проекта теперь должна ссылаться на `AGENTS.md` как на operational layer поверх knowledge-notes.
- При развитии структуры проекта нужно поддерживать `AGENTS.md` в актуальном состоянии вместе с knowledge-слоем.
- Для новых runtime-компонентов разумно фиксировать не только общий workflow, но и устойчивые implementation patterns вроде `Button` matrix и shared `Spin`.

## Related Concepts

- [[memory/knowledge/concepts/button-component-matrix]]
- [[memory/knowledge/concepts/codex-agent-rules]]
- [[memory/knowledge/concepts/spin-component-geometry]]
- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
