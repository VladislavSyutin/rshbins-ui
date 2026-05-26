# RSHBINS legacy component builder skill

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/logs/index]] | [[memory/knowledge/concepts/legacy-delivery-layer]] | [[memory/knowledge/concepts/fos-stack-compatibility-audit]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-prepare-three-legacy-foundations-for-fos-review]] | [[memory/logs/2026-05-26]]

## Summary

Пользовательский Codex skill rshbins-legacy-component-builder ведёт RSHBINS/FOS компоненты как legacy-first поставку в структуре legacy/components/. Он фиксирует единый workflow от проектных правил, legacy baseline, Figma/tokens и ФОС reference contracts к React 17-compatible JSX, plain CSS, PropTypes, Storybook matrices и quality gates.

## Why It Matters

- Скилл превращает разрозненные источники качества: Figma визуал, legacy-ветку, DOCX/zip от разработчиков и bootstrap-чеклисты, в повторяемый процесс для каждого нового компонента.
- Он снижает риск, что агент начнет писать modern src/components или generic React UI вместо copy-friendly ФОС delivery layer.
- Уточнение про `src/` важно: skill должен запрещать modern implementation layer, но не должен запрещать классический package facade вроде `src/index.js`.

## Known Patterns

- Использовать skill для задач по новым или изменяемым legacy-компонентам, особенно когда нужно совместить Figma parity, ФОС API contracts и Storybook review.
- Основной runtime target: legacy/components/<component-name>/ComponentName.jsx, styles.css, index.js, index.d.ts, Readme.md, ComponentName.stories.tsx.
- `src/` допустим только как thin entrypoint/barrel или документационный import facade поверх `legacy/`; runtime legacy files не импортируют обратно из `src/`.
- Подгружать references/fos-legacy-contracts.md для Form, Panel, Input, Field, Fieldset, Select и других задач, где важны старые callback/dataId/static-helper контракты.
- Подгружать references/quality-gates.md перед финальным ответом по legacy-компоненту.

## Known Pitfalls

- Skill валиден структурно, но его качество нужно проверить на следующей реальной component implementation и уточнить после встречи с ФОС-разработчиками.
- Нельзя считать Storybook доказательством полной совместимости с Webpack 3/FOS runtime без отдельного smoke-теста или подтверждения разработчиков.
- Старые формулировки "legacy-only" и "Do not target src" могут быть прочитаны слишком широко; актуальная трактовка — не класть реализации в modern `src/components`, но разрешать `src/index.*` facade.

## Related Modules Or Files

- /Users/vladislavsyutin/.codex/skills/rshbins-legacy-component-builder/SKILL.md
- /Users/vladislavsyutin/.codex/skills/rshbins-legacy-component-builder/references/fos-legacy-contracts.md
- /Users/vladislavsyutin/.codex/skills/rshbins-legacy-component-builder/references/quality-gates.md
- legacy/components/

## Related Decisions

- [[memory/knowledge/decisions/adr-prepare-three-legacy-foundations-for-fos-review]]

## Related Concepts

- [[memory/knowledge/concepts/legacy-delivery-layer]]
- [[memory/knowledge/concepts/fos-stack-compatibility-audit]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-05-26]]
