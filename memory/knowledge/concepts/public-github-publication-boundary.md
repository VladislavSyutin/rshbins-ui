# Публичная публикация UI kit на GitHub

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/logs/index]] | [[memory/knowledge/concepts/codex-agent-rules]] | [[memory/knowledge/concepts/design-token-exports]] | [[memory/knowledge/concepts/storybook-theme-preview]]

## Summary

Репозиторий `RSHBINS UI` опубликован на GitHub как публичный исходник UI kit, но проектная память и локальные служебные артефакты не входят в публичный контур. Публичной единицей публикации считаются исходники компонентов, токены, Storybook-конфиг, иконки и скрипты token pipeline.

## Why It Matters

Это разделяет внешний контракт библиотеки и внутренний рабочий контекст. Команды могут использовать публичный репозиторий как source of truth для UI kit, не получая вместе с ним внутренние журналы, локальные заметки и вспомогательные Codex-артефакты.

## Known Patterns

- Публиковать в GitHub `src/`, `design-tokens/`, `icons/`, `.storybook/`, `scripts/design_tokens/`, `package.json`, `package-lock.json`, `README.md`, `AGENTS.md`.
- Исключать из публичного контура `memory/`, `scripts/project_memory/`, `.codex/`, `.env*`, `node_modules/`, build outputs.
- Оставлять `"private": true` в `package.json`, если репозиторий должен быть публичным на GitHub, но не должен случайно публиковаться в npm.
- Держать публичное описание и правила входа в `README.md`, а рабочую память — только в `memory/`.
- Перед первой публикацией проверять `git status --ignored`, чтобы убедиться, что внутренние каталоги действительно не попадают в индекс.

## Known Pitfalls

- Если полагаться только на устную договорённость, `memory/` или `.env*` легко утекут в первый коммит.
- iCloud `dataless`-файлы могут ломать staging: Git зависает на чтении placeholder-файлов, пока они не материализованы локально или не будут переписаны.
- Публичный GitHub-репозиторий сам по себе не решает версионирование потребления; без отдельной release-модели продуктовые команды начнут копировать код вручную.

## Related Modules Or Files

- `.gitignore`
- `README.md`
- `package.json`
- `icons/`
- `memory/`
- `scripts/project_memory/`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/codex-agent-rules]]
- [[memory/knowledge/concepts/design-token-exports]]
- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/ui-kit-from-figma]]

## Source Logs

- [[memory/logs/2026-04-24]]
