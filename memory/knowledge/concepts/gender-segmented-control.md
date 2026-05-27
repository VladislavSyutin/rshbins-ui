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
- Использовать `box-shadow: inset 0 0 0 2px` для error-рамки на обоих айтемах одновременно: средняя линия выглядит вдвое толще внешней (2+2=4px). Решение: `border-color` + `border-right-width: 1px` / `border-left-width: 1px` на каждом айтеме.

## Legacy Delivery (ветка legacy)

В `legacy/components/gender/` реализован единый самодостаточный компонент без отдельного `GenderItem`. Внутренний `GenderOption` — приватная функция в `Gender.jsx`, не экспортируется. Вся CSS-геометрия объединена в один `styles.css` с BEM-именами `__item`, `__item-input`, `__item-content`, `__item-label`.

Ключевые решения legacy-варианта:
- Нет `disabled` состояния — убрано для FOS.
- `Gender.values` static map для `{ male, female }`.
- `dataId → data-id` по legacy-контракту.
- Storybook: Playground + Overview (Default / Male / Female / Error).

## Related Modules Or Files

- `src/components/gender/Gender.tsx` (modern)
- `legacy/components/gender/Gender.jsx` (FOS delivery)
- `legacy/components/gender/styles.css`
- `legacy/components/gender/index.d.ts`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/checkbox-form-control]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
