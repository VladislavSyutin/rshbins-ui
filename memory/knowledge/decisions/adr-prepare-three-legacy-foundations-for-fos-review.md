# ADR: Сфокусировать подготовку к ФОС-встрече на Button, InputText и Spin

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/decisions/index]] | [[memory/logs/index]] | [[memory/knowledge/concepts/legacy-delivery-layer]] | [[memory/knowledge/concepts/fos-stack-compatibility-audit]] | [[memory/knowledge/concepts/button-component-matrix]] | [[memory/knowledge/concepts/input-text-floating-label-control]] | [[memory/knowledge/concepts/spin-component-geometry]] | [[memory/logs/2026-05-25]]

## Status

Accepted

## Context

- После сравнения RSHBINS UI Legacy с codex_ui_kit_bootstrap.zip стало ясно, что bootstrap полезен как чеклист, но не как замена текущему visual baseline.
- DOCX core-сервиса и zip референсных компонентов подтверждают требования ФОС: React 17, Webpack 3, Babel legacy, PropTypes, dataId -> data-id, plain CSS, Jest/Enzyme behavioral contracts, react-text-mask/react-select для соответствующих компонентов.
- Текущий Legacy уже содержит Button, InputText и Spin; эти компоненты лучше сохранить как демонстрационный срез подхода, чем распыляться на Form/Field/Panel/Select до встречи.

## Decision

- До встречи не начинать разработку новых legacy-компонентов.
- Подготовить Button, InputText и Spin как proof-of-approach: visual fidelity текущего UI kit плюс FOS-facing compatibility narrative.
- Считать Storybook review-поверхностью, а не финальным доказательством совместимости с Webpack 3; отдельно отметить необходимость compat smoke/test layer.
- Использовать bootstrap-архив и ФОС-примеры как список контрактов, рисков и вопросов к разработчикам, а не как код для переноса.

## Alternatives Considered

- Сразу реализовать Form, Field, Fieldset, Panel, Select из референсного ФОС zip — отложено, потому что это расширит scope перед встречей и смешает обсуждение текущих компонентов с новой архитектурной работой.
- Заменить текущие компоненты кодом из bootstrap-архива — отклонено, потому что он хуже сохраняет текущий визуал/механику, использует CSS Modules и упрощает масочную механику Input.

## Consequences

- На встрече можно показывать зрелый вертикальный срез: Button как action primitive, InputText как сложный form control, Spin как атомарная loading-индикация.
- Нужно заранее подготовить разговор про отличие InputText от legacy Input и про будущий FOS-compatible Input facade, если ФОС потребуют drop-in масочный контракт.
- После встречи можно принимать решение, добавлять ли Form/Field/Panel/Select и насколько глубоко воспроизводить react-text-mask/react-select механику.

## Related Concepts

- [[memory/knowledge/concepts/legacy-delivery-layer]]
- [[memory/knowledge/concepts/fos-stack-compatibility-audit]]
- [[memory/knowledge/concepts/button-component-matrix]]
- [[memory/knowledge/concepts/input-text-floating-label-control]]
- [[memory/knowledge/concepts/spin-component-geometry]]

## Source Logs

- [[memory/logs/2026-05-25]]
