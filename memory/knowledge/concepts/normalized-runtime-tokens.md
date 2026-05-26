# Нормализованный runtime-слой токенов

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/design-token-exports]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-build-normalized-runtime-tokens]] | [[memory/logs/2026-04-17]]

## Summary

Raw export из Figma хранится как входной артефакт в `design-tokens/`, а для кода и Storybook теперь собирается отдельный runtime-friendly слой в `design-tokens/normalized/` через `scripts/design_tokens/build_runtime_tokens.py`. Поверх него дополнительно генерируется CSS variables слой в `src/styles/tokens.css` через `scripts/design_tokens/export_css_variables.py`.

## Why It Matters

Такой слой снимает типичные проблемы прямого использования Figma-export в коде: битые refs, design-label значения для `fontWeight`, timing в `px`, а также неудобное именование для runtime-потребителей.

## Known Patterns

- Исправлять в raw export только объективные ошибки совместимости, а основную нормализацию выполнять в builder-скрипте.
- Использовать `design-tokens/normalized/runtime.tokens.json` как ближайший source для UI kit runtime.
- Проверять `design-tokens/normalized/validation-report.json` после каждого нового экспорта из Figma.
- Генерировать `src/styles/tokens.css` перед typecheck и сборкой Storybook, чтобы глобальные стили и stories всегда использовали актуальные variables.

## Known Pitfalls

- Подправлять generated-файлы вручную вместо изменения builder-логики.
- Подключать raw export напрямую в компоненты и тему.
- Игнорировать warnings из validation-report после свежего экспорта.
- Разводить runtime JSON и CSS variables слой по разным соглашениям имён.

## Related Modules Or Files

- `design-tokens/README.md`
- `design-tokens/normalized/runtime.tokens.json`
- `design-tokens/normalized/validation-report.json`
- `scripts/design_tokens/build_runtime_tokens.py`
- `scripts/design_tokens/export_css_variables.py`
- `src/styles/tokens.css`

## Related Decisions

- [[memory/knowledge/decisions/adr-build-normalized-runtime-tokens]]

## Related Concepts

- [[memory/knowledge/concepts/design-token-exports]]
- [[memory/knowledge/concepts/codex-agent-rules]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
