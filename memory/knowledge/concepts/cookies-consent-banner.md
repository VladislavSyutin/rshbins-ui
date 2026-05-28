# Cookies как consent overlay у нижнего края экрана

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/toast-feedback-overlay]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/text-link-component]] | [[memory/logs/2026-04-21]]

## Summary

`src/components/cookies/` реализует Figma-driven баннер согласия на cookie как dismissible overlay с вариантами `s` и `xs`, token-driven SCSS и действиями на существующих `Button`. Компонент поддерживает `placement="bottom-center"` для fixed-показа поверх viewport и внутреннюю фазу `closing`, чтобы сначала проиграть exit-анимацию, а потом вызвать `onClose`.

## Why It Matters

`Cookies` закрепляет второй runtime-паттерн overlay-компонентов после `Toast`, но с другой геометрией и поведением: большой surface, текстовый контент, две CTA-кнопки и привязка к нижнему краю окна на `32px`. Это полезный ориентир для будущих баннеров согласия, промо-плашек и других transient surfaces, которые должны тестироваться не внутри Storybook iframe, а относительно реального viewport.

## Known Patterns

- Варианты размера задаются через `size: 's' | 'xs'`: `s` для всех брейкпоинтов кроме `XS`, `xs` для компактного мобильного варианта.
- Fixed-режим задаётся через `placement="bottom-center"`: `position: fixed`, центрирование через `translateX(-50%)` и `32px` от нижней границы viewport.
- Появление использует `Move in Up` за `150ms`, а закрытие проигрывает обратную `Move in Down` анимацию за `150ms` перед вызовом `onClose`.
- Закрытие инициируется primary action по умолчанию через `closeOnPrimaryAction`; secondary action остаётся внешним callback без автоматического dismiss.
- Для визуального соответствия Figma баннер использует `--color-background-default-primary`, `--shadow-flyout`, `--radius-m`, `--typography-subheading-1-regular-*` и `--typography-footnote-regular-*`.
- Storybook `Interactive` использует parent-document portal по аналогии с Toast, чтобы fixed-позиционирование считалось от окна браузера, а не от iframe preview.
- Legacy `Cookies` defaults теперь соответствуют filled cookie dialog из ветки `modern-and-legacy`: без заголовка, primary label `Понятно`, без secondary action, текст `Продолжая использование сайта...` со ссылкой на `Политикой АО СК «РСХБ-Страхование»`.
- Дефолтная ссылка политики в legacy `Cookies` открывается в новой вкладке через `target="_blank"` и сохраняет `rel="noreferrer noopener"`.
- Для policy link внутри legacy `Cookies` нужно использовать общий `TextLink size="s"`, чтобы legal/cookie inline links не расходились по стилю с auth templates.

## Known Pitfalls

- Если consumer размонтирует `Cookies` напрямую, exit-анимация не успеет проиграться; скрытие должно идти через внутренний `closing` flow компонента.
- Для `bottom-center` нельзя использовать keyframes, которые перетирают `translateX(-50%)`, иначе баннер теряет центрирование.
- При проверке в Storybook без parent-document portal fixed overlay будет позиционироваться относительно iframe canvas и даст неверное ощущение реального расстояния до нижнего края окна.
- Вариант `s` не стоит автоматически переводить в `xs` через JS-брейкпоинты; текущий паттерн хранит вариант как явный prop и использует CSS/media query только как защитный fallback для узкого viewport.

## Related Modules Or Files

- `src/components/cookies/Cookies.tsx`
- `src/components/cookies/Cookies.scss`
- `src/components/cookies/Cookies.stories.tsx`
- `legacy/components/cookies/Cookies.jsx`
- `legacy/components/cookies/Cookies.stories.tsx`
- `src/components/button/Button.tsx`
- `src/components/toast/Toast.stories.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/toast-feedback-overlay]]
- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/text-link-component]]

## Source Logs

- [[memory/logs/2026-04-21]]
- [[memory/logs/2026-05-28]]
