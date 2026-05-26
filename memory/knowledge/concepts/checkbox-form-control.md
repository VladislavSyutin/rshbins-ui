# Checkbox как первый form control UI kit

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/button-component-matrix]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]] | [[memory/logs/2026-04-17]] | [[memory/logs/2026-04-21]]

## Summary

`src/components/checkbox/` стал первым form control в runtime-слое UI kit, собранным напрямую из Figma component matrix. Компонент использует настоящий `input[type='checkbox']`, typed API с `size`, `label`, `invalid` и `previewState`, а также отдельную Storybook-матрицу для состояний `inactive`, `active` и `error` в двух размерах.

## Why It Matters

Checkbox задаёт шаблон для следующих интерактивных полей: визуальная Figma-матрица должна переводиться не в декоративный `div`, а в доступный native control, при этом preview-состояния для Storybook не должны смешиваться с runtime-логикой формы.

## Known Patterns

- Строить binary form control вокруг реального `input`, скрытого только визуально, чтобы сохранить keyboard/accessibility semantics.
- Разделять runtime-признаки (`checked`, `defaultChecked`, `invalid`) и `previewState`, который нужен только для Storybook parity с Figma `hover` и `focused`.
- Вычислять visual status (`inactive`, `active`, `error`) отдельно и прокидывать его в SCSS через `data-preview-status`, а не дублировать JSX под каждую Figma-вариацию.
- Для точной Figma parity хранить checkmark как отдельный SVG-ассет в `icons/`, если иконка уже пришла из Figma MCP.
- Для form controls сначала собирать `Overview` story с полной матрицей размеров и состояний, а затем уже править интерактивный `Playground`.

## Known Pitfalls

- Реализовать checkbox как чисто визуальный контейнер без native input и тем самым потерять фокус, `aria-invalid` и стандартное поведение клавиатуры.
- Смешать `previewState` с реальным состоянием формы и начать использовать его вне Storybook.
- Трактовать `error` как независимое состояние от `checked`; в текущем mapping error относится к невыбранному обязательному checkbox.
- Хардкодить размеры checkmark или border-цвета мимо токенов вместо semantic CSS variables и asset из Figma.
- Если Checkbox docs/story висит на спиннере без явной React-ошибки, проверять, отдается ли `src/components/checkbox/Checkbox.tsx` через Storybook/Vite module URL; уже был случай нечитаемого файла, который подвешивал preview.

## Related Modules Or Files

- `src/components/checkbox/Checkbox.tsx`
- `src/components/checkbox/Checkbox.scss`
- `src/components/checkbox/Checkbox.stories.tsx`
- `icons/check.svg`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/button-component-matrix]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
- [[memory/logs/2026-04-21]]
