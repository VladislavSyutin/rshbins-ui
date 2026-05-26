# Switch как binary form control с SVG-геометрией

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/checkbox-form-control]] | [[memory/knowledge/concepts/radio-group-single-select-control]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]] | [[memory/logs/2026-04-21]]

## Summary

`src/components/switch/` реализует Figma `Switch` из node `61:1770` как настоящий binary form control: native `input[type='checkbox']` с `role='switch'`, typed API с `label`, `checked`/`defaultChecked`, `disabled` и Storybook-only `previewState`, плюс SCSS-геометрия, повторяющая SVG-координаты Figma. В legacy delivery layer есть отдельный `legacy/components/switch/` на React 17/plain CSS/PropTypes, который используется как универсальный primitive внутри `InputText variant="switch"`.

## Why It Matters

Switch похож на checkbox по семантике, но его визуальная геометрия чувствительна к тому, как CSS считает border и absolute-position. Для pixel-perfect parity нельзя переносить SVG stroke в обычный CSS `border`, если этот border начинает участвовать в layout и сдвигает `Ellipse 1`.

## Known Patterns

- Строить switch вокруг настоящего `input[type='checkbox']` с `role='switch'`, скрытого только визуально.
- Держать состояния `inactive`/`active` через `checked` и `defaultChecked`, а `hover`/`focused` отдавать в Storybook через `previewState`.
- Повторять Figma SVG-геометрию: track `40x24`, `Ellipse 1` с `r=10`, inactive `cx=12`, active `cx=28`.
- Рисовать обводку track через `::before`, а не через CSS `border` на самом control, чтобы stroke не менял координатную систему absolute thumb.
- Для active-state двигать thumb на `16px`: inactive занимает `x=2..22`, active занимает `x=18..38`.
- Использовать semantic tokens для фона, текста, brand fill и default/hover/focus border colors.
- В legacy/FOS stories для switch не показывать off/inactive состояние, если конкретный review-сценарий просит только включенный switch; при этом runtime-компонент остаётся обычным checkbox/switch и поддерживает checked/unchecked.
- В legacy composed input-сценариях импортировать switch из `../switch/index.js`, а не рисовать локальный native checkbox внутри input.

## Known Pitfalls

- Если задать `border: 2px` прямо на `.rshb-switch__control`, absolute `left: 2px` считается от padding/content box и thumb визуально прилипает к боковым стенкам.
- Если уменьшить thumb ради "внутреннего отступа", компонент перестает совпадать с Figma SVG: там circle имеет `r=10`, а просвет обеспечен координатами и stroke overlay.
- Не использовать временные Figma MCP SVG assets в runtime-компоненте: ссылки живут ограниченное время, а форма стабильно выражается через CSS и токены.
- Не смешивать `previewState` с реальной логикой формы; это инструмент visual parity в Storybook.

## Related Modules Or Files

- `src/components/switch/Switch.tsx`
- `src/components/switch/Switch.scss`
- `src/components/switch/Switch.stories.tsx`
- `legacy/components/switch/Switch.jsx`
- `legacy/components/switch/styles.css`
- `legacy/components/switch/Switch.stories.tsx`
- `legacy/components/input-text/InputText.jsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/checkbox-form-control]]
- [[memory/knowledge/concepts/radio-group-single-select-control]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-21]]
