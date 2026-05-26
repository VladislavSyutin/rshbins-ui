# Toast как feedback overlay

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/concepts/authentication-templates-layer]] | [[memory/logs/2026-04-21]] | [[memory/logs/2026-04-23]]

## Summary

`src/components/toast/` реализует Figma-driven Toast как краткое feedback-уведомление с вариантами `danger` и `success`. Компонент использует token-driven SCSS, иконки из `icons/` через CSS mask/currentColor, `--shadow-flyout`, semantic background/text tokens и поддерживает `placement="top-center"` для fixed overlay по центру viewport.

## Why It Matters

Toast стал первым компонентом UI kit, которому нужна не только статическая Storybook-матрица, но и runtime-поведение: появление, авто-закрытие через 5 секунд, закрытие по крестику и exit-анимация перед размонтированием. Это задаёт паттерн для будущих overlay/feedback-компонентов.

## Known Patterns

- Варианты компонента задаются через `variant: 'danger' | 'success'`, а не через отдельные компоненты.
- Fixed-режим задаётся через `placement="top-center"`: `position: fixed`, центр viewport по горизонтали и `32px` от верхней границы окна браузера.
- Появление использует Figma motion `Move in Down` за `150ms`; закрытие запускает внутреннее состояние `closing`, проигрывает обратную анимацию `150ms` и только потом вызывает `onClose`.
- Таймер авто-закрытия живёт внутри `Toast`: `autoCloseDuration` по умолчанию `5000`, `null` отключает авто-закрытие для статических stories.
- Иконки `check`, `triangle-exclamation-regular` и `xmark` импортируются из `icons/` как URL и окрашиваются через CSS mask/currentColor.
- `Components/Toast/Interactive` в Storybook рендерит toast порталом в `window.parent.document.body`, чтобы проверять overlay относительно окна Storybook, а не iframe canvas.
- Если toast используется из template/story container, но должен позиционироваться от окна браузера, потребитель должен портировать toast в `document.body`. Так сделано в `AuthenticationPhoneConfirmation` и `AuthenticationEmailConfirmation` для `NewCodeHasBeenSent`: иначе `position: fixed` может визуально считаться от Storybook/test области.
- У Toast остаются только stories `Playground`, `Interactive` и `Overview`; отдельную вкладку `States` удалили, потому что closing проверяется интерактивно, а не через отдельную статическую вкладку.

## Known Pitfalls

- Если потребитель сразу размонтирует toast без `Toast`-managed close flow, exit-анимация не будет видна; закрытие должно идти через `onClose` компонента после внутреннего `closing`.
- В Storybook iframe fixed-позиционирование считается от iframe viewport; для проверки реального экрана нужна parent-document portal story.
- В template stories fixed toast может оказаться привязан к canvas/preview-контейнеру, если он смонтирован как обычный потомок шаблона; для production-like поведения нужен portal в `document.body`.
- При `placement="top-center"` анимация должна учитывать `translateX(-50%)`; обычные keyframes с `translateY(...)` перетрут центрирование.
- Не возвращать кнопку показа toast в основной `App` без явного запроса: текущая production-страница остаётся foundations preview, а интерактивная проверка toast живёт в Storybook.

## Related Modules Or Files

- `src/components/toast/Toast.tsx`
- `src/components/toast/Toast.scss`
- `src/components/toast/Toast.stories.tsx`
- `src/templates/authentication/authentication-phone-confirmation/AuthenticationPhoneConfirmation.tsx`
- `src/templates/authentication/authentication-email-confirmation/AuthenticationEmailConfirmation.tsx`
- `icons/check.svg`
- `icons/triangle-exclamation-regular.svg`
- `icons/xmark.svg`

## Related Decisions

- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/authentication-templates-layer]]

## Source Logs

- [[memory/logs/2026-04-21]]
- [[memory/logs/2026-04-23]]
