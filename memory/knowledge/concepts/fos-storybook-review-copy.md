# Изолированная FOS Storybook-копия для встречи

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/logs/index]] | [[memory/knowledge/concepts/fos-stack-compatibility-audit]] | [[memory/knowledge/concepts/legacy-delivery-layer]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-prepare-three-legacy-foundations-for-fos-review]] | [[memory/logs/2026-05-25]]

## Summary

Отдельная папка /Users/vladislavsyutin/Documents/Вайбкодинг/RSHBINS UI FOS Storybook служит временной review-поверхностью для показа разработчикам ФОС трёх legacy-компонентов Button, InputText и Spin без изменений в исходных RSHBINS UI и RSHBINS UI Legacy.

## Why It Matters

- Позволяет показать зрелый вертикальный срез совместимости ФОС без риска повредить main repo или грязный Legacy worktree.
- Фокусирует встречу на текущих трёх компонентах и их delivery contract, а не на разработке новых Form/Field/Panel/Select.
- Отделяет visual review в Storybook от будущего Webpack 3/Babel smoke test в реальной ФОС-среде.

## Known Patterns

- Папка создана как обычная копия RSHBINS UI Legacy, а не git worktree; исходные папки остаются read-only источниками для этой задачи.
- Storybook запускается на 6008 и подключает FOS Readiness плюс stories Button/InputText/Spin.
- FOS Readiness фиксирует delivery source, runtime dependencies, границы доказательности Storybook и вопросы к ФОС.
- Button FOS/API показывает visual type alias через type=primary|secondary|flat-primary|flat-secondary, native type=button|submit|reset и приоритет buttonType.
- InputText stories показывают matrix 13 состояний, controlled onValueChange, uncontrolled defaultValue, clear behavior, focus ref, dataId и onFocusChange.
- Spin stories показывают sizes, доступный label/role=status и использование внутри Button loading.
- Для Button FOS/API story layout должен использовать alignItems:start, иначе CSS Grid растягивает кнопку по высоте строки и ломает hug-впечатление без проблемы в самом компоненте.

## Known Pitfalls

- Эта копия не git-tracked worktree; без отдельной фиксации изменения легко потерять или разнести с исходным Legacy.
- Storybook 10/Vite build успешен, но не доказывает Webpack 3/Babel совместимость ФОС.
- build-storybook создаёт storybook-static в новой папке; это проверочный артефакт, не source delivery.
- InputText не является drop-in masked Input: react-text-mask/static helpers/callback signatures остаются отдельным будущим facade.
- npm audit в новой папке показывал 2 moderate уязвимости в dev-зависимостях, не исправлялись перед встречей.

## Related Modules Or Files

- /Users/vladislavsyutin/Documents/Вайбкодинг/RSHBINS UI FOS Storybook
- /Users/vladislavsyutin/Documents/Вайбкодинг/RSHBINS UI FOS Storybook/legacy/fos-readiness/FosReadiness.stories.tsx
- /Users/vladislavsyutin/Documents/Вайбкодинг/RSHBINS UI FOS Storybook/legacy/components/button/Button.stories.tsx
- /Users/vladislavsyutin/Documents/Вайбкодинг/RSHBINS UI FOS Storybook/legacy/components/input-text/InputText.stories.tsx
- /Users/vladislavsyutin/Documents/Вайбкодинг/RSHBINS UI FOS Storybook/legacy/components/spin/Spin.stories.tsx

## Related Decisions

- [[memory/knowledge/decisions/adr-prepare-three-legacy-foundations-for-fos-review]]

## Related Concepts

- [[memory/knowledge/concepts/fos-stack-compatibility-audit]]
- [[memory/knowledge/concepts/legacy-delivery-layer]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-05-25]]
