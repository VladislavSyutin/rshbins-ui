# Аудит совместимости legacy-слоя со стеком ФОС

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/logs/index]] | [[memory/knowledge/concepts/legacy-delivery-layer]] | [[memory/knowledge/concepts/button-component-matrix]] | [[memory/knowledge/concepts/input-text-floating-label-control]] | [[memory/knowledge/concepts/spin-component-geometry]] | [[memory/knowledge/decisions/adr-keep-modern-and-legacy-in-one-repo]] | [[memory/knowledge/decisions/adr-prepare-three-legacy-foundations-for-fos-review]] | [[memory/logs/2026-05-25]] | [[memory/logs/2026-05-19]] | [[memory/logs/2026-05-18]]

## Summary

Актуальная карта совместимости legacy delivery layer со стеком ФОС после сравнения текущего worktree RSHBINS UI Legacy, bootstrap-архива разработчика, DOCX core-сервиса и референсных компонентов ФОС. Фокус ближайшего этапа: не расширять каталог, а довести три уже выбранные компонента Button, InputText и Spin до чистой демонстрационной и FOS-friendly поставки без потери текущего визуала и механики UI kit.

## Why It Matters

- ФОС-разработчики будут оценивать не только внешний вид, но и чистоту сборки: насколько компонент можно перенести в React 17/Webpack 3/Babel legacy окружение с минимальными правками.
- Текущий visual baseline должен остаться за RSHBINS UI Legacy, а не за bootstrap-архивом: визуал bootstrap проще и местами расходится с текущей механикой компонентов.
- Перед встречей важнее показать зрелость подхода на Button/InputText/Spin, чем открывать новые компоненты Form/Field/Panel/Select.

## Known Patterns

- Стек ФОС из DOCX: React 17.0.2, MobX 4.15.7, Webpack 3.5.2, Babel v7 legacy, Jest 23 + Enzyme через @rshbins-life/react-test, web-presentation-ui, plain .css/.module.css, react-text-mask, text-mask-addons, react-select v1.1.0, react-custom-scrollbars.
- Референсные компоненты ФОС устроены как self-contained folders: Component.jsx, styles.css, index.js, Readme.md, Component.test.jsx; публичный контракт документируется PropTypes и тестами.
- Для ФОС критичны dataId -> data-id, сохранение callback signatures, default props, static helpers, literal class aliases, null-render behavior и predictability при disabled/focus/error states.
- Storybook остается review-поверхностью, но delivery source должен быть plain JSX/CSS без Sass, CSS Modules, Tailwind, styled-components, React 18/19 API, src/templates/prototypes/dialogs imports и Vite-only runtime assumptions.
- codex_ui_kit_bootstrap.zip полезен как checklist: он содержит SPEC/ARCHITECTURE/COMPONENT_CONTRACTS/DESIGN_AUDIT и подтверждает зависимости/контракты, но не должен подменять текущий Legacy visual source.
- Текущий Legacy Button сохраняет более полную визуальную матрицу UI kit: buttonType primary/secondary/flat-primary/flat-secondary, size, loading через Spin, icon-only, selected/focus/pressed preview states.
- Текущий Legacy InputText сохраняет floating-label визуал, clear action, helper/error states и current UI kit mechanics, но требует FOS-facing объяснения, потому что это не полный legacy Input facade с react-text-mask.
- Текущий Spin уже оформлен как отдельный публичный legacy-компонент и может показываться как пример чистой атомарной поставки.

## Known Pitfalls

- Bootstrap-проект поставлен грязно: внутри node_modules, storybook-static, .DS_Store; локальный build-storybook из распакованного архива упал с bad interpreter / Operation not permitted. Это demo/scaffold, а не чистый delivery artifact.
- Bootstrap использует CSS Modules в компонентах и упрощенный Input без полной react-text-mask/text-mask-addons механики; сам docs/compatibility-notes.md фиксирует неполное воспроизведение masked behavior.
- Наш Storybook 10/Vite build проходит, но не доказывает Webpack 3/Babel compatibility. Нужен отдельный compat smoke check или честное позиционирование Storybook как visual review.
- Button API у нас использует buttonType, тогда как ФОС-примеры и bootstrap используют type как visual button type. Для встречи стоит подготовить alias story/notes или добавить compatibility alias позже.
- InputText не должен продаваться как drop-in replacement старого Input: у старого Input есть react-text-mask, static mask helpers и onChange(value)/(unmaskedValue, isFilled). Если ФОС ожидают именно это, нужен отдельный Input facade поверх визуального слоя.
- Текущий worktree RSHBINS UI Legacy находится на ветке dev с большим грязным diff и удалениями modern-слоя; перед передачей разработчикам нужно изолировать/зафиксировать правильную ветку или delivery package.

## Related Modules Or Files

- legacy/components/button/Button.jsx
- legacy/components/input-text/InputText.jsx
- legacy/components/spin/Spin.jsx
- legacy/styles/tokens.css
- legacy/components/button/Readme.md
- legacy/components/input-text/Readme.md
- legacy/components/spin/Readme.md

## Related Decisions

- [[memory/knowledge/decisions/adr-keep-modern-and-legacy-in-one-repo]]
- [[memory/knowledge/decisions/adr-prepare-three-legacy-foundations-for-fos-review]]

## Related Concepts

- [[memory/knowledge/concepts/legacy-delivery-layer]]
- [[memory/knowledge/concepts/button-component-matrix]]
- [[memory/knowledge/concepts/input-text-floating-label-control]]
- [[memory/knowledge/concepts/spin-component-geometry]]

## Source Logs

- [[memory/logs/2026-05-25]]
- [[memory/logs/2026-05-19]]
- [[memory/logs/2026-05-18]]
