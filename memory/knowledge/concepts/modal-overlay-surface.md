# Modal как overlay surface с затемнением и направленной motion-анимацией

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/authentication-prototypes-layer]] | [[memory/knowledge/concepts/toast-feedback-overlay]] | [[memory/knowledge/concepts/cookies-consent-banner]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/logs/2026-04-21]] | [[memory/logs/2026-04-24]]

## Summary

`src/components/modal/` реализует Figma-driven `Modal` как token-driven overlay surface с вариантами `default`, `text-input` и `captcha`. Компонент использует существующий `Button`, локальный input-слот, иконки из `icons/` и поддерживает `placement="top-center"` для fixed-показа на `32px` от верхней границы viewport.

## Why It Matters

`Modal` закрепляет третий runtime-паттерн overlay-компонентов после `Toast` и `Cookies`, но уже с отдельной подложкой, более крупным surface и сценариями формы. Для auth prototypes это особенно важно: если модалку рендерить внутри layout-контейнера вместо независимого viewport layer, она начинает выглядеть не как эталонный dialog component.

## Known Patterns

- Варианты задаются через `variant: 'default' | 'captcha' | 'text-input'`, а не через разрозненные компоненты.
- Для fixed-показа используется внешний слой `.rshb-modal-layer` с `position: fixed`, `inset: 0` и затемнением `rgb(0 0 0 / 15%)`.
- Сам surface модалки центрируется по горизонтали и фиксируется на `32px` от верхнего края viewport через `placement="top-center"`.
- Показ использует анимацию сверху вниз `Move in Down` за `150ms`, а закрытие проигрывает обратную анимацию снизу вверх `Move in Up` за те же `150ms` перед вызовом `onClose`.
- Как и у `Toast` и `Cookies`, размонтирование откладывается через внутреннее состояние `closing`, чтобы exit-анимация успела завершиться.
- Storybook `Interactive` использует parent-document portal по аналогии с другими overlay-компонентами, чтобы fixed-позиционирование и затемнение считались от реального окна браузера, а не от iframe preview.
- Для visual parity модалка использует `--color-background-default-on-secondary`, `--shadow-flyout`, `--radius-m`, `--typography-subheading-1-regular-*` и `--typography-body-regular-*`.
- На мобильном диапазоне до `743px` modal surface принудительно ограничивается до `313px`, но сохраняет `max-width: calc(100vw - 32px)` для совсем узких экранов.
- Action buttons в dialog templates должны переопределять базовый `Button width: fit-content` более специфичным селектором, иначе в некоторых контекстах modal actions схлопываются до ширины контента.

## Known Pitfalls

- Если consumer размонтирует `Modal` напрямую, exit-анимация не проиграется; закрытие должно идти через встроенный dismiss flow.
- Для `top-center` нельзя использовать keyframes, которые теряют `translateX(-50%)`, иначе surface смещается с центра.
- Без отдельного overlay-layer невозможно корректно добавить полупрозрачный фон для fullscreen-показа и при этом не ломать inline-вариант.
- В Storybook fixed overlay внутри iframe даёт ложное ощущение расстояния до верхней кромки окна; для проверки нужен parent-document portal.
- Если modal dialog вставить внутрь auth prototype layout без независимого viewport-layer, общий grid/padding контейнера может визуально “сломать” положение и ширину dialog surface.
- Старые формулы mobile width не должны ссылаться на несуществующие spacing tokens; иначе mobile modal width начинает вести себя нестабильно в реальном preview.

## Related Modules Or Files

- `src/components/modal/Modal.tsx`
- `src/components/modal/Modal.scss`
- `src/components/modal/Modal.stories.tsx`
- `src/components/button/Button.tsx`
- `src/dialogs/modals/shared/DialogModalTemplate.scss`
- `icons/arrow-rotate-left.svg`
- `icons/volume-regular.svg`

## Related Decisions

- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/toast-feedback-overlay]]
- [[memory/knowledge/concepts/authentication-prototypes-layer]]
- [[memory/knowledge/concepts/cookies-consent-banner]]
- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/ui-kit-from-figma]]

## Source Logs

- [[memory/logs/2026-04-21]]
- [[memory/logs/2026-04-24]]
