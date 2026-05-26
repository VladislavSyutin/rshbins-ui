# ADR: Использовать shared Spin-компонент для loading states

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/decisions/index]] | [[memory/knowledge/concepts/button-component-matrix]] | [[memory/knowledge/concepts/spin-component-geometry]] | [[memory/logs/2026-04-17]]

## Status

Accepted

## Context

Первый runtime `Button` сначала получил локальный CSS-spinner для loading-состояния, но он не совпадал с Figma ни по геометрии, ни по visual ratio. При этом в макете уже существует отдельный component set `Spin` с размерами, анимацией и собственной векторной формой.

## Decision

Использовать отдельный shared `Spin` как источник loading indicator для `Button` и будущих компонентов.

- Хранить `Spin` в `src/components/spin/`.
- Подключать `Spin` в loading states компонентов вместо локальных border-based заглушек.
- Сохранять Figma-aligned container sizes и visual ratio.
- Для крупных размеров использовать size-specific SVG geometry из Figma, если единый path даёт слишком толстый результат.

## Alternatives Considered

- Оставить spinner как локальную CSS-анимацию внутри `Button`.
- Использовать один общий SVG path для всех размеров и подгонять только scale.

## Consequences

- Loading indicators становятся консистентными между компонентами и ближе к Figma по форме.
- Поддержка `Spin` требует бережной синхронизации не только container size, но и visual ratio/path geometry.
- Будущие runtime-компоненты могут переиспользовать `Spin`, не дублируя анимацию и визуальную логику.

## Related Concepts

- [[memory/knowledge/concepts/button-component-matrix]]
- [[memory/knowledge/concepts/spin-component-geometry]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
