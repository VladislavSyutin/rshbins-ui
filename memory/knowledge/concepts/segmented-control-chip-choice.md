# Segment и SegmentedControl как chip-like single-select control

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/gender-segmented-control]] | [[memory/knowledge/concepts/radio-group-single-select-control]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]] | [[memory/logs/2026-04-17]]

## Summary

`src/components/segment/` и `src/components/segmented-control/` добавили в UI kit новый тип segmented choice: не side-specific control с общей рамкой, как `Gender`, а набор самостоятельных chip-like сегментов с внутренними отступами, радиусом `xs`, optional leading/trailing icons и horizontal single-select логикой. Базовый `Segment` отвечает за native radio semantics, `previewState` и token-driven `inactive`/`hover`/`focused`/`active`, а `SegmentedControl` собирает из него группу options.

## Why It Matters

Этот компонент закрывает отдельный Figma-паттерн, который нельзя безопасно свести ни к `Gender`, ни к обычному `RadioGroup`. Здесь сегменты не делят общую border geometry между соседями, а живут как независимые selectable chips с gap между ними. Если применить к нему ментальную модель `Gender`, получится неверная визуальная композиция и лишняя связность между item-ами.

## Known Patterns

- Строить chip-like segmented choice как primitive `Segment` + orchestration-компонент `SegmentedControl`, а не как несколько JSX-копий из Figma.
- Для такого контрола не использовать shared parent border: каждый `Segment` владеет собственной геометрией, фоном, focus-ring и состояниями.
- Ограничивать hover-реакцию только неактивными сегментами; выбранный сегмент должен оставаться в `brand-selection` и не сереть при наведении.
- Для простых 18px иконок удобно использовать inline SVG c `fill=\"currentColor\"`, чтобы активное и неактивное состояние автоматически наследовало token-driven цвет без отдельного icon-wrapper или Figma asset URL.
- В docs-матрицах Storybook такие preview-состояния нужно рендерить как статичные примеры: отключать pointer events у demo-инстансов и открывать docs-страницу в неактивном дефолтном состоянии, иначе реальный `:hover` начинает конфликтовать с Figma preview-state.
- Для uncontrolled single-select логики использовать тот же fallback-подход, что и в `RadioGroup`: если текущее значение ещё существует в новом `options`, не сбрасывать его только из-за новой ссылки на массив.
- Для legacy/FOS delivery можно держать item приватным внутри `SegmentedControl.jsx`, если отдельный public `Segment` не нужен по контракту; не раскрывать лишний API без реального сценария переиспользования.
- В legacy branch иконки для demo/stories лучше импортировать из корневой папки `icons/` и рендерить через CSS mask/currentColor, а не рисовать новые inline SVG прямо в story.
- Storybook-покрытие для segmented controls должно повторять только нужный review scope: если пользователь или макет показал только `default/hover/focused` и базовый content example, не добавлять disabled, long-label и другие состояния без явного запроса.

## Legacy Delivery (ветка legacy)

В `legacy/components/segmented-control/` компонент собран как самодостаточный React 17/plain CSS control с приватным `SegmentOption` внутри `SegmentedControl.jsx`, без отдельного public `Segment` в поставке для ФОС. Поведение deliberately ближе к `RadioGroup`: если `value`/`defaultValue` не переданы, активный сегмент не выбирается автоматически.

Storybook для legacy-варианта должен оставаться узким review surface:
- `Docs` и `Playground` показывают ровно тот content/icon example, который нужен для текущего review;
- `States` демонстрирует только реально запрошенные preview states;
- если Storybook уже запущен для этого worktree, существующий процесс нужно обновлять и переиспользовать, а не плодить новый порт.

## Known Pitfalls

- Перенести на `SegmentedControl` подход `Gender` с общей рамкой и side-specific border ownership, хотя у chip-like сегментов такой рамки нет.
- Разрешить активному сегменту визуально реагировать на hover и тем самым ломать Figma parity.
- Делать docs-примеры интерактивными и получать ложные hover-эффекты в `Segment/docs`, которые не относятся к задуманному preview-состоянию.
- Завязать иконки на краткоживущий Figma asset URL или новый icon package, хотя существующий репозиторий уже позволяет выразить их локально и токен-совместимо.

## Related Modules Or Files

- `src/components/segment/Segment.tsx`
- `src/components/segment/Segment.scss`
- `src/components/segment/Segment.stories.tsx`
- `src/components/segmented-control/SegmentedControl.tsx`
- `src/components/segmented-control/SegmentedControl.scss`
- `src/components/segmented-control/SegmentedControl.stories.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/gender-segmented-control]]
- [[memory/knowledge/concepts/radio-group-single-select-control]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
