# Legacy icon assets как общий источник SVG для FOS components

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/logs/index]] | [[memory/knowledge/concepts/legacy-delivery-layer]] | [[memory/knowledge/concepts/input-text-floating-label-control]] | [[memory/knowledge/concepts/calendar-date-picker]] | [[memory/knowledge/concepts/spin-component-geometry]] | [[memory/logs/2026-05-26]]

## Summary

Корневая папка icons/ перенесена в legacy branch из modern ветки и используется legacy-компонентами как единый SVG asset source вместо inline SVG хардкода.

## Why It Matters

- ФОС-поставка должна быть copy-friendly, но иконки не должны дублироваться inline внутри Button/InputText/Calendar/Spin, иначе быстро появятся расхождения с modern UI kit.

## Known Patterns

- Импортировать нужный SVG из icons/ напрямую в legacy JSX/TSX и рендерить через CSS mask, когда нужен currentColor.
- Добавить local SVG module declaration для Storybook/typecheck, если TypeScript story импортирует .svg.
- Кнопочные иконки передавать в legacy Button через leadingIcon/trailingIcon, а не рисовать локальный native control.

## Known Pitfalls

- Inline <svg>/<path> в legacy/components снова создаёт второй источник правды и усложняет замену иконок после обновления icon pack.
- Прямой <img> сохраняет asset, но не наследует currentColor; для token-driven states лучше CSS mask.

## Related Modules Or Files

- icons/
- legacy/svg.d.ts
- legacy/components/button/Button.stories.tsx
- legacy/components/calendar/Calendar.jsx
- legacy/components/input-text/InputText.jsx
- legacy/components/spin/Spin.jsx

## Related Decisions

- Отдельные решения пока не привязаны.

## Related Concepts

- [[memory/knowledge/concepts/legacy-delivery-layer]]
- [[memory/knowledge/concepts/input-text-floating-label-control]]
- [[memory/knowledge/concepts/calendar-date-picker]]
- [[memory/knowledge/concepts/spin-component-geometry]]

## Source Logs

- [[memory/logs/2026-05-26]]
