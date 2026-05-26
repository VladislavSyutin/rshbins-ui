# Storybook как поверхность визуальной проверки

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/connections/figma-artifacts-to-storybook]] | [[memory/logs/2026-04-17]] | [[memory/logs/2026-04-21]]

## Summary

Storybook уже настроен на `@storybook/react-vite`, ожидает stories в `src/**/*.stories.@(ts|tsx)`, использует `layout: fullscreen`, импортирует `../src/styles/global.scss`, подключает набор весов Ubuntu и даёт глобальный переключатель `light/dark`.

## Why It Matters

Теперь Storybook не просто заготовка, а реальная точка визуального контроля для токенов, тем и первых компонентных паттернов до начала разработки UI kit-компонентов из Figma.

## Known Patterns

- Использовать Storybook как первую интеграционную площадку для tokens и themes.
- Генерировать CSS variables из normalized runtime-токенов перед запуском Storybook.
- Держать имена тем и surface-классы синхронными с соглашениями design tokens.
- Проверять базовые stories и глобальные стили до наращивания component catalog.
- Использовать Storybook как поверхность визуальной проверки реальных компонентов и сценариев в обеих темах.
- Для production-компонентов собирать отдельный `Playground` и обзорную матрицу состояний/размеров, как у `Button` и `Spin`.
- Для Storybook 10 + Vite 8 + React 19 держать в `.storybook/main.ts` `viteFinal` с `legacy.inconsistentCjsInterop: true`, иначе Storybook internal renderer может упасть на default-import React/JSX runtime.
- Если manager Storybook открылся, но конкретная story/docs остаётся на спиннере, проверять прямые Vite module URL через `curl --max-time`, например `/src/components/checkbox/Checkbox.tsx` и соответствующий `.stories.tsx`.
- Если прямой URL модуля зависает без ошибки, проверять чтение файла локально: возможен битый/нечитаемый файл, который подвешивает Vite import pipeline.
- После восстановления зависшего module file очищать `node_modules/.cache/storybook` и перезапускать Storybook, чтобы preview не держался за старый transform cache.

## Known Pitfalls

- Держать Storybook-конфиг отдельно от реальной темы приложения.
- Хардкодить демонстрационные стили в stories вместо использования токенов.
- Править `src/styles/tokens.css` вручную вместо повторной генерации через scripts.
- Сразу переходить к сложным компонентам, не проверив целевые stories и сценарии в обеих темах.
- Ограничиваться проверкой `index.json`: он может видеть story entry, даже если импорт конкретного component module зависает.
- Путать спиннер preview с ошибкой компонента: иногда root cause лежит в Vite transform/cache или нечитаемом source file, а не в JSX runtime.

## Related Modules Or Files

- `.storybook/main.ts`
- `.storybook/preview.tsx`
- `package.json`
- `src/`
- `src/styles/global.scss`
- `src/styles/tokens.css`
- `scripts/design_tokens/export_css_variables.py`
- `src/components/checkbox/Checkbox.tsx`
- `src/components/checkbox/Checkbox.stories.tsx`
- `src/components/radio-group/RadioGroup.tsx`
- `src/components/radio-group/RadioGroup.stories.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/button-component-matrix]]
- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/design-token-exports]]
- [[memory/knowledge/concepts/codex-agent-rules]]
- [[memory/knowledge/concepts/normalized-runtime-tokens]]
- [[memory/knowledge/concepts/spin-component-geometry]]
- [[memory/knowledge/concepts/checkbox-form-control]]
- [[memory/knowledge/concepts/radio-group-single-select-control]]

## Source Logs

- [[memory/logs/2026-04-17]]
- [[memory/logs/2026-04-21]]
