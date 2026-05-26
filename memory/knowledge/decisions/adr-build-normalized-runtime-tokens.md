# ADR: Строить runtime-токены поверх raw Figma export

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/decisions/index]] | [[memory/knowledge/concepts/design-token-exports]] | [[memory/knowledge/concepts/normalized-runtime-tokens]] | [[memory/logs/2026-04-17]]

## Status

Accepted

## Context

Raw JSON-экспорт из Figma уже годится как входной артефакт, но в нём есть особенности, которые неудобны для прямого использования в UI kit: typography weight labels вместо runtime-friendly значений, timing tokens в `px`, потенциальные broken refs и naming, заточенный под Figma.

## Decision

Оставить raw export в `design-tokens/` как source artifact и строить отдельный generated runtime-слой через `scripts/design_tokens/build_runtime_tokens.py`.

- Raw export использовать как входные данные и не превращать в hand-edited runtime-файлы.
- Generated-слой писать в `design-tokens/normalized/`.
- После нового экспорта из Figma заново прогонять builder и проверять validation-report.

## Alternatives Considered

- Использовать raw JSON напрямую в коде и Storybook.
- Нормализовать файлы вручную после каждого экспорта из Figma.

## Consequences

- Появляется предсказуемый слой токенов для кода и визуальной проверки.
- Проще контролировать совместимость между design source и runtime.
- Любые особые правила нормализации должны жить в builder-скрипте, а не в разовых ручных правках.

## Related Concepts

- [[memory/knowledge/concepts/design-token-exports]]
- [[memory/knowledge/concepts/normalized-runtime-tokens]]

## Source Logs

- [[memory/logs/2026-04-17]]
