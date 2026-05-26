# Экспорт design tokens из Figma

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/connections/figma-artifacts-to-storybook]] | [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]] | [[memory/logs/2026-04-17]]

## Summary

В репозитории уже есть JSON-экспорт design tokens: primitives и collections для colors, spacings, radius, typography, responsive, effects, animation, а также mode-specific файлы для icon и color styles.
Поверх raw export теперь есть generated-слой `design-tokens/normalized/`, который собирается локальным builder-скриптом и предназначен для runtime-использования.

## Why It Matters

Это самый конкретный подтверждённый слой дизайна в кодовой базе на старте проекта. Через него можно выстроить тему, токен-пайплайн и правила для будущих компонентов без угадывания значений вручную.

## Known Patterns

- Держать raw export в репозитории как входной артефакт и отдельно проектировать слой потребления токенов.
- Генерировать runtime-friendly слой из raw export, а не подгонять Figma JSON под код вручную после каждого экспорта.
- Явно учитывать различие между primitive-токенами и style-токенами.
- Проверять совместимость light/dark режимов до появления большого числа компонентов.

## Known Pitfalls

- Редактировать raw export вручную без фиксации источника изменения.
- Смешивать primitives и semantic usage без отдельного слоя соглашений.
- Игнорировать mode-specific иконки и цветовые стили при построении тем.
- Пытаться использовать raw typography и animation tokens напрямую в коде, не нормализуя `fontWeight/fontStyle` и timing units.

## Related Modules Or Files

- `design-tokens/manifest.json`
- `design-tokens/Color Primitives.Mode 1.tokens.json`
- `design-tokens/Color Styles.Mode: Light.tokens.json`
- `design-tokens/Color Styles.Mode: Dark.tokens.json`
- `design-tokens/Icon.Mode: Light.tokens.json`
- `design-tokens/Icon.Mode: Dark.tokens.json`
- `design-tokens/normalized/runtime.tokens.json`
- `design-tokens/normalized/validation-report.json`
- `scripts/design_tokens/build_runtime_tokens.py`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/normalized-runtime-tokens]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
