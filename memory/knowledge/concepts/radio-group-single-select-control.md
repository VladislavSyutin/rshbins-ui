# Radio и RadioGroup как single-select form controls

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/checkbox-form-control]] | [[memory/knowledge/concepts/gender-segmented-control]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]] | [[memory/logs/2026-04-17]] | [[memory/logs/2026-04-21]]

## Summary

`src/components/radio/` и `src/components/radio-group/` закрепили новый слой form controls в UI kit: базовый `Radio` отвечает за native `input[type='radio']`, круглую геометрию, token-driven `hover`/`focused`/`active` состояния и Storybook-only `previewState`, а композиционный `RadioGroup` управляет списком options, layout (`vertical`/`horizontal`) и инвариантом "в группе всегда выбран один пункт".

## Why It Matters

После `Checkbox` и `Gender` в библиотеке появился reusable primitive для обычных single-select выборов, не привязанных к segmented layout. Это даёт стабильный шаблон для будущих radio-like компонентов: визуальное состояние живёт в одном элементе, а групповая логика и доступность не размазываются по нескольким JSX-копиям из Figma.

## Known Patterns

- Строить radio-like control вокруг настоящего `input[type='radio']`, скрытого только визуально, чтобы сохранить keyboard navigation и стандартную семантику `radiogroup`.
- Держать ownership круглой геометрии, border colors, inner dot и `previewState` в примитиве `Radio`, а не дублировать эти детали в каждом group-компоненте.
- В `RadioGroup` разделять primitive и orchestration: сам group должен знать только `options`, `value`/`defaultValue`, `name`, `required`, `disabled`, `onChange` и направление раскладки.
- Для uncontrolled radio group нормализовать выбор через fallback к `defaultValue` или первому option, но не сбрасывать текущее значение при каждом новом array-reference `options`, если выбранный option всё ещё существует.
- Для простых Figma-геометрий вроде radio indicator предпочитать token-driven CSS-отрисовку вместо временного asset URL, чтобы компонент оставался theme-aware и не зависел от срока жизни MCP-asset.
- Проверять radio controls на двух уровнях Storybook: отдельная матрица состояний для `Radio` и композиционные stories для `RadioGroup`.

## Known Pitfalls

- Реализовать `RadioGroup` как несколько отдельных JSX-веток из Figma и потерять общий reusable primitive для состояний и accessibility.
- Смешать Storybook-only `previewState` с runtime API формы и начать передавать его в обычные пользовательские сценарии.
- Сбрасывать uncontrolled выбранное значение к первому option каждый раз, когда массив `options` приходит в новой ссылке.
- Завязывать active indicator на внешний SVG-asset, хотя форма может быть выражена устойчиво через CSS и semantic tokens.
- Если RadioGroup story висит на спиннере, не смотреть только на `index.json`: проверять прямые module URL `RadioGroup.tsx`, `Radio.tsx` и зависимые controls через Storybook/Vite.

## Related Modules Or Files

- `src/components/radio/Radio.tsx`
- `src/components/radio/Radio.scss`
- `src/components/radio/Radio.stories.tsx`
- `src/components/radio-group/RadioGroup.tsx`
- `src/components/radio-group/RadioGroup.scss`
- `src/components/radio-group/RadioGroup.stories.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/checkbox-form-control]]
- [[memory/knowledge/concepts/gender-segmented-control]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
- [[memory/logs/2026-04-21]]
