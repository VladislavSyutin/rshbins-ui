# Legacy delivery layer рядом с modern UI kit

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/logs/index]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/decisions/adr-keep-modern-and-legacy-in-one-repo]] | [[memory/logs/2026-04-29]] | [[memory/logs/2026-05-07]]

## Summary

На ветке `legacy` canonical runtime delivery остаётся в `legacy/`, а `src/` может существовать только как тонкий package entrypoint/barrel поверх legacy-компонентов. В более широком репозитории modern UI kit и legacy delivery могут жить рядом, но для FOS-ветки source of truth для компонентов — `legacy/components/`.

## Why It Matters

- Это позволяет не деградировать основной UI kit до ограничений legacy-стека ФОС и при этом готовить copy-friendly поставку для их интеграции.
- Такое разделение снижает риск расхождения между Figma-driven modern-разработкой и адаптацией под Webpack 3 / React 17 среду.

## Known Patterns

- На ветке `legacy` компонентные реализации живут в `legacy/components/`; `src/index.js` и `src/index.d.ts` только реэкспортируют этот слой для привычного package API.
- Legacy runtime files не импортируют из `src/`, чтобы не создать обратную зависимость и не смешать delivery layer с package facade.
- В combined/modern ветках modern-реализации и visual-first stories могут жить в `src/`, а адаптированные legacy-компоненты и их обзор живут в `legacy/`.
- Legacy-компоненты следуют формату, близкому к примерам ФОС: component file, plain CSS, простой entrypoint и локальный README.
- Совместимость токенов обеспечивается через shared legacy token alias layer с semantic mapping и fallback-значениями.

## Known Pitfalls

- Нельзя считать Storybook доказательством полной совместимости с ФОС: он подтверждает визуальное поведение, но не заменяет пилотную интеграцию в их стек.
- Если смешивать modern и legacy в одном компонентном каталоге без явного разделения, разработчикам и дизайнерам становится неясно, какой слой является source of truth, а какой — delivery adaptation.
- Если трактовать запрет `src/components` как запрет любого `src`, проект выглядит нетипично для библиотеки и теряет понятный package entrypoint.

## Related Modules Or Files

- src/components/
- src/index.js
- src/index.d.ts
- legacy/components/
- legacy/tokens/legacy-theme.css
- .storybook/main.ts
- .storybook/preview.tsx

## Related Decisions

- [[memory/knowledge/decisions/adr-keep-modern-and-legacy-in-one-repo]]

## Related Concepts

- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/ui-kit-from-figma]]

## Source Logs

- [[memory/logs/2026-04-29]]
- [[memory/logs/2026-05-07]]
