# Gender как первый segmented form control

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/checkbox-form-control]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]] | [[memory/logs/2026-04-17]]

## Summary

`src/components/gender/` стал первым segmented form control в runtime-слое UI kit. Компонент собран как `radiogroup` из двух side-specific `GenderItem`, а не как статический контейнер с текстом. Устойчивое правило для этой пары: внешний `Gender` отвечает только за композицию и value management, а ownership рамки и state-specific border geometry должны оставаться у левого и правого `GenderItem`.

## Why It Matters

Segmented controls чувствительны к тому, кто владеет border-геометрией. Если общий контейнер рисует серую обводку, а активный или error-state рисуется поверх дочерним сегментом, при переключении возникает визуальный скачок или "дёрганье". Для Figma-parity и стабильной геометрии border должен жить у сегментов, а родитель не должен добавлять конкурирующую рамку.

## Known Patterns

- Реализовывать segmented choice как native radio group с отдельными reusable item-компонентами, а не как набор декоративных `div`.
- Держать side-specific геометрию (`left`/`right`) во вспомогательном компоненте, чтобы он сам управлял внешними сторонами, скруглениями и active/error state borders.
- Для grouped-режима задавать постоянную толщину рамки у `GenderItem`, а менять только цвет и фон, чтобы при переключении не менялся layout.
- Оставлять `Gender` тонким orchestration-компонентом: `value`, `defaultValue`, `name`, `required`, `invalid`, `onChange`.
- Проверять segmented controls и на композиционном уровне (`Gender`), и на state-matrix уровне (`GenderItem`) через отдельные Storybook stories.

## Known Pitfalls

- Рисовать дефолтную серую рамку на родителе и одновременно добавлять active/error borders на дочерних сегментах.
- Держать border-width нестабильным между inactive и active состояниями, если control должен визуально оставаться на одной сетке.
- Потерять radio semantics, если helper-item превращается в чисто стилизованный контейнер без `input[type='radio']`.
- Смешать visual composition родителя с логикой состояния item и усложнить дальнейшее расширение на другие segmented controls.

## Related Modules Or Files

- `src/components/gender/Gender.tsx`
- `src/components/gender/Gender.scss`
- `src/components/gender/Gender.stories.tsx`
- `src/components/gender-item/GenderItem.tsx`
- `src/components/gender-item/GenderItem.scss`
- `src/components/gender-item/GenderItem.stories.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/checkbox-form-control]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
