# Button как первая runtime matrix-компонента

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/spin-component-geometry]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-use-shared-spin-component-for-loading-states]] | [[memory/logs/2026-04-17]] | [[memory/logs/2026-04-24]]

## Summary

`src/components/button/` стал первой production-ready runtime-компонентой, реализованной напрямую из большого Figma component set. Компонент переводит Figma-матрицу в typed API с `variant`, `size`, `iconOnly`, `loading`, `selected`, `leadingIcon`, `trailingIcon` и `previewState`, а Storybook показывает и `Playground`, и обзорную матрицу состояний.

## Why It Matters

Это первый подтверждённый шаблон того, как в этом репозитории нужно переводить Figma variant matrix в код: не как набор разрозненных JSX-копий, а как один token-driven компонент с понятным prop API и отдельной поверхностью для визуальной проверки.

## Known Patterns

- Отделять реальные runtime-состояния (`loading`, `disabled`, `selected`) от `previewState`, который нужен в Storybook для воспроизведения `hover`, `focused`, `pressed` и `selection`.
- Строить variant matrix через один TSX-компонент и data-attributes в SCSS, а не через отдельный файл на каждую Figma-вариацию.
- Иконки передавать через слоты `leadingIcon` и `trailingIcon`, чтобы цвет наследовался от `currentColor`.
- Loading-состояние должно скрывать основной контент и поверх него показывать отдельный shared `Spin`.
- Loading spinner внутри `Button` зависит от размера кнопки: для `size='m'` использовать `Spin size='s'`, для `size='s'` использовать `Spin size='xs'`.
- Для Figma parity сначала собирать `Overview` story с матрицей, а затем уже тонко править геометрию и state mapping.

## Known Pitfalls

- Смешивать `previewState` с реальной бизнес-логикой состояния кнопки.
- Оставлять loading-геометрию локальной CSS-заглушкой внутри `Button`.
- Забывать, что базовый `.rshb-button` использует `width: fit-content`; контейнеры вроде modal actions должны явно переопределять ширину кнопки, если ожидается full-width поведение.
- Подгонять variant matrix под произвольные имена, которые расходятся с Figma semantic mapping.
- Считать, что `hover` и `pressed` достаточно проверить только интерактивно; для этого проекта нужна и явная Storybook-матрица.

## Related Modules Or Files

- `src/components/button/Button.tsx`
- `src/components/button/Button.scss`
- `src/components/button/Button.stories.tsx`
- `src/components/spin/Spin.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-use-shared-spin-component-for-loading-states]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/spin-component-geometry]]
- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/ui-kit-from-figma]]

## Source Logs

- [[memory/logs/2026-04-17]]
- [[memory/logs/2026-04-24]]
