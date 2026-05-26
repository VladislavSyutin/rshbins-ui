# InputCodeItem как OTP-контрол с post-completion reset

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/concepts/spin-component-geometry]] | [[memory/logs/2026-04-21]]

## Summary

`src/components/input-code-item/` реализует Figma-driven OTP/SMS-code control на 4 ячейки. Компонент экспортируется как `InputCodeItem` и построен как группа из нативных текстовых input-элементов с `inputMode="numeric"`, внутренним state machine для сценария `ввод -> loading -> error/reset`, Storybook `previewState` для Figma-матрицы и отдельным `completionBehavior` для выбора между production-like ошибкой и циклическим reset-сценарием в playground.

## Why It Matters

Это первый компонент в библиотеке, где визуальная Figma-матрица сочетается с последовательной интерактивной логикой: переход фокуса по цифрам, поддержка мобильной клавиатуры, временный loading и автоматическое восстановление фокуса после сброса. Здесь легко получить визуально правильный, но UX-ломкий контрол, если не разделить preview-состояния и runtime-поведение.

## Known Patterns

- Строить OTP-контрол поверх массива скрытых нативных input-элементов, а не через один общий input с маской.
- Держать цифры как `string[]` фиксированной длины и собирать код только при полном заполнении всех ячеек.
- Использовать отдельный preview-only слой (`previewState`), чтобы Storybook мог показать `default`, `typing`, `loading`, `error` без запуска интерактивной логики.
- Для runtime-сценария после заполнения запускать loading через таймер и затем либо показывать ошибку, либо делать reset, в зависимости от `completionBehavior`.
- Для мобильных клавиатур обрабатывать `onChange` как fallback, потому что `onKeyDown` на touch-устройствах может не сработать.
- Откладывать восстановление фокуса через pending-focus request и отдельный state trigger, чтобы первый input гарантированно активировался и после initial mount, и после выхода из loading.
- Выражать курсор, рамки, disabled-background и helper text через semantic tokens и SCSS, а не через inline-heavy Figma Make код.

## Known Pitfalls

- Если completion-эффект возвращает cleanup с `clearTimeout`, он может сам же уничтожить loading-таймер на следующем ререндере после `setIsLoading(true)`, и компонент зависнет в `loading`.
- Если пытаться фокусировать первую ячейку сразу после reset, пока input ещё disabled, пользователь сможет печатать только после ручного клика.
- Если не разделять интерактивный режим и `previewState`, Storybook-матрица состояний начнёт жить собственной логикой и перестанет быть стабильным Figma snapshot.
- Если очищать реальный input не сразу после `onChange`, mobile fallback может начать копить несколько цифр в одном поле.

## Related Modules Or Files

- `src/components/input-code-item/InputCodeItem.tsx`
- `src/components/input-code-item/InputCodeItem.scss`
- `src/components/input-code-item/InputCodeItem.stories.tsx`
- `/Users/vladislavsyutin/Downloads/InputCodeItem.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/spin-component-geometry]]

## Source Logs

- [[memory/logs/2026-04-21]]
- [[memory/logs/2026-04-23]]
