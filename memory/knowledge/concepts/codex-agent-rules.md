# Правила агента в AGENTS.md

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/normalized-runtime-tokens]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]] | [[memory/logs/2026-04-17]]

## Summary

В корне репозитория появился `AGENTS.md`, который фиксирует проектные правила для Codex при Figma-driven разработке: обязательный MCP workflow, React + TypeScript + colocated Sass, использование semantic CSS variables, работу через Storybook и запрет на параллельные styling-системы вроде Tailwind или CSS Modules.

## Why It Matters

Память проекта описывает знания и решения, но именно `AGENTS.md` служит исполняемым operational-contract для будущих сессий. Он снижает риск того, что агент начнёт генерировать код по общим шаблонам вместо реальных соглашений репозитория.

## Known Patterns

- Хранить Figma-to-code правила в одном корневом файле, который Codex подхватывает автоматически.
- Привязывать правила к реальной структуре репозитория: `src/components/`, `src/styles/`, `src/theme/`, `icons/`, `.storybook/`.
- В правилах разделять source-of-truth для raw tokens, normalized runtime tokens и generated CSS variables.
- Завязывать завершение Figma-задач на визуальную проверку в Storybook, а не только на прохождение typecheck.

## Known Pitfalls

- Обновлять кодовую базу и не синхронизировать `AGENTS.md`, из-за чего агентские правила начинают отставать от проекта.
- Описывать в `AGENTS.md` желаемую архитектуру, которая ещё не подтверждена кодом.
- Дублировать правила в нескольких местах без явного primary source.
- Считать память проекта заменой `AGENTS.md`, хотя она скорее объясняет контекст и историю решений.

## Related Modules Or Files

- `AGENTS.md`
- `src/styles/global.scss`
- `src/styles/tokens.css`
- `src/theme/runtimeTokens.ts`
- `.storybook/preview.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/normalized-runtime-tokens]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
