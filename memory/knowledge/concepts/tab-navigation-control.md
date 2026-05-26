# Tab и Tabs как горизонтальная навигация между панелями

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/segmented-control-chip-choice]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]] | [[memory/logs/2026-04-21]]

## Summary

`src/components/tab/` и `src/components/tabs/` добавили в UI kit Figma-driven вкладки. Вспомогательный `Tab` реализует `_Tab` из Figma node `2055:2163`: active, inactive, hover и focused состояния, optional leading/trailing icons, body regular typography, 18px icon slot, 16px vertical padding и 2px underline/focus geometry через project tokens. Основной `Tabs` реализует Figma node `2055:2370` как `tablist`, а не как статический ряд `div`.

## Why It Matters

Tabs похожи на `SegmentedControl` только внешне: оба являются горизонтальным single-select набором, но семантика другая. `Tabs` переключает панели/разделы контента внутри одного окна и должен использовать `role="tablist"`/`role="tab"` с `aria-selected`, roving `tabIndex` и клавиатурной навигацией. Переносить сюда radio input модель из `SegmentedControl` нельзя без потери доступности и смысла компонента.

## Known Patterns

- Делить реализацию на primitive `Tab` и orchestration-компонент `Tabs`, сохраняя Figma-иерархию `_Tab`/`Tabs`.
- `Tab` строить на `<button type="button">`, чтобы получить нативные click/Enter/Space semantics без скрытого input.
- `Tabs` поддерживает controlled/uncontrolled API через `value`/`defaultValue` и `onChange(value, event)`.
- Для клавиатуры поддерживать `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, `End`; при `activationMode="automatic"` фокус стрелкой сразу выбирает вкладку, при `manual` только перемещает фокус.
- Visual states выражать через project tokens: `--color-text-default-primary`, `--color-text-default-tertiary`, `--color-border-brand-default`, `--color-border-default-default-hover`, `--color-border-default-default-focus`, `--typography-body-regular-*`, `--space-paddings-inside-m`, `--space-margins-inside-xs`, `--space-margins-inside-m`.
- Для Storybook держать отдельные stories `Components/Tab` и `Components/Tabs`: primitive states и group composition.

## Known Pitfalls

- Не превращать Tabs в `radiogroup`: это нарушает ARIA-семантику tab navigation.
- Не использовать краткоживущие Figma asset URLs для star icons в stories; inline SVG с `currentColor` достаточно для визуальной проверки и наследует token-driven цвет.
- Не добавлять горизонтальные padding к `Tab` item: в Figma item ширина складывается из контента, gap между icon/text/icon и vertical padding; расстояние между вкладками задаёт parent `Tabs` через `--space-margins-inside-m`.
- Не рисовать focused state обычным outline, если нужна Figma parity: используется inset 2px ring поверх той же геометрии.
- Не считать active tab hoverable: active cursor `default`, underline остаётся brand.

## Related Modules Or Files

- `src/components/tab/Tab.tsx`
- `src/components/tab/Tab.scss`
- `src/components/tab/Tab.stories.tsx`
- `src/components/tabs/Tabs.tsx`
- `src/components/tabs/Tabs.scss`
- `src/components/tabs/Tabs.stories.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/segmented-control-chip-choice]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-21]]
